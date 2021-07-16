import unittest

from model_utils import utils

class TestAnalysisReportGeneration(unittest.TestCase):
    def test_recording_fully_accurate(self):
        report = utils.generate_pitch_analysis_report(([[10, 2], [3, 3], [11, 2]], 41), ([[10, 2], [3, 3], [11, 2]], 41))
        self.assertEqual(report['inaccuracy'][0], 0)
        self.assertEqual(report['inaccuracy'][1], 0)
        self.assertEqual(report['inaccuracy'][2], 0)
    def test_recording_offset_slowed(self):
        # report = utils.generate_pitch_analysis_report((['A#2', 'D#3', 'B2'], 41), (['A#2', 'A#2', 'D#3', 'D#3', 'B2', 'B2'], 21))
        pass
        


if __name__ == '__main__':
    unittest.main()


        