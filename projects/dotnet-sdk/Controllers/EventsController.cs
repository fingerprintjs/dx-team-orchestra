using Microsoft.AspNetCore.Mvc;
using FingerprintPro.ServerSdk.Api;
using FingerprintPro.ServerSdk.Client;
using FingerprintPro.ServerSdk.Model;
using Newtonsoft.Json;
using dotnet_sdk.Models;

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

                var deserializedTag = tag != null ? JsonConvert.DeserializeObject<Tag>(tag) : null;

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