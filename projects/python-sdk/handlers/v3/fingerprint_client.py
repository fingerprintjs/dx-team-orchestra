from typing import Callable, Any, Tuple

from fingerprint_pro_server_api_sdk import FingerprintApi, Configuration
from fingerprint_pro_server_api_sdk.rest import ApiException
from flask import request, jsonify
from urllib3._collections import HTTPHeaderDict

from musician_response import prepare_musician_response, prepare_musician_response_from_error


def create_client():
    api_key = request.args.get('apiKey')
    region = request.args.get('region')
    configuration = Configuration(api_key=api_key, region=region)
    return FingerprintApi(configuration=configuration)


def create_response(api_call: Callable[[], Tuple[Any, int, HTTPHeaderDict]]):
    try:
        (result, code, http_response) = api_call()
        return jsonify(prepare_musician_response(result, code, http_response))
    except ApiException as e:
        return jsonify(prepare_musician_response_from_error(e))
