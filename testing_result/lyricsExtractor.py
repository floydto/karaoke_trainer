from lyrics_extractor import SongLyrics
from googleapiclient.discovery import build

my_api_key = "AIzaSyBSC42xmBi7XCliGHMrHBweCQwhqgEIBP0" #Custom Search JSON API(project2, https://developers.google.com/custom-search/v1/overview#search_engine_id)
gcs_engine_id = "3a14520fe0a545953" # google search engine (https://cse.google.com/cse/setup/basic?cx=3a14520fe0a545953)

extract_lyrics = SongLyrics(my_api_key, gcs_engine_id)

data = extract_lyrics.get_lyrics("willow")

print(data)

