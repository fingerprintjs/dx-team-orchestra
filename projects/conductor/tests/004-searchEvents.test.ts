import { test } from '../utils/playwright'
import testData from '../utils/testData'

test.describe('SearchEvents suite', () => {
  test('with valid api key and limit', async ({ assert, identify }) => {
    const { visitorId } = await identify({
      auth: testData.credentials.maxFeaturesUS,
    })

    await assert.thatResponsesMatch('searchEvents', {
      visitorId,
      limit: 10,
      apiKey: testData.credentials.maxFeaturesUS.privateKey,
      region: testData.credentials.maxFeaturesUS.region,
    })
  })
})
