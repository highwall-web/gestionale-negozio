import { Body, Controller, OperationId, Post, Route, Tags } from "tsoa";
import { RegisterRequest } from "../dto/auth.dto";
import { SetupService } from "../service/setup.service";

@Route("setup")
@Tags("Setup")
export class SetupController extends Controller {

    @Post("/")
    @OperationId("setup")
    public async setup(@Body() body: RegisterRequest): Promise<string> {
        const service = new SetupService();
        const result = await service.setup(body);
        this.setStatus(result.status);
        return result.message;
    }

}