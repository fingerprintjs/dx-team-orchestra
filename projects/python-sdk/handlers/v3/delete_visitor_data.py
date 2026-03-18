from flask import request

from handlers.v3.fingerprint_client import create_client, create_response


def delete_visitor_data():
    visitor_id = request.args.get('visitorId', '')
    api_instance = create_client()
    return create_response(lambda: api_instance.delete_visitor_data_with_http_info(visitor_id))
