import * as dotenv from 'dotenv';
import express from 'express';
dotenv.config();

const app = express();
const port = 8080;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});