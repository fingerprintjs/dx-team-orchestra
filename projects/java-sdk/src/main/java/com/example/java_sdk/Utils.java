package com.example.java_sdk;

import com.fingerprint.Sealed;
import com.fingerprint.sdk.Region;

public class Utils {
    static Region getRegion(String region) {
        if (region == null) {
            return Region.GLOBAL;
        }
        switch (region) {
            case "eu":
                return Region.EUROPE;
            case "ap":
                return Region.ASIA;
            default:
                return Region.GLOBAL;
        }
    }
}
