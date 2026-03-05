package fingerprintv4

import (
	"fmt"
	"go-sdk/response"
	"net/http"

	"github.com/fingerprintjs/go-sdk/v8"
)

func Init(apiKey string, region string) *fingerprint.Client {
	client := fingerprint.New(fingerprint.WithAPIKey(apiKey), fingerprint.WithRegion(fingerprint.Region(region)))
	return client
}

func ProcessResponse(data interface{}, httpRes *http.Response, err error) response.MusicianResponse {
	if fpErr, ok := fingerprint.AsErrorResponse(err); ok {
		return response.MusicianResponse{
			Code:             httpRes.StatusCode,
			OriginalResponse: fmt.Sprintf("%v", httpRes),
			ParsedResponse:   fpErr.Error,
		}
	}

	return response.MusicianResponse{
		Code:             httpRes.StatusCode,
		OriginalResponse: fmt.Sprintf("%v", httpRes),
		ParsedResponse:   data,
	}
}
