import { ProductResponse } from "../dto/product.dto";
import { products } from "../schema/products";
import { models } from "../schema/models";
import { colors } from "../schema/colors";
import { brands } from "../schema/brands";
import { ModelMapper } from "./model.mapper";
import { ColorMapper } from "./color.mapper";

type ProductEntity = typeof products.$inferSelect;
type ModelEntity = typeof models.$inferSelect;
type ColorEntity = typeof colors.$inferSelect;
type BrandEntity = typeof brands.$inferSelect;

export class ProductMapper {

    static toResponse(
        product: ProductEntity,
        model: ModelEntity,
        brand: BrandEntity,
        color: ColorEntity
    ): ProductResponse {
        return {
            id: product.id,
            model: ModelMapper.toResponse(model, brand),
            color: ColorMapper.toResponse(color),
            capacita: product.capacita ?? undefined,
            codiceUnlock: product.codiceUnlock ?? undefined,
            sequenzaUnlock: product.sequenzaUnlock ? JSON.parse(product.sequenzaUnlock) : undefined,
            pin: product.pin ?? undefined,
            accessori: product.accessori ?? undefined,
            contattoConLiquidi: product.contattoConLiquidi ?? undefined,
            dispositivoNonTestabile: product.dispositivoNonTestabile ?? undefined,
            acquistatoPressoDiNoi: product.acquistatoPressoDiNoi ?? undefined,
            seriale: product.seriale ?? undefined,
            imei: product.imei ?? undefined,
            codiceModello: product.codiceModello ?? undefined,
            testDiagnostici: product.testDiagnostici as Record<string, string[]> ?? undefined,
            lasciatoInNegozio: product.lasciatoInNegozio ?? undefined,
        };
    }

}
