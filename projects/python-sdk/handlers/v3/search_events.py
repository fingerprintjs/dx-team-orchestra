from fingerprint_pro_server_api_sdk.rest import ApiException
from flask import jsonify, request

from handlers.v3.fingerprint_client import create_client
from musician_response import prepare_musician_response, prepare_musician_response_from_error


def search_events():
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
        "developer_tools": request.args.get('developerTools'),
        "location_spoofing": request.args.get('locationSpoofing'),
        "mitm_attack": request.args.get('mitmAttack'),
        "proxy": request.args.get('proxy'),
        "sdk_version": request.args.get('sdkVersion'),
        "sdk_platform": request.args.get('sdkPlatform'),
        "environment": request.args.getlist('environment'),
        "proximity_id": request.args.get('proximityId'),
        "proximity_precision_radius": request.args.get('proximityPrecisionRadius'),
    }

    filtered_additional_params = {key: value for key, value in additional_params.items() if value is not None}

    api_instance = create_client()

    try:
        (result, code, http_response) = api_instance.search_events_with_http_info(limit, **filtered_additional_params)
        response = prepare_musician_response(result, code, http_response)
    except ApiException as e:
        response = prepare_musician_response_from_error(e)

    return jsonify(response)
