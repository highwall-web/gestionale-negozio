import { RepairResponse } from "../dto/repair.dto";
import { repairs } from "../schema/repairs";
import { customers } from "../schema/customers";
import { products } from "../schema/products";
import { models } from "../schema/models";
import { brands } from "../schema/brands";
import { colors } from "../schema/colors";
import { repairDetails } from "../schema/repairDetails";
import { CustomerMapper } from "./customer.mapper";
import { ProductMapper } from "./product.mapper";
import { RepairDetailsMapper } from "./repairDetails.mapper";
import { InterventionQuantitaResponse, RepairMessageResponse } from "../dto/repairDetails.dto";

type RepairEntity = typeof repairs.$inferSelect;
type CustomerEntity = typeof customers.$inferSelect;
type ProductEntity = typeof products.$inferSelect;
type ModelEntity = typeof models.$inferSelect;
type BrandEntity = typeof brands.$inferSelect;
type ColorEntity = typeof colors.$inferSelect;
type RepairDetailsEntity = typeof repairDetails.$inferSelect;

export class RepairMapper {

    static toResponse(
        repair: RepairEntity,
        customer: CustomerEntity,
        product: ProductEntity,
        model: ModelEntity,
        brand: BrandEntity,
        color: ColorEntity,
        details: RepairDetailsEntity,
        interventi: InterventionQuantitaResponse[],
        messaggi: RepairMessageResponse[]
    ): RepairResponse {
        return {
            id: repair.id,
            customer: CustomerMapper.toResponse(customer),
            product: ProductMapper.toResponse(product, model, brand, color),
            details: RepairDetailsMapper.toResponse(details, interventi, messaggi),
            stato: repair.stato ?? undefined,
            statoRiparazione: repair.statoRiparazione ?? undefined,
            costoTotale: repair.costoTotale ? parseFloat(repair.costoTotale) : undefined,
            createdAt: repair.createdAt.toISOString(),
        };
    }

}
