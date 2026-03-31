import {
  Body,
  Controller,
  Delete,
  Get,
  OperationId,
  Path,
  Post,
  Put,
  Query,
  Route,
  Tags,
} from "tsoa";
import {
  CustomerResponse,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "../dto/customer.dto";

@Route("customers")
@Tags("Customers")
export class CustomerController extends Controller {
  @Post("/")
  @OperationId("createCustomer")
  public async createCustomer(@Body() body: CreateCustomerRequest): Promise<CustomerResponse> {
    throw new Error("Not implemented");
  }

  @Get("/")
  @OperationId("getAllCustomers")
  public async getAllCustomers(): Promise<CustomerResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/search")
  @OperationId("searchCustomers")
  public async searchCustomers(
    @Query() nome?: string,
    @Query() cognome?: string,
    @Query() telefono?: string,
    @Query() email?: string
  ): Promise<CustomerResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/{id}")
  @OperationId("getCustomerById")
  public async getCustomerById(@Path() id: number): Promise<CustomerResponse> {
    throw new Error("Not implemented");
  }

  @Put("/{id}")
  @OperationId("updateCustomer")
  public async updateCustomer(
    @Path() id: number,
    @Body() body: UpdateCustomerRequest
  ): Promise<CustomerResponse> {
    throw new Error("Not implemented");
  }

  @Delete("/{id}")
  @OperationId("deleteCustomer")
  public async deleteCustomer(@Path() id: number): Promise<void> {
    throw new Error("Not implemented");
  }
}
