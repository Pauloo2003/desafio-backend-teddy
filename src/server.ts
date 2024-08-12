import express from 'express';
import dotenv from 'dotenv';
import db from './models';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import urlRoutes from './routes/Url';
import urlEncurtadaRoutes from './routes/UrlEncurtada';
import { setupSwagger } from './config/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/', urlEncurtadaRoutes);

app.get('/', (req, res) => {
    res.redirect('/api/api-docs');
});
// Configuração do Swagger
setupSwagger(app);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});
