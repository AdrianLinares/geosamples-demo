// Contratos de tipos del SPA (espejo de server/src/types.ts, design D1).

export type Sample = {
  id: number;
  igm: string | null;
  codigoMuestra: string;
  nombreEstacion: string;
  estacionCompanero: string | null;
  simboloUG: string | null;
  ugMapa: string | null;
  descripcionMuestra: string;
  nombreRoca: string;
  localizacion: string;
  plancha: string;
  norte: number | null;
  este: number | null;
  altura: number | null;
  fecha: string; // ISO YYYY-MM-DD
  nombreColector: string | null;
  existeMuestra: boolean | null;
  tipoAnalisis: string;
};

export type CanonicalEntry = {
  id: number;
  name: string;
  normalizedKey: string;
};

export type SampleFilters = {
  code?: string;
  rock?: string;
  unit?: string;
  collector?: string;
  analysis?: string;
  plancha?: string;
  dateFrom?: string;
  dateTo?: string;
  q?: string;
  page?: number;
  pageSize?: number;
};

export type SampleListResponse = {
  data: Sample[];
  total: number;
  page: number;
  pageSize: number;
};

export type MetaResponse = {
  rockTypes: CanonicalEntry[];
  collectors: CanonicalEntry[];
  analysisTypes: CanonicalEntry[];
  constants: {
    sistemaCoordenadas: string;
    proyecto: string;
  };
};

export type RegistrationPayload = {
  igm?: string | null;
  codigoMuestra: string;
  nombreEstacion: string;
  estacionCompanero?: string | null;
  simboloUG?: string | null;
  ugMapa?: string | null;
  descripcionMuestra?: string;
  localizacion?: string;
  plancha?: string;
  norte?: number | null;
  este?: number | null;
  altura?: number | null;
  fecha: string;
  nombreColector?: string | null;
  existeMuestra?: boolean | null;
  nombreRoca: string;
  tipoAnalisis: string;
};