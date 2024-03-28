//imports
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

import path from "path";
import appRouter from "./routers";
const testServer: Application = express(); //testServer initialization;


testServer.enable("trust proxy");
testServer.use(cookieParser());

// middlewares  
testServer.use(express.json());
testServer.use(cors()); 

// Routes
testServer.use("/api/v1", appRouter);


export default testServer;

