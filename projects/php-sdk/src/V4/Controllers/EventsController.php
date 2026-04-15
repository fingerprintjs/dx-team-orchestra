<?php

namespace PHP_SDK\V4\Controllers;

use Fingerprint\ServerSdk\Model\EventUpdate;
use Fingerprint\ServerSdk\Model\SearchEventsBot;
use Fingerprint\ServerSdk\Model\SearchEventsIncrementalIdentificationStatus;
use Fingerprint\ServerSdk\Model\SearchEventsSdkPlatform;
use Fingerprint\ServerSdk\Model\SearchEventsVpnConfidence;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use PHP_SDK\V4\FingerprintClient;
use Psr\Http\Message\MessageInterface;

class EventsController
{
    public function getEvent(ServerRequest $request, Response $response): MessageInterface
    {
        $queryParams = $request->getQueryParams();
        $eventId = $queryParams['event_id'] ?? '';
        $rulesetId = $queryParams['ruleset_id'] ?? null;
        $client = FingerprintClient::createFromQueryParams($queryParams);

        return FingerprintClient::createResponse($response, fn() => $client->getEventWithHttpInfo($eventId, ruleset_id: $rulesetId));
    }

    public function searchEvents(ServerRequest $request, Response $response): MessageInterface
    {
        return FingerprintClient::createResponse($response, function () use ($request) {
            $queryParams = $request->getQueryParams();
            $limit = isset($queryParams['limit']) ? (int) $queryParams['limit'] : 10;

            $paginationKey = $queryParams['pagination_key'] ?? null;
            $visitorId = $queryParams['visitor_id'] ?? null;
            $highRecallId = $queryParams['high_recall_id'] ?? null;
            $bot = isset($queryParams['bot']) ? SearchEventsBot::from($queryParams['bot']) : null;
            $ipAddress = $queryParams['ip_address'] ?? null;
            $asn = $queryParams['asn'] ?? null;
            $linkedId = $queryParams['linked_id'] ?? null;
            $url = $queryParams['url'] ?? null;
            $bundleId = $queryParams['bundle_id'] ?? null;
            $packageName = $queryParams['package_name'] ?? null;
            $origin = $queryParams['origin'] ?? null;
            $start = isset($queryParams['start']) ? (int) $queryParams['start'] : null;
            $end = isset($queryParams['end']) ? (int) $queryParams['end'] : null;
            $reverse = isset($queryParams['reverse']) ? filter_var($queryParams['reverse'], FILTER_VALIDATE_BOOLEAN) : null;
            $suspect = isset($queryParams['suspect']) ? filter_var($queryParams['suspect'], FILTER_VALIDATE_BOOLEAN) : null;
            $vpn = isset($queryParams['vpn']) ? filter_var($queryParams['vpn'], FILTER_VALIDATE_BOOLEAN) : null;
            $virtualMachine = isset($queryParams['virtual_machine']) ? filter_var($queryParams['virtual_machine'], FILTER_VALIDATE_BOOLEAN) : null;
            $tampering = isset($queryParams['tampering']) ? filter_var($queryParams['tampering'], FILTER_VALIDATE_BOOLEAN) : null;
            $antiDetectBrowser = isset($queryParams['anti_detect_browser']) ? filter_var($queryParams['anti_detect_browser'], FILTER_VALIDATE_BOOLEAN) : null;
            $incognito = isset($queryParams['incognito']) ? filter_var($queryParams['incognito'], FILTER_VALIDATE_BOOLEAN) : null;
            $privacySettings = isset($queryParams['privacy_settings']) ? filter_var($queryParams['privacy_settings'], FILTER_VALIDATE_BOOLEAN) : null;
            $jailbroken = isset($queryParams['jailbroken']) ? filter_var($queryParams['jailbroken'], FILTER_VALIDATE_BOOLEAN) : null;
            $frida = isset($queryParams['frida']) ? filter_var($queryParams['frida'], FILTER_VALIDATE_BOOLEAN) : null;
            $factoryReset = isset($queryParams['factory_reset']) ? filter_var($queryParams['factory_reset'], FILTER_VALIDATE_BOOLEAN) : null;
            $clonedApp = isset($queryParams['cloned_app']) ? filter_var($queryParams['cloned_app'], FILTER_VALIDATE_BOOLEAN) : null;
            $emulator = isset($queryParams['emulator']) ? filter_var($queryParams['emulator'], FILTER_VALIDATE_BOOLEAN) : null;
            $rootApps = isset($queryParams['root_apps']) ? filter_var($queryParams['root_apps'], FILTER_VALIDATE_BOOLEAN) : null;
            $vpnConfidence = isset($queryParams['vpn_confidence']) ? SearchEventsVpnConfidence::from($queryParams['vpn_confidence']) : null;
            $minSuspectScore = isset($queryParams['min_suspect_score']) ? (float) $queryParams['min_suspect_score'] : null;
            $developerTools = isset($queryParams['developer_tools']) ? filter_var($queryParams['developer_tools'], FILTER_VALIDATE_BOOLEAN) : null;
            $locationSpoofing = isset($queryParams['location_spoofing']) ? filter_var($queryParams['location_spoofing'], FILTER_VALIDATE_BOOLEAN) : null;
            $mitmAttack = isset($queryParams['mitm_attack']) ? filter_var($queryParams['mitm_attack'], FILTER_VALIDATE_BOOLEAN) : null;
            $proxy = isset($queryParams['proxy']) ? filter_var($queryParams['proxy'], FILTER_VALIDATE_BOOLEAN) : null;
            $sdkVersion = $queryParams['sdk_version'] ?? null;
            $sdkPlatform = isset($queryParams['sdk_platform']) ? SearchEventsSdkPlatform::from($queryParams['sdk_platform']) : null;
            $proximityId = $queryParams['proximity_id'] ?? null;
            $totalHits = isset($queryParams['total_hits']) ? (int) $queryParams['total_hits'] : null;
            $torNode = isset($queryParams['tor_node']) ? filter_var($queryParams['tor_node'], FILTER_VALIDATE_BOOLEAN) : null;
            $incrementalIdentificationStatus = isset($queryParams['incremental_identification_status']) ? SearchEventsIncrementalIdentificationStatus::from($queryParams['incremental_identification_status']) : null;
            $simulator = isset($queryParams['simulator']) ? filter_var($queryParams['simulator'], FILTER_VALIDATE_BOOLEAN) : null;

            // Parse environment from raw query string since repeated keys (environment=a&environment=b)
            // are collapsed to the last value by PHP's parse_str / getQueryParams().
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

            $client = FingerprintClient::createFromQueryParams($queryParams);

            return $client->searchEventsWithHttpInfo(
                $limit,
                pagination_key: $paginationKey,
                visitor_id: $visitorId,
                high_recall_id: $highRecallId,
                bot: $bot,
                ip_address: $ipAddress,
                asn: $asn,
                linked_id: $linkedId,
                url: $url,
                bundle_id: $bundleId,
                package_name: $packageName,
                origin: $origin,
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
                vpn_confidence: $vpnConfidence,
                min_suspect_score: $minSuspectScore,
                developer_tools: $developerTools,
                location_spoofing: $locationSpoofing,
                mitm_attack: $mitmAttack,
                proxy: $proxy,
                sdk_version: $sdkVersion,
                sdk_platform: $sdkPlatform,
                environment: $environment,
                proximity_id: $proximityId,
                total_hits: $totalHits,
                tor_node: $torNode,
                incremental_identification_status: $incrementalIdentificationStatus,
                simulator: $simulator,
            );
        });
    }

    public function updateEvent(ServerRequest $request, Response $response): MessageInterface
    {
        $queryParams = $request->getQueryParams();
        $eventId = $queryParams['event_id'] ?? '';

        $linkedId = $queryParams['linked_id'] ?? '';
        $suspect = $queryParams['suspect'] ?? null;
        $tags = $queryParams['tags'] ?? null;

        $body = new EventUpdate();
        if ($linkedId) {
            $body->setLinkedId($linkedId);
        }

        if ($suspect) {
            $body->setSuspect(filter_var($suspect, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE));
        }

        if ($tags) {
            $parsedTags = json_decode($tags, true);
            $body->setTags($parsedTags);
        }

        $client = FingerprintClient::createFromQueryParams($queryParams);

        return FingerprintClient::createResponse($response, fn() => $client->updateEventWithHttpInfo($eventId, $body));
    }
}
