using Microsoft.AspNetCore.Mvc;
using FingerprintPro.ServerSdk.Api;
using FingerprintPro.ServerSdk.Client;
using FingerprintPro.ServerSdk.Model;
using dotnet_sdk.Models;
using FingerprintPro.ServerSdk.Json;

namespace dotnet_sdk.Controllers
{
    [ApiController]
    [Route("")]
    public class EventsController : ControllerBase
    {
        [HttpGet("/getEvents")]
        public async Task<IActionResult> GetEvents(
            [FromQuery] string? apiKey,
            [FromQuery] string? region,
            [FromQuery] string? requestId)
        {
            try
            {
                var parsedRegion = Utils.GetRegion(region);
                var configuration = new Configuration(apiKey)
                {
                    Region = parsedRegion
                };
                var api = new FingerprintApi(configuration);

                var apiResponse = api.GetEventWithHttpInfo(requestId);
                var eventResponse = apiResponse.Response;
                var rawResponse = await eventResponse.Content.ReadAsStringAsync();

                var response = new MusicianResponse<EventsGetResponse>(eventResponse.StatusCode, rawResponse, apiResponse.Data);
                return Ok(response);
            }
            catch (Exception e) {
                return Ok(Utils.ProcessException(e));
            }
        }

        [HttpGet("/searchEvents")]
        public async Task<IActionResult> SearchEvents(
            [FromQuery] string? apiKey,
            [FromQuery] string? region,
            [FromQuery] int? limit,
            [FromQuery] string? visitorId,
            [FromQuery] string? bot,
            [FromQuery] string? ipAddress,
            [FromQuery] string? linkedId,
            [FromQuery] long? start,
            [FromQuery] long? end,
            [FromQuery] bool? reverse,
            [FromQuery] bool? suspect
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

                var apiResponse = api.SearchEventsWithHttpInfo(limit, visitorId:visitorId, bot:bot, ipAddress:ipAddress, linkedId:linkedId, 
                                                               start:start, end:end, reverse:reverse, suspect:suspect);
                var eventResponse = apiResponse.Response;
                var rawResponse = await eventResponse.Content.ReadAsStringAsync();

                var response = new MusicianResponse<SearchEventsResponse>(eventResponse.StatusCode, rawResponse, apiResponse.Data);
                return Ok(response);
            }
            catch (Exception e) {
                return Ok(Utils.ProcessException(e));
            }
        }

        [HttpGet("/updateEvent")]
        public async Task<IActionResult> UpdateEvent(
            [FromQuery] string? apiKey,
            [FromQuery] string? region,
            [FromQuery] string? requestId,
            [FromQuery] string? linkedId,
            [FromQuery] string? tag,
            [FromQuery] Boolean? suspect
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

                var deserializedTag = tag != null ? JsonUtils.Deserialize<Tag>(tag) : null;

                var updateEventRequest = new EventsUpdateRequest(linkedId, deserializedTag, suspect);

                var apiResponse = api.UpdateEventWithHttpInfo(updateEventRequest, requestId);
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