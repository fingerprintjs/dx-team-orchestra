import { Region, RequestError } from '@fingerprintjs/fingerprintjs-pro-server-api';
import { MusicianResponse } from './types';

export function getRegion(region: string): Region {
    switch (region) {
        case 'eu':
            return Region.EU;
        case 'ap':
            return Region.AP;
        default:
            return Region.Global;
    }
}

export async function unwrapError<Response200Type>(error: unknown): Promise<MusicianResponse<Response200Type>> {
    if (error instanceof RequestError) {
        const originalResponse = await error.response.text();
        return {
            code: error.statusCode,
            originalResponse: originalResponse,
            parsedResponse: error.responseBody,
        };
    }
    // Make behaviour consistent with other Server SDKs
    if (error instanceof Error && error.message == `Api key is not set`){
        return {
            code: 404,
            originalResponse: error.toString(),
            parsedResponse: JSON.stringify(error),
        };
    }
    return {
        code: 500,
        originalResponse: error?.toString(),
        parsedResponse: JSON.stringify(error),
    };
}
