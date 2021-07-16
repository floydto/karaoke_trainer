from pydub import AudioSegment
import matplotlib.pyplot as plt
import os
import sys

sys.path.append(os.path.abspath(os.getcwd()))

class utils:
    @staticmethod
    #   user_file is the name of the file, not the file object returned by the open() method
    def convert_audio_for_model(user_file, output_file = 'converted_audio_file.wav', expected_sample_rate=16000):
        audio = AudioSegment.from_file(user_file)
        audio = audio.set_frame_rate(expected_sample_rate).set_channels(1)
        audio.export(output_file, format="wav")
        return output_file
    def plot_audio_samples(audio_samples):
        plt.plot(audio_samples)
        plt.show()
        pass
    def plot_model_outputs(pitch_outputs, confidence_outputs):
        fig, ax = plt.subplots()
        fig.set_size_inches(20, 10)
        plt.plot(pitch_outputs, label='pitch')
        plt.plot(confidence_outputs, label='confidence')
        plt.legend(loc="lower right")
        plt.show()
        pass
    @staticmethod
    def generate_pitch_analysis_report(song_res, recording_res):
        comparison_res = []
        print(song_res)
        print(recording_res)
        for key in range(len(song_res[0])):
            if len(recording_res[0]) > key:
                comparison_res.append(abs(song_res[0][key][0] - recording_res[0][key][0]))
            else:
                comparison_res.append(song_res[0][key][0])
        report = {
            'song_results': song_res,
            'recording_results': recording_res,
            'inaccuracy': comparison_res
        }
        return report
