import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './routes'
import { errorMiddleware } from './middleware/errorMiddleware'

export const app = express()
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(cookieParser())
app.use(express.json())
app.use(routes)

app.use(errorMiddleware)