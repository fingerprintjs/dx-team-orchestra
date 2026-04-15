<?php

namespace PHP_SDK\V4;

use Fingerprint\ServerSdk\Api\FingerprintApi;
use Fingerprint\ServerSdk\ApiException;
use Fingerprint\ServerSdk\Configuration;
use GuzzleHttp\Psr7\Response;
use InvalidArgumentException;
use Psr\Http\Message\MessageInterface;
use Throwable;
use ValueError;

class FingerprintClient
{
    private const FIELD_MESSAGES = [
        'bot' => 'invalid bot type',
    ];

    public static function createFromQueryParams(array $queryParams): FingerprintApi
    {
        $apiKey = $queryParams['api_key'] ?? '';
        $region = $queryParams['region'] ?? null;

        return FingerprintClient::create($apiKey, $region);
    }

    public static function create(string $apiKey, ?string $region = null): FingerprintApi
    {
        $config = new Configuration($apiKey);
        if ($region) {
            $config->setRegion($region);
        }

        return new FingerprintApi($config);
    }

    public static function createResponse(Response $response, callable $apiCall): MessageInterface
    {
        try {
            list($model, $httpResponse) = $apiCall();
            $result = [
                'code' => $httpResponse->getStatusCode(),
                'originalResponse' => (string) $httpResponse->getBody(),
                'parsedResponse' => $model,
            ];
        } catch (ApiException $e) {
            $result = [
                'code' => $e->getCode(),
                'originalResponse' => (string) $e->getResponseObject()?->getBody(),
                'parsedResponse' => $e->getErrorDetails(),
            ];
        } catch (InvalidArgumentException|ValueError $e) {
            $result = self::buildValidationErrorResult($e);
        } catch (Throwable $e) {
            $result = [
                'code' => 500,
                'originalResponse' => $e->getMessage(),
                'parsedResponse' => $e->getMessage(),
            ];
        }

        $response->getBody()->write(json_encode($result));

        return $response->withHeader('Content-Type', 'application/json');
    }

    public static function buildValidationErrorResult(Throwable $e): array
    {
        $message = $e->getMessage();
        $field = null;

        // Mock parameter validation
        if (preg_match('/invalid value for "\$(\w+)"/', $message, $matches)) {
            $field = $matches[1];
        }

        // Mock enum validation (for searchEvents only)
        elseif (preg_match('/"[^"]+" is not a valid backing value for enum .*\\\\(\w+)$/', $message, $matches)) {
            $enumClass = $matches[1];
            $field = preg_replace('/^SearchEvents/', '', $enumClass);
            $field = strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $field));
        }

        if ($field) {
            $message = self::FIELD_MESSAGES[$field] ?? 'invalid ' . str_replace('_', ' ', $field);
        }

        return [
            'code' => 400,
            'originalResponse' => $e->getMessage(),
            'parsedResponse' => [
                'error' => [
                    'code' => 'request_cannot_be_parsed',
                    'message' => $message,
                ],
            ],
        ];
    }
}
