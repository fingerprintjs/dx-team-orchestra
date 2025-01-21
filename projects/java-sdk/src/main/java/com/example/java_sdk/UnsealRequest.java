package com.example.java_sdk;

import java.util.List;
import java.util.Map;

public class UnsealRequest {
    private String sealedData;
    private List<Map<String, String>> keys;

    public String getSealedData() {
        return sealedData;
    }

    public void setSealedData(String sealedData) {
        this.sealedData = sealedData;
    }

    public List<Map<String, String>> getKeys() {
        return keys;
    }

    public void setKeys(List<Map<String, String>> keys) {
        this.keys = keys;
    }
}
