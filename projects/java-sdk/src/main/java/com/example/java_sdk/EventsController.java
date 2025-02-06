package com.example.java_sdk;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fingerprint.api.FingerprintApi;
import com.fingerprint.model.EventsGetResponse;
import com.fingerprint.model.EventsUpdateRequest;
import com.fingerprint.model.SearchEventsResponse;
import com.fingerprint.sdk.ApiClient;
import com.fingerprint.sdk.ApiException;
import com.fingerprint.sdk.ApiResponse;
import com.fingerprint.sdk.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class EventsController {
    private final ObjectMapper objectMapper;

    public EventsController(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @GetMapping("/searchEvents")
    public ResponseEntity<MusicianResponse> searchEvents(
            @RequestParam(required = false) String apiKey,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String visitorId,
            @RequestParam(required = false) String bot,
            @RequestParam(required = false) String ipAddress,
            @RequestParam(required = false) String linkedId,
            @RequestParam(required = false) Long start,
            @RequestParam(required = false) Long end,
            @RequestParam(required = false) Boolean reverse,
            @RequestParam(required = false) Boolean suspect
    ) {
        ApiClient client = Configuration.getDefaultApiClient(apiKey, Utils.getRegion(region));
        FingerprintApi api = new FingerprintApi(client);
        try {
            final ApiResponse<SearchEventsResponse> apiResponse =
                    api.searchEventsWithHttpInfo(limit, visitorId, bot, ipAddress, linkedId, start, end, reverse, suspect);
            final SearchEventsResponse events = apiResponse.getData();
            final int code = apiResponse.getStatusCode();
            final MusicianResponse response = new MusicianResponse(code, events, events);
            return ResponseEntity.ok(response);
        } catch (ApiException e) {
            final MusicianResponse response = new MusicianResponse(e);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/getEvents")
    public ResponseEntity<MusicianResponse> getEvents(
            @RequestParam(required = false, value = "") String apiKey,
            @RequestParam(required = false, value = "") String region,
            @RequestParam(required = false, value = "") String requestId
    ) {
        ApiClient client = Configuration.getDefaultApiClient(apiKey, Utils.getRegion(region));
        FingerprintApi api = new FingerprintApi(client);
        try {
            final ApiResponse<EventsGetResponse> apiResponse = api.getEventWithHttpInfo(requestId);
            final EventsGetResponse event = apiResponse.getData();
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
            @RequestParam(required = false, value = "") String apiKey,
            @RequestParam(required = false, value = "") String region,
            @RequestParam(required = false, value = "") String requestId,
            @RequestParam(required = false) String linkedId,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) Boolean suspect
    ) {
        ApiClient client = Configuration.getDefaultApiClient(apiKey, Utils.getRegion(region));
        FingerprintApi api = new FingerprintApi(client);
        try {
            final EventsUpdateRequest eventsUpdateRequest = new EventsUpdateRequest();
            eventsUpdateRequest.setLinkedId(linkedId);
            eventsUpdateRequest.setSuspect(suspect);
            if (tag != null) {
                try {
                    Map<String, Object> parsedTag = objectMapper.readValue(tag, new TypeReference<Map<String, Object>>() {
                    });
                    eventsUpdateRequest.setTag(parsedTag);
                } catch (JsonProcessingException e) {
                }
            }

            final ApiResponse<Void> apiResponse = api.updateEventWithHttpInfo(requestId, eventsUpdateRequest);
            final int code = apiResponse.getStatusCode();
            final MusicianResponse response = new MusicianResponse(code, apiResponse.getData(), apiResponse.getData());
            return ResponseEntity.ok(response);
        } catch (ApiException e) {
            final MusicianResponse response = new MusicianResponse(e);
            return ResponseEntity.ok(response);
        }
    }
}
