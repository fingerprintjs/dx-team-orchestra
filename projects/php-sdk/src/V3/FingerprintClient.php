<?php

namespace PHP_SDK\V3;

use Fingerprint\ServerAPI\Api\FingerprintApi;
use Fingerprint\ServerAPI\ApiException;
use Fingerprint\ServerAPI\Configuration;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Response;
use PHP_SDK\Models\MusicianResponse;
use Psr\Http\Message\MessageInterface;

class FingerprintClient
{
    public static function create(array $queryParams): FingerprintApi
    {
        $apiKey = $queryParams['apiKey'] ?? '';
        $region = $queryParams['region'] ?? '';
        $config = Configuration::getDefaultConfiguration($apiKey, $region);

        return new FingerprintApi(new Client(), $config);
    }

    public static function createResponse(Response $response, callable $apiCall): MessageInterface
    {
        try {
            list($model, $apiResponse) = $apiCall();
            $result = new MusicianResponse($apiResponse->getStatusCode(), $apiResponse, $model);
        } catch (ApiException $e) {
            $result = MusicianResponse::BuildForApiException($e);
        } catch (\Throwable $e) {
            $result = new MusicianResponse(500, $e->getMessage(), $e->getMessage());
        }

        $response->getBody()->write(json_encode($result));

        return $response->withHeader('Content-Type', 'application/json');
    }
}
