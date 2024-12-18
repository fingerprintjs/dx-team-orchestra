using System.Net;
using FingerprintPro.ServerSdk.Client;
using FingerprintPro.ServerSdk.Model;

namespace dotnet_sdk.Models
{
    class MusicianResponse<T> {
        public int code { get; set; }
        public string originalResponse { get; set; }
        public T parsedResponse { get; set; }

        public MusicianResponse(HttpStatusCode code, string originalResponse, T parsedResponse) {
            this.code = (int)code;
            this.originalResponse = originalResponse;
            this.parsedResponse = parsedResponse;
        }

        public MusicianResponse(int code, HttpResponseMessage originalResponse, T parsedResponse) {
            this.code = code;
            this.originalResponse = originalResponse.ToString();
            this.parsedResponse = parsedResponse;
        }
    }
}