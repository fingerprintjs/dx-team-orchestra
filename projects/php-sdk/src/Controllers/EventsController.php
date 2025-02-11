<?php

namespace PHP_SDK\Controllers;

use Fingerprint\ServerAPI\Api\FingerprintApi;
use Fingerprint\ServerAPI\ApiException;
use Fingerprint\ServerAPI\Configuration;
use Fingerprint\ServerAPI\Model\EventsUpdateRequest;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use PHP_SDK\Models\MusicianResponse;
use Psr\Http\Message\MessageInterface;

class EventsController
{
    public function searchEvents(ServerRequest $request, Response $response): MessageInterface {
        $queryParams = $request->getQueryParams();
        $apiKey = $queryParams['apiKey'] ?? '';
        $region = $queryParams['region'] ?? '';
        $limit = $queryParams['limit'] ?? null;

        $visitorId = $queryParams['visitorId'] ?? null;
        $bot = $queryParams['bot'] ?? null;
        $ipAddress = $queryParams['ipAddress'] ?? null;
        $linkedId = $queryParams['linkedId'] ?? null;
        $start = isset($queryParams['start']) ? (int) $queryParams['start'] : null;
        $end = isset($queryParams['end']) ? (int) $queryParams['end'] : null;
        $reverse = isset($queryParams['reverse']) ? filter_var($queryParams['reverse'], FILTER_VALIDATE_BOOLEAN) : null;
        $suspect = isset($queryParams['suspect']) ? filter_var($queryParams['suspect'], FILTER_VALIDATE_BOOLEAN) : null;

        $config = Configuration::getDefaultConfiguration($apiKey, $region);
        $client = new FingerprintApi(
            new Client(),
            $config
        );

        try {
            list($model, $apiResponse) = $client->searchEvents(
                $limit,
                $visitorId,
                $bot,
                $ipAddress,
                $linkedId,
                $start,
                $end,
                $reverse,
                $suspect
            );

            $result = new MusicianResponse($apiResponse->getStatusCode(), $apiResponse, $model);
        } catch (ApiException $e) {
            $result = MusicianResponse::BuildForApiException($e);
        } catch (\Throwable $e) {
            $result = new MusicianResponse(500, $e->getMessage(), $e->getMessage());
        }

        $response->getBody()->write(json_encode($result));

        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getEvents(ServerRequest $request, Response $response): MessageInterface
    {
        $queryParams = $request->getQueryParams();
        $apiKey = $queryParams['apiKey'] ?? '';
        $region = $queryParams['region'] ?? '';
        $requestId = $queryParams['requestId'] ?? '';

        $config = Configuration::getDefaultConfiguration($apiKey, $region);
        $client = new FingerprintApi(
            new Client(),
            $config
        );

        try {
            list($model, $api_response) = $client->getEvent($requestId);
            $result = new MusicianResponse($api_response->getStatusCode(), $api_response, $model);
        } catch (ApiException $e) {
            $result = MusicianResponse::BuildForApiException($e);
        } catch (\Throwable $e) {
            $result = new MusicianResponse(500, $e->getMessage(), $e->getMessage());
        }


        $response->getBody()->write(json_encode($result));

        return $response->withHeader('Content-Type', 'application/json');
    }

    public function updateEvent(ServerRequest $request, Response $response): MessageInterface
    {
        $queryParams = $request->getQueryParams();
        $apiKey = $queryParams['apiKey'] ?? '';
        $region = $queryParams['region'] ?? '';
        $requestId = $queryParams['requestId'] ?? '';

        $linkedId = $queryParams['linkedId'] ?? '';
        $suspect = $queryParams['suspect'] ?? null;
        $tag = $queryParams['tag'] ?? null;

        $config = Configuration::getDefaultConfiguration($apiKey, $region);
        $client = new FingerprintApi(
            new Client(),
            $config
        );

        $body = new EventsUpdateRequest();
        if ($linkedId) {
            $body->setLinkedId($linkedId);
        }

        if ($suspect) {
            $body->setSuspect(filter_var($suspect, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE));
        }

        if ($tag) {
            $parsedTag = json_decode($tag, true);
            $body->setTag($parsedTag);
        }

        try {
            list($model, $api_response) = $client->updateEvent($body, $requestId);
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
