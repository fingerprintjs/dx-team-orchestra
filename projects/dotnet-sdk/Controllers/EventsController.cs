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
            [FromQuery] string? paginationKey,
            [FromQuery] string? visitorId,
            [FromQuery] string? bot,
            [FromQuery] string? ipAddress,
            [FromQuery] string? linkedId,
            [FromQuery] long? start,
            [FromQuery] long? end,
            [FromQuery] bool? reverse,
            [FromQuery] bool? suspect,
            [FromQuery] bool? vpn,
            [FromQuery] bool? virtualMachine,
            [FromQuery] bool? tampering,
            [FromQuery] bool? antiDetectBrowser,
            [FromQuery] bool? incognito,
            [FromQuery] bool? privacySettings,
            [FromQuery] bool? jailbroken,
            [FromQuery] bool? frida,
            [FromQuery] bool? factoryReset,
            [FromQuery] bool? clonedApp,
            [FromQuery] bool? emulator,
            [FromQuery] bool? rootApps,
            [FromQuery] float? minSuspectScore,
            [FromQuery] bool? ipBlocklist,
            [FromQuery] bool? datacenter
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

                var apiResponse = api.SearchEventsWithHttpInfo(limit, paginationKey: paginationKey, visitorId:visitorId, bot:bot, ipAddress:ipAddress, linkedId:linkedId,
                                                               start:start, end:end, reverse:reverse, suspect:suspect, vpn:vpn, virtualMachine:virtualMachine,
                                                               tampering:tampering, antiDetectBrowser:antiDetectBrowser, incognito:incognito, privacySettings:privacySettings,
                                                               jailbroken:jailbroken, frida:frida, factoryReset:factoryReset, clonedApp:clonedApp, emulator:emulator,
                                                               rootApps:rootApps, minSuspectScore:minSuspectScore, ipBlocklist:ipBlocklist, datacenter:datacenter);
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
