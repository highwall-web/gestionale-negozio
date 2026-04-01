import { Controller, Get, OperationId, Route, Tags } from "tsoa";
import { HealthResponse } from "../dto/health.dto";

@Route("health")
@Tags("Health")
export class HealthController extends Controller {
    @Get("/")
    @OperationId("healthCheck")
    public async healthCheck(): Promise<HealthResponse> {
        return {
            status: "ok",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
}
