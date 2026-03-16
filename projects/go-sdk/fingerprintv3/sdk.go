package fingerprintv3

import (
	"context"
	"fmt"
	"go-sdk/response"
	"net/http"

	"github.com/fingerprintjs/fingerprint-pro-server-api-go-sdk/v7/sdk"
)

func Init(apiKey string, region string) (*sdk.APIClient, context.Context) {
	cfg := sdk.NewConfiguration()
	cfg.ChangeRegion(sdk.Region(region))

	client := sdk.NewAPIClient(cfg)
	auth := context.WithValue(context.Background(), sdk.ContextAPIKey, sdk.APIKey{
		Key: apiKey,
	})
	return client, auth
}

func ProcessResponse(data interface{}, httpRes *http.Response, err sdk.Error) response.MusicianResponse {
	if err != nil {
		return response.MusicianResponse{
			Code:             httpRes.StatusCode,
			OriginalResponse: fmt.Sprintf("%v", httpRes),
			ParsedResponse:   err.Model(),
		}
	}

	return response.MusicianResponse{
		Code:             httpRes.StatusCode,
		OriginalResponse: fmt.Sprintf("%v", httpRes),
		ParsedResponse:   data,
	}
}
