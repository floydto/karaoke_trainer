// import express from 'express'
// import UploadPictureService from '../services/uploadPictureService'
// import { upload } from '../main';


// export class UploadPictureController {
//     constructor(private uploadPictureService: UploadPictureService) {}

//     get = async (req: express.Request, res: express.Response) => {
//         try{
//             let mahjongPictureName = await this.uploadPictureService.getPicture();
//             res.json(mahjongPictureName)
//         }
//         catch (err) {
//             res.status(500).json(err.toString())
//         }
//     }

//     post = async (req: express.Request, res: express.Response) => {
//         try {
//             let mahjongPictureName = req.file?.filename
//             await this.uploadPictureService.savePicture({ mahjongPictureName })
//             if(!mahjongPictureName || typeof mahjongPictureName != "string" || mahjongPictureName.length == 0){
//                 return res.json(400).json("invalid mahjong picture content")
//             }
//             return res.status(200).json({
//                 success: true,
//                 message: "upload image successfully",
//                 filename: req.file?.filename
//             })
//         }
//         catch (err) {
//             return res.status(500).json({
//                 err: err.toString()
//             })
//         }
//     }

// }

// export default UploadPictureController;