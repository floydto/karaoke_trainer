import AudioService from "./audioServices"
import Knex from 'knex'
import { ReportAccessRequest } from "../typedefs/audioTypes"
const knexConfig = require('../knexfile')

const knex = Knex(knexConfig['testing'])

beforeAll(async() => {
    await knex.migrate.latest()
})

afterAll(async() => {
    knex.destroy();
})

describe('CRUD operations with analysis reports', () => {
    let audioService: AudioService;
    let testingUserID: number;

    beforeEach(async () => {
        await knex.seed.run();
        audioService = new AudioService(knex);
        testingUserID = (await knex
            .select('id')
            .from('user'))[0].id as number;
    })


    it('Can add Song Record', async () => {
        // Arrange
        let newRecordTesting = {
            song_name: 'Testing Song Name',
            song_file: 'testingSongFile.mp3',
            recording_file: 'testingRecordingFile.mp3',
            notes: 'Testing Notes',
            user_id: testingUserID,
            result: { 
                'success' : true,
                'report' : [
                    [[1, 2], [3, 4]],
                    [[1, 3], [3, 5]],
                    [[0, 1], [0, 1]] 
                ]
            },
        }

        // Act
        await audioService.addSongRecord(newRecordTesting)

        // Assert
        const testSingingRecord = (await knex
            .select('*')
            .from('singing_record')
            .where('song_name', 'Testing Song Name'))[0];

        expect(testSingingRecord).toBeDefined();
        expect(testSingingRecord.song_name).toBe('Testing Song Name');
        expect(testSingingRecord.song_file).toBe('testingSongFile.mp3');
        expect(testSingingRecord.recording_file).toBe('testingRecordingFile.mp3');
        expect(testSingingRecord.notes).toBe('Testing Notes');
        expect(testSingingRecord.user_id).toBe(testingUserID);
        expect(testSingingRecord.result).toEqual({ 
            'success' : true,
            'report' : [
                [[1, 2], [3, 4]],
                [[1, 3], [3, 5]],
                [[0, 1], [0, 1]] 
            ]
        });
    })

    it("Can get Song Record with user id", async () => {
        //  Arrange
        const testRecord = (await knex
            .select('*')
            .from('singing_record'))[0]
        
        let accessRequest: ReportAccessRequest = {
            recordID: testRecord.id,
            userID: testRecord.user_id
        }

        //  Act
        let accessResponse = await audioService.getSongRecord(accessRequest)

        //  Assert
        expect(accessResponse.success).toBe(true)
        expect(accessResponse.report?.result).toEqual(testRecord.result)
    })

    it("Can get Song Record with token", async () => {
        //  Arrange
        const testRecord = (await knex
            .select('*')
            .from('singing_record'))[0]
        const testToken = (await knex
            .select('*')
            .from('singing_record_token')
            .where('record', testRecord.id))[0]
        
        let accessRequest: ReportAccessRequest = {
            recordID: testRecord.id,
            retrievalToken: testToken.token
        }

        //  Act
        let accessResponse = await audioService.getSongRecord(accessRequest)

        //  Assert
        expect(accessResponse.success).toBe(true)
        expect(accessResponse.report?.result).toEqual(testRecord.result)
    })

    it("Can reject invalid access requests", async() => {
        //  Arrange
        const testRecord = (await knex
            .select('*')
            .from('singing_record'))[0]
        let accessRequest: ReportAccessRequest = {
            recordID: testRecord.id,
            retrievalToken: "invalid token"
        }

        //  Act
        let accessResponse = await audioService.getSongRecord(accessRequest)

        //  Assert
        expect(accessResponse.success).toBe(false)
        expect(accessResponse.error).toMatch(/You lack the necessary permissions/)
    })


    it("Can delete song records", async() => {
        //  Arrange
        const testRecord = (await knex
            .select('*')
            .from('singing_record'))[0]
        let deleteRequest: ReportAccessRequest = {
            recordID: testRecord.id,
            userID: testRecord.user_id
        }

        //  Act
        let deleteResponse = await audioService.deleteSongRecord(deleteRequest)

        //  Assert
        expect(deleteResponse.success).toBe(true)
        expect(deleteResponse.error).toBeUndefined()
    })

    it("Can reject invalid deletion requests", async() => {
        //  Arrange
        const testRecord = (await knex
            .select('*')
            .from('singing_record'))[0]
        let deleteRequest: ReportAccessRequest = {
            recordID: testRecord.id,
            retrievalToken: "invalidToken"
        }

        //  Act
        let deleteResponse = await audioService.deleteSongRecord(deleteRequest)

        //  Assert
        expect(deleteResponse.success).toBe(false)
        expect(deleteResponse.error).toMatch(/You lack the necessary permissions/)
    })
})

afterAll(async () => {
    await knex.destroy();
})