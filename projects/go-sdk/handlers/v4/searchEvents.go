package handlersv4

import (
	"encoding/json"
	"go-sdk/fingerprintv4"
	"net/http"
	"strconv"

	fingerprint "github.com/fingerprintjs/go-sdk/v8"
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
	var developerTools *bool
	var locationSpoofing *bool
	var mitmAttack *bool
	var proxy *bool
	var sdkVersion *string
	var sdkPlatform *string
	var environment []string
	var proximityId *string

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
	if query.Has("developerTools") {
		if val, err := strconv.ParseBool(query.Get("developerTools")); err == nil {
			developerTools = &val
		}
	}
	if query.Has("locationSpoofing") {
		if val, err := strconv.ParseBool(query.Get("locationSpoofing")); err == nil {
			locationSpoofing = &val
		}
	}
	if query.Has("mitmAttack") {
		if val, err := strconv.ParseBool(query.Get("mitmAttack")); err == nil {
			mitmAttack = &val
		}
	}
	if query.Has("proxy") {
		if val, err := strconv.ParseBool(query.Get("proxy")); err == nil {
			proxy = &val
		}
	}
	if query.Has("sdkVersion") {
		val := query.Get("sdkVersion")
		sdkVersion = &val
	}
	if query.Has("sdkPlatform") {
		val := query.Get("sdkPlatform")
		sdkPlatform = &val
	}
	if query.Has("environment") {
		environment = query["environment"]
	}
	if query.Has("proximityId") {
		val := query.Get("proximityId")
		proximityId = &val
	}

	paginationKey := query.Get("paginationKey")
	visitorId := query.Get("visitorId")
	bot := query.Get("bot")
	ipAddress := query.Get("ipAddress")
	linkedId := query.Get("linkedId")
	vpnConfidence := query.Get("vpnConfidence")

	searchEventsReq := fingerprint.NewSearchEventsRequest().
		Limit(limit)

	if paginationKey != "" {
		searchEventsReq = searchEventsReq.PaginationKey(paginationKey)
	}
	if visitorId != "" {
		searchEventsReq = searchEventsReq.VisitorID(visitorId)
	}
	if linkedId != "" {
		searchEventsReq = searchEventsReq.LinkedID(linkedId)
	}
	if start != nil {
		searchEventsReq = searchEventsReq.Start(*start)
	}
	if end != nil {
		searchEventsReq = searchEventsReq.End(*end)
	}
	if reverse != nil {
		searchEventsReq = searchEventsReq.Reverse(*reverse)
	}
	if suspect != nil {
		searchEventsReq = searchEventsReq.Suspect(*suspect)
	}
	if vpn != nil {
		searchEventsReq = searchEventsReq.VPN(*vpn)
	}
	if virtualMachine != nil {
		searchEventsReq = searchEventsReq.VirtualMachine(*virtualMachine)
	}
	if tampering != nil {
		searchEventsReq = searchEventsReq.Tampering(*tampering)
	}
	if antiDetectBrowser != nil {
		searchEventsReq = searchEventsReq.AntiDetectBrowser(*antiDetectBrowser)
	}
	if incognito != nil {
		searchEventsReq = searchEventsReq.Incognito(*incognito)
	}
	if privacySettings != nil {
		searchEventsReq = searchEventsReq.PrivacySettings(*privacySettings)
	}
	if jailbroken != nil {
		searchEventsReq = searchEventsReq.Jailbroken(*jailbroken)
	}
	if frida != nil {
		searchEventsReq = searchEventsReq.Frida(*frida)
	}
	if factoryReset != nil {
		searchEventsReq = searchEventsReq.FactoryReset(*factoryReset)
	}
	if clonedApp != nil {
		searchEventsReq = searchEventsReq.ClonedApp(*clonedApp)
	}
	if emulator != nil {
		searchEventsReq = searchEventsReq.Emulator(*emulator)
	}
	if rootApps != nil {
		searchEventsReq = searchEventsReq.RootApps(*rootApps)
	}
	if minSuspectScore != nil {
		searchEventsReq = searchEventsReq.MinSuspectScore(*minSuspectScore)
	}
	if developerTools != nil {
		searchEventsReq = searchEventsReq.DeveloperTools(*developerTools)
	}
	if locationSpoofing != nil {
		searchEventsReq = searchEventsReq.LocationSpoofing(*locationSpoofing)
	}
	if mitmAttack != nil {
		searchEventsReq = searchEventsReq.MITMAttack(*mitmAttack)
	}
	if proxy != nil {
		searchEventsReq = searchEventsReq.Proxy(*proxy)
	}
	if sdkVersion != nil {
		searchEventsReq = searchEventsReq.SDKVersion(*sdkVersion)
	}
	if sdkPlatform != nil {
		searchEventsReq = searchEventsReq.SDKPlatform(fingerprint.SearchEventsSDKPlatform(*sdkPlatform))
	}
	if len(environment) > 0 {
		searchEventsReq = searchEventsReq.Environment(environment)
	}
	if proximityId != nil {
		searchEventsReq = searchEventsReq.ProximityID(*proximityId)
	}
	if bot != "" {
		searchEventsReq = searchEventsReq.Bot(fingerprint.SearchEventsBot(bot))
	}
	if ipAddress != "" {
		searchEventsReq = searchEventsReq.IPAddress(ipAddress)
	}
	if vpnConfidence != "" {
		searchEventsReq = searchEventsReq.VPNConfidence(fingerprint.SearchEventsVPNConfidence(vpnConfidence))
	}
	queryParams := searchEventsQueryParams{
		ApiKey:    query.Get("apiKey"),
		Region:    query.Get("region"),
		RequestId: query.Get("requestId"),
	}

	client := fingerprintv4.Init(queryParams.ApiKey, queryParams.Region)
	response := fingerprintv4.ProcessResponse(client.SearchEvents(r.Context(), searchEventsReq))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(response)
}
