import {test} from '../utils/playwright';
import testData from '../utils/testData';

test.describe('Sealed', () => {
  test('Successfully unseal result with maximum fields', async ({sdkApi, identify, assert}) => {
    const {sealedResult: sealedData, requestId} = await identify({
      auth: testData.credentials.sealedMaximumFeaturesUs
    })
    test.expect(sealedData).toBeDefined()
    const keys = [
      {
        key: testData.credentials.sealedMaximumFeaturesUs.encryptionKey,
        algorithm: 'aes-256-gcm'
      }
    ]
    const {data: unsealedEvent} = await sdkApi.unseal({sealedData, keys});
    await assert.thatUnsealedDataMatches(unsealedEvent, {
      apiKey: testData.credentials.sealedMaximumFeaturesUs.privateKey,
      region: testData.credentials.sealedMaximumFeaturesUs.region,
      requestId
    });
  })

  test('Successfully unseal result looking for right key', async ({sdkApi, assert, identify}) => {
    const {
      sealedResult: sealedData,
      requestId
    } = await identify({auth: testData.credentials.sealedMaximumFeaturesUs})
    test.expect(sealedData).toBeDefined()
    const keys = [
      {
        key: testData.credentials.sealedMinimumFeaturesUs.encryptionKey,
        algorithm: 'aes-256-gcm'
      },
      {
        key: testData.credentials.sealedMaximumFeaturesUs.encryptionKey,
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

  test('Successfully unseal result with minimum fields', async ({sdkApi, assert, identify}) => {
    const {
      sealedResult: sealedData,
      requestId
    } = await identify({auth: testData.credentials.sealedMinimumFeaturesUs})
    test.expect(sealedData).toBeDefined()
    const keys = [
      {
        key: testData.credentials.sealedMinimumFeaturesUs.encryptionKey,
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
