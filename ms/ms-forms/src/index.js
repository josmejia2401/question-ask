require('dotenv').config({ path: '../.env' });
const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const formsRoutes = require('./routes/forms');
const usersRoutes = require('./routes/users');
const filesRoutes = require('./routes/files');
const rateLimit = require('express-rate-limit');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const requestIdMiddleware = require('./middlewares/request-id');
const { scheduleCleanup } = require('./jobs/cleanup-job');

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*'], // o ['Content-Type', 'Authorization', ...]
    credentials: false
}));
app.use(express.json());
app.use(express.urlencoded());
app.use(rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 100, // Límite de 100 solicitudes por IP por ventana
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: {
        status: 429,
        error: '¡Ups! Demasiadas solicitudes. Intenta de nuevo más tarde.',
    },
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use(fileUpload());
app.use(requestIdMiddleware);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/files', filesRoutes);

scheduleCleanup();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
