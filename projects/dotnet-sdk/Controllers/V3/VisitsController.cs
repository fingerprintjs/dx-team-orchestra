using System.Net;
using Microsoft.AspNetCore.Mvc;
using FingerprintPro.ServerSdk.Model;
using dotnet_sdk.Models;

namespace dotnet_sdk.Controllers.V3;

[ApiController]
[Route("")]
public class VisitsController : ControllerBase
{
    [HttpGet("/getVisits")]
    public async Task<IActionResult> GetVisits(
        [FromQuery] string? apiKey,
        [FromQuery] string? region,
        [FromQuery] string? visitorId,
        [FromQuery] string? requestId,
        [FromQuery] string? linkedId,
        [FromQuery] int? limit,
        [FromQuery] string? paginationKey,
        [FromQuery] long? before
    )
    {
        try
        {
            var api = Utils.CreateApi(apiKey, region);

            var apiResponse = api.GetVisitsWithHttpInfo(visitorId, requestId, linkedId, limit, paginationKey, before);
            var httpResponse = apiResponse.Response;
            var rawResponse = await httpResponse.Content.ReadAsStringAsync();

            var response = new MusicianResponse<VisitorsGetResponse>(httpResponse.StatusCode, rawResponse, apiResponse.Data);
            return Ok(response);
        }
        // SDK rejects an empty ID without sending a request
        catch (ArgumentException e) when (e.ParamName == "visitorId")
        {
            return Ok(new MusicianResponse<object>(HttpStatusCode.BadRequest, e.Message, new { error = new { code = "RequestCannotBeParsed", message = "visitor id is required" } }));
        }
        catch (Exception e) {
            return Ok(Utils.ProcessException(e));
        }
    }

    [HttpGet("/deleteVisitorData")]
    public async Task<IActionResult> DeleteVisitorData(
        [FromQuery] string? apiKey,
        [FromQuery] string? region,
        [FromQuery] string? visitorId
    )
    {
        try
        {
            var api = Utils.CreateApi(apiKey, region);

            var apiResponse = api.DeleteVisitorDataWithHttpInfo(visitorId);
            var httpResponse = apiResponse.Response;
            var rawResponse = await httpResponse.Content.ReadAsStringAsync();

            var response = new MusicianResponse<object>(httpResponse.StatusCode, rawResponse, apiResponse.Data);
            return Ok(response);
        }
        catch (Exception e) {
            return Ok(Utils.ProcessException(e));
        }
    }
}