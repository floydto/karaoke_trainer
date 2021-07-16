import Knex from "knex";

class UploadPictureService {
    constructor(public knex: Knex){}

    async getPicture(){
        const mahjongPictureName = await this.knex
            .select("name")
            .from("mahjong_picture")
            .orderBy("id")
        // console.log(mahjongPictureName)
        return mahjongPictureName
    }

    async savePicture(mahjongPictureName:{mahjongPictureName: string}){
        const saveResult = await this.knex
        .insert([{
            name: mahjongPictureName.mahjongPictureName
        }])
        .into("mahjong_picture")
        .returning("name")
    
        if(saveResult.length != 1){
            throw new Error("Failed to insert memos: please only insert one picture at one time.")
        }
        return saveResult[0];
    }
}
export default UploadPictureService;


