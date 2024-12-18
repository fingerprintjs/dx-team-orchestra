package handlers

import (
	"encoding/json"
	"github.com/fingerprintjs/fingerprint-pro-server-api-go-sdk/v7/sdk/sealed"
	"go-sdk/utils"
	"net/http"
)

type RequestBody struct {
	SealedData []byte                 `json:"sealedData"`
	Keys       []sealed.DecryptionKey `json:"keys"`
}

func Unseal(w http.ResponseWriter, r *http.Request) {
	var body RequestBody
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&body)

	unsealedResponse, err := sealed.UnsealEventsResponse(body.SealedData, body.Keys)

	var response utils.MusicianResponse
	if err != nil {
		response = utils.MusicianResponse{
			Code:             500,
			OriginalResponse: "",
			ParsedResponse:   err.Error(),
		}
	} else {
		response = utils.MusicianResponse{
			Code:             200,
			OriginalResponse: "",
			ParsedResponse:   unsealedResponse,
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(response)
}
