using System.Net;
using System.Text.Json;
using V3Api = FingerprintPro.ServerSdk.Api;
using V3Client = FingerprintPro.ServerSdk.Client;
using V4Client = Fingerprint.ServerSdk.Client;
using dotnet_sdk.Models;

namespace dotnet_sdk;

internal static class Utils {
    public static V3Api.FingerprintApi CreateApi(string? apiKey, string? region)
    {
        var configuration = new V3Client.Configuration(apiKey)
        {
            Region = GetRegion(region)
        };
        return new V3Api.FingerprintApi(configuration);
    }

    private static V3Client.Region GetRegion(string? region) => region switch
    {
        "eu" => V3Client.Region.Eu,
        "ap" => V3Client.Region.Asia,
        _ => V3Client.Region.Us
    };

    public static object ParseRawContent(string? rawContent)
    {
        if (string.IsNullOrEmpty(rawContent)) return "error";
        try { return JsonSerializer.Deserialize<JsonElement>(rawContent); }
        catch { return rawContent; }
    }

    public static object ProcessException(Exception e) {
        // V4 SDK API errors
        if (e is V4Client.ApiException v4Exception)
        {
            return new MusicianResponse<object>((int)v4Exception.StatusCode, v4Exception.RawContent, ParseRawContent(v4Exception.RawContent));
        }
        // V3 SDK API errors
        if (e.InnerException is V3Client.ApiException v3Exception)
        {
            return new MusicianResponse<dynamic>(v3Exception.HttpCode, v3Exception.ResponseMessage, v3Exception.ErrorContent);
        }
        // Since 8.9.1 the V4 SDK throws ArgumentException for empty, "." or ".." event/visitor IDs without sending a request.
        // Only visitorId is mapped (the Server API error for a missing visitor ID), because deleteVisitorData without
        // visitor_id is the only case covered by existing tests. Invalid event IDs, and "."/".." visitor IDs being reported
        // as missing, are intentional gaps.
        // TODO: INTER-2607 replaces this with a dedicated musician response for SDK validation errors
        if (e is ArgumentException { ParamName: "visitorId" })
        {
            return new MusicianResponse<object>(HttpStatusCode.BadRequest, e.Message, new { error = new { code = "request_cannot_be_parsed", message = "visitor id is required" } });
        }
        return new MusicianResponse<string>(HttpStatusCode.InternalServerError, e.Message, "error");
    }
}