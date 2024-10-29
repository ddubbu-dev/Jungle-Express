import express, { Express, Request, Response } from 'express'
import { db_test } from './schemas'

const app: Express = express()
const port = 8000

app.get('/', async (req: Request, res: Response) => {
    res.send('Typescript + Node.js + Express Server + MongoDB')

    await db_test().catch((err) => console.log(err))
})

app.listen(port, () => {
    console.log(`[server]: Server is running at <https://localhost>:${port}`)
})
