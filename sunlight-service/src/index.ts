// sunlight-service/src/index.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sunlightRouter from './routes/sunlight';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow requests from frontend origin
app.use(express.json()); // Parse JSON bodies

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Sunlight Service API');
});

app.use('/api/sunlight', sunlightRouter);

// Basic Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});