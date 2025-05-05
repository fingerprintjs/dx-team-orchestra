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

        $paginationKey = $queryParams['paginationKey'] ?? null;
        $visitorId = $queryParams['visitorId'] ?? null;
        $bot = $queryParams['bot'] ?? null;
        $ipAddress = $queryParams['ipAddress'] ?? null;
        $linkedId = $queryParams['linkedId'] ?? null;
        $start = isset($queryParams['start']) ? (int) $queryParams['start'] : null;
        $end = isset($queryParams['end']) ? (int) $queryParams['end'] : null;
        $reverse = isset($queryParams['reverse']) ? filter_var($queryParams['reverse'], FILTER_VALIDATE_BOOLEAN) : null;
        $suspect = isset($queryParams['suspect']) ? filter_var($queryParams['suspect'], FILTER_VALIDATE_BOOLEAN) : null;
        $vpn = isset($queryParams['vpn']) ? filter_var($queryParams['vpn'], FILTER_VALIDATE_BOOLEAN) : null;
        $virtualMachine = isset($queryParams['virtualMachine']) ? filter_var($queryParams['virtualMachine'], FILTER_VALIDATE_BOOLEAN) : null;
        $tampering = isset($queryParams['tampering']) ? filter_var($queryParams['tampering'], FILTER_VALIDATE_BOOLEAN) : null;
        $antiDetectBrowser = isset($queryParams['antiDetectBrowser']) ? filter_var($queryParams['antiDetectBrowser'], FILTER_VALIDATE_BOOLEAN) : null;
        $incognito = isset($queryParams['incognito']) ? filter_var($queryParams['incognito'], FILTER_VALIDATE_BOOLEAN) : null;
        $privacySettings = isset($queryParams['privacySettings']) ? filter_var($queryParams['privacySettings'], FILTER_VALIDATE_BOOLEAN) : null;
        $jailbroken = isset($queryParams['jailbroken']) ? filter_var($queryParams['jailbroken'], FILTER_VALIDATE_BOOLEAN) : null;
        $frida = isset($queryParams['frida']) ? filter_var($queryParams['frida'], FILTER_VALIDATE_BOOLEAN) : null;
        $factoryReset = isset($queryParams['factoryReset']) ? filter_var($queryParams['factoryReset'], FILTER_VALIDATE_BOOLEAN) : null;
        $clonedApp = isset($queryParams['clonedApp']) ? filter_var($queryParams['clonedApp'], FILTER_VALIDATE_BOOLEAN) : null;
        $emulator = isset($queryParams['emulator']) ? filter_var($queryParams['emulator'], FILTER_VALIDATE_BOOLEAN) : null;
        $rootApps = isset($queryParams['rootApps']) ? filter_var($queryParams['rootApps'], FILTER_VALIDATE_BOOLEAN) : null;
        $minSuspectScore = isset($queryParams['minSuspectScore']) ? (float) $queryParams['minSuspectScore'] : null;
        $ipBlocklist = isset($queryParams['ipBlocklist']) ? filter_var($queryParams['ipBlocklist'], FILTER_VALIDATE_BOOLEAN) : null;
        $datacenter = isset($queryParams['datacenter']) ? filter_var($queryParams['datacenter'], FILTER_VALIDATE_BOOLEAN) : null;

        $config = Configuration::getDefaultConfiguration($apiKey, $region);
        $client = new FingerprintApi(
            new Client(),
            $config
        );

        try {
            list($model, $apiResponse) = $client->searchEvents(
                $limit,
                pagination_key: $paginationKey,
                visitor_id: $visitorId,
                bot: $bot,
                ip_address: $ipAddress,
                linked_id: $linkedId,
                start: $start,
                end: $end,
                reverse: $reverse,
                suspect: $suspect,
                vpn: $vpn,
                virtual_machine: $virtualMachine,
                tampering: $tampering,
                anti_detect_browser: $antiDetectBrowser,
                incognito: $incognito,
                privacy_settings: $privacySettings,
                jailbroken: $jailbroken,
                frida: $frida,
                factory_reset: $factoryReset,
                cloned_app: $clonedApp,
                emulator: $emulator,
                root_apps: $rootApps,
                min_suspect_score: $minSuspectScore,
                ip_blocklist: $ipBlocklist,
                datacenter: $datacenter
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
