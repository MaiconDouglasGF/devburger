import routes from './routes.js'
import express from 'express'

class App {
constructor () {
    this.app = express();

    this.middlewares();
    this.routes();
}
middlewares() {
    this.app.use(express.json())
}
routes() {
    this.app.use(routes)
}

}

export default new App().app