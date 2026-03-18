from flask import request

from handlers.v4.fingerprint_client import create_client, create_response


def _parse_bool(value):
    if value is None:
        return None
    return value.lower() in ['true', '1']


def search_events():
    limit = request.args.get('limit', type=int)

    additional_params = {
        "pagination_key": request.args.get('pagination_key'),
        "visitor_id": request.args.get('visitor_id'),
        "bot": request.args.get('bot'),
        "ip_address": request.args.get('ip_address'),
        "asn": request.args.get('asn'),
        "linked_id": request.args.get('linked_id'),
        "url": request.args.get('url'),
        "bundle_id": request.args.get('bundle_id'),
        "package_name": request.args.get('package_name'),
        "origin": request.args.get('origin'),
        "start": request.args.get('start', type=int),
        "end": request.args.get('end', type=int),
        "reverse": _parse_bool(request.args.get('reverse')),
        "suspect": _parse_bool(request.args.get('suspect')),
        "vpn": _parse_bool(request.args.get('vpn')),
        "virtual_machine": _parse_bool(request.args.get('virtual_machine')),
        "tampering": _parse_bool(request.args.get('tampering')),
        "anti_detect_browser": _parse_bool(request.args.get('anti_detect_browser')),
        "incognito": _parse_bool(request.args.get('incognito')),
        "privacy_settings": _parse_bool(request.args.get('privacy_settings')),
        "jailbroken": _parse_bool(request.args.get('jailbroken')),
        "frida": _parse_bool(request.args.get('frida')),
        "factory_reset": _parse_bool(request.args.get('factory_reset')),
        "cloned_app": _parse_bool(request.args.get('cloned_app')),
        "emulator": _parse_bool(request.args.get('emulator')),
        "root_apps": _parse_bool(request.args.get('root_apps')),
        "vpn_confidence": request.args.get('vpn_confidence'),
        "min_suspect_score": request.args.get('min_suspect_score', type=float),
        "developer_tools": _parse_bool(request.args.get('developer_tools')),
        "location_spoofing": _parse_bool(request.args.get('location_spoofing')),
        "mitm_attack": _parse_bool(request.args.get('mitm_attack')),
        "proxy": _parse_bool(request.args.get('proxy')),
        "sdk_version": request.args.get('sdk_version'),
        "sdk_platform": request.args.get('sdk_platform'),
        "environment": request.args.getlist('environment'),
        "proximity_id": request.args.get('proximity_id'),
        "total_hits": request.args.get('total_hits', type=int),
        "tor_node": _parse_bool(request.args.get('tor_node')),
    }

    filtered_additional_params = {key: value for key, value in additional_params.items() if value is not None}

    api_instance = create_client()
    return create_response(lambda: api_instance.search_events_with_http_info(limit=limit, **filtered_additional_params))
