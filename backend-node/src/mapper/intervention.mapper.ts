import { InterventionResponse } from "../dto/intervention.dto";
import { interventions } from "../schema/interventions";
import { models } from "../schema/models";

type InterventionEntity = typeof interventions.$inferSelect;
type ModelEntity = typeof models.$inferSelect;

export class InterventionMapper {

    static toResponse(entity: InterventionEntity, model?: ModelEntity | null): InterventionResponse {
        return {
            id: entity.id,
            modelId: entity.modelId ?? undefined,
            modelNome: model?.nome ?? undefined,
            nome: entity.nome,
            prezzo: parseFloat(entity.prezzo),
            periodoGaranzia: entity.periodoGaranzia ?? undefined,
        };
    }

}
