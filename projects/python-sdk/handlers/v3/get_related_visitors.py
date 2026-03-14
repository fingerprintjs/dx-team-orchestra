from flask import request

from handlers.v3.fingerprint_client import create_client, create_response


def get_related_visitors():
    visitor_id = request.args.get('visitorId', '')
    api_instance = create_client()
    return create_response(lambda: api_instance.get_related_visitors_with_http_info(visitor_id))
