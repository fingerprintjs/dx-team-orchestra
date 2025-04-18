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
	var vpn *bool
	var virtualMachine *bool
	var tampering *bool
	var antiDetectBrowser *bool
	var incognito *bool
	var privacySettings *bool
	var jailbroken *bool
	var frida *bool
	var factoryReset *bool
	var clonedApp *bool
	var emulator *bool
	var rootApps *bool
	var minSuspectScore *float32

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
	if query.Has("vpn") {
		if val, err := strconv.ParseBool(query.Get("vpn")); err == nil {
			vpn = &val
		}
	}
	if query.Has("virtualMachine") {
		if val, err := strconv.ParseBool(query.Get("virtualMachine")); err == nil {
			virtualMachine = &val
		}
	}
	if query.Has("tampering") {
		if val, err := strconv.ParseBool(query.Get("tampering")); err == nil {
			tampering = &val
		}
	}
	if query.Has("antiDetectBrowser") {
		if val, err := strconv.ParseBool(query.Get("antiDetectBrowser")); err == nil {
			antiDetectBrowser = &val
		}
	}
	if query.Has("incognito") {
		if val, err := strconv.ParseBool(query.Get("incognito")); err == nil {
			incognito = &val
		}
	}
	if query.Has("privacySettings") {
		if val, err := strconv.ParseBool(query.Get("privacySettings")); err == nil {
			privacySettings = &val
		}
	}
	if query.Has("jailbroken") {
		if val, err := strconv.ParseBool(query.Get("jailbroken")); err == nil {
			jailbroken = &val
		}
	}
	if query.Has("frida") {
		if val, err := strconv.ParseBool(query.Get("frida")); err == nil {
			frida = &val
		}
	}
	if query.Has("factoryReset") {
		if val, err := strconv.ParseBool(query.Get("factoryReset")); err == nil {
			factoryReset = &val
		}
	}
	if query.Has("clonedApp") {
		if val, err := strconv.ParseBool(query.Get("clonedApp")); err == nil {
			clonedApp = &val
		}
	}
	if query.Has("emulator") {
		if val, err := strconv.ParseBool(query.Get("emulator")); err == nil {
			emulator = &val
		}
	}
	if query.Has("rootApps") {
		if val, err := strconv.ParseBool(query.Get("rootApps")); err == nil {
			rootApps = &val
		}
	}
	if query.Has("minSuspectScore") {
		if score, err := strconv.ParseFloat(query.Get("minSuspectScore"), 32); err == nil {
			scoreFloat32 := float32(score)
			minSuspectScore = &scoreFloat32
		}
	}

	paginationKey := query.Get("paginationKey")
	visitorId := query.Get("visitorId")
	bot := query.Get("bot")
	ipAddress := query.Get("ipAddress")
	linkedId := query.Get("linkedId")
	vpnConfidence := query.Get("vpnConfidence")

	searchEventsOpts := sdk.FingerprintApiSearchEventsOpts{
		PaginationKey:     &paginationKey,
		VisitorId:         &visitorId,
		LinkedId:          &linkedId,
		Start:             start,
		End:               end,
		Reverse:           reverse,
		Suspect:           suspect,
		Vpn:               vpn,
		VirtualMachine:    virtualMachine,
		Tampering:         tampering,
		AntiDetectBrowser: antiDetectBrowser,
		Incognito:         incognito,
		PrivacySettings:   privacySettings,
		Jailbroken:        jailbroken,
		Frida:             frida,
		FactoryReset:      factoryReset,
		ClonedApp:         clonedApp,
		Emulator:          emulator,
		RootApps:          rootApps,
		MinSuspectScore:   minSuspectScore,
	}
	if bot != "" {
		searchEventsOpts.Bot = &bot
	}
	if ipAddress != "" {
		searchEventsOpts.IpAddress = &ipAddress
	}
	if vpnConfidence != "" {
		searchEventsOpts.VpnConfidence = &vpnConfidence
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
