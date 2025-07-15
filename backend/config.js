// Configuración para diferentes entornos
const config = {
  development: {
    port: process.env.PORT || 3010,
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_DATABASE || 'lunai_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password'
    },
    cors: {
      origin: ['http://localhost:4200', 'http://localhost:3000']
    }
  },
  production: {
    port: process.env.PORT || 3010,
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    cors: {
      origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['*']
    }
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];
