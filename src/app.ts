import express from "express"
import cors from "cors"
import authRouter from "./modules/auth/auth.routes"
import { errorHandler } from "./middlewares/errorHandler"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRouter)

app.use(errorHandler)

export default app