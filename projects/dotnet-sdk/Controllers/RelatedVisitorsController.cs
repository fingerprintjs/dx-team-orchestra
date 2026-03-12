using Microsoft.AspNetCore.Mvc;
using FingerprintPro.ServerSdk.Model;
using dotnet_sdk.Models;

namespace dotnet_sdk.Controllers;

[ApiController]
[Route("")]
public class RelatedVisitorsController : ControllerBase
{
    [HttpGet("/getRelatedVisitors")]
    public async Task<IActionResult> GetRelatedVisitors(
        [FromQuery] string? apiKey,
        [FromQuery] string? region,
        [FromQuery] string? visitorId
    )
    {
        try
        {
            var api = Utils.CreateApi(apiKey, region);

            var apiResponse = api.GetRelatedVisitorsWithHttpInfo(visitorId);
            var eventResponse = apiResponse.Response;
            var rawResponse = await eventResponse.Content.ReadAsStringAsync();

            var response = new MusicianResponse<RelatedVisitorsResponse>(eventResponse.StatusCode, rawResponse, apiResponse.Data);
            return Ok(response);
        }
        catch (Exception e) {
            return Ok(Utils.ProcessException(e));
        }
    }
}