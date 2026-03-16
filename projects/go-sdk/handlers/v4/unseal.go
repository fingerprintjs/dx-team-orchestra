package handlersv4

import (
	"encoding/json"
	"go-sdk/response"
	"net/http"

	"github.com/fingerprintjs/go-sdk/v8"
)

type RequestBody struct {
	SealedData []byte                      `json:"sealedData"`
	Keys       []fingerprint.DecryptionKey `json:"keys"`
}

func Unseal(w http.ResponseWriter, r *http.Request) {
	var body RequestBody
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&body)

	unsealedResponse, err := fingerprint.UnsealEventsResponse(body.SealedData, body.Keys)

	var resp response.MusicianResponse
	if err != nil {
		resp = response.MusicianResponse{
			Code:             500,
			OriginalResponse: "",
			ParsedResponse:   err.Error(),
		}
	} else {
		resp = response.MusicianResponse{
			Code:             200,
			OriginalResponse: "",
			ParsedResponse:   unsealedResponse,
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(resp)
}
