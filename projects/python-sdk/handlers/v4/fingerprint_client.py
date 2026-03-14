import json
from typing import Callable

from pydantic import ValidationError
from fingerprint_server_sdk import FingerprintApi, Configuration
from fingerprint_server_sdk.api_response import ApiResponse
from fingerprint_server_sdk.configuration import Region
from fingerprint_server_sdk.rest import ApiException
from flask import request, jsonify


def create_client():
    api_key = request.args.get('api_key', '')
    region = request.args.get('region')
    # Bypass client validation to get Server API v4 error response
    try:
        resolved_region = Region(region) if region else None
    except ValueError:
        resolved_region = None
    configuration = Configuration(api_key=api_key, region=resolved_region)
    return FingerprintApi(configuration)


def prepare_response(data, code, raw_data):
    parsed = data.to_dict() if data is not None else data
    return {
        "code": code,
        "originalResponse": str(raw_data),
        "parsedResponse": parsed,
    }


def prepare_error_response(error: Exception):
    if isinstance(error, ApiException):
        try:
            parsed = json.loads(error.body) if error.body else str(error.reason)
        except (json.JSONDecodeError, TypeError):
            parsed = str(error.reason)
        return {
            "code": error.status,
            "originalResponse": str(error),
            "parsedResponse": parsed,
        }

    # Bypass client validation and mock Server API v4 error response
    if isinstance(error, ValidationError):
        first_error = error.errors()[0]
        field = first_error['loc'][-1]
        field_messages = {
            "bot": "invalid bot type",
        }
        message = field_messages.get(field, f"invalid {field}")
        return {
            "code": 400,
            "originalResponse": str(error),
            "parsedResponse": {
                "error": {
                    "code": "request_cannot_be_parsed",
                    "message": message,
                }
            },
        }

    return {
        "code": 500,
        "originalResponse": str(error),
        "parsedResponse": str(error),
    }


def create_response(api_call: Callable[[], ApiResponse]):
    try:
        api_response = api_call()
        return jsonify(prepare_response(api_response.data, api_response.status_code, api_response.raw_data))
    except Exception as e:
        return jsonify(prepare_error_response(e))
