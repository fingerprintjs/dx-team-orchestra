<?php

namespace PHP_SDK\V4\Controllers;

use Fingerprint\ServerSdk\Sealed\DecryptionAlgorithm;
use Fingerprint\ServerSdk\Sealed\DecryptionKey;
use Fingerprint\ServerSdk\Sealed\Sealed;
use Fingerprint\ServerSdk\Sealed\UnsealAggregateException;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use Psr\Http\Message\MessageInterface;

class SealedController
{
    public function unseal(ServerRequest $request, Response $response): MessageInterface
    {
        $parsedBody = json_decode($request->getBody(), true);

        $sealed_result = base64_decode($parsedBody['sealedData']);
        $decryption_keys = array_map(function ($keyData) {
            $decodedKey = base64_decode($keyData['key']);
            $algorithm = DecryptionAlgorithm::from($keyData['algorithm']);
            return new DecryptionKey($decodedKey, $algorithm);
        }, $parsedBody['keys']);

        try {
            $data = Sealed::unsealEventResponse($sealed_result, $decryption_keys);
            $result = [
                'code' => 200,
                'originalResponse' => $data,
                'parsedResponse' => $data,
            ];
        } catch (UnsealAggregateException $e) {
            $result = [
                'code' => 500,
                'originalResponse' => $e->getMessage(),
                'parsedResponse' => array_map(fn($ex) => $ex->getMessage(), $e->getExceptions()),
            ];
        } catch (\Throwable $e) {
            $result = [
                'code' => 500,
                'originalResponse' => $e->getMessage(),
                'parsedResponse' => $e->getMessage(),
            ];
        }

        $response->getBody()->write(json_encode($result));

        return $response->withHeader('Content-Type', 'application/json');
    }
}
