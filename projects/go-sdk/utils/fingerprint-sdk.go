package utils

import (
	"context"
	"fmt"
	"github.com/fingerprintjs/fingerprint-pro-server-api-go-sdk/v7/sdk"
	"net/http"
)

func InitSdk(apiKey string, region string) (*sdk.APIClient, context.Context) {
	cfg := sdk.NewConfiguration()
	cfg.ChangeRegion(sdk.Region(region))

	client := sdk.NewAPIClient(cfg)
	auth := context.WithValue(context.Background(), sdk.ContextAPIKey, sdk.APIKey{
		Key: apiKey,
	})
	return client, auth
}

func ProcessResponse(data interface{}, httpRes *http.Response, err sdk.Error) MusicianResponse {
	if err != nil {
		return MusicianResponse{
			Code:             httpRes.StatusCode,
			OriginalResponse: fmt.Sprintf("%v", httpRes),
			ParsedResponse:   err.Model(),
		}
	}

	return MusicianResponse{
		Code:             httpRes.StatusCode,
		OriginalResponse: fmt.Sprintf("%v", httpRes),
		ParsedResponse:   data,
	}
}
