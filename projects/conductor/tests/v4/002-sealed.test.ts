import { test } from '../../utils/v4/playwright'
import testData from '../../utils/testData'

test.describe('Sealed', () => {
  test('Successfully unseal result with maximum fields', async ({ sdkApi, identify, assert }) => {
    const { sealed_result: sealedData, event_id } = await identify({
      auth: testData.credentials.sealedMaximumFeaturesUs,
    })
    test.expect(sealedData).toBeDefined()
    const keys = [
      {
        key: testData.credentials.sealedMaximumFeaturesUs.encryptionKey,
        algorithm: 'aes-256-gcm',
      },
    ]
    const { data: unsealedEvent } = await sdkApi.unseal({ sealedData, keys })
    await assert.thatUnsealedDataMatches(unsealedEvent, {
      api_key: testData.credentials.sealedMaximumFeaturesUs.privateKey,
      region: testData.credentials.sealedMaximumFeaturesUs.region,
      event_id: event_id,
    })
  })

  test('Successfully unseal result looking for right key', async ({ sdkApi, assert, identify }) => {
    const { sealed_result: sealedData, event_id } = await identify({
      auth: testData.credentials.sealedMaximumFeaturesUs,
    })
    test.expect(sealedData).toBeDefined()
    const keys = [
      {
        key: testData.credentials.sealedMinimumFeaturesUs.encryptionKey,
        algorithm: 'aes-256-gcm',
      },
      {
        key: testData.credentials.sealedMaximumFeaturesUs.encryptionKey,
        algorithm: 'aes-256-gcm',
      },
    ]
    const { data: unsealedEvent } = await sdkApi.unseal({ sealedData, keys })
    await assert.thatUnsealedDataMatches(unsealedEvent, {
      api_key: testData.sealedMaximumFeaturesUs.privateKey,
      region: testData.sealedMaximumFeaturesUs.region,
      event_id: event_id,
    })
  })

  test('Successfully unseal result with minimum fields', async ({ sdkApi, assert, identify }) => {
    const { sealed_result: sealedData, event_id } = await identify({
      auth: testData.credentials.sealedMinimumFeaturesUs,
    })
    test.expect(sealedData).toBeDefined()
    const keys = [
      {
        key: testData.credentials.sealedMinimumFeaturesUs.encryptionKey,
        algorithm: 'aes-256-gcm',
      },
    ]
    const { data: unsealedEvent } = await sdkApi.unseal({ sealedData, keys })
    await assert.thatUnsealedDataMatches(unsealedEvent, {
      api_key: testData.sealedMinimumFeaturesUs.privateKey,
      region: testData.sealedMinimumFeaturesUs.region,
      event_id: event_id,
    })
  })
})
