package handlersv4

import (
	"encoding/json"
	"go-sdk/fingerprintv4"
	"net/http"

	fingerprint "github.com/fingerprintjs/go-sdk/v8"
)

type getEventsQueryParams struct {
	ApiKey    string `json:"api_key"`
	Region    string `json:"region"`
	EventID   string `json:"event_id"`
	RulesetID string `json:"ruleset_id"`
}

func GetEvent(w http.ResponseWriter, r *http.Request) {
	queryParams := getEventsQueryParams{
		ApiKey:    r.URL.Query().Get("api_key"),
		Region:    r.URL.Query().Get("region"),
		EventID:   r.URL.Query().Get("event_id"),
		RulesetID: r.URL.Query().Get("ruleset_id"),
	}

	client := fingerprintv4.Init(queryParams.ApiKey, queryParams.Region)

	var options []fingerprint.GetEventOption
	if queryParams.RulesetID != "" {
		options = append(options, fingerprint.WithRulesetID(queryParams.RulesetID))
	}

	response := fingerprintv4.ProcessResponse(client.GetEvent(r.Context(), queryParams.EventID, options...))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(response)
}
