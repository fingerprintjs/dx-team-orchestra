<?php

namespace PHP_SDK\Controllers;

use Fingerprint\ServerAPI\Api\FingerprintApi;
use Fingerprint\ServerAPI\Configuration;
use GuzzleHttp\Client;
use Slim\Psr7\Response;

class EventsController
{
    public function getEvents($request, $response, $args)
    {
        $queryParams = $request->getQueryParams();
        $apiKey = $queryParams['apiKey'];
        $region = $queryParams['region'];
        $requestId = $queryParams['requestId'];

        $config = Configuration::getDefaultConfiguration($apiKey, $region);
        $client = new FingerprintApi(
            new Client(),
            $config
        );

        try {
            // Fetch the event with a given requestId
            list($model, $response) = $client->getEvent($requestId);
            echo "<pre>" . $response->getBody()->getContents() . "</pre>";
        } catch (Exception $e) {
            echo 'Exception when calling FingerprintApi->getEvent: ', $e->getMessage(), PHP_EOL;
        }



        $data = ['message' => 'Hello from Slim Framework!'];
        $response->getBody()->write(json_encode($data));

        return $response->withHeader('Content-Type', 'application/json');
    }
}
