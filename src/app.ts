import express, { Application, Request, Response } from "express";
import cors from 'cors';

const app: Application = express();


//middleware
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


export default app;