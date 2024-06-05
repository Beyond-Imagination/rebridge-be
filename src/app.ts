import express, { Express, Request, Response } from 'express'

const app: Express = express()
const port = 8080

app.get('/', (req: Request, res: Response) => {
    res.send('test-app')
})

app.listen(port, () => {
    console.log('server on')
})