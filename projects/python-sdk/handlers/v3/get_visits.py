from flask import request

from handlers.v3.fingerprint_client import create_client, create_response


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
    return create_response(lambda: api_instance.get_visits_with_http_info(visitor_id, **filtered_additional_params))
