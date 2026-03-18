from fingerprint_pro_server_api_sdk import EventsUpdateRequest
from flask import request, json

from handlers.v3.fingerprint_client import create_client, create_response


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
    return create_response(lambda: api_instance.update_event_with_http_info(update_body, request_id))
