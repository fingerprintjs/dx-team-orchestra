package com.example.java_sdk;

import com.fingerprint.api.FingerprintApi;
import com.fingerprint.model.RelatedVisitor;
import com.fingerprint.model.RelatedVisitorsResponse;
import com.fingerprint.model.VisitorsGetResponse;
import com.fingerprint.sdk.ApiClient;
import com.fingerprint.sdk.ApiException;
import com.fingerprint.sdk.ApiResponse;
import com.fingerprint.sdk.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RelatedVisitorsController {

    @GetMapping("getRelatedVisitors")
    public ResponseEntity<MusicianResponse> getRelatedVisitors(
            @RequestParam(required = false, value = "") String apiKey,
            @RequestParam(required = false, value = "") String region,
            @RequestParam(required = false, value = "") String visitorId
    ) {
        ApiClient client = Configuration.getDefaultApiClient(apiKey, Utils.getRegion(region));
        FingerprintApi api = new FingerprintApi(client);
        try {
            final ApiResponse<RelatedVisitorsResponse> apiResponse = api.getRelatedVisitorsWithHttpInfo(visitorId);
            final RelatedVisitorsResponse visits = apiResponse.getData();
            final int code = apiResponse.getStatusCode();
            final MusicianResponse response = new MusicianResponse(code, visits, visits);
            return ResponseEntity.ok(response);
        } catch (ApiException e) {
            final MusicianResponse response = new MusicianResponse(e);
            return ResponseEntity.ok(response);
        }
    }
}
