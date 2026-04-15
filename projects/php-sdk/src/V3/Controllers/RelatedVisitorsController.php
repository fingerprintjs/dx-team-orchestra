<?php

namespace PHP_SDK\V3\Controllers;

use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use PHP_SDK\V3\FingerprintClient;
use Psr\Http\Message\MessageInterface;

class RelatedVisitorsController
{
    public function getRelatedVisitors(ServerRequest $request, Response $response): MessageInterface
    {
        $queryParams = $request->getQueryParams();
        $visitorId = $queryParams['visitorId'] ?? '';
        $client = FingerprintClient::create($queryParams);

        return FingerprintClient::createResponse($response, fn() => $client->getRelatedVisitors($visitorId));
    }
}
