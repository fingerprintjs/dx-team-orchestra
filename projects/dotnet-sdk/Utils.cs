using FingerprintPro.ServerSdk.Client;
using dotnet_sdk.Models;

namespace dotnet_sdk;

internal static class Utils {
    public static Region GetRegion(string? region) => region switch
    {
        "eu" => Region.Eu,
        "ap" => Region.Asia,
        _ => Region.Us
    };

    public static object ProcessException(Exception e) {
        if (e.InnerException is ApiException innerEx)
        {
            return new MusicianResponse<dynamic>(innerEx.HttpCode, innerEx.ResponseMessage, innerEx.ErrorContent);
        }
        return new MusicianResponse<string>(System.Net.HttpStatusCode.InternalServerError, e.Message, "error");
    }
}