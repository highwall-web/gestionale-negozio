import { ColorResponse, CreateColorRequest } from "./color.dto";
import { CreateModelRequest, ModelResponse } from "./model.dto";

export interface ProductResponse {
  id: number;
  model: ModelResponse;
  color: ColorResponse;
  capacita?: string;
  codiceUnlock?: string;
  sequenzaUnlock?: number[];
  pin?: string;
  accessori?: string;
  contattoConLiquidi?: boolean;
  dispositivoNonTestabile?: boolean;
  acquistatoPressoDiNoi?: boolean;
  seriale?: string;
  imei?: string;
  codiceModello?: string;
  testDiagnostici?: Record<string, string[]>;
  lasciatoInNegozio?: boolean;
}

export interface CreateProductRequest {
  model: CreateModelRequest;
  color: CreateColorRequest;
  capacita?: string;
  codiceUnlock?: string;
  sequenzaUnlock?: number[];
  pin?: string;
  accessori?: string;
  contattoConLiquidi?: boolean;
  dispositivoNonTestabile?: boolean;
  acquistatoPressoDiNoi?: boolean;
  seriale?: string;
  imei?: string;
  codiceModello?: string;
  testDiagnostici?: Record<string, string[]>;
  lasciatoInNegozio?: boolean;
}

export type UpdateProductRequest = CreateProductRequest;
