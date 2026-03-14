from fingerprint_pro_server_api_sdk.rest import ApiException
from flask import jsonify, request

from handlers.v3.fingerprint_client import create_client
from musician_response import prepare_musician_response, prepare_musician_response_from_error


def get_events():
    request_id = request.args.get('requestId', '')
    api_instance = create_client()

    try:
        (result, code, http_response) = api_instance.get_event_with_http_info(request_id)
        response = prepare_musician_response(result, code, http_response)
    except ApiException as e:
        response = prepare_musician_response_from_error(e)

    return jsonify(response)
