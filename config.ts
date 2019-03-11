export const config = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        name: process.env.DB_NAME || 'anti_theft',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'passwd'
    },
    api: {
        port: process.env.PORT || 3000
    }
};