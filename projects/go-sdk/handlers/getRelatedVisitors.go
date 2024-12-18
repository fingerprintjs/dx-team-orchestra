package handlers

import (
	"encoding/json"
	"go-sdk/utils"
	"net/http"
)

type getRelatedVisitorsQueryParams struct {
	ApiKey    string `json:"apiKey"`
	Region    string `json:"region"`
	VisitorId string `json:"visitorId"`
}

func GetRelatedVisitors(w http.ResponseWriter, r *http.Request) {
	queryParams := getRelatedVisitorsQueryParams{
		ApiKey:    r.URL.Query().Get("apiKey"),
		Region:    r.URL.Query().Get("region"),
		VisitorId: r.URL.Query().Get("visitorId"),
	}

	client, auth := utils.InitSdk(queryParams.ApiKey, queryParams.Region)
	response := utils.ProcessResponse(client.FingerprintApi.GetRelatedVisitors(auth, queryParams.VisitorId))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(response)
}
