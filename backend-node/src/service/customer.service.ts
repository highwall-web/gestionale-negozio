import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "../config/db";
import { CustomerResponse, CreateCustomerRequest, UpdateCustomerRequest } from "../dto/customer.dto";
import { CustomerMapper } from "../mapper/customer.mapper";
import { customers } from "../schema/customers";
import { HttpError } from "../common/httpError";
import { HttpStatus } from "../common/httpStatus";
import { SQL } from "drizzle-orm";

export class CustomerService {

    async create(request: CreateCustomerRequest): Promise<CustomerResponse> {
        const [saved] = await db.insert(customers).values({
            nome: request.nome,
            cognome: request.cognome,
            email: request.email,
            indirizzo: request.indirizzo,
            citta: request.citta,
            cap: request.cap,
            telefono: request.telefono,
            telefonoSecondario: request.telefonoSecondario,
        }).returning();

        return CustomerMapper.toResponse(saved);
    }

    async getAll(): Promise<CustomerResponse[]> {
        const result = await db.select().from(customers);
        return result.map(r => CustomerMapper.toResponse(r));
    }

    async search(nome?: string, cognome?: string, telefono?: string, email?: string): Promise<CustomerResponse[]> {
        const filters: SQL[] = [];
        if (nome) filters.push(ilike(customers.nome, `%${nome}%`));
        if (cognome) filters.push(ilike(customers.cognome, `%${cognome}%`));
        if (telefono) filters.push(ilike(customers.telefono, `%${telefono}%`));
        if (email) filters.push(ilike(customers.email, `%${email}%`));

        const result = await db.select().from(customers)
            .where(filters.length > 0 ? and(...filters) : undefined)
            .limit(10);

        return result.map(r => CustomerMapper.toResponse(r));
    }

    async getById(id: number): Promise<CustomerResponse> {
        const result = await db.select().from(customers).where(eq(customers.id, id));
        const customer = result.at(0);
        if (!customer) throw new HttpError(HttpStatus.NOT_FOUND, "Cliente non trovato");
        return CustomerMapper.toResponse(customer);
    }

    async update(id: number, request: UpdateCustomerRequest): Promise<CustomerResponse> {
        const result = await db.select().from(customers).where(eq(customers.id, id));
        if (!result.at(0)) throw new HttpError(HttpStatus.NOT_FOUND, "Cliente non trovato");

        const [updated] = await db.update(customers).set({
            nome: request.nome,
            cognome: request.cognome,
            email: request.email,
            indirizzo: request.indirizzo,
            citta: request.citta,
            cap: request.cap,
            telefono: request.telefono,
            telefonoSecondario: request.telefonoSecondario,
        }).where(eq(customers.id, id)).returning();

        return CustomerMapper.toResponse(updated);
    }

    async delete(id: number): Promise<void> {
        const result = await db.select().from(customers).where(eq(customers.id, id));
        if (!result.at(0)) throw new HttpError(HttpStatus.NOT_FOUND, "Cliente non trovato");

        await db.delete(customers).where(eq(customers.id, id));
    }

}
