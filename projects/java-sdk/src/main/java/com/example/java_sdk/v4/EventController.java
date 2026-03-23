package com.example.java_sdk.v4;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fingerprint.v4.api.FingerprintApi;
import com.fingerprint.v4.model.*;
import com.fingerprint.v4.sdk.ApiClient;
import com.fingerprint.v4.sdk.ApiException;
import com.fingerprint.v4.sdk.ApiResponse;
import com.fingerprint.v4.sdk.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v4")
public class EventController {
    private final ObjectMapper objectMapper;

    public EventController(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @GetMapping("/searchEvents")
    public ResponseEntity<MusicianResponse> searchEvents(
            @RequestParam(required = false) String api_key,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String pagination_key,
            @RequestParam(required = false) String visitor_id,
            @RequestParam(required = false) String bot,
            @RequestParam(required = false) String ip_address,
            @RequestParam(required = false) String asn,
            @RequestParam(required = false) String linked_id,
            @RequestParam(required = false) String url,
            @RequestParam(required = false) String bundle_id,
            @RequestParam(required = false) String package_name,
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) Long start,
            @RequestParam(required = false) Long end,
            @RequestParam(required = false) Boolean reverse,
            @RequestParam(required = false) Boolean suspect,
            @RequestParam(required = false) Boolean vpn,
            @RequestParam(required = false) Boolean virtual_machine,
            @RequestParam(required = false) Boolean tampering,
            @RequestParam(required = false) Boolean anti_detect_browser,
            @RequestParam(required = false) Boolean incognito,
            @RequestParam(required = false) Boolean privacy_settings,
            @RequestParam(required = false) Boolean jailbroken,
            @RequestParam(required = false) Boolean frida,
            @RequestParam(required = false) Boolean factory_reset,
            @RequestParam(required = false) Boolean cloned_app,
            @RequestParam(required = false) Boolean emulator,
            @RequestParam(required = false) Boolean root_apps,
            @RequestParam(required = false) String vpn_confidence,
            @RequestParam(required = false) Float min_suspect_score,
            @RequestParam(required = false) Boolean developer_tools,
            @RequestParam(required = false) Boolean location_spoofing,
            @RequestParam(required = false) Boolean mitm_attack,
            @RequestParam(required = false) Boolean proxy,
            @RequestParam(required = false) String sdk_version,
            @RequestParam(required = false) String sdk_platform,
            @RequestParam(required = false) List<String> environment,
            @RequestParam(required = false) String proximity_id,
            @RequestParam(required = false) Long total_hits,
            @RequestParam(required = false) Boolean tor_node
    ) {
        ApiClient client = Configuration.getDefaultApiClient(api_key, Utils.getRegion(region));
        FingerprintApi api = new FingerprintApi(client);
        try {
            final ApiResponse<EventSearch> apiResponse =
                    api.searchEventsWithHttpInfo(new FingerprintApi.SearchEventsOptionalParams()
                            .setLimit(limit)
                            .setPaginationKey(pagination_key)
                            .setVisitorId(visitor_id)
                            .setBot(bot != null ? SearchEventsBot.fromValue(bot) : null)
                            .setIpAddress(ip_address)
                            .setAsn(asn)
                            .setLinkedId(linked_id)
                            .setUrl(url)
                            .setBundleId(bundle_id)
                            .setPackageName(package_name)
                            .setOrigin(origin)
                            .setStart(start)
                            .setEnd(end)
                            .setReverse(reverse)
                            .setSuspect(suspect)
                            .setVpn(vpn)
                            .setVirtualMachine(virtual_machine)
                            .setTampering(tampering)
                            .setAntiDetectBrowser(anti_detect_browser)
                            .setIncognito(incognito)
                            .setPrivacySettings(privacy_settings)
                            .setJailbroken(jailbroken)
                            .setFrida(frida)
                            .setFactoryReset(factory_reset)
                            .setClonedApp(cloned_app)
                            .setEmulator(emulator)
                            .setRootApps(root_apps)
                            .setVpnConfidence(vpn_confidence != null ? SearchEventsVpnConfidence.fromValue(vpn_confidence) : null)
                            .setMinSuspectScore(min_suspect_score)
                            .setDeveloperTools(developer_tools)
                            .setLocationSpoofing(location_spoofing)
                            .setMitmAttack(mitm_attack)
                            .setProxy(proxy)
                            .setSdkVersion(sdk_version)
                            .setSdkPlatform(sdk_platform != null ? SearchEventsSdkPlatform.fromValue(sdk_platform) : null)
                            .setEnvironment(environment)
                            .setProximityId(proximity_id)
                            .setTotalHits(total_hits)
                            .setTorNode(tor_node)
                    );
            final EventSearch events = apiResponse.getData();
            final int code = apiResponse.getStatusCode();
            final MusicianResponse response = new MusicianResponse(code, events, events);
            return ResponseEntity.ok(response);
        } catch (ApiException e) {
            final MusicianResponse response = new MusicianResponse(e);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/getEvent")
    public ResponseEntity<MusicianResponse> getEvent(
            @RequestParam(required = false, value = "") String api_key,
            @RequestParam(required = false, value = "") String region,
            @RequestParam(required = false, value = "") String event_id,
            @RequestParam(required = false, value = "") String ruleset_id
    ) {
        ApiClient client = Configuration.getDefaultApiClient(api_key, Utils.getRegion(region));
        FingerprintApi api = new FingerprintApi(client);
        try {
            final ApiResponse<Event> apiResponse = api.getEventWithHttpInfo(event_id, new FingerprintApi
                    .GetEventOptionalParams().setRulesetId(ruleset_id));
            final Event event = apiResponse.getData();
            final int code = apiResponse.getStatusCode();
            final MusicianResponse response = new MusicianResponse(code, event, event);
            return ResponseEntity.ok(response);
        } catch (ApiException e) {
            final MusicianResponse response = new MusicianResponse(e);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/updateEvent")
    public ResponseEntity<MusicianResponse> updateEvent(
            @RequestParam(required = false, value = "") String api_key,
            @RequestParam(required = false, value = "") String region,
            @RequestParam(required = false, value = "") String event_id,
            @RequestParam(required = false) String linked_id,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) Boolean suspect
    ) {
        ApiClient client = Configuration.getDefaultApiClient(api_key, Utils.getRegion(region));
        FingerprintApi api = new FingerprintApi(client);
        try {
            final EventUpdate eventsUpdateRequest = new EventUpdate();
            eventsUpdateRequest.setLinkedId(linked_id);
            eventsUpdateRequest.setSuspect(suspect);
            if (tag != null) {
                try {
                    Map<String, Object> parsedTag = objectMapper.readValue(tag, new TypeReference<Map<String, Object>>() {
                    });
                    eventsUpdateRequest.setTags(parsedTag);
                } catch (JsonProcessingException e) {
                }
            }

            final ApiResponse<Void> apiResponse = api.updateEventWithHttpInfo(event_id, eventsUpdateRequest);
            final int code = apiResponse.getStatusCode();
            final MusicianResponse response = new MusicianResponse(code, apiResponse.getData(), apiResponse.getData());
            return ResponseEntity.ok(response);
        } catch (ApiException e) {
            final MusicianResponse response = new MusicianResponse(e);
            return ResponseEntity.ok(response);
        }
    }
}
