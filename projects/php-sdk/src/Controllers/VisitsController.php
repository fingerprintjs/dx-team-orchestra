<?php

namespace PHP_SDK\Controllers;

use Fingerprint\ServerAPI\Api\FingerprintApi;
use Fingerprint\ServerAPI\ApiException;
use Fingerprint\ServerAPI\Configuration;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use PHP_SDK\Models\MusicianResponse;
use Psr\Http\Message\MessageInterface;

class VisitsController
{
    public function getVisits(ServerRequest $request, Response $response): MessageInterface
    {
        $queryParams = $request->getQueryParams();
        $apiKey = $queryParams['apiKey'] ?? '';
        $region = $queryParams['region'] ?? '';
        $visitorId = $queryParams['visitorId'] ?? '';

        $requestId = $queryParams['requestId'] ?? null;
        $linkedId = $queryParams['linkedId'] ?? null;
        $limit = $queryParams['limit'] ?? null;
        $paginationKey = $queryParams['paginationKey'] ?? null;
        $before = $queryParams['before'] ?? null;

        $config = Configuration::getDefaultConfiguration($apiKey, $region);
        $client = new FingerprintApi(
            new Client(),
            $config
        );

        try {
            list($model, $api_response) = $client->getVisits($visitorId, $requestId, $linkedId, $limit, $paginationKey, $before);
            $result = new MusicianResponse($api_response->getStatusCode(), $api_response, $model);
        } catch (ApiException $e) {
            $result = MusicianResponse::BuildForApiException($e);
        } catch (\Throwable $e) {
            $result = new MusicianResponse(500, $e->getMessage(), $e->getMessage());
        }

        $response->getBody()->write(json_encode($result));

        return $response->withHeader('Content-Type', 'application/json');
    }

    public function deleteVisitorData(ServerRequest $request, Response $response): MessageInterface
    {
        $queryParams = $request->getQueryParams();
        $apiKey = $queryParams['apiKey'] ?? '';
        $region = $queryParams['region'] ?? '';
        $visitorId = $queryParams['visitorId'] ?? '';

        $config = Configuration::getDefaultConfiguration($apiKey, $region);
        $client = new FingerprintApi(
            new Client(),
            $config
        );

        try {
            list($model, $api_response) = $client->deleteVisitorData($visitorId);
            $result = new MusicianResponse($api_response->getStatusCode(), $api_response, $model);
        } catch (ApiException $e) {
            $result = MusicianResponse::BuildForApiException($e);
        } catch (\Throwable $e) {
            $result = new MusicianResponse(500, $e->getMessage(), $e->getMessage());
        }

        $response->getBody()->write(json_encode($result));

        return $response->withHeader('Content-Type', 'application/json');
    }
}
