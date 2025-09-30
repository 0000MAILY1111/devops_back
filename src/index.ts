import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database/db';
import { corsConfig } from './config/cors';
import cors from 'cors';
import path from 'path';

import projectRoutes from './routes/projectRoutes';
import authRoutes from './routes/authRoutes';
import deployRouter from './routes/deployRoutes';


dotenv.config(); 
console.log('🔄 Iniciando aplicación...');
console.log('📁 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'No configurada');
console.log('🌐 FRONTEND_URL:', process.env.FRONTEND_URL);

connectDB(); 
const app = express();  
app.use(cors(corsConfig)); // Configuración de CORS habilitada

app.use(express.json());
// Servir archivos estáticos desde la carpeta 'public'  //esto es para el frontend
//app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, 'views/resources')));

const PORT: number = parseInt(process.env.PORT || '4000', 10);
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

app.use ('/api/projects', projectRoutes  );
app.use ('/api/auth', authRoutes  );
app.use ('/api/deploy', deployRouter)
// Ruta de prueba
export default app;
