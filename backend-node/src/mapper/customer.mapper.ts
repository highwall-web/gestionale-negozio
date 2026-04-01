import { CustomerResponse } from "../dto/customer.dto";
import { customers } from "../schema/customers";

type CustomerEntity = typeof customers.$inferSelect;

export class CustomerMapper {

    static toResponse(entity: CustomerEntity): CustomerResponse {
        return {
            id: entity.id,
            nome: entity.nome,
            cognome: entity.cognome,
            email: entity.email,
            indirizzo: entity.indirizzo ?? undefined,
            citta: entity.citta ?? undefined,
            cap: entity.cap ?? undefined,
            telefono: entity.telefono,
            telefonoSecondario: entity.telefonoSecondario ?? undefined,
        };
    }

}
