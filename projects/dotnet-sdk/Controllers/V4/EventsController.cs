using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Fingerprint.ServerSdk.Api;
using Fingerprint.ServerSdk.Client;
using Fingerprint.ServerSdk.Model;
using dotnet_sdk.Models;

namespace dotnet_sdk.Controllers.V4;

[ApiController]
[Route("v4")]
public class EventsController(FingerprintV4Factory factory) : ControllerBase
{
    [HttpGet("getEvent")]
    public async Task<IActionResult> GetEvent(
        [FromQuery(Name = "api_key")] string? apiKey,
        [FromQuery(Name = "region")] string? region,
        [FromQuery(Name = "event_id")] string? eventId,
        [FromQuery(Name = "ruleset_id")] string? rulesetId)
    {
        try
        {
            var api = factory.CreateApi(apiKey, region);

            var rulesetIdOption = rulesetId != null
                ? new Option<string>(rulesetId)
                : default;

            var apiResponse = await api.GetEventAsync(eventId ?? "", rulesetIdOption);

            return apiResponse.TryOk(out var data)
                ? Ok(new MusicianResponse<Event>(HttpStatusCode.OK, apiResponse.RawContent, data))
                : Ok(new MusicianResponse<object>(apiResponse.StatusCode, apiResponse.RawContent, Utils.ParseRawContent(apiResponse.RawContent)));
        }
        catch (Exception e)
        {
            return Ok(Utils.ProcessException(e));
        }
    }

