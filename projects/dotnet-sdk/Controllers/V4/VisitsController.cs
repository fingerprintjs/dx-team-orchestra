using System.Net;
using Microsoft.AspNetCore.Mvc;
using dotnet_sdk.Models;

namespace dotnet_sdk.Controllers.V4;

[ApiController]
[Route("v4")]
public class VisitsController(FingerprintV4Factory factory) : ControllerBase
{
    [HttpGet("deleteVisitorData")]
    public async Task<IActionResult> DeleteVisitorData(
        [FromQuery(Name = "api_key")] string? apiKey,
        [FromQuery(Name = "region")] string? region,
        [FromQuery(Name = "visitor_id")] string? visitorId)
    {
        try
        {
            var api = factory.CreateApi(apiKey, region);

            var apiResponse = await api.DeleteVisitorDataAsync(visitorId ?? "");

            return Ok(new MusicianResponse<object>(apiResponse.StatusCode, apiResponse.RawContent ?? "", Utils.ParseRawContent(apiResponse.RawContent)));
        }
        // Server API rejects a missing API key before the ID
        catch (ArgumentException e) when (string.IsNullOrEmpty(apiKey))
        {
            return Ok(new MusicianResponse<object>(HttpStatusCode.Forbidden, e.Message, new { error = new { code = "secret_api_key_required", message = "secret API key in header is missing or empty" } }));
        }
        // SDK rejects an empty ID without sending a request
        catch (ArgumentException e) when (e.ParamName == "visitorId")
        {
            return Ok(new MusicianResponse<object>(HttpStatusCode.BadRequest, e.Message, new { error = new { code = "request_cannot_be_parsed", message = "visitor id is required" } }));
        }
        catch (Exception e)
        {
            return Ok(Utils.ProcessException(e));
        }
    }
}
