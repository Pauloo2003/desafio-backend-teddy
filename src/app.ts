import express from 'express';
import dotenv from 'dotenv';
import db from './models';
import userRoutes from './routes/User';
import authRoutes from './routes/Auth';
import urlRoutes from './routes/Url';
import urlEncurtadaRoutes from './routes/UrlEncurtada';
import { setupSwagger } from './config/swagger';
import logRequest from './middleware/logRequest';

dotenv.config();

const app = express();

app.use(express.json());
app.use(logRequest);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/', urlEncurtadaRoutes);

app.get('/', (req, res) => {
    res.redirect('/api/api-docs');
});

// Configuração do Swagger
setupSwagger(app);

export default app;
