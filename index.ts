import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorMiddleware } from './src/middleware/errorMiddleware'

const app = express()
app.use(cors({origin:"*", credentials:true}))
app.use(cookieParser())

app.use(errorMiddleware)

app.listen(3000, () => {
    console.log("se esta escuchando en el puerto 3000")
})