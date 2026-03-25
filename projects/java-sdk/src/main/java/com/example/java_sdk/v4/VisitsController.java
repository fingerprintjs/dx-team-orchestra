package com.example.java_sdk.v4;

import com.example.java_sdk.v4.Utils;
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

@RestController("VisitsControllerV4")
@RequestMapping("/v4")
public class VisitsController {
    @GetMapping("/deleteVisitorData")
    public ResponseEntity<com.example.java_sdk.v4.MusicianResponse> deleteVisitorData(
            @RequestParam(required = false, value = "") String api_key,
            @RequestParam(required = false, value = "") String region,
            @RequestParam(required = false, value = "") String visitor_id
    ) {
        ApiClient client = Configuration.getDefaultApiClient(api_key, Utils.getRegion(region));
        FingerprintApi api = new FingerprintApi(client);
        try {
            final ApiResponse<Void> apiResponse = api.deleteVisitorDataWithHttpInfo(visitor_id);
            final int code = apiResponse.getStatusCode();
            final com.example.java_sdk.v4.MusicianResponse response = new com.example.java_sdk.v4.MusicianResponse(code, apiResponse.getData(), apiResponse.getData());
            return ResponseEntity.ok(response);
        } catch (ApiException e) {
            final com.example.java_sdk.v4.MusicianResponse response = new com.example.java_sdk.v4.MusicianResponse(e);
            return ResponseEntity.ok(response);
        }
    }
}
