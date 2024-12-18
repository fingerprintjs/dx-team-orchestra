package handlers

import (
	"encoding/json"
	"go-sdk/utils"
	"net/http"
)

type getEventsQueryParams struct {
	ApiKey    string `json:"apiKey"`
	Region    string `json:"region"`
	RequestId string `json:"requestId"`
}

func GetEvents(w http.ResponseWriter, r *http.Request) {
	queryParams := getEventsQueryParams{
		ApiKey:    r.URL.Query().Get("apiKey"),
		Region:    r.URL.Query().Get("region"),
		RequestId: r.URL.Query().Get("requestId"),
	}

	client, auth := utils.InitSdk(queryParams.ApiKey, queryParams.Region)
	response := utils.ProcessResponse(client.FingerprintApi.GetEvent(auth, queryParams.RequestId))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(response)
}
