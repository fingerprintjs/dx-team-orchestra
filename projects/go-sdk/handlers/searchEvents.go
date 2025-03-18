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

	var start *int64
	var end *int64
	var limit int32 = 10
	var reverse *bool
	var suspect *bool

	if query.Has("limit") {
		limitInt64, _ :=
			strconv.ParseInt(query.Get("limit"), 10, 32)
		limit = int32(limitInt64)
	}
	if query.Has("start") {
		if startInt64, err := strconv.ParseInt(query.Get("start"), 10, 64); err == nil {
			start = &startInt64
		}
	}
	if query.Has("end") {
		if endInt64, err := strconv.ParseInt(query.Get("end"), 10, 64); err == nil {
			end = &endInt64
		}
	}
	if query.Has("reverse") {
		if val, err := strconv.ParseBool(query.Get("reverse")); err == nil {
			reverse = &val
		}
	}
	if query.Has("suspect") {
		if val, err := strconv.ParseBool(query.Get("suspect")); err == nil {
			suspect = &val
		}
	}

	paginationKey := query.Get("paginationKey")
	visitorId := query.Get("visitorId")
	bot := query.Get("bot")
	ipAddress := query.Get("ipAddress")
	linkedId := query.Get("linkedId")

	searchEventsOpts := sdk.FingerprintApiSearchEventsOpts{
		PaginationKey: &paginationKey,
		VisitorId:     &visitorId,
		LinkedId:      &linkedId,
		Start:         start,
		End:           end,
		Reverse:       reverse,
		Suspect:       suspect,
	}
	if bot != "" {
		searchEventsOpts.Bot = &bot
	}
	if ipAddress != "" {
		searchEventsOpts.IpAddress = &ipAddress
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
