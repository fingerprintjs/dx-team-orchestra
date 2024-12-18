using Microsoft.AspNetCore.Mvc;
using FingerprintPro.ServerSdk.Api;
using FingerprintPro.ServerSdk.Client;
using FingerprintPro.ServerSdk.Model;
using dotnet_sdk.Models;

namespace dotnet_sdk.Controllers
{
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
                var parsedRegion = Utils.GetRegion(region);
                var configuration = new Configuration(apiKey)
                {
                    Region = parsedRegion
                };
                var api = new FingerprintApi(configuration);

                var apiResponse = api.GetVisitsWithHttpInfo(visitorId, requestId, linkedId, limit, paginationKey, before);
                var eventResponse = apiResponse.Response;
                var rawResponse = await eventResponse.Content.ReadAsStringAsync();

                var response = new MusicianResponse<VisitorsGetResponse>(eventResponse.StatusCode, rawResponse, apiResponse.Data);
                return Ok(response);
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
                var parsedRegion = Utils.GetRegion(region);
                var configuration = new Configuration(apiKey)
                {
                    Region = parsedRegion
                };
                var api = new FingerprintApi(configuration);

                var apiResponse = api.DeleteVisitorDataWithHttpInfo(visitorId);
                var eventResponse = apiResponse.Response;
                var rawResponse = await eventResponse.Content.ReadAsStringAsync();

                var response = new MusicianResponse<object>(eventResponse.StatusCode, rawResponse, apiResponse.Data);
                return Ok(response);
            }
            catch (Exception e) {
                return Ok(Utils.ProcessException(e));
            }
        }
    }
}