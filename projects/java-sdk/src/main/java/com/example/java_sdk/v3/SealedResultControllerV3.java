package com.example.java_sdk.v3;

import com.example.java_sdk.UnsealRequest;
import com.fingerprint.Sealed;
import com.fingerprint.model.EventsGetResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Base64;


@RestController
public class SealedResultControllerV3 {
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
