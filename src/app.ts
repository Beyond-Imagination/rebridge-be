import express from 'express'
import dbConnector from '@models/connector'
import { logger } from '@typegoose/typegoose/lib/logSettings'
import cookieParser from 'cookie-parser'
import hpp from 'hpp'
import helmet from 'helmet'
import compression from 'compression'
import mongoose from 'mongoose'
import routers from './routers'

class App {
    public app: express.Application
    public env: string
    public port: string | number

    constructor() {
        this.app = express()
        this.env = process.env.NODE_ENV || 'development'
        this.port = process.env.PORT || 3000
        logger.info(`App is initializing at port: ${this.port}`)
        this.initializeMiddlewares()
        this.setControllers()
    }

    public async connectDB() {
        await dbConnector()
    }

    public listen() {
        const server = this.app.listen(this.port, () => {
            logger.info(`🚀 App listening on the port: ${this.port} ENV: ${this.env}`)
        })

        const gracefulShutdownHandler = function gracefulShutdownHandler() {
            console.log(`Gracefully shutting down`)

            setTimeout(() => {
                console.log('Shutting down application')
                server.close(async function () {
                    console.log('All requests stopped, shutting down')
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

    private initializeMiddlewares() {
        this.app.use(hpp())
        this.app.use(helmet())
        this.app.use(compression())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cookieParser())
    }

    private setControllers() {
        this.app.use('/user', routers.user)
        this.app.use('/train', routers.train)
    }
}

export default App
