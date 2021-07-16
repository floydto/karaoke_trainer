from logging import error
from statistics import StatisticsError
import tornado.ioloop
import tornado.web
import json
import sys
import os
# from sys import platform

#if platform == "darwin":
#    os.environ['KMP_DUPLICATE_LIB_OK']='True'

#   Adding current directory to sys.path
sys.path.append(os.path.abspath(os.getcwd()))

#   Adding uploads/reference and uploads/recording folders to sys.path
song_path = os.path.abspath(os.path.join(os.getcwd(), os.pardir, 'uploads', 'reference'))
sys.path.append(song_path)
recording_path = os.path.abspath(os.path.join(os.getcwd(), os.pardir, 'uploads', 'recording')) 
sys.path.append(recording_path)
song_path_alt = os.path.abspath(os.path.join(os.getcwd(), 'uploads', 'reference'))
sys.path.append(song_path_alt)
recording_path_alt = os.path.abspath(os.path.join(os.getcwd(), 'uploads', 'recording')) 
sys.path.append(recording_path_alt)

#   Lyrics extractor
from lyrics_extractor import LyricScraperException
#   Modified SongLyrics class that includes custom scrapers for Chinese lyrics
from custom_lyrics_extractor import CustomSongLyrics
from googleapiclient.discovery import build
my_api_key = "AIzaSyBSC42xmBi7XCliGHMrHBweCQwhqgEIBP0" #Custom Search JSON API(project2, https://developers.google.com/custom-search/v1/overview#search_engine_id)
gcs_engine_id = "29cf18e777a0f8875" # google search engine (https://cse.google.com/cse/setup/basic?cx=29cf18e777a0f8875)

#   Pitch analysis model
from model import pitch_analysis_model
from model_utils import utils

model = pitch_analysis_model()

class PitchAnalysisHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Content-Type", 'application/json')

    def post(self):
        req = json.loads(self.request.body)
        res = {}
        song_res = {}
        recording_res = {}

        print(req)
        try:
            song_res = model.analyse_pitch(os.path.join(song_path, req['reference']), None, False)
            recording_res = model.analyse_pitch(os.path.join(recording_path, req['recording']), song_res[1], False)
            report = utils.generate_pitch_analysis_report(song_res, recording_res)
        except StatisticsError as err:
            res = json.dumps({
                'success': False,
                'message': "No sound was detected in one/both of your uploaded files. Please make sure that your microphone is working and that you have given your browser permission to use it.",
                'error': err.args[0]
            })
        except Exception as err:
            print(err)
            res = json.dumps({
                'success': False,
                'message': 'Something went wrong.'
            })
        else:
            res = json.dumps({
                'success': True,
                'report': report
            })
        self.write(res)

        
class LyricsHandler(tornado.web.RequestHandler):
    def post(self):
        req = json.loads(self.request.body)
        res = {}
        try:
            extract_lyrics = CustomSongLyrics(my_api_key, gcs_engine_id)
            data = extract_lyrics.get_lyrics(req['song'])
        except LyricScraperException as err:
            res = json.dumps({
                'success': False,
                'message': err.args[0]['error']
            })
        except:
            res = json.dumps({
                'success': False,
                'message': "Failed to retrieve lyrics from server"
            })
        else:
            res = json.dumps({
                'success': True,
                'title': data['title'], 
                'lyrics': data['lyrics']
            })
        self.write(res)

def make_app():
    return tornado.web.Application([
        (r"/analysis", PitchAnalysisHandler),
        (r"/lyrics", LyricsHandler)
    ])

if __name__ == "__main__":
    app = make_app()
    server = tornado.httpserver.HTTPServer(app)
    server.bind(8888)
    server.start()
    tornado.ioloop.IOLoop.current().start()

