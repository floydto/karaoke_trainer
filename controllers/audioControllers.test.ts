import AudioService from "../services/audioServices"
import AudioController from "./audioControllers"
import Knex from 'knex'


import express from 'express'
import ytdl from 'ytdl-core';
import ytsr from 'ytsr';   

jest.mock('express')
jest.mock('ytdl-core')
jest.mock('ytsr')


describe('Youtube-related functionality', () => {
    let audioService: AudioService;
    let audioController: AudioController;
    let req: express.Request;
    let res: express.Response;

    beforeEach(() => {
        audioService = new AudioService({} as Knex);
        audioController = new AudioController(audioService);    
        req = {
            body: {},
            params: {},
            session: {
                user: {}
            }
        } as any as express.Request;
        res = {
            json: jest.fn()
        } as any as express.Response
    })

    afterEach(() => {    
        jest.clearAllMocks();
    });

    it('Can get Youtube video when provided with valid link', async () => {
        // Arrange
        req['query'] = {
            search: "www.youtube.com/testlink",
        };

        const validateURL = jest.spyOn(ytdl, "validateURL").mockReturnValue(true);
        const getVideo = jest.spyOn(audioService, "getYoutubeVideoByURL").mockResolvedValue({
            success: true,
            url: "www.youtube.com/testlink",
            video: 'test video data url',
            audio: 'test audio data url',
            details: 'testing video details'               
        } as any)
        const resJSON = jest.spyOn(res, "json") 

        // Act
        await audioController.getYoutubeLink(req, res)

        // Assert
        expect(validateURL).toHaveBeenCalledWith("www.youtube.com/testlink")
        expect(getVideo).toHaveBeenCalledWith("www.youtube.com/testlink")
        expect(resJSON).toHaveBeenCalledWith({
            success: true,
            url: "www.youtube.com/testlink",
            video: 'test video data url',
            audio: 'test audio data url',
            details: 'testing video details'               
        })
    })

    it('Will attempt to run query string through ytsr if provided with an invalid Youtube link', async () => {
        // Arrange
        req['query'] = {
            search: "youtube search query",
        };

        const validateURL = jest.spyOn(ytdl, "validateURL").mockReturnValue(false);
        const getVideo = jest.spyOn(audioService, "getYoutubeVideoByURL").mockResolvedValue({
            success: true,
            url: "www.youtube.com/videolink",
            video: 'test video data url',
            audio: 'test audio data url',
            details: 'testing video details'               
        } as any)
        const ytsrResults = {
            get: jest.fn()
        }
        const getYtsr = jest.spyOn(ytsr, "getFilters").mockResolvedValue(ytsrResults as any)
        const ytsrResultsSpy = jest.spyOn(ytsrResults, "get").mockReturnValue({
            get: jest.fn(() => { return {url: "www.youtube.com/searchurl"}})
        })
        const resJSON = jest.spyOn(res, "json");
        (ytsr as any as jest.Mock).mockResolvedValue({
            items: [{url: "www.youtube.com/videolink"}]
        })

        // Act
        await audioController.getYoutubeLink(req, res)

        // Assert
        expect(validateURL).toHaveBeenCalledWith("youtube search query")
        expect(ytsrResultsSpy).toHaveBeenCalledWith("Type")
        expect(getYtsr).toHaveBeenCalledWith("youtube search query")
        expect(getVideo).toHaveBeenCalledWith("www.youtube.com/videolink")
        expect(resJSON).toHaveBeenCalledWith({
            success: true,
            url: "www.youtube.com/videolink",
            video: 'test video data url',
            audio: 'test audio data url',
            details: 'testing video details'               
        })
    })
})

// describe('getSongLyrics', () => {
//     it.skip('can handle get song', () => {
//         // Arrange
//         const req:any = {
//             params: {
//                 song: "Oceans",
//             },
//         }
//         const res: any = {
//             json: jest.fn(),
//         }
//         const audioService = new AudioService(knex);
//         const audioController = new AudioController(audioService);    

//         // Act
//         audioController.getSongLyrics(req, res)

//         // Assert
//         expect(res.json).toHaveBeenCalled();
//         expect(res.json).not.toHaveBeenCalledWith(null)
//     })
// })