package com.example.java_sdk;

import com.fingerprint.Sealed;
import com.fingerprint.model.EventsGetResponse;
import com.fingerprint.sdk.ApiException;
import com.fingerprint.sdk.ApiResponse;
import com.fingerprint.sdk.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;


public class SealedResultController {
    @PostMapping("/unseal")
    public ResponseEntity<MusicianResponse> unseal(
            @RequestBody String sealedData,
            @RequestBody List<Map<String, String>> keys
    ) {
        try {
            final Sealed.DecryptionKey[] keysList = keys.stream().map(
                    key -> new Sealed.DecryptionKey(
                            Base64.getDecoder().decode(key.get("key")),
                            Sealed.DecryptionAlgorithm.valueOf(key.get("algorithm"))
                    )).toArray(Sealed.DecryptionKey[]::new);
            final EventsGetResponse event = Sealed.unsealEventResponse(Base64.getDecoder().decode(sealedData), keysList);
            final MusicianResponse response = new MusicianResponse(200, event, event);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            final MusicianResponse response = new MusicianResponse(e);
            return ResponseEntity.ok(response);
        }
    }
}