    [HttpGet("searchEvents")]
    public async Task<IActionResult> SearchEvents(
        [FromQuery(Name = "api_key")] string? apiKey,
        [FromQuery(Name = "region")] string? region,
        [FromQuery(Name = "limit")] int? limit,
        [FromQuery(Name = "pagination_key")] string? paginationKey,
        [FromQuery(Name = "visitor_id")] string? visitorId,
        [FromQuery(Name = "bot")] string? bot,
        [FromQuery(Name = "ip_address")] string? ipAddress,
        [FromQuery(Name = "linked_id")] string? linkedId,
        [FromQuery(Name = "start")] long? start,
        [FromQuery(Name = "end")] long? end,
        [FromQuery(Name = "reverse")] bool? reverse,
        [FromQuery(Name = "suspect")] bool? suspect,
        [FromQuery(Name = "vpn")] bool? vpn,
        [FromQuery(Name = "virtual_machine")] bool? virtualMachine,
        [FromQuery(Name = "tampering")] bool? tampering,
        [FromQuery(Name = "anti_detect_browser")] bool? antiDetectBrowser,
        [FromQuery(Name = "incognito")] bool? incognito,
        [FromQuery(Name = "privacy_settings")] bool? privacySettings,
        [FromQuery(Name = "jailbroken")] bool? jailbroken,
        [FromQuery(Name = "frida")] bool? frida,
        [FromQuery(Name = "factory_reset")] bool? factoryReset,
        [FromQuery(Name = "cloned_app")] bool? clonedApp,
        [FromQuery(Name = "emulator")] bool? emulator,
        [FromQuery(Name = "root_apps")] bool? rootApps,
        [FromQuery(Name = "min_suspect_score")] float? minSuspectScore,
        [FromQuery(Name = "ip_blocklist")] bool? ipBlocklist,
        [FromQuery(Name = "datacenter")] bool? datacenter,
        [FromQuery(Name = "developer_tools")] bool? developerTools,
        [FromQuery(Name = "location_spoofing")] bool? locationSpoofing,
        [FromQuery(Name = "mitm_attack")] bool? mitmAttack,
        [FromQuery(Name = "proxy")] bool? proxy,
        [FromQuery(Name = "sdk_version")] string? sdkVersion,
        [FromQuery(Name = "sdk_platform")] string? sdkPlatform,
        [FromQuery(Name = "environment")] List<string>? environment,
        [FromQuery(Name = "proximity_id")] string? proximityId,
        [FromQuery(Name = "vpn_confidence")] string? vpnConfidence,
        [FromQuery(Name = "asn")] string? asn,
        [FromQuery(Name = "url")] string? url,
        [FromQuery(Name = "origin")] string? origin,
        [FromQuery(Name = "bundle_id")] string? bundleId,
        [FromQuery(Name = "tor_node")] bool? torNode,
        [FromQuery(Name = "package_name")] string? packageName
    )
    {
        try
        {
            var api = factory.CreateApi(apiKey, region);

            var request = new SearchEventsRequest { Limit = limit ?? 10 };

            if (paginationKey != null) request = request.WithPaginationKey(paginationKey);
            if (visitorId != null) request = request.WithVisitorId(visitorId);
            if (linkedId != null) request = request.WithLinkedId(linkedId);
            if (ipAddress != null) request = request.WithIpAddress(ipAddress);
            if (start.HasValue) request = request.WithStart(start.Value);
            if (end.HasValue) request = request.WithEnd(end.Value);
            if (reverse.HasValue) request = request.WithReverse(reverse.Value);
            if (suspect.HasValue) request = request.WithSuspect(suspect.Value);
            if (vpn.HasValue) request = request.WithVpn(vpn.Value);
            if (virtualMachine.HasValue) request = request.WithVirtualMachine(virtualMachine.Value);
            if (tampering.HasValue) request = request.WithTampering(tampering.Value);
            if (antiDetectBrowser.HasValue) request = request.WithAntiDetectBrowser(antiDetectBrowser.Value);
            if (incognito.HasValue) request = request.WithIncognito(incognito.Value);
            if (privacySettings.HasValue) request = request.WithPrivacySettings(privacySettings.Value);
            if (jailbroken.HasValue) request = request.WithJailbroken(jailbroken.Value);
            if (frida.HasValue) request = request.WithFrida(frida.Value);
            if (factoryReset.HasValue) request = request.WithFactoryReset(factoryReset.Value);
            if (clonedApp.HasValue) request = request.WithClonedApp(clonedApp.Value);
            if (emulator.HasValue) request = request.WithEmulator(emulator.Value);
            if (rootApps.HasValue) request = request.WithRootApps(rootApps.Value);
            if (minSuspectScore.HasValue) request = request.WithMinSuspectScore(minSuspectScore.Value);
            if (developerTools.HasValue) request = request.WithDeveloperTools(developerTools.Value);
            if (locationSpoofing.HasValue) request = request.WithLocationSpoofing(locationSpoofing.Value);
            if (mitmAttack.HasValue) request = request.WithMitmAttack(mitmAttack.Value);
            if (proxy.HasValue) request = request.WithProxy(proxy.Value);
            if (bot != null)
            {
                // To prevent internal error, just response like Server API error
                try { request = request.WithBot(SearchEventsBotValueConverter.FromString(bot)); }
                catch { throw new ApiException("Invalid bot filter", HttpStatusCode.BadRequest, "{\"error\":{\"code\":\"request_cannot_be_parsed\",\"message\":\"invalid bot type\"}}"); }
            }
            if (sdkVersion != null) request = request.WithSdkVersion(sdkVersion);
            if (sdkPlatform != null)
            {
                // To prevent internal error, just response like Server API error
                try { request = request.WithSdkPlatform(SearchEventsSdkPlatformValueConverter.FromString(sdkPlatform)); }
                catch { throw new ApiException("Invalid sdkPlatform", HttpStatusCode.BadRequest, "{\"error\":{\"code\":\"request_cannot_be_parsed\",\"message\":\"invalid sdk platform\"}}"); }
            }
            if (vpnConfidence != null)
            {
                // To prevent internal error, just response like Server API error
                try { request = request.WithVpnConfidence(SearchEventsVpnConfidenceValueConverter.FromString(vpnConfidence)); }
                catch { throw new ApiException("Invalid vpnConfidence", HttpStatusCode.BadRequest, "{\"error\":{\"code\":\"request_cannot_be_parsed\",\"message\":\"invalid vpn confidence\"}}"); }
            }
            if (environment is { Count: > 0 }) request = request.WithEnvironment(environment);
            if (proximityId != null) request = request.WithProximityId(proximityId);
            if (asn != null) request = request.WithAsn(asn);
            if (url != null) request = request.WithUrl(url);
            if (origin != null) request = request.WithOrigin(origin);
            if (bundleId != null) request = request.WithBundleId(bundleId);
            if (torNode.HasValue) request = request.WithTorNode(torNode.Value);
            if (packageName != null) request = request.WithPackageName(packageName);

            var apiResponse = await api.SearchEventsAsync(request);

            return apiResponse.TryOk(out var data)
                ? Ok(new MusicianResponse<EventSearch>(HttpStatusCode.OK, apiResponse.RawContent, data))
                : Ok(new MusicianResponse<object>(apiResponse.StatusCode, apiResponse.RawContent, Utils.ParseRawContent(apiResponse.RawContent)));
        }
        catch (Exception e)
        {
            return Ok(Utils.ProcessException(e));
        }
    }

    [HttpGet("updateEvent")]
    public async Task<IActionResult> UpdateEvent(
        [FromQuery(Name = "api_key")] string? apiKey,
        [FromQuery(Name = "region")] string? region,
        [FromQuery(Name = "event_id")] string? eventId,
        [FromQuery(Name = "linked_id")] string? linkedId,
        [FromQuery(Name = "tags")] string? tags,
        [FromQuery(Name = "suspect")] bool? suspect)
    {
        try
        {
            var api = factory.CreateApi(apiKey, region);

            var updateRequest = new EventUpdate();
            if (linkedId != null) updateRequest.LinkedId = linkedId;
            if (suspect.HasValue) updateRequest.Suspect = suspect;
            if (tags != null) updateRequest.Tags = JsonSerializer.Deserialize<Dictionary<string, object>>(tags)!;

            var apiResponse = await api.UpdateEventAsync(eventId ?? "", updateRequest);

            return Ok(new MusicianResponse<object>(apiResponse.StatusCode, apiResponse.RawContent ?? "", Utils.ParseRawContent(apiResponse.RawContent)));
        }
        catch (Exception e)
        {
            return Ok(Utils.ProcessException(e));
        }
    }
}
