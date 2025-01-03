<?php

namespace PHP_SDK\Models;

use Fingerprint\ServerAPI\ApiException;
use Fingerprint\ServerAPI\Sealed\UnsealAggregateException;
use PHP_SDK\Utils\ObjectSerializer;

class MusicianResponse
{
    public readonly int $code;
    public readonly mixed $originalResponse;
    public readonly mixed $parsedResponse;

    public function __construct(int $code, mixed $originalResponse, mixed $parsedResponse)
    {
        $this->code = $code;
        $this->originalResponse = $originalResponse;
        $this->parsedResponse = empty($parsedResponse) ? $parsedResponse : ObjectSerializer::sanitizeForSerialization($parsedResponse);
    }

    public static function BuildForApiException(ApiException $e): MusicianResponse
    {
        return new self($e->getCode(), $e->getResponseObject(), $e->getErrorDetails());
    }

    public static function BuildForUnsealAggregateException(UnsealAggregateException $e): MusicianResponse
    {
        return new self(500, $e->getMessage(), $e->getExceptions());
    }

    public static function BuildForGenericException(\Throwable $e): MusicianResponse
    {
        return new self(500, $e->getMessage(), $e->getMessage());
    }
}
