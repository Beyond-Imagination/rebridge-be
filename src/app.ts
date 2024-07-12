import express from 'express'
import cookieParser from 'cookie-parser'
import hpp from 'hpp'
import helmet from 'helmet'
import compression from 'compression'
import mongoose from 'mongoose'

import dbConnector from '@models/connector'
import { logger, loggerMiddleware } from '@utils/logger'
import routers from './routers'
import middleware from '@/middleware'

class App {
    public app: express.Application
    public env: string
    public port: string | number

    constructor() {
        this.app = express()
        this.env = process.env.NODE_ENV || 'development'
        this.port = process.env.PORT || 3000
        logger.info(`App is initializing at port: ${this.port}`)
        this.setPreMiddlewares()
        this.setControllers()
        this.setPostMiddleware()
    }

    public async connectDB() {
        await dbConnector()
    }

    public listen() {
        const server = this.app.listen(this.port, () => {
            logger.info(`🚀 App listening on the port: ${this.port} ENV: ${this.env}`)
        })

        const gracefulShutdownHandler = function gracefulShutdownHandler() {
            logger.info(`Gracefully shutting down`)

            setTimeout(() => {
                console.log('Shutting down application')
                server.close(async function () {
                    logger.info('All requests stopped, shutting down')
                    await mongoose.connection.close(false)
                    process.exit()
                })
            }, 0)
        }

        process.on('SIGINT', gracefulShutdownHandler)
        process.on('SIGTERM', gracefulShutdownHandler)
    }

    public getServer() {
        return this.app
    }

    private setPreMiddlewares() {
        this.app.use(hpp())
        this.app.use(helmet())
        this.app.use(compression())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cookieParser())
        this.app.use(middleware.request.requestId)
        this.app.use(loggerMiddleware)
    }

    private setPostMiddleware() {
        this.app.use(middleware.error)
    }

    private setControllers() {
        this.app.use('/user', routers.user)
        this.app.use('/train', routers.train)
    }
}

export default App
