from fingerprint_pro_server_api_sdk.rest import KnownApiException, ApiException


def prepare_musician_response(musician_data, code, http_response):
    return {
        "code": code,
        "originalResponse": str(http_response),
        "parsedResponse": musician_data.to_dict(),
    }

def prepare_musician_response_from_error(error: Exception):
    if isinstance(error, KnownApiException):
        return {
            "code": error.status,
            "originalResponse": str(error),
            "parsedResponse": error.structured_error.to_dict(),
        }

    if isinstance(error, ApiException):
        return {
            "code": error.status,
            "originalResponse": str(error),
            "parsedResponse": str(error.reason),
        }

    return {
        "code": 500,
        "originalResponse": str(error),
        "parsedResponse": str(error),
    }
