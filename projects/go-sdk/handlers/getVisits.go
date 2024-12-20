package handlers

import (
	"encoding/json"
	"github.com/fingerprintjs/fingerprint-pro-server-api-go-sdk/v7/sdk"
	"go-sdk/utils"
	"net/http"
	"strconv"
)

type getVisitsQueryParams struct {
	ApiKey    string `json:"apiKey"`
	Region    string `json:"region"`
	VisitorId string `json:"visitorId"`
}

func GetVisits(w http.ResponseWriter, r *http.Request) {
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	before, _ := strconv.ParseInt(r.URL.Query().Get("before"), 10, 64)

	queryParams := getVisitsQueryParams{
		ApiKey:    r.URL.Query().Get("apiKey"),
		Region:    r.URL.Query().Get("region"),
		VisitorId: r.URL.Query().Get("visitorId"),
	}

	visitorOps := sdk.FingerprintApiGetVisitsOpts{
		RequestId:     r.URL.Query().Get("requestId"),
		LinkedId:      r.URL.Query().Get("linkedId"),
		Limit:         int32(limit),
		PaginationKey: r.URL.Query().Get("paginationKey"),
		Before:        before,
	}

	client, auth := utils.InitSdk(queryParams.ApiKey, queryParams.Region)
	response := utils.ProcessResponse(client.FingerprintApi.GetVisits(auth, queryParams.VisitorId, &visitorOps))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(response)
}
