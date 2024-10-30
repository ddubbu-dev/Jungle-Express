import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'fs'
import express, { Express, Request, Response } from 'express'
import { connect_db } from './schemas'
import routes from './routes'

const app: Express = express()
const port = 8000

app.use(cors())
app.use(express.json())
app.use('/posts', routes.post)
app.use('/users', routes.user)

const swaggerJson = JSON.parse(readFileSync('./docs/output.json', 'utf-8'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson))

app.get('/', async (req: Request, res: Response) => {
    res.send('Typescript + Node.js + Express Server + MongoDB')
})

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
