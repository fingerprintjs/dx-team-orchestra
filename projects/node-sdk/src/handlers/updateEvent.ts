import { Handler, MusicianResponse } from "../types";
import {
  EventsUpdateRequest,
  FingerprintJsServerApiClient,
} from "@fingerprintjs/fingerprintjs-pro-server-api";
import { getRegion, parseBoolean, unwrapError } from '../utils';

interface QueryParams {
  apiKey?: string;
  region?: string;
  requestId?: string;
  linkedId?: string;
  tag?: string;
  suspect?: 'true' | 'false';
}

export const updateEvent: Handler<QueryParams> = async (req, res) => {
  const {
    apiKey = "",
    region = "",
    requestId = "",
    linkedId,
    tag,
    suspect,
  } = req.query;
  console.log(req.query);
  let result: MusicianResponse<void>;
  try {
    const client = new FingerprintJsServerApiClient({
      apiKey: apiKey,
      region: getRegion(region),
    });

    let eventsUpdateRequest: EventsUpdateRequest = {};
    if (linkedId != undefined) {
      eventsUpdateRequest.linkedId = linkedId;
    }
    if (tag != undefined) {
      eventsUpdateRequest.tag = JSON.parse(tag);
    }
    if (suspect != undefined) {
      eventsUpdateRequest.suspect = parseBoolean(suspect);
    }
    console.log(eventsUpdateRequest, linkedId, tag, suspect, JSON.stringify(eventsUpdateRequest));
    const event = await client.updateEvent(eventsUpdateRequest, requestId);
    result = {
      code: 200,
      originalResponse: event,
      parsedResponse: event,
    };
  } catch (error) {
    result = await unwrapError<void>(error, 'updateEvent');
  }
  res.send(result);
};
