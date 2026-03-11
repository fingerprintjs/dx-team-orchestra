package handlersv3

import (
	"encoding/json"
	"go-sdk/fingerprintv3"
	"net/http"
)

type deleteVisitorDataQueryParams struct {
	ApiKey    string `json:"apiKey"`
	Region    string `json:"region"`
	VisitorId string `json:"visitorId"`
}

func DeleteVisitorData(w http.ResponseWriter, r *http.Request) {
	queryParams := deleteVisitorDataQueryParams{
		ApiKey:    r.URL.Query().Get("apiKey"),
		Region:    r.URL.Query().Get("region"),
		VisitorId: r.URL.Query().Get("visitorId"),
	}

	client, auth := fingerprintv3.Init(queryParams.ApiKey, queryParams.Region)
	httpRes, err := client.FingerprintApi.DeleteVisitorData(auth, queryParams.VisitorId)
	response := fingerprintv3.ProcessResponse(nil, httpRes, err)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(response)
}
