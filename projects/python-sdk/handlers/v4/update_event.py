from fingerprint_server_sdk import EventUpdate
from flask import request, json

from handlers.v4.fingerprint_client import create_client, create_response


def update_event():
    event_id = request.args.get('event_id', '')
    tags = request.args.get('tags')
    if tags is not None:
        tags = json.loads(tags)

    suspect = request.args.get('suspect')
    if suspect is not None:
        suspect = suspect.lower() in ['true', '1']

    event_update = EventUpdate(
        linked_id=request.args.get('linked_id'),
        suspect=suspect,
        tags=tags
    )

    api_instance = create_client()
    return create_response(lambda: api_instance.update_event_with_http_info(event_id, event_update))
