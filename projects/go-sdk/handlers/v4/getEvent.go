package handlersv4

import (
	"encoding/json"
	"go-sdk/fingerprintv4"
	"net/http"
)

type getEventsQueryParams struct {
	ApiKey  string `json:"apiKey"`
	Region  string `json:"region"`
	EventID string `json:"eventId"`
}

func GetEvent(w http.ResponseWriter, r *http.Request) {
	queryParams := getEventsQueryParams{
		ApiKey:  r.URL.Query().Get("apiKey"),
		Region:  r.URL.Query().Get("region"),
		EventID: r.URL.Query().Get("eventId"),
	}

	client := fingerprintv4.Init(queryParams.ApiKey, queryParams.Region)
	response := fingerprintv4.ProcessResponse(client.GetEvent(r.Context(), queryParams.EventID))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(response)
}
