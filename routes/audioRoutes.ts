import express from 'express'
import { audioController, upload } from '../main';

export const audioRoutes = express.Router();

audioRoutes.get("/youtube", audioController.getYoutubeLink)

audioRoutes.post("/audiofile", upload.fields([
    { name: 'reference', maxCount: 1 },
    { name: 'recording', maxCount: 1 }
]), audioController.postRecordings)

audioRoutes.post("/audiolink", upload.single('recording'), audioController.postYoutubeLink)

audioRoutes.post('/lyrics/:song', audioController.getSongLyrics)


audioRoutes.get('/report', audioController.getAnalysisReport)

audioRoutes.delete('/report', audioController.deleteAnalysisReport)




