package com.example.java_sdk.v4;

import com.example.java_sdk.UnsealRequest;
import com.fingerprint.v4.Sealed;
import com.fingerprint.v4.model.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Base64;


@RestController("SealedResultControllerV4")
@RequestMapping("/v4")
public class SealedResultController {
    @PostMapping("/unseal")
    public ResponseEntity<com.example.java_sdk.v4.MusicianResponse> unseal(@RequestBody UnsealRequest request) {
        try {
            final Sealed.DecryptionKey[] keysList = request.getKeys().stream().map(
                    key -> new Sealed.DecryptionKey(
                            Base64.getDecoder().decode(key.get("key")),
                            Sealed.DecryptionAlgorithm.valueOf(key.get("algorithm").toUpperCase().replace("-", "_"))
                    )).toArray(Sealed.DecryptionKey[]::new);
            final Event event = Sealed.unsealEventResponse(Base64.getDecoder().decode(request.getSealedData()), keysList);
            final com.example.java_sdk.v4.MusicianResponse response = new com.example.java_sdk.v4.MusicianResponse(200, event, event);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            final com.example.java_sdk.v4.MusicianResponse response = new com.example.java_sdk.v4.MusicianResponse(e);
            return ResponseEntity.ok(response);
        }
    }
}
