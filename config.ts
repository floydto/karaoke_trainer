import dotenv from 'dotenv';
dotenv.config();

export const tornadoPort = process.env.PYTHON_PORT || 8888
export const tornadoPath = `http://localhost:${tornadoPort}`