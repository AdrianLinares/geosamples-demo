// Curated canonical maps (design D3): normalized raw value → canonical entry.
// Every key is produced by normalizeKey (trim, lowercase, accent-fold, strip
// trailing `?`/`.`, collapse whitespace), so case/accent variants merge
// automatically; explicit aliases cover typos and reorderings found in
// data/muestras.tsv. Unmatched values resolve deterministically via titleCase.

import { normalizeKey } from "./normalize.js";

export type Canonical = {
  name: string;
  aliases: readonly string[];
};

/** 58 raw rock strings in the source → 42 canonical entries (< 57 required). */
export const ROCK_CANONICALS: readonly Canonical[] = [
  { name: "Anfibolita", aliases: [] },
  { name: "Anortosita", aliases: [] },
  { name: "Arcillolitas", aliases: [] },
  { name: "Arena", aliases: [] },
  { name: "Caliza (packstone)", aliases: [] },
  { name: "Cuarzodiorita", aliases: ["cuarzodiorita", "Roca ígnea, cuarzodiorita", "cuarzodiorita?"] },
  {
    name: "Cuarzodiorita, cuarcita y esquisto micáceo",
    aliases: ["cuarzodiorita, cuarcita, esquisto micaceo"],
  },
  {
    name: "Cuarzodiorita y enclaves máficos de grano fino y faneríticos de grano grueso",
    aliases: ["Cuarzodiorita y enclaves máficos de grano fino y fneríticos de grano grueso"],
  },
  { name: "Depósito reciente", aliases: ["Deposito reciente"] },
  {
    name: "Depósitos disgregados de costras de antiguas arenas de playa conformados por cuarzo, feldespatos y materia orgánica",
    aliases: ["Depósitos disgregados de costras de antiguas arenas de playa conformados por cuarzo, feldespatos y materia orgámica"],
  },
  { name: "Dique", aliases: [] },
  { name: "Esquisto", aliases: ["esquisto", "Esquisto", "Esquisto  ", "Esquistos"] },
  { name: "Esquisto anfibolico", aliases: ["esquisto anfibolico?", "esquisto anfilbolico"] },
  { name: "Esquisto cloritico", aliases: ["Esquistos cloriticos"] },
  { name: "Esquisto con anfíbol y biotita", aliases: ["esquisto con amp y bt"] },
  { name: "Esquisto cuarzo feldespático", aliases: ["Esquisto  cuarzo feldespatico ?"] },
  { name: "Esquisto hornbléndico", aliases: ["esquisto hornblendico?"] },
  { name: "Esquisto micáceo", aliases: ["Esquisto micaceo", "esquisto micaceos"] },
  { name: "Esquisto micáceo con estaurolita", aliases: ["Esquisto micáceo con estaurolita?"] },
  {
    name: "Esquistos biotíticos - cuarzo feldespáticos en bandas",
    aliases: ["Esquistos biotitos _ cuarzo feldespatos en bandas"],
  },
  { name: "Esquistos cuarzo biotíticos", aliases: [] },
  { name: "Esquistos miloniticos", aliases: ["esquistos miloniticos"] },
  { name: "Granito", aliases: [] },
  { name: "Granitoide", aliases: ["granitoide"] },
  { name: "Granodiorita", aliases: [] },
  { name: "Granodiorita con moscovita", aliases: [] },
  {
    name: "Hornblendita con plagioclasa",
    aliases: ["Hornblendita con plagioclasa.", "Hornblentita con Pl, Tonalita, Granodiorita"],
  },
  { name: "Milonita", aliases: [] },
  { name: "Neis", aliases: ["neis?"] },
  { name: "Neis anfibolico", aliases: ["Neiss anfibolico", "neiss anfibolico ?"] },
  { name: "Neis anortositico", aliases: [] },
  { name: "Neis augen de anfibol y cuarzo", aliases: [] },
  { name: "Neis cataclastico", aliases: [] },
  {
    name: "Neis de cuarzo y anfibol",
    aliases: ["Neiss de cuarzo y anfibol", "Neiss de cuarzo y anfbol"],
  },
  { name: "Neis de cuarzo y plagioclasa", aliases: ["Neiss de cuarzo y plagioclasa"] },
  { name: "Plagioclasita neisica", aliases: ["Plagioclasita Neisisca"] },
  {
    name: "Roca metamórfica de protolito sedimentario con diques cuarzofeldespáticos",
    aliases: ["Roca metamórifca de protolito sedimentario con diques cuarzofeldespaticos"],
  },
  { name: "Rudstone de conchas de bivalvos", aliases: [] },
  { name: "Saprolito de cuarzodiorita", aliases: ["Cuarzodiorita saprolitizado"] },
  { name: "Tonalita", aliases: ["tonalitas"] },
  { name: "Ultracataclasita", aliases: ["Ultracataclasita ?"] },
  { name: "Xenolito de diorita y tonalita", aliases: ["Xenoliito de diorita y Tonalita"] },
];

