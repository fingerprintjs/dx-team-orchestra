package utils

type MusicianResponse struct {
	Code             int         `json:"code"`
	OriginalResponse string      `json:"originalResponse"`
	ParsedResponse   interface{} `json:"parsedResponse"`
}
