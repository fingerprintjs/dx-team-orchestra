// ReSharper disable UnusedMember.Global
using System.Net;

namespace dotnet_sdk.Models;

internal class MusicianResponse<T>(int code, string originalResponse, T parsedResponse)
{
    public int Code { get; set; } = code;
    public string OriginalResponse { get; set; } = originalResponse;
    public T ParsedResponse { get; set; } = parsedResponse;

    public MusicianResponse(HttpStatusCode code, string originalResponse, T parsedResponse) : this((int)code,
        originalResponse, parsedResponse) { }

    public MusicianResponse(int code, HttpResponseMessage originalResponse, T parsedResponse) : this(code,
        originalResponse.ToString(), parsedResponse) { }
}