import { Handler, MusicianResponse } from '../types';
import {
    FingerprintJsServerApiClient,
} from '@fingerprintjs/fingerprintjs-pro-server-api';
import { getRegion, unwrapError } from '../utils';

interface QueryParams {
    apiKey?: string;
    region?: string;
    visitorId?: string;
}

export const deleteVisitorData: Handler<QueryParams> = async (req, res) => {
    const {apiKey = '', region = '', visitorId = ''} = req.query;
    const client = new FingerprintJsServerApiClient({
        apiKey: apiKey,
        region: getRegion(region),
    });
    let result: MusicianResponse<void>;
    try {
        const event = await client.deleteVisitorData(visitorId);
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
