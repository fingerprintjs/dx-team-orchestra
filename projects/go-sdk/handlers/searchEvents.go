package handlers

import (
	"encoding/json"
	"github.com/fingerprintjs/fingerprint-pro-server-api-go-sdk/v7/sdk"
	"go-sdk/utils"
	"net/http"
	"strconv"
)

type searchEventsQueryParams struct {
	ApiKey    string `json:"apiKey"`
	Region    string `json:"region"`
	RequestId string `json:"requestId"`
}

func SearchEvents(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	var start int64 = 0
	var end int64 = 0
	var limit int32 = 10
	reverse := false
	suspect := false

	if query.Has("limit") {
		limitInt64, _ :=
			strconv.ParseInt(query.Get("limit"), 10, 32)
		limit = int32(limitInt64)
	}
	if query.Has("start") {
		start, _ = strconv.ParseInt(query.Get("start"), 10, 64)
	}
	if query.Has("end") {
		end, _ = strconv.ParseInt(query.Get("end"), 10, 64)
	}
	if query.Has("reverse") {
		reverse, _ = strconv.ParseBool(query.Get("reverse"))
	}
	if query.Has("suspect") {
		suspect, _ = strconv.ParseBool(query.Get("suspect"))
	}

	searchEventsOpts := sdk.FingerprintApiSearchEventsOpts{
		VisitorId: query.Get("visitorId"),
		Bot:       query.Get("bot"),
		IpAddress: query.Get("ipAddress"),
		LinkedId:  query.Get("linkedId"),
		Start:     start,
		End:       end,
		Reverse:   reverse,
		Suspect:   suspect,
	}
	queryParams := searchEventsQueryParams{
		ApiKey:    query.Get("apiKey"),
		Region:    query.Get("region"),
		RequestId: query.Get("requestId"),
	}

	client, auth := utils.InitSdk(queryParams.ApiKey, queryParams.Region)
	response := utils.ProcessResponse(client.FingerprintApi.SearchEvents(auth, limit, &searchEventsOpts))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(response)
}
