<?php

namespace PHP_SDK\V3\Controllers;

use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use PHP_SDK\V3\FingerprintClient;
use Psr\Http\Message\MessageInterface;

class VisitsController
{
    public function getVisits(ServerRequest $request, Response $response): MessageInterface
    {
        $queryParams = $request->getQueryParams();
        $visitorId = $queryParams['visitorId'] ?? '';

        $requestId = $queryParams['requestId'] ?? null;
        $linkedId = $queryParams['linkedId'] ?? null;
        $limit = $queryParams['limit'] ?? null;
        $paginationKey = $queryParams['paginationKey'] ?? null;
        $before = $queryParams['before'] ?? null;

        $client = FingerprintClient::create($queryParams);

        return FingerprintClient::createResponse($response, fn() => $client->getVisits($visitorId, $requestId, $linkedId, $limit, $paginationKey, $before));
    }

    public function deleteVisitorData(ServerRequest $request, Response $response): MessageInterface
    {
        $queryParams = $request->getQueryParams();
        $visitorId = $queryParams['visitorId'] ?? '';
        $client = FingerprintClient::create($queryParams);

        return FingerprintClient::createResponse($response, fn() => $client->deleteVisitorData($visitorId));
    }
}
