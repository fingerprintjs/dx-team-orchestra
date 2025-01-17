import { test } from '../utils/playwright';
import generateIdentificationData, { identify } from '../htmlScripts/runIdentification';
import testData from '../utils/testData';
import * as assert from 'node:assert';

test.describe('Sealed', () => {
    test('Successfully unseal result with maximum fields', async ({ sdkApi, assert }) => {
        const { sealedResult: sealedData, requestId } = await identify({publicApiKey: testData.sealedMaximumFeaturesUs.publicKey})
        test.expect(sealedData).not.toBe(undefined);
        const keys = [
            {
                key: testData.sealedMaximumFeaturesUs.encryptionKey,
                algorithm: 'aes-256-gcm'
            }
        ]
        const {data: unsealedEvent} = await sdkApi.unseal({sealedData, keys});
        await assert.thatUnsealedDataMatches(unsealedEvent, {
            apiKey: testData.sealedMaximumFeaturesUs.privateKey,
            region: testData.sealedMaximumFeaturesUs.region,
            requestId
        });
    })

    test('Successfully unseal result looking for right key', async ({ sdkApi, assert }) => {
        const { sealedResult: sealedData, requestId } = await identify({publicApiKey: testData.sealedMaximumFeaturesUs.publicKey})
        test.expect(sealedData).not.toBe(undefined);
        const keys = [
            {
                key: testData.sealedMinimumFeaturesUs.encryptionKey,
                algorithm: 'aes-256-gcm'
            },
            {
                key: testData.sealedMaximumFeaturesUs.encryptionKey,
                algorithm: 'aes-256-gcm'
            }
        ]
        const {data: unsealedEvent} = await sdkApi.unseal({sealedData, keys});
        await assert.thatUnsealedDataMatches(unsealedEvent, {
            apiKey: testData.sealedMaximumFeaturesUs.privateKey,
            region: testData.sealedMaximumFeaturesUs.region,
            requestId
        });
    })

    test('Successfully unseal result with minimum fields', async ({ sdkApi, assert }) => {
        const { sealedResult: sealedData, requestId } = await identify({publicApiKey: testData.sealedMinimumFeaturesUs.publicKey})
        test.expect(sealedData).not.toBe(undefined);
        const keys = [
            {
                key: testData.sealedMinimumFeaturesUs.encryptionKey,
                algorithm: 'aes-256-gcm'
            }
        ]
        const {data: unsealedEvent} = await sdkApi.unseal({sealedData, keys});
        await assert.thatUnsealedDataMatches(unsealedEvent, {
            apiKey: testData.sealedMinimumFeaturesUs.privateKey,
            region: testData.sealedMinimumFeaturesUs.region,
            requestId
        });
    })
})
