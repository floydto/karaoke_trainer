import { Request, Response } from 'express';
import AudioService from '../services/audioServices';
import { RecordCreationResponseBody, ReportAccessRequest, SongRecord } from '../typedefs/audioTypes';

import ytdl from 'ytdl-core';
import fs from 'fs';
import ytsr from 'ytsr';

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
import ffmpeg from 'fluent-ffmpeg';

import fetch from 'node-fetch';

import { tornadoPath } from '../config';
import path from 'path';



export default class AudioController {
    constructor(
        private audioService: AudioService
    ) { }

    getYoutubeLink = async (req: Request, res: Response) => {
        const { search } = req.query
        let responseBody;
        if (ytdl.validateURL(`${search}`) === true) {
            //  If query string is a valid Youtube video URL, get the metadata of the video with that URL
            responseBody = await this.audioService.getYoutubeVideoByURL(`${search}`)
        } else if (search != "" && search != undefined) {
            //  Else, run the query string through Youtube's search engine and return the video url of the first result
            const filters = await ytsr.getFilters(`${search}`);
            if (filters && filters.get('Type')) {
                const filter = filters.get('Type')?.get('Video');
                if (filter?.url) {
                    const searchResults = await ytsr(filter.url, { limit: 1 });
                    responseBody = await this.audioService.getYoutubeVideoByURL(searchResults.items[0]['url'])
                }
            }
        } else {
            responseBody = {
                success: false,
                error: "Invalid Youtube Link"
            }
        }
        res.json(responseBody)
    }

    //  Handler for analysis requests containing two user-uploaded audio files or one audio file + user's microphone recording.
    postRecordings = async (req: Request, res: Response) => {
        let newRecord: SongRecord = {
            song_name: req.body.title,
            song_file: req.body.reference,
            recording_file: req.body.recording,
            notes: req.body.notes,
            user_id: req.session?.['user'] as any as number
        }
        
        let responseBody: RecordCreationResponseBody = await this.audioService.addSongRecord(newRecord)

        //  Sending response back to client without waiting for the analysis report to improve user feedback
        res.json({
            success: true,
            message: "Submitted for analysis!",
            body: responseBody
        })
        
        let result = await this.audioService.callAnalysisModel(req.body.reference, req.body.recording)
        if (result.success === true) {
            await this.audioService.updateSongRecord(responseBody.newRecordID, {
                result: result.report
            })
        } else {
            await this.audioService.updateSongRecord(responseBody.newRecordID, {
                result: {
                    message: result.message,
                    error: result.error
                }
            })
        }
    }

    //  Handler for analysis requests containing user's microphone recording and a valid Youtube video URL.
    postYoutubeLink = async (req: Request, res: Response) => {
        let ytdlstream;
        let songfile = `${Date.now()}.wav`;
        let wavstream = fs.createWriteStream(path.join('uploads', 'reference', songfile));
        let recordingOffset
        if (req.body['playback-sync'] === 'partial-video') {
            recordingOffset = (parseInt(req.body['recording-offset']) * 60) + parseInt(req.body['recording-offset'].substring(req.body['recording-offset'].indexOf(":") + 1))
        } else {
            recordingOffset = 0;
        }   

        try {
            if (ytdl.validateURL(req.body.youtubelink) === false) {
                throw "Invalid Youtube video URL";
            } else {
                ytdlstream = ytdl(req.body.youtubelink, { quality: 'highestaudio' });
            }
        } catch(err) {
            res.json({
                success: false,
                message: "Something went wrong when requesting the video from Youtube",
                error: err
            })
        }
        
        let newRecord: SongRecord = {
            song_name: req.body.title,
            song_file: songfile,
            recording_file: req.body.recording,
            notes: req.body.notes,
            user_id: req.session?.['user'] as any as number
        }
        let responseBody: RecordCreationResponseBody = await this.audioService.addSongRecord(newRecord);

        res.json({
            success: true,
            message: "Submitted for analysis!",
            body: responseBody
        })

        ffmpeg({ source: ytdlstream })
            .format('wav')
            .setFfmpegPath(ffmpegPath)
            .seekInput(recordingOffset)
            .writeToStream(wavstream)

        wavstream.on('close', async() => {
            let result = await this.audioService.callAnalysisModel(songfile, req.body.recording);
            if (result.success === true) {
                await this.audioService.updateSongRecord(responseBody.newRecordID, {
                    result: result.report
                });
            } else {
                await this.audioService.updateSongRecord(responseBody.newRecordID, {
                    result: {
                        message: result.message,
                        error: result.error
                    }
                });
            }
        })
    }

    //  Calls lyrics extractor service on Tornado server
    getSongLyrics = async (req: Request, res: Response) => {
        const results = await fetch(`${tornadoPath}/lyrics`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "song": req.params['song'] })
        });
        const lyrics = await results.json();
        res.json(lyrics);
    }

    getAnalysisReport = async (req: Request, res: Response) => {
        let accessRequest: ReportAccessRequest = {
            userID: req.session['user'] as any as number, 
            retrievalToken: req.query.token as string,
            recordID: parseInt(req.query.record as string)
        }
        let responseBody = await this.audioService.getSongRecord(accessRequest);
        
        res.json(responseBody)
    }

    deleteAnalysisReport = async (req: Request, res: Response) => {
        let deleteRequest: ReportAccessRequest = {
            userID: req.session['user'] as any as number,
            retrievalToken: req.query.token as string,
            recordID: parseInt(req.query.record as string)
        }
        let responseBody = await this.audioService.deleteSongRecord(deleteRequest);

        res.json(responseBody)
    }
}