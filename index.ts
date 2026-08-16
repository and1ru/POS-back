import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorMiddleware } from './src/middleware/errorMiddleware.ts'
import routes from './src/routes.ts'

const app = express()
app.use(cors({origin:"http://localhost:5173", credentials:true}))
app.use(cookieParser())
app.use(express.json())
app.use(routes)

app.use(errorMiddleware)

app.listen(3000, () => {
    console.log("se esta escuchando en el puerto 3000")
})