using FingerprintPro.ServerSdk.Client;
using FingerprintPro.ServerSdk.Model;
using dotnet_sdk.Models;

namespace dotnet_sdk
{
    class Utils {
        public static Region GetRegion(String region) {
            switch(region) {
                case "eu":
                    return Region.Eu;
                case "ap":
                    return Region.Asia;
                default:
                    return Region.Us;
            }
        }

        public static object ProcessException(Exception e) {
            if (e.InnerException != null)
                {
                    if (e.InnerException is ApiException innerEx)
                    {
                        return new MusicianResponse<ErrorResponse>(innerEx.HttpCode, innerEx.ResponseMessage, innerEx.ErrorContent);
                    }
                }
                return new MusicianResponse<String>(System.Net.HttpStatusCode.InternalServerError, e.Message, "error");
        }
    }
}