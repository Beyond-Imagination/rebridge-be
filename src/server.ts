import App from '@/app'
import 'reflect-metadata'
;(async function () {
    const app = new App()
    await app.connectDB()
    app.listen()
})()
