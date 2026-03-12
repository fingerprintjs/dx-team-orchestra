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

            var apiResponse = await api.DeleteVisitorDataAsync(visitorId!);

            return Ok(new MusicianResponse<string>(apiResponse.StatusCode, apiResponse.RawContent ?? "", "ok"));
        }
        catch (Exception e)
        {
            return Ok(Utils.ProcessException(e));
        }
    }
}
