package com.example.java_sdk;

import com.fingerprint.Sealed;
import com.fingerprint.sdk.ApiException;

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
        this.code = e.getCode();
        // TODO: should be a model
        this.originalResponse = (T) e.getMessage();
        this.parsedResponse = (T) e.getResponseBody();
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

