import { ModelResponse } from "../dto/model.dto";
import { models } from "../schema/models";
import { brands } from "../schema/brands";

type ModelEntity = typeof models.$inferSelect;
type BrandEntity = typeof brands.$inferSelect;

export class ModelMapper {

    static toResponse(model: ModelEntity, brand: BrandEntity): ModelResponse {
        return {
            id: model.id,
            nome: model.nome,
            tipoDispositivo: model.tipoDispositivo,
            brandId: model.brandId,
            brandNome: brand.nome,
        };
    }

}