/** 16 raw collector strings (non-blank) → 12 canonical entries. */
export const COLLECTOR_CANONICALS: readonly Canonical[] = [
  { name: "Andrea Carolina Matajira Pabon", aliases: [] },
  { name: "Ana Milena Cardozo Ortiz _ Viviana Monsalve", aliases: [] },
  {
    name: "Ana Milena Cardozo y Germán Pardo Torres",
    aliases: ["Ana Milena Cardozo y Germán Pado Torres"], // Pado → Pardo
  },
  {
    name: "Angela Rincón y Elizabeth Cortés",
    aliases: ["Angela Rincón y Elizabeth Cortes"],
  },
  {
    name: "Elizabeth Cortés & Milton Galvis",
    aliases: ["Milton Galvis & Elizabeth Cortés"],
  },
  { name: "Angela Rincón y Edgar Carrillo", aliases: [] },
  {
    name: "Alejandro Patiño y Elizabeth Cortés",
    aliases: ["Alejandro Patiño Elizabeth Cortes", "Elizabeth Cortes Alejandro Patiño"],
  },
  { name: "Alejandro Patiño", aliases: [] },
  {
    name: "Angela Rincón, Luis Bernal y Elizabeth Cortés",
    aliases: ["Luis Bernal, Elizabeth Cortes y Angela Rincón", "Angela Rincón, Luis Bernal y Elizabeth Cortes"],
  },
  { name: "Leopoldo Gonzalez _ Edgar Carrillo", aliases: [] },
  { name: "Carlos Mario Alarcón", aliases: [] },
  { name: "Ana Milena Cardozo y Natalia Cabrera Claros", aliases: [] },
];

/** Exactly four canonical analysis types (catalog spec). */
export const ANALYSIS_CANONICALS: readonly Canonical[] = [
  { name: "Seccion Delgada", aliases: [] },
  { name: "Dataciones Radiometricas", aliases: ["DatacionesRadiometricas"] },
  { name: "Analisis Macro", aliases: [] },
  { name: "Bioestratigrafia", aliases: [] },
];

/** Metadata constants stored once (design D2, catalog spec). */
export const SISTEMA_COORDENADAS = "Magna Colombia Bogotá";
export const PROYECTO = "Investigación Maritima, Costera e Insular";

function buildMap(list: readonly Canonical[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const entry of list) {
    const keys = new Set<string>([normalizeKey(entry.name)]);
    for (const alias of entry.aliases) keys.add(normalizeKey(alias));
    for (const key of keys) {
      const existing = map.get(key);
      if (existing !== undefined && existing !== entry.name) {
        throw new Error(
          `Canonical alias conflict for key "${key}": "${existing}" vs "${entry.name}"`,
        );
      }
      map.set(key, entry.name);
    }
  }
  return map;
}

const ROCK_MAP = buildMap(ROCK_CANONICALS);
const COLLECTOR_MAP = buildMap(COLLECTOR_CANONICALS);
const ANALYSIS_MAP = buildMap(ANALYSIS_CANONICALS);

/** Deterministic best-effort fallback: title-case each word of the key. */
function titleCase(key: string): string {
  return key
    .split(" ")
    .map((word) => (word === "" ? word : word[0]!.toUpperCase() + word.slice(1)))
    .join(" ");
}

/** Resolve a raw rock name to its canonical entry (never drops). */
export function resolveRock(raw: string): string {
  return ROCK_MAP.get(normalizeKey(raw)) ?? titleCase(normalizeKey(raw));
}

/** Resolve a raw collector to its canonical entry (never drops). */
export function resolveCollector(raw: string): string {
  return COLLECTOR_MAP.get(normalizeKey(raw)) ?? titleCase(normalizeKey(raw));
}

/** Resolve a raw analysis value to its canonical entry (never drops). */
export function resolveAnalysis(raw: string): string {
  return ANALYSIS_MAP.get(normalizeKey(raw)) ?? titleCase(normalizeKey(raw));
}

/** Full canonical lists, sorted for deterministic seeding. */
export const CANONICAL_ROCKS: readonly string[] = ROCK_CANONICALS.map((r) => r.name).sort();
export const CANONICAL_COLLECTORS: readonly string[] = COLLECTOR_CANONICALS.map((c) => c.name).sort();
export const CANONICAL_ANALYSES: readonly string[] = ANALYSIS_CANONICALS.map((a) => a.name).sort();