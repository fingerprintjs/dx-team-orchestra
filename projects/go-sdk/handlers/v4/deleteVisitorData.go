package handlersv4

import (
	"encoding/json"
	"go-sdk/fingerprintv4"
	"net/http"
)

type deleteVisitorDataQueryParams struct {
	ApiKey    string `json:"api_key"`
	Region    string `json:"region"`
	VisitorID string `json:"visitor_id"`
}

func DeleteVisitorData(w http.ResponseWriter, r *http.Request) {
	queryParams := deleteVisitorDataQueryParams{
		ApiKey:    r.URL.Query().Get("api_key"),
		Region:    r.URL.Query().Get("region"),
		VisitorID: r.URL.Query().Get("visitor_id"),
	}

	client := fingerprintv4.Init(queryParams.ApiKey, queryParams.Region)
	httpRes, err := client.DeleteVisitorData(r.Context(), queryParams.VisitorID)
	response := fingerprintv4.ProcessResponse(nil, httpRes, err)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(response)
}
