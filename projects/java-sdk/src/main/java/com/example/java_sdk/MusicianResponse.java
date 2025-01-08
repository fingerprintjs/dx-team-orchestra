package com.example.java_sdk;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.fingerprint.Sealed;
import com.fingerprint.sdk.ApiException;

import java.util.HashMap;
import java.util.Map;

class MusicianResponse<T> {
    private int code;
    private T originalResponse;
    private T parsedResponse;

    public MusicianResponse(int code, T originalResponse, T parsedResponse) {
        this.code = code;
        this.originalResponse = originalResponse;
        this.parsedResponse = parsedResponse;
    }

    public MusicianResponse(ApiException e) {
        ObjectMapper objectMapper = new ObjectMapper();
        this.code = e.getCode();
        this.originalResponse = (T) e.getMessage();
        // TODO: better solution?
        if (e.getMessage() == "Missing the required parameter 'visitorId' when calling deleteVisitorData") {
            this.parsedResponse = (T) new HashMap<String, Object>() {{
                put("error", new HashMap<String, String>() {{
                    put("code", "RequestCannotBeParsed");
                    put("message", "visitor id is required");
                }});
            }};
        } else {
            // TODO: should be a model
            try {
                this.parsedResponse = (T) objectMapper.readValue(e.getResponseBody(), Map.class);
            } catch (JsonProcessingException ex) {
                this.parsedResponse = (T) e.getResponseBody();
            }
        }
    }

    public MusicianResponse(Exception e) {
        this.code = 500;
        this.originalResponse = (T) e.getMessage();
        this.parsedResponse = (T) e.getMessage();
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public T getOriginalResponse() {
        return originalResponse;
    }

    public void setOriginalResponse(T originalResponse) {
        this.originalResponse = originalResponse;
    }

    public T getParsedResponse() {
        return parsedResponse;
    }

    public void setParsedResponse(T parsedResponse) {
        this.parsedResponse = parsedResponse;
    }
}

