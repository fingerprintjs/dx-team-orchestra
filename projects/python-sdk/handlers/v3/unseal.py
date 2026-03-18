import base64

from fingerprint_pro_server_api_sdk import unseal_event_response, DecryptionKey
from flask import jsonify, request

from musician_response import prepare_musician_response, prepare_musician_response_from_error


def unseal():
    data = request.get_json()

    sealed_data = data.get("sealedData")
    sealed_data = base64.b64decode(sealed_data)
    keys = data.get("keys")
    keys = list(map(lambda key: DecryptionKey(base64.b64decode(key.get("key")), key.get("algorithm")), keys))

    try:
        result = unseal_event_response(sealed_data, keys)
        response = prepare_musician_response(result, 200, "")
    except Exception as e:
        response = prepare_musician_response_from_error(e)
    return jsonify(response)
