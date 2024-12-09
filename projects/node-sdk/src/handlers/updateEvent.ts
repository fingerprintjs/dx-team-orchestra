import { Handler, MusicianResponse } from '../types';
import {
    EventsUpdateRequest,
    FingerprintJsServerApiClient,
} from '@fingerprintjs/fingerprintjs-pro-server-api';
import { getRegion, unwrapError } from '../utils';

interface QueryParams {
    apiKey?: string;
    region?: string;
    requestId?: string;
    linkedId?: string;
    tag?: string;
    suspect?: boolean;
}

export const updateEvent: Handler<QueryParams> = async (req, res) => {
    const {apiKey = '', region = '', requestId = '', linkedId, tag, suspect} = req.query;
    const client = new FingerprintJsServerApiClient({
        apiKey: apiKey,
        region: getRegion(region),
    });

    let result: MusicianResponse<void>;
    try {
        let eventsUpdateRequest: EventsUpdateRequest = {};
        if (linkedId != undefined) {
            eventsUpdateRequest.linkedId = linkedId;
        }
        if (tag != undefined) {
            eventsUpdateRequest.tag = JSON.parse(tag);
        }
        if (suspect != undefined) {
            eventsUpdateRequest.suspect = suspect;
        }
        const event = await client.updateEvent(eventsUpdateRequest, requestId);
        result = {
            code: 200,
            originalResponse: event,
            parsedResponse: event,
        };
    } catch (error) {
        result = await unwrapError<void>(error);
    }
    res.send(result);
};
