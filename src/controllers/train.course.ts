import { Request, Response } from 'express'

export async function courseHealthCheck(req: Request, res: Response) {
    res.status(200).send('OK')
}
