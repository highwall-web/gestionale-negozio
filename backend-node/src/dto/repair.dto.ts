import { CustomerResponse, CreateCustomerRequest } from "./customer.dto";
import { ProductResponse, CreateProductRequest } from "./product.dto";
import { RepairDetailsResponse, CreateRepairDetailsRequest } from "./repairDetails.dto";

export type StatoRepair = "NUOVO" | "IN_CORSO" | "PRONTO" | "CONSEGNATO";

export type StatoRiparazione =
  | "ACCETTATO"
  | "ANALISI_IN_CORSO"
  | "RIPARAZIONE_IN_CORSO"
  | "ATTESA_PEZZI_DI_RICAMBIO"
  | "IN_ATTESA_DI_PREVENTIVO"
  | "PREVENTIVO_NON_ACCETTATO"
  | "RIPARAZIONE_CONCLUSA"
  | "DISPOSITIVO_NON_RIPARABILE";

export interface RepairResponse {
  id: string;
  customer: CustomerResponse;
  product: ProductResponse;
  details?: RepairDetailsResponse;
  stato?: StatoRepair;
  statoRiparazione?: StatoRiparazione;
  costoTotale?: number;
  createdAt: string;
}

export interface CreateRepairRequest {
  customerId?: number;
  customer: CreateCustomerRequest;
  product: CreateProductRequest;
  details: CreateRepairDetailsRequest;
}

export interface UpdateRepairRequest {
  customerId: number;
  stato?: StatoRepair;
  statoRiparazione?: StatoRiparazione;
}

export interface UpdateStatoRepairRequest {
  stato?: StatoRepair;
  statoRiparazione?: StatoRiparazione;
}

export interface RepairRangeResponse {
  id: string;
  nomeCliente: string;
  cognomeCliente: string;
  brand: string;
  modello: string;
  colore: string;
  dataConsegna: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
