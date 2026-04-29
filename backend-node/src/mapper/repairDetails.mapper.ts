import {
    RepairDetailsResponse,
    InterventionQuantitaResponse,
    RepairMessageResponse,
} from "../dto/repairDetails.dto";
import { repairDetails } from "../schema/repairDetails";
import { repairMessages } from "../schema/repairMessages";
import { interventions } from "../schema/interventions";
import { repairDetailsInterventions } from "../schema/repairDetailsInterventions";

type RepairDetailsEntity = typeof repairDetails.$inferSelect;
type RepairMessageEntity = typeof repairMessages.$inferSelect;
type InterventionEntity = typeof interventions.$inferSelect;
type RepairDetailsInterventionEntity = typeof repairDetailsInterventions.$inferSelect;

export class RepairDetailsMapper {

    static toInterventionQuantita(
        rdi: RepairDetailsInterventionEntity,
        intervention: InterventionEntity
    ): InterventionQuantitaResponse {
        return {
            interventionId: intervention.id,
            modelId: intervention.modelId ?? undefined,
            nome: intervention.nome,
            prezzo: parseFloat(rdi.prezzoUnitario),
            quantita: rdi.quantita,
            periodoGaranzia: intervention.periodoGaranzia ?? undefined,
        };
    }

    static toMessage(entity: RepairMessageEntity): RepairMessageResponse {
        return {
            id: entity.id,
            testo: entity.testo,
            autore: entity.autore,
            createdAt: entity.createdAt.toISOString(),
        };
    }

    static toResponse(
        entity: RepairDetailsEntity,
        interventi: InterventionQuantitaResponse[],
        messaggi: RepairMessageResponse[]
    ): RepairDetailsResponse {
        return {
            id: entity.id,
            repairId: entity.repairId,
            isPreventivo: entity.isPreventivo,
            interventi,
            dataConsegna: entity.dataConsegna?.toISOString() ?? undefined,
            dataRiconsegnaEffettiva: entity.dataRiconsegnaEffettiva?.toISOString() ?? undefined,
            acconto: entity.acconto ? parseFloat(entity.acconto) : undefined,
            messaggi,
        };
    }

}
