export interface InterventionQuantitaRequest {
  interventionId: number;
  quantita: number;
}

export interface InterventionQuantitaResponse {
  interventionId: number;
  modelId?: number;
  nome: string;
  prezzo: number;
  quantita: number;
  periodoGaranzia?: number;
}

export interface AddMessageRequest {
  testo: string;
}

export interface UpdateMessageRequest {
  testo: string;
}

export interface RepairMessageResponse {
  id: number;
  testo: string;
  autore: string;
  createdAt: string;
}

export interface RepairDetailsResponse {
  id: number;
  repairId: string;
  isPreventivo: boolean;
  interventi: InterventionQuantitaResponse[];
  dataConsegna?: string;
  dataRiconsegnaEffettiva?: string;
  acconto?: number;
  messaggi: RepairMessageResponse[];
}

export interface CreateRepairDetailsRequest {
  isPreventivo: boolean;
  interventi: InterventionQuantitaRequest[];
  dataConsegna?: string;
  acconto?: number;
  messaggi?: AddMessageRequest[];
}

export interface UpdateDataConsegnaRequest {
  dataConsegna: string | null;
}

export interface UpdateRepairDetailsRequest {
  isPreventivo: boolean;
  interventi: InterventionQuantitaRequest[];
  dataConsegna?: string;
  acconto?: number;
}
