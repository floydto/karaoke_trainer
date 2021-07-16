import tensorflow as tf
import tensorflow_hub as hub
from scipy.io import wavfile

import math
import statistics

from model_utils import utils


class pitch_analysis_model:
    def __init__(self):
        self.__MODEL = hub.load("https://tfhub.dev/google/spice/2")
        self.__MAX_ABS_INT16 = 32768.0
        self.__A4_FREQ = 440
        self.__C0_FREQ = self.__A4_FREQ * pow(2, -4.75)
        self.__NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "Rest"]
        pass

    def analyse_pitch(self, uploaded_audio_file, previous_prediction_params, plot_results):
        print('analysing ' + uploaded_audio_file)
        #   Converts user-uploaded file to 16kHz sampling rate and mono audio
        converted_audio_file = utils.convert_audio_for_model(uploaded_audio_file)
        
        
        sample_rate, audio_samples = wavfile.read(converted_audio_file, "rb")
        if (plot_results == True):
            utils.plot_audio_samples(audio_samples)

        #   Normalise
        audio_samples = audio_samples / float(self.__MAX_ABS_INT16)

        #   Find pitch of the audio samples
        model_output = self.__MODEL.signatures["serving_default"](tf.constant(audio_samples, tf.float32))

        pitch_outputs = model_output["pitch"]
        uncertainty_outputs = model_output["uncertainty"]

        # 'Uncertainty' basically means the inverse of confidence.
        confidence_outputs = 1.0 - uncertainty_outputs

        if (plot_results == True):
            utils.plot_model_outputs(pitch_outputs, confidence_outputs)        

        confidence_outputs = list(confidence_outputs)
        pitch_outputs = [ float(x) for x in pitch_outputs]

        indices = range(len (pitch_outputs))
        
        pitch_outputs_and_rests = [
            self.output2hz(p) if c >= 0.9 else 0
            for i, p, c in zip(indices, pitch_outputs, confidence_outputs)
        ]
        
        # The ideal offset is the mean quantization error for all the notes
        # (excluding rests):
        offsets = [self.hz2offset(p) for p in pitch_outputs_and_rests if p != 0]

        ideal_offset = statistics.mean(offsets)
                
        best_error = float("inf")
        best_notes_and_rests = None
        best_predictions_per_note = None
        
        if previous_prediction_params == None:
            for predictions_per_note in range(20, 65, 1):
                for prediction_start_offset in range(predictions_per_note):

                    error, note_indices = self.get_quantization_and_error(
                        pitch_outputs_and_rests, predictions_per_note,
                        prediction_start_offset, ideal_offset)

                    if error < best_error:      
                        best_error = error
                        best_notes_and_rests = note_indices
                        best_predictions_per_note = predictions_per_note
        else:
            for prediction_start_offset in range(previous_prediction_params):

                    error, note_indices = self.get_quantization_and_error(
                        pitch_outputs_and_rests, previous_prediction_params,
                        prediction_start_offset, ideal_offset)

                    if error < best_error:      
                        best_error = error
                        best_notes_and_rests = note_indices
                        best_predictions_per_note = previous_prediction_params

        # Trimming extra rests from beginning and end of results
        while best_notes_and_rests[0][0] == -1:
            best_notes_and_rests = best_notes_and_rests[1:]
        while best_notes_and_rests[-1][0] == -1:
            best_notes_and_rests = best_notes_and_rests[:-1]

        return best_notes_and_rests, best_predictions_per_note

    def output2hz(self, pitch_output):
        # Constants taken from https://tfhub.dev/google/spice/2
        PT_OFFSET = 25.58
        PT_SLOPE = 63.07
        FMIN = 10.0
        BINS_PER_OCTAVE = 12.0
        cqt_bin = pitch_output * PT_SLOPE + PT_OFFSET
        return FMIN * 2.0 ** (1.0 * cqt_bin / BINS_PER_OCTAVE)
    
    def hz2offset(self, freq):
        # This measures the quantization error for a single note.
        if freq == 0:  # Rests always have zero error.
          return None
        # Quantized note.
        h = round(12 * math.log2(freq / self.__C0_FREQ))
        return 12 * math.log2(freq / self.__C0_FREQ) - h

    def quantize_predictions(self, group, ideal_offset):
        # Group values are either 0, or a pitch in Hz.
        non_zero_values = [v for v in group if v != 0]
        zero_values_count = len(group) - len(non_zero_values)

        # Create a rest if 80% is silent, otherwise create a note.
        if zero_values_count > 0.8 * len(group):
            # Interpret as a rest. Count each dropped note as an error, weighted a bit
            # worse than a badly sung note (which would 'cost' 0.5).
            return 0.51 * len(non_zero_values), [-1, -1, "Rest"]
        else:
        # Interpret as note, estimating as mean of non-rest predictions.
            h = round(
                statistics.mean([
                    12 * math.log2(freq / self.__C0_FREQ) - ideal_offset for freq in non_zero_values
                ]))
            octave = h // 12
            note_index = [h % 12, octave, self.__NOTE_NAMES[h % 12]]
            # Quantization error is the total difference from the quantized note.
            error = sum([
                abs(12 * math.log2(freq / self.__C0_FREQ) - ideal_offset - h)
                for freq in non_zero_values
            ])
            return error, note_index

    def get_quantization_and_error(self, pitch_outputs_and_rests, predictions_per_eighth,
                               prediction_start_offset, ideal_offset):
        # Apply the start offset - we can just add the offset as rests.
        pitch_outputs_and_rests = [0] * prediction_start_offset + \
                                    pitch_outputs_and_rests
        # Collect the predictions for each note (or rest).
        groups = [
            pitch_outputs_and_rests[i:i + predictions_per_eighth]
            for i in range(0, len(pitch_outputs_and_rests), predictions_per_eighth)
        ]

        quantization_error = 0

        note_indices = []
        for group in groups:
            error, note_index = self.quantize_predictions(group, ideal_offset)
            quantization_error += error
            note_indices.append(note_index)

        return quantization_error, note_indices


