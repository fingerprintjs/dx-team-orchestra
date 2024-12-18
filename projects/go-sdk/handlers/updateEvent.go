package handlers

import (
	"encoding/json"
	"github.com/fingerprintjs/fingerprint-pro-server-api-go-sdk/v7/sdk"
	"go-sdk/utils"
	"net/http"
	"strconv"
)

type updateEventQueryParams struct {
	ApiKey    string `json:"apiKey"`
	Region    string `json:"region"`
	RequestId string `json:"requestId"`
}

func UpdateEvent(w http.ResponseWriter, r *http.Request) {
	suspect, _ := strconv.ParseBool(r.URL.Query().Get("suspect"))
	var tag sdk.ModelMap
	json.Unmarshal([]byte(r.URL.Query().Get("tag")), &tag)

	queryParams := updateEventQueryParams{
		ApiKey:    r.URL.Query().Get("apiKey"),
		Region:    r.URL.Query().Get("region"),
		RequestId: r.URL.Query().Get("requestId"),
	}

	updateBody := sdk.EventsUpdateRequest{
		LinkedId: r.URL.Query().Get("linkedId"),
		Tag:      &tag,
		Suspect:  suspect,
	}

	client, auth := utils.InitSdk(queryParams.ApiKey, queryParams.Region)
	httpRes, err := client.FingerprintApi.UpdateEvent(auth, updateBody, queryParams.RequestId)
	response := utils.ProcessResponse(nil, httpRes, err)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(response)
}
