import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./generated/routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Swagger UI
const swaggerDocument = require("./generated/swagger.json");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const apiRouter = express.Router();
RegisterRoutes(apiRouter);
app.use("/api", apiRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Docs: http://localhost:${PORT}/docs`);
});

export default app;
