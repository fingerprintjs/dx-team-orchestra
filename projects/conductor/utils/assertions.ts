import {FingerprintApi, GetEventsParams} from "./api";
import {expect} from "@playwright/test";
import {JsonResponse} from "./http";
import {EventsGetResponse} from '@fingerprintjs/fingerprintjs-pro-server-api';

interface ThatResponseMatchParams {
  expectedResponse?: unknown;
  expectedStatusCode?: number;
  callback: (api: FingerprintApi) => Promise<JsonResponse<unknown>>
  strict?: boolean
}

export class Assertions {
  constructor(private readonly fingerprintApi: FingerprintApi, private readonly sdksApi: FingerprintApi) {
  }

  /**
   * Compares the responses of the same method from two different APIs and ensures they match.
   *
   * @param {Method} method - The method name from the FingerprintApi to be invoked.
   * @param {...Parameters<FingerprintApi[Method]>} params - The parameters to pass to the specified method.
   * @return {Promise<void>} Resolves when the comparison is complete and the responses match.
   */
  async thatResponsesMatch<Method extends keyof FingerprintApi>(method: Method, ...params: Parameters<FingerprintApi[Method]>): Promise<void> {
    const realResponse: JsonResponse<any> = await this.fingerprintApi[method].call(this.fingerprintApi, ...params);
    const sdkResponse: JsonResponse<any> = await this.sdksApi[method].call(this.sdksApi, ...params);

    expect(sdkResponse.data).toMatchObject(realResponse.data);
  }

  async thatUnsealedDataMatches(sealedData: EventsGetResponse, params: GetEventsParams) {
    const {data: originalEvent} = await this.fingerprintApi.getEvent(params);
    expect(sealedData).toMatchObject(originalEvent);
  }

  /**
   * Verifies that the response and status code from the callback match the expected values.
   *
   * @param {Object} params - An object containing the parameters for the method.
   * @param {any} params.expectedResponse - The expected response data to compare with the actual response.
   * @param {number} params.expectedStatusCode - The expected HTTP status code to match with the actual response's status.
   * @param {Function} params.callback - A callback function that interacts with the API and returns the response and data.
   *
   * @return {Promise<void>} A promise that resolves when the assertions are complete.
   */
  async thatResponseMatch({
                            expectedResponse,
                            expectedStatusCode,
                            callback,
                            strict = true
                          }: ThatResponseMatchParams): Promise<void> {
    const {response, data} = await callback(this.sdksApi)

    if (expectedStatusCode) {
      expect(response.status()).toBe(expectedStatusCode);
    }

    if (expectedResponse) {
      if(strict) {
        expect(data).toStrictEqual(expectedResponse)
      } else {
        expect(data).toEqual(expect.objectContaining(expectedResponse as any))
      }
    }
  }
}