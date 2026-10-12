import express, { Application, Request, Response } from "express";
import cors from 'cors';
import pinoHttp from "pino-http";
import {logger} from "./config/logger";
import {notFound} from "./middlewares/notFound";
import {errorHandler} from "./middlewares/errorHandler"
const app: Application = express();

// req logging
app.use(pinoHttp({logger}));

// cors middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Health check route

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
        message: "CampusX API is running",
        timestamp: new Date().toISOString(),
    }); 
});

// 404
app.use(notFound);

// Central error handler → MUST be last
app.use(errorHandler);


export default app;