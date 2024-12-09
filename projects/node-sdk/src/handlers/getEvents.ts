import { Handler, MusicianResponse } from "../types";
import {
  EventsGetResponse,
  FingerprintJsServerApiClient,
} from "@fingerprintjs/fingerprintjs-pro-server-api";
import { getRegion, unwrapError } from "../utils";

interface QueryParams {
  apiKey?: string;
  region?: string;
  requestId?: string;
}

export const getEvents: Handler<QueryParams> = async (req, res) => {
  const { apiKey = "", region = "", requestId = "" } = req.query;
  let result: MusicianResponse<EventsGetResponse>;
  try {
    const client = new FingerprintJsServerApiClient({
      apiKey: apiKey,
      region: getRegion(region),
    });

    const event = await client.getEvent(requestId);
    result = {
      code: 200,
      originalResponse: event,
      parsedResponse: event,
    };
  } catch (error) {
    result = await unwrapError<EventsGetResponse>(error);
  }
  res.send(result);
};
