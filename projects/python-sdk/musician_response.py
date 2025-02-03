from datetime import datetime

from fingerprint_pro_server_api_sdk import IdentificationSeenAt
from fingerprint_pro_server_api_sdk.rest import KnownApiException, ApiException

CUSTOM_RENAME = {
    "public_vpn": "publicVPN"
}

UNMODIFIED_KEYS = ["tag"]  # List of keys to keep unchanged

def to_camel_case(snake_str):
    if snake_str in CUSTOM_RENAME:
        return CUSTOM_RENAME[snake_str]
    snake_str = snake_str.lstrip('_')
    parts = snake_str.split('_')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])

def convert_keys_to_camel_case(obj):
    if isinstance(obj, dict):
        return {
            # Keep the key and its value untouched if it is listed in UNMODIFIED_KEYS
            (k if k in UNMODIFIED_KEYS else to_camel_case(k)): (
                v if k in UNMODIFIED_KEYS else convert_keys_to_camel_case(v)
            )
            for k, v in obj.items()
        }
    elif isinstance(obj, list):
        return [convert_keys_to_camel_case(i) for i in obj]
    elif isinstance(obj, datetime):
        iso_format = obj.strftime("%Y-%m-%dT%H:%M:%S")
        milliseconds = str(f"{obj.microsecond // 1000:03}").rstrip("0")
        return f"{iso_format}.{milliseconds}Z" if milliseconds else f"{iso_format}Z"

    return obj

def prepare_musician_response(musician_data, code, http_response):
    return {
        "code": code,
        "originalResponse": str(http_response),
        "parsedResponse": convert_keys_to_camel_case(
            musician_data.to_dict()) if musician_data is not None else musician_data,
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
