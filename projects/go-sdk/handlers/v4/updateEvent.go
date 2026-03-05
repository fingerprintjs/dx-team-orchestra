package handlersv4

import (
	"encoding/json"
	"go-sdk/fingerprintv4"
	"net/http"
	"strconv"

	fingerprint "github.com/fingerprintjs/go-sdk/v8"
)

type updateEventQueryParams struct {
	ApiKey  string `json:"apiKey"`
	Region  string `json:"region"`
	EventID string `json:"eventId"`
}

func UpdateEvent(w http.ResponseWriter, r *http.Request) {
	var suspectValue *bool

	query := r.URL.Query()

	suspect, suspectErr := strconv.ParseBool(query.Get("suspect"))
	if suspectErr == nil {
		suspectValue = &suspect
	}

	var tag map[string]interface{}
	json.Unmarshal([]byte(query.Get("tag")), &tag)

	linkedId := query.Get("linkedId")

	eventUpdate := fingerprint.EventUpdate{
		LinkedID: &linkedId,
		Suspect:  suspectValue,
		Tags:     tag,
	}

	queryParams := updateEventQueryParams{
		ApiKey:  query.Get("apiKey"),
		Region:  query.Get("region"),
		EventID: query.Get("eventId"),
	}

	client := fingerprintv4.Init(queryParams.ApiKey, queryParams.Region)

	httpRes, err := client.UpdateEvent(r.Context(), queryParams.EventID, eventUpdate)
	response := fingerprintv4.ProcessResponse(nil, httpRes, err)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(response)
}
