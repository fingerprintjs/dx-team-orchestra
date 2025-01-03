<?php

namespace PHP_SDK\Controllers;

use Fingerprint\ServerAPI\ApiException;
use Fingerprint\ServerAPI\Sealed\DecryptionAlgorithm;
use Fingerprint\ServerAPI\Sealed\DecryptionKey;
use Fingerprint\ServerAPI\Sealed\Sealed;
use Fingerprint\ServerAPI\Sealed\UnsealAggregateException;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use PHP_SDK\Models\MusicianResponse;
use Psr\Http\Message\MessageInterface;

class SealedController
{
    public function unseal(ServerRequest $request, Response $response): MessageInterface
    {
        $parsedBody = json_decode($request->getBody(), true);

        $sealed_result = base64_decode($parsedBody['sealedData']);
        $decryption_keys = array_map(function ($keyData) {
            $decodedKey = base64_decode($keyData['key']);
//            $algorithm = DecryptionAlgorithm::from($keyData['algorithm']); // use this when DecryptionAlgorithm will became enum
            $algorithm = $keyData['algorithm'];
            return new DecryptionKey($decodedKey, $algorithm);
        }, $parsedBody['keys']);

        try {
            $data = Sealed::unsealEventResponse($sealed_result, $decryption_keys);
            $result = new MusicianResponse(200, $data, $data);
        } catch (UnsealAggregateException $e) {
            $result = MusicianResponse::BuildForUnsealAggregateException($e);
        } catch (\Throwable $e) {
            $result = new MusicianResponse(500, $e->getMessage(), $e->getMessage());
        }

        $response->getBody()->write(json_encode($result));

        return $response->withHeader('Content-Type', 'application/json');
    }
}
