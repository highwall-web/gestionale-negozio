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
    Security,
    Tags,
} from "tsoa";
import {
    CustomerResponse,
    CreateCustomerRequest,
    UpdateCustomerRequest,
    CustomerSortBy,
} from "../dto/customer.dto";
import { PaginatedResponse, SortOrder } from "../common/pagination";
import { CustomerService } from "../service/customer.service";

const customerService = new CustomerService();

@Route("customers")
@Tags("Customers")
@Security("bearerAuth")
export class CustomerController extends Controller {
    @Post("/")
    @OperationId("createCustomer")
    public async createCustomer(@Body() body: CreateCustomerRequest): Promise<CustomerResponse> {
        return customerService.create(body);
    }

    @Get("/")
    @OperationId("getAllCustomers")
    public async getAllCustomers(
        @Query() page?: number,
        @Query() pageSize?: number,
        @Query() sortBy?: CustomerSortBy,
        @Query() sortOrder?: SortOrder,
        @Query() nome?: string,
        @Query() cognome?: string,
        @Query() telefono?: string,
        @Query() email?: string
    ): Promise<PaginatedResponse<CustomerResponse>> {
        return customerService.getAll(page, pageSize, sortBy, sortOrder, nome, cognome, telefono, email);
    }

    @Get("/search")
    @OperationId("searchCustomers")
    public async searchCustomers(
        @Query() nome?: string,
        @Query() cognome?: string,
        @Query() telefono?: string,
        @Query() email?: string
    ): Promise<CustomerResponse[]> {
        return customerService.search(nome, cognome, telefono, email);
    }

    @Get("/{id}")
    @OperationId("getCustomerById")
    public async getCustomerById(@Path() id: number): Promise<CustomerResponse> {
        return customerService.getById(id);
    }

    @Put("/{id}")
    @OperationId("updateCustomer")
    public async updateCustomer(
        @Path() id: number,
        @Body() body: UpdateCustomerRequest
    ): Promise<CustomerResponse> {
        return customerService.update(id, body);
    }

    @Delete("/{id}")
    @OperationId("deleteCustomer")
    public async deleteCustomer(@Path() id: number): Promise<void> {
        return customerService.delete(id);
    }
}
