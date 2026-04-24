<?php

namespace PHP_SDK\V3\Controllers;

use Fingerprint\ServerAPI\Model\EventsUpdateRequest;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use PHP_SDK\V3\FingerprintClient;
use Psr\Http\Message\MessageInterface;

class EventsController
{
    public function getEvents(ServerRequest $request, Response $response): MessageInterface
    {
        $queryParams = $request->getQueryParams();
        $requestId = $queryParams['requestId'] ?? '';
        $client = FingerprintClient::create($queryParams);

        return FingerprintClient::createResponse($response, fn() => $client->getEvent($requestId));
    }

    public function searchEvents(ServerRequest $request, Response $response): MessageInterface
    {
        $queryParams = $request->getQueryParams();
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
        $developerTools = isset($queryParams['developerTools']) ? filter_var($queryParams['developerTools'], FILTER_VALIDATE_BOOLEAN) : null;
        $locationSpoofing = isset($queryParams['locationSpoofing']) ? filter_var($queryParams['locationSpoofing'], FILTER_VALIDATE_BOOLEAN) : null;
        $mitmAttack = isset($queryParams['mitmAttack']) ? filter_var($queryParams['mitmAttack'], FILTER_VALIDATE_BOOLEAN) : null;
        $proxy = isset($queryParams['proxy']) ? filter_var($queryParams['proxy'], FILTER_VALIDATE_BOOLEAN) : null;
        $sdkVersion = $queryParams['sdkVersion'] ?? null;
        $sdkPlatform = $queryParams['sdkPlatform'] ?? null;
        $proximityId = $queryParams['proximityId'] ?? null;
        $proximityPrecisionRadius = $queryParams['proximityPrecisionRadius'] ?? null;

        $environment = null;
        $rawQuery = $request->getUri()->getQuery();
        if ($rawQuery) {
            $environmentValues = [];
            foreach (explode('&', $rawQuery) as $pair) {
                $parts = explode('=', $pair, 2);
                if ($parts[0] === 'environment' && isset($parts[1])) {
                    $value = trim(urldecode($parts[1]));
                    if ($value !== '') {
                        $environmentValues[] = $value;
                    }
                }
            }
            if (!empty($environmentValues)) {
                $environment = $environmentValues;
            }
        }

        $client = FingerprintClient::create($queryParams);

        return FingerprintClient::createResponse($response, fn() => $client->searchEvents(
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
            datacenter: $datacenter,
            developer_tools: $developerTools,
            location_spoofing: $locationSpoofing,
            mitm_attack: $mitmAttack,
            proxy: $proxy,
            sdk_version: $sdkVersion,
            sdk_platform: $sdkPlatform,
            environment: $environment,
            proximity_id: $proximityId,
            proximity_precision_radius: $proximityPrecisionRadius
        ));
    }

    public function updateEvent(ServerRequest $request, Response $response): MessageInterface
    {
        $queryParams = $request->getQueryParams();
        $requestId = $queryParams['requestId'] ?? '';

        $linkedId = $queryParams['linkedId'] ?? '';
        $suspect = $queryParams['suspect'] ?? null;
        $tag = $queryParams['tag'] ?? null;

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

        $client = FingerprintClient::create($queryParams);

        return FingerprintClient::createResponse($response, fn() => $client->updateEvent($body, $requestId));
    }
}
