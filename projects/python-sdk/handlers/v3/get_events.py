from flask import request

from handlers.v3.fingerprint_client import create_client, create_response


def get_events():
    request_id = request.args.get('requestId', '')
    api_instance = create_client()
    return create_response(lambda: api_instance.get_event_with_http_info(request_id))
