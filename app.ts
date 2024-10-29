import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { connect_db } from './schemas'
import routes from './routes'
import swaggerUi from 'swagger-ui-express'
import swaggerJson from './swagger/swagger.json'

const app: Express = express()
const port = 8000

const corsOptions = {
    origin: 'http://localhost:8000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}

// common middleware
app.use(cors(corsOptions))
app.options('*', cors(corsOptions)) // Preflight 요청 허용
app.use(express.json())
app.use('/swagger-api', swaggerUi.serve, swaggerUi.setup(swaggerJson))

// ===========================
app.use('/posts', routes.post)

app.listen(port, async () => {
    await connect_db()
        .then(() => {
            console.log('[1] DB Connected')
        })
        .catch((err) => {
            console.log('[Error] DB Connected\n', err)
        })

    console.log(`[2] Server runs at <https://localhost>:${port}`)
})
