const express = require('express')
const cors = require('cors')
const indexRoute = require('./routes/indexRoute')

require('dotenv').config()
const app = express()

app.use(express.json())
app.use(cors())

app.use('/api', indexRoute)

app.listen(process.env.PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:${process.env.PORT}`)
)
