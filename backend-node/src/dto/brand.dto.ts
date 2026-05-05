export interface BrandResponse {
  id: number;
  nome: string;
}

export interface CreateBrandRequest {
  nome: string;
}

export interface UpdateBrandRequest {
  nome: string;
}
