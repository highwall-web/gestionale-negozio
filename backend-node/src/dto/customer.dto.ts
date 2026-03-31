export interface CustomerResponse {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  indirizzo?: string;
  citta?: string;
  cap?: string;
  telefono: string;
  telefonoSecondario?: string;
}

export interface CreateCustomerRequest {
  nome: string;
  cognome: string;
  email: string;
  indirizzo?: string;
  citta?: string;
  cap?: string;
  telefono: string;
  telefonoSecondario?: string;
}

export interface UpdateCustomerRequest {
  nome: string;
  cognome: string;
  email: string;
  indirizzo?: string;
  citta?: string;
  cap?: string;
  telefono: string;
  telefonoSecondario?: string;
}
