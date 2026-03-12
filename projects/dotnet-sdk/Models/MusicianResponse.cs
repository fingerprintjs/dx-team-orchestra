using System.Net;

namespace dotnet_sdk.Models
{
    class MusicianResponse<T> {
        public int Code { get; set; }
        public string OriginalResponse { get; set; }
        public T ParsedResponse { get; set; }

        public MusicianResponse(HttpStatusCode code, string originalResponse, T parsedResponse) {
            Code = (int)code;
            OriginalResponse = originalResponse;
            ParsedResponse = parsedResponse;
        }

        public MusicianResponse(int code, HttpResponseMessage originalResponse, T parsedResponse) {
            Code = code;
            OriginalResponse = originalResponse.ToString();
            ParsedResponse = parsedResponse;
        }
    }
}