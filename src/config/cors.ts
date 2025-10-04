import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whitelist = [process.env.FRONTEND_URL]  //METODO DE ARRGLO WHITELIST
        
        // Permitir requests sin origin (como Postman) y herramientas de desarrollo
        if (process.argv[2]==='--api') {
            whitelist.push (undefined)
        }
        
        // En desarrollo, permitir localhost en diferentes puertos
        if (process.env.NODE_ENV !== 'production') {
            whitelist.push('http://localhost:5173')
            whitelist.push('http://localhost:3000')
            whitelist.push('http://127.0.0.1:5173')
            whitelist.push(undefined) // Para requests de herramientas como Postman
        }
        
        if (whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}