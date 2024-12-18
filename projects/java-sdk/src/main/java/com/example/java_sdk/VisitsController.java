package com.example.java_sdk;

import com.fingerprint.api.FingerprintApi;
import com.fingerprint.model.EventsGetResponse;
import com.fingerprint.model.VisitorsGetResponse;
import com.fingerprint.sdk.ApiClient;
import com.fingerprint.sdk.ApiException;
import com.fingerprint.sdk.ApiResponse;
import com.fingerprint.sdk.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

public class VisitsController {

    @GetMapping("/getVisits")
    public ResponseEntity<MusicianResponse> getVisits(
            @RequestParam(required = false, value = "") String apiKey,
            @RequestParam(required = false, value = "") String region,
            @RequestParam(required = false, value = "") String visitorId,
            @RequestParam(required = false) String requestId,
            @RequestParam(required = false) String linkedId,
            @RequestParam(required = false) int limit,
            @RequestParam(required = false) String paginationKey,
            @RequestParam(required = false) Long before
    ) {
        ApiClient client = Configuration.getDefaultApiClient(apiKey, Utils.getRegion(region));
        FingerprintApi api = new FingerprintApi(client);
        try {
            final ApiResponse<VisitorsGetResponse> apiResponse = api.getVisitsWithHttpInfo(visitorId, requestId, linkedId, limit, paginationKey, before);
            final VisitorsGetResponse visits = apiResponse.getData();
            final int code = apiResponse.getStatusCode();
            final MusicianResponse response = new MusicianResponse(code, visits, visits);
            return ResponseEntity.ok(response);
        } catch (ApiException e) {
            final MusicianResponse response = new MusicianResponse(e);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/deleteVisitorData")
    public ResponseEntity<MusicianResponse> deleteVisitorData(
            @RequestParam(required = false, value = "") String apiKey,
            @RequestParam(required = false, value = "") String region,
            @RequestParam(required = false, value = "") String visitorId
    ) {
        ApiClient client = Configuration.getDefaultApiClient(apiKey, Utils.getRegion(region));
        FingerprintApi api = new FingerprintApi(client);
        try {
            final ApiResponse<Void> apiResponse = api.deleteVisitorDataWithHttpInfo(visitorId);
            final int code = apiResponse.getStatusCode();
            final MusicianResponse response = new MusicianResponse(code, apiResponse.getData(), apiResponse.getData());
            return ResponseEntity.ok(response);
        } catch (ApiException e) {
            final MusicianResponse response = new MusicianResponse(e);
            return ResponseEntity.ok(response);
        }
    }
}
