import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import './database';
import { router } from './routes';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(router);

export { app, port };
