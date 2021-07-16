#   Lyrics 
from lyrics_extractor.lyrics import _ScraperFactory
from lyrics_extractor import SongLyrics


class CustomScraperFactory(_ScraperFactory):    
    def mojim_scraper(self): 
        all_extracts = self.source_code.select('dd')
        lyrics = ''
        for extract in all_extracts:
            if extract.get_text().strip() in ["歌詞", "專輯列表", "歌手介紹", "相關影音"]:
                pass
            else:
                for br in extract.find_all("br"):
                    br.replace_with("\n")
                lyrics += extract.get_text()
        lyrics = lyrics.replace('更多更詳盡歌詞 在 ※ Mojim.com　魔鏡歌詞網', "")    
        self._update_title(self.title.replace("※ Mojim.com", ""))
        return lyrics.strip()
    def kkbox_scraper(self):
        extract = self.source_code.select('p.lyrics')
        lyrics = extract[0].get_text().strip()
        return lyrics
    

class CustomSongLyrics(SongLyrics):
    scraper_factory = CustomScraperFactory()
    SCRAPERS = {
        "genius": scraper_factory.genius_scraper,
        'glamsham': scraper_factory.glamsham_scraper,
        'lyricsbell': scraper_factory.lyricsbell_scraper,
        'lyricsted': scraper_factory.lyricsted_scraper,
        'lyricsoff': scraper_factory.lyricsoff_scraper,
        'lyricsmint': scraper_factory.lyricsmint_scraper,
        'mojim': scraper_factory.mojim_scraper,
        'kkbox': scraper_factory.kkbox_scraper
    }