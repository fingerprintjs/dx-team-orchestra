from fingerprint_pro_server_api_sdk import EventsUpdateRequest
from fingerprint_pro_server_api_sdk.rest import ApiException
from flask import jsonify, request, json

from handlers.v3.fingerprint_client import create_client
from musician_response import prepare_musician_response, prepare_musician_response_from_error


def update_event():
    request_id = request.args.get('requestId', '')
    tag = request.args.get('tag')
    if tag is not None:
        tag = json.loads(tag)

    suspect = request.args.get('suspect')
    if suspect is not None:
        suspect = suspect.lower() in ['true', '1']

    update_body = EventsUpdateRequest(
        linked_id=request.args.get('linkedId'),
        suspect=suspect,
        tag=tag
    )

    api_instance = create_client()

    try:
        (result, code, http_response) = api_instance.update_event_with_http_info(update_body, request_id)
        response = prepare_musician_response(result, code, http_response)
    except ApiException as e:
        response = prepare_musician_response_from_error(e)

    return jsonify(response)
