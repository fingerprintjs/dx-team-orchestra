package handlersv4

import (
	"encoding/json"
	"go-sdk/fingerprintv4"
	"net/http"
	"strconv"

	fingerprint "github.com/fingerprintjs/go-sdk/v8"
)

type searchEventsQueryParams struct {
	ApiKey  string `json:"api_key"`
	Region  string `json:"region"`
	EventID string `json:"event_id"`
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
	if query.Has("virtual_machine") {
		if val, err := strconv.ParseBool(query.Get("virtual_machine")); err == nil {
			virtualMachine = &val
		}
	}
	if query.Has("tampering") {
		if val, err := strconv.ParseBool(query.Get("tampering")); err == nil {
			tampering = &val
		}
	}
	if query.Has("anti_detect_browser") {
		if val, err := strconv.ParseBool(query.Get("anti_detect_browser")); err == nil {
			antiDetectBrowser = &val
		}
	}
	if query.Has("incognito") {
		if val, err := strconv.ParseBool(query.Get("incognito")); err == nil {
			incognito = &val
		}
	}
	if query.Has("privacy_settings") {
		if val, err := strconv.ParseBool(query.Get("privacy_settings")); err == nil {
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
	if query.Has("factory_reset") {
		if val, err := strconv.ParseBool(query.Get("factory_reset")); err == nil {
			factoryReset = &val
		}
	}
	if query.Has("cloned_app") {
		if val, err := strconv.ParseBool(query.Get("cloned_app")); err == nil {
			clonedApp = &val
		}
	}
	if query.Has("emulator") {
		if val, err := strconv.ParseBool(query.Get("emulator")); err == nil {
			emulator = &val
		}
	}
	if query.Has("root_apps") {
		if val, err := strconv.ParseBool(query.Get("root_apps")); err == nil {
			rootApps = &val
		}
	}
	if query.Has("min_suspect_score") {
		if score, err := strconv.ParseFloat(query.Get("min_suspect_score"), 32); err == nil {
			scoreFloat32 := float32(score)
			minSuspectScore = &scoreFloat32
		}
	}
	if query.Has("developer_tools") {
		if val, err := strconv.ParseBool(query.Get("developer_tools")); err == nil {
			developerTools = &val
		}
	}
	if query.Has("location_spoofing") {
		if val, err := strconv.ParseBool(query.Get("location_spoofing")); err == nil {
			locationSpoofing = &val
		}
	}
	if query.Has("mitm_attack") {
		if val, err := strconv.ParseBool(query.Get("mitm_attack")); err == nil {
			mitmAttack = &val
		}
	}
	if query.Has("proxy") {
		if val, err := strconv.ParseBool(query.Get("proxy")); err == nil {
			proxy = &val
		}
	}
	if query.Has("sdk_version") {
		val := query.Get("sdk_version")
		sdkVersion = &val
	}
	if query.Has("sdk_platform") {
		val := query.Get("sdk_platform")
		sdkPlatform = &val
	}
	if query.Has("environment") {
		environment = query["environment"]
	}
	if query.Has("proximity_id") {
		val := query.Get("proximity_id")
		proximityId = &val
	}

	paginationKey := query.Get("pagination_key")
	visitorId := query.Get("visitor_id")
	bot := query.Get("bot")
	ipAddress := query.Get("ip_address")
	linkedId := query.Get("linked_id")
	vpnConfidence := query.Get("vpn_confidence")

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
		ApiKey:  query.Get("api_key"),
		Region:  query.Get("region"),
		EventID: query.Get("event_id"),
	}

	client := fingerprintv4.Init(queryParams.ApiKey, queryParams.Region)
	response := fingerprintv4.ProcessResponse(client.SearchEvents(r.Context(), searchEventsReq))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(response)
}
