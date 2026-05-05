import { BrandResponse, UpdateBrandRequest } from "../dto/brand.dto";
import { brands } from "../schema/brands";

type BrandEntity = typeof brands.$inferSelect;

export class BrandMapper {

    static toResponse(entity: BrandEntity): BrandResponse {
        return {
            id: entity.id,
            nome: entity.nome,
        };
    }

    static updateEntity(entity: BrandEntity, request: UpdateBrandRequest): void {
        entity.nome = request.nome;
    }

}
