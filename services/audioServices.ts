import Knex from 'knex';
import { RecordCreationResponseBody, ReportAccessError, ReportAccessReponse, ReportAccessRequest, SongRecord } from '../typedefs/audioTypes';
import { tornadoPath } from '../config';

import bcrypt from 'bcryptjs';

import ytdl from 'ytdl-core';
import fetch from 'node-fetch';

export default class AudioService {
    constructor(
        private knex: Knex
    ) { }


    //  Basic CRUD operations for singing records
    getSongRecord = async (request: ReportAccessRequest): Promise<ReportAccessReponse> => {
        try {
            let hasPermissions = await this.getReportAccessPermissions(request)
            if (hasPermissions === true) {
                let report = await this.knex.select('*')
                    .from('singing_record')
                    .where('id', request.recordID)
                return {
                    success: true,
                    report: report[0]
                }
            } else {
                throw new ReportAccessError('You lack the necessary permissions to access this analysis report')
            }
        } catch (err) {
            return {
                success: false,
                error: err.message
            }
        }
    }

    addSongRecord = async (newRecord: SongRecord): Promise<RecordCreationResponseBody> => {
        let userLoggedIn;
        let hash;
        let newRecordID = (await this.knex
            .insert(newRecord)
            .into('singing_record')
            .returning('id'))[0] as number

        //  If user is not logged in, generate a token that the user can use to retrieve their report
        if (!newRecord.user_id){
            userLoggedIn = false;
            hash = await this.getRetrievalToken(newRecordID, newRecord.song_file as string)
        } else {
            userLoggedIn = true;
        }

        return {
            userLoggedIn: userLoggedIn,
            newRecordID: newRecordID,
            retrievalToken: hash
        }
    }

    updateSongRecord = async (recordID: number, updatedFields: SongRecord) => {
        await this.knex('singing_record')
            .update(updatedFields)
            .where('id', recordID)
    }

    deleteSongRecord = async (request: ReportAccessRequest) => {
        try {
            let hasPermissions = await this.getReportAccessPermissions(request)
            if (hasPermissions === true) {
                await this.knex('singing_record_token')
                    .where('record', request.recordID)
                    .del()
                await this.knex('singing_record')
                    .where('id', request.recordID)
                    .andWhere('user_id', request.userID)
                    .del()
                return {
                    success: true,
                }
            } else {
                return {
                    success: false,
                    error: 'You lack the necessary permissions to delete this analysis report.'
                }
            }
        } catch (err) {
            return {
                success: false,
                error: err.message
            }
        }
    }

    private getRetrievalToken = async (recordID: number, filename: string) => {
        let hash = await bcrypt.hash(filename, 10)
        await this.knex
            .insert({
                record: recordID,
                token: hash
            })
            .into('singing_record_token')
        return hash
    }

    private getReportAccessPermissions = async(request: ReportAccessRequest): Promise<boolean> => {
        let findReport = await this.knex.select("*")
            .from('singing_record')
            .where('id', request.recordID)
        if (findReport.length === 0) {
            return false
        }
    
        if (request.userID) {
            let verifyByUser = await this.knex.select('*')
                .from('singing_record')
                .where('id', request.recordID)
                .andWhere('user_id', request.userID)
            if (verifyByUser.length > 0) {
                return true
            }
        }
        
        if (request.retrievalToken) {
            let verifyByToken = await this.knex.select('*')
                .from('singing_record_token')
                .where('record', request.recordID)
                .andWhere('token', request.retrievalToken)
            if (verifyByToken.length > 0) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    
    //  Helper function that takes a youtube URL as an argument and returns the metadata for said video
    getYoutubeVideoByURL = async (url: string) => {
        try {
            let info = await ytdl.getInfo(url)
            let videolink = ytdl.filterFormats(info.formats, (format => format.hasVideo && format.hasAudio))[0].url
            return {
                success: true,
                url: url,
                video: videolink,
                audio: videolink,
                details: info.videoDetails    
            }
        } catch (err) {
            return {
                success: false,
                error: err.message,
                message: "Something went wrong while retrieving the video from Youtube"
            }
        }
    }


    //  Calls the pitch analysis model stored on the Tornado server
    callAnalysisModel = async (referencePath: string, recordingPath: string) => {
        try {
            let pythonres = await fetch(`${tornadoPath}/analysis`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    reference: referencePath,
                    recording: recordingPath
                })
            })
            let result = await pythonres.json()
            return result
        } catch (err) {
            return {
                success: false,
                error: err.message
            }
        }
    }
}