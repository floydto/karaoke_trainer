export interface SongRecord {
    song_name?: String,
    song_file?: String,
    recording_file?: String,
    notes?: String,
    user_id?: Number
    result?: {}
}

export interface RecordCreationResponseBody {
    newRecordID: number,
    userLoggedIn: boolean,
    retrievalToken?: string
}

export interface ReportAccessRequest {
    recordID: number,
    userID?: number,
    retrievalToken?: string
}

export interface ReportAccessReponse {
    success: boolean,
    report?: SongRecord,
    error?: Error,
    message?: string
}

export class ReportAccessError extends Error {
    constructor(message: string) {
        super(message)

        Object.setPrototypeOf(this, ReportAccessError.prototype);
    }

    getErrorMessage() {
        return this.message;
    }
}