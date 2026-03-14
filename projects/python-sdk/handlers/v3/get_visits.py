from fingerprint_pro_server_api_sdk.rest import ApiException
from flask import jsonify, request

from handlers.v3.fingerprint_client import create_client
from musician_response import prepare_musician_response, prepare_musician_response_from_error


def get_visits():
    visitor_id = request.args.get('visitorId', '')
    additional_params = {
        "request_id": request.args.get('requestId'),
        "linked_id": request.args.get('linkedId'),
        "limit": request.args.get('limit'),
        "pagination_key": request.args.get('paginationKey'),
        "before": request.args.get('before'),
    }

    filtered_additional_params = {key: value for key, value in additional_params.items() if value is not None}

    api_instance = create_client()

    try:
        (result, code, http_response) = api_instance.get_visits_with_http_info(visitor_id, **filtered_additional_params)
        response = prepare_musician_response(result, code, http_response)
    except ApiException as e:
        response = prepare_musician_response_from_error(e)

    return jsonify(response)
