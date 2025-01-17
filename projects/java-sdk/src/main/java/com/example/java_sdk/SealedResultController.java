package com.example.java_sdk;

import com.fingerprint.Sealed;
import com.fingerprint.model.EventsGetResponse;
import com.fingerprint.sdk.ApiException;
import com.fingerprint.sdk.ApiResponse;
import com.fingerprint.sdk.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;


@RestController
public class SealedResultController {
    @PostMapping("/unseal")
    public ResponseEntity<MusicianResponse> unseal(@RequestBody UnsealRequest request) {
        try {
            final Sealed.DecryptionKey[] keysList = request.getKeys().stream().map(
                    key -> new Sealed.DecryptionKey(
                            Base64.getDecoder().decode(key.get("key")),
                            Sealed.DecryptionAlgorithm.valueOf(key.get("algorithm").toUpperCase().replace("-", "_"))
                    )).toArray(Sealed.DecryptionKey[]::new);
            final EventsGetResponse event = Sealed.unsealEventResponse(Base64.getDecoder().decode(request.getSealedData()), keysList);
            final MusicianResponse response = new MusicianResponse(200, event, event);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            final MusicianResponse response = new MusicianResponse(e);
            return ResponseEntity.ok(response);
        }
    }
}
