export type TipoDispositivo = "TELEFONO" | "TABLET" | "COMPUTER";

export type ModelSortBy = "nome" | "brand";

export interface ModelResponse {
    id: number;
    nome: string;
    tipoDispositivo: TipoDispositivo;
    brandId: number;
    brandNome: string;
}

export interface CreateModelRequest {
    nome: string;
    tipoDispositivo: TipoDispositivo;
    brandNome: string;
}

export interface UpdateModelRequest {
    nome: string;
    tipoDispositivo: TipoDispositivo;
    brandId: number;
}
