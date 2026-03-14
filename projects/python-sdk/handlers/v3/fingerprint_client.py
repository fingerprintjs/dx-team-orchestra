from fingerprint_pro_server_api_sdk import FingerprintApi, Configuration
from flask import request


def create_client():
    api_key = request.args.get('apiKey')
    region = request.args.get('region')
    configuration = Configuration(api_key=api_key, region=region)
    return FingerprintApi(configuration=configuration)
