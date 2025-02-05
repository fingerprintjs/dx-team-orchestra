import express from 'express'

import { getEvents } from './handlers/getEvents'
import { getVisits } from './handlers/getVisits'
import { deleteVisitorData } from './handlers/deleteVisitorData'
import { updateEvent } from './handlers/updateEvent'
import { getRelatedVisitors } from './handlers/getRelatedVisitors'
import { unseal } from './handlers/unseal'
import { searchEvents } from './handlers/searchEvents'

const app = express()

app.use(express.json())

const port = 3002

app.get('/getEvents', getEvents)
app.get('/searchEvents', searchEvents)
app.get('/updateEvent', updateEvent)
app.get('/getVisits', getVisits)
app.get('/deleteVisitorData', deleteVisitorData)
app.get('/getRelatedVisitors', getRelatedVisitors)
app.post('/unseal', unseal)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
