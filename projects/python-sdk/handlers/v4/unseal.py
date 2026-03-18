import base64

from fingerprint_server_sdk.sealed import unseal_event_response, DecryptionKey
from flask import jsonify, request

from handlers.v4.fingerprint_client import prepare_response, prepare_error_response


def unseal():
    data = request.get_json()

    sealed_data = data.get("sealedData")
    sealed_data = base64.b64decode(sealed_data)
    keys = data.get("keys")
    keys = list(map(lambda key: DecryptionKey(base64.b64decode(key.get("key")), key.get("algorithm")), keys))

    try:
        result = unseal_event_response(sealed_data, keys)
        response = prepare_response(result, 200, "")
    except Exception as e:
        response = prepare_error_response(e)
    return jsonify(response)
