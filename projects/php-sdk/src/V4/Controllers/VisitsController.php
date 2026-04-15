<?php

namespace PHP_SDK\V4\Controllers;

use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use PHP_SDK\V4\FingerprintClient;
use Psr\Http\Message\MessageInterface;

class VisitsController
{
    public function deleteVisitorData(ServerRequest $request, Response $response): MessageInterface
    {
        $queryParams = $request->getQueryParams();
        $visitorId = $queryParams['visitor_id'] ?? '';
        $client = FingerprintClient::createFromQueryParams($queryParams);

        return FingerprintClient::createResponse($response, fn() => $client->deleteVisitorDataWithHttpInfo($visitorId));
    }
}
