"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
//For env File 
dotenv_1.default.config();
// Catch unhandled promise rejections
process.on('unhandledRejection', error => {
    console.error('Unhandled Promise Rejection:', error);
});
// Catch uncaught exceptions
process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
});
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3389;
dbConfig_1.default.authenticate()
    .then(() => {
    console.log('Database connected...');
    dbConfig_1.default.sync();
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use('/api', userRoutes_1.default);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch(err => {
    console.error('Unable to connect to the database:', err);
});
