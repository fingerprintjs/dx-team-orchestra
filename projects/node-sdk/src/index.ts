import express from 'express'

import { deleteVisitorData as deleteVisitorDataV3 } from './handlers/v3/deleteVisitorData'
import { getEvents } from './handlers/v3/getEvents'
import { getRelatedVisitors } from './handlers/v3/getRelatedVisitors'
import { getVisits } from './handlers/v3/getVisits'
import { searchEvents } from './handlers/v3/searchEvents'
import { unseal as unsealV3 } from './handlers/v3/unseal'
import { updateEvent as updateEventV3 } from './handlers/v3/updateEvent'
import { deleteVisitorData as deleteVisitorDataV4 } from './handlers/v4/deleteVisitorData'
import { getEvent } from './handlers/v4/getEvent'
import { searchEvents as searchEventsV4 } from './handlers/v4/searchEvents'
import { unseal as unsealV4 } from './handlers/v4/unseal'
import { updateEvent as updateEventV4 } from './handlers/v4/updateEvent'

const app = express()

app.use(express.json())

const port = 3002

app.get('/getEvents', getEvents)
app.get('/searchEvents', searchEvents)
app.get('/updateEvent', updateEventV3)
app.get('/getVisits', getVisits)
app.get('/deleteVisitorData', deleteVisitorDataV3)
app.get('/getRelatedVisitors', getRelatedVisitors)
app.post('/unseal', unsealV3)

app.get('/v4/getEvent', getEvent)
app.get('/v4/searchEvents', searchEventsV4)
app.get('/v4/updateEvent', updateEventV4)
app.get('/v4/deleteVisitorData', deleteVisitorDataV4)
app.post('/v4/unseal', unsealV4)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
