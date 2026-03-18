from flask import request

from handlers.v4.fingerprint_client import create_client, create_response


def get_event():
    event_id = request.args.get('event_id', '')
    ruleset_id = request.args.get('ruleset_id')
    api_instance = create_client()
    return create_response(lambda: api_instance.get_event_with_http_info(event_id, ruleset_id=ruleset_id))
