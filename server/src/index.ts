/* Import modules */
import dotenv from 'dotenv';
import express, { Request, Response} from 'express';
import cors from 'cors';

/* Import database */
import * as database from './config/database';

/* Import routes */
import register from './routes/account/register';
import login from './routes/account/login';
import accounts from './routes/account/accounts';



/* Set up app */
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

/* Default route */
app.get('/', (request: Request, response: Response) => {
  response.send('Server is running');
});

/* Set up routes */
app.use('/api', register);
app.use('/api', login);
app.use('/api', accounts);

/* Set not found handler */
app.use((request: Request, response: Response) => {
  response.status(404).json({ error: "Not found" });
});



/* Start the server */
database.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}/api`);
  });
}).catch((err) => {
  console.error("❌ Failed to connect to database:", err);
});
