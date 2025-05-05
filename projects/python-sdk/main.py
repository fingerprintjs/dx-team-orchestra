import base64

from fingerprint_pro_server_api_sdk.rest import ApiException
from flask import Flask, jsonify, request, json
from fingerprint_pro_server_api_sdk import FingerprintApi, Configuration, EventsUpdateRequest, unseal_event_response, \
    DecryptionKey

from musician_response import prepare_musician_response, prepare_musician_response_from_error

app = Flask(__name__)

@app.route('/getEvents', methods=['GET'])
def get_events():
    api_key = request.args.get('apiKey')
    region = request.args.get('region')
    request_id = request.args.get('requestId', '')

    configuration = Configuration(api_key=api_key, region=region)
    api_instance = FingerprintApi(configuration=configuration)

    try:
        (result, code, http_response) = api_instance.get_event_with_http_info(request_id)
        response = prepare_musician_response(result, code, http_response)
    except ApiException as e:
        response = prepare_musician_response_from_error(e)

    return jsonify(response)

@app.route('/searchEvents', methods=['GET'])
def search_events():
    api_key = request.args.get('apiKey')
    region = request.args.get('region')
    limit = request.args.get('limit')

    additional_params = {
        "pagination_key": request.args.get('paginationKey'),
        "visitor_id": request.args.get('visitorId'),
        "bot": request.args.get('bot'),
        "ip_address": request.args.get('ipAddress'),
        "linked_id": request.args.get('linkedId'),
        "start": request.args.get('start'),
        "end": request.args.get('end'),
        "reverse": request.args.get('reverse'),
        "suspect": request.args.get('suspect'),
        "vpn": request.args.get('vpn'),
        "virtual_machine": request.args.get('virtualMachine'),
        "tampering": request.args.get('tampering'),
        "anti_detect_browser": request.args.get('antiDetectBrowser'),
        "incognito": request.args.get('incognito'),
        "privacy_settings": request.args.get('privacySettings'),
        "jailbroken": request.args.get('jailbroken'),
        "frida": request.args.get('frida'),
        "factory_reset": request.args.get('factoryReset'),
        "cloned_app": request.args.get('clonedApp'),
        "emulator": request.args.get('emulator'),
        "root_apps": request.args.get('rootApps'),
        "min_suspect_score": request.args.get('minSuspectScore'),
        "ip_blocklist": request.args.get('ipBlocklist'),
        "datacenter": request.args.get('datacenter'),
    }

    filtered_additional_params = {key: value for key, value in additional_params.items() if value is not None}

    configuration = Configuration(api_key=api_key, region=region)
    api_instance = FingerprintApi(configuration=configuration)

    try:
        (result, code, http_response) = api_instance.search_events_with_http_info(limit, **filtered_additional_params)
        response = prepare_musician_response(result, code, http_response)
    except ApiException as e:
        response = prepare_musician_response_from_error(e)

    return jsonify(response)

@app.route('/updateEvent', methods=['GET'])
def update_event():
    api_key = request.args.get('apiKey')
    region = request.args.get('region')
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

    configuration = Configuration(api_key=api_key, region=region)
    api_instance = FingerprintApi(configuration=configuration)

    try:
        (result, code, http_response) = api_instance.update_event_with_http_info(update_body, request_id)
        response = prepare_musician_response(result, code, http_response)
    except ApiException as e:
        response = prepare_musician_response_from_error(e)

    return jsonify(response)

@app.route('/getRelatedVisitors', methods=['GET'])
def get_related_visitors():
    api_key = request.args.get('apiKey')
    region = request.args.get('region')
    visitor_id = request.args.get('visitorId', '')

    configuration = Configuration(api_key=api_key, region=region)
    api_instance = FingerprintApi(configuration=configuration)

    try:
        (result, code, http_response) = api_instance.get_related_visitors_with_http_info(visitor_id)
        response = prepare_musician_response(result, code, http_response)
    except ApiException as e:
        response = prepare_musician_response_from_error(e)

    return jsonify(response)

@app.route('/getVisits', methods=['GET'])
def get_visits():
    api_key = request.args.get('apiKey')
    region = request.args.get('region')
    visitor_id = request.args.get('visitorId', '')
    additional_params = {
        "request_id": request.args.get('requestId'),
        "linked_id": request.args.get('linkedId'),
        "limit": request.args.get('limit'),
        "pagination_key": request.args.get('paginationKey'),
        "before": request.args.get('before'),
    }

    filtered_additional_params = {key: value for key, value in additional_params.items() if value is not None}

    configuration = Configuration(api_key=api_key, region=region)
    api_instance = FingerprintApi(configuration=configuration)

    try:
        (result, code, http_response) = api_instance.get_visits_with_http_info(visitor_id, **filtered_additional_params)
        response = prepare_musician_response(result, code, http_response)
    except ApiException as e:
        response = prepare_musician_response_from_error(e)

    return jsonify(response)

@app.route('/deleteVisitorData', methods=['GET'])
def delete_visitor_data():
    api_key = request.args.get('apiKey')
    region = request.args.get('region')
    request_id = request.args.get('visitorId', '')

    configuration = Configuration(api_key=api_key, region=region)
    api_instance = FingerprintApi(configuration=configuration)

    try:
        (result, code, http_response) = api_instance.delete_visitor_data_with_http_info(request_id)
        response = prepare_musician_response(result, code, http_response)
    except ApiException as e:
        response = prepare_musician_response_from_error(e)

    return jsonify(response)

@app.route('/unseal', methods=['POST'])
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3003, debug=True)
