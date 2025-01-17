import {FingerprintApi} from "./api";
import {expect} from "@playwright/test";
import {JsonResponse} from "./http";

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
}