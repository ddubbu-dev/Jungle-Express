import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'fs'
import express, { Express, Request, Response } from 'express'
import routes from './routes'
import { AppDataSource } from './db'
import { logger, logMiddleware } from './middleware/logger'

const app: Express = express()
const port = 8000

app.use(logMiddleware)
app.use(cors())
app.use(express.json())
app.use('/posts', routes.post)
app.use('/users', routes.user)

const swaggerJson = JSON.parse(readFileSync('./docs/output.json', 'utf-8'))
app.use('/swagger-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson))

app.get('/', async (req: Request, res: Response) => {
    res.send('Typescript + Node.js + Express Server + MongoDB')
})

AppDataSource.initialize()
    .then(() => {
        logger.info('DB Connected')

        app.listen(port, async () => {
            logger.info(`Server runs at <https://localhost>:${port}`)
        })
    })
    .catch((err) => {
        logger.error('DB Connected', err)
    })
