export type InterventionSortBy = "nome" | "prezzo";

export interface InterventionResponse {
  id: number;
  modelId?: number;
  modelNome?: string;
  nome: string;
  prezzo: number;
  periodoGaranzia?: number;
}

export interface CreateInterventionRequest {
  modelId?: number;
  nome: string;
  prezzo: number;
  periodoGaranzia?: number;
}

export interface UpdateInterventionRequest {
  modelId?: number | null;
  nome: string;
  prezzo: number;
  periodoGaranzia?: number | null;
}
