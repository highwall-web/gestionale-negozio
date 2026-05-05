import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./generated/routes";
import { errorHandler } from "./middleware/errorHandler";
import { authLimiter } from "./middleware/rateLimiter";
import { scheduleTokenCleanup } from "./jobs/cleanupTokens";
import { seedAdmin } from "./jobs/seedAdmin";
import { client, db } from "./config/db";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "path";

async function bootstrap() {
    await migrate(db, { migrationsFolder: path.join(__dirname, "../drizzle") });
    console.log("Migrations applied");

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(helmet());
    app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
    app.use(express.json());
    app.use(cookieParser());

    // Swagger UI
    const swaggerDocument = require("./generated/swagger.json");
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    const apiRouter = express.Router();
    apiRouter.use("/auth/login", authLimiter);
    apiRouter.use("/auth/refresh", authLimiter);
    RegisterRoutes(apiRouter);
    app.use("/api", apiRouter);
    app.use(errorHandler);

    const cronTask = scheduleTokenCleanup();
    seedAdmin();

    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Docs: http://localhost:${PORT}/docs`);
    });

    const shutdown = async () => {
        cronTask.stop();
        server.close();
        await client.end();
        process.exit(0);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
}

bootstrap().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
