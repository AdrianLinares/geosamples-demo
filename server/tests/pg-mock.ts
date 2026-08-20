// Mock pg Pool + 99 fixture rows for the API contract tests (api.test.ts).
// The SQL-marker classification and the filter order (code, rock, unit,
// collector, analysis, plancha, dateFrom, dateTo, q) mirror
// server/src/routes/samples.ts buildWhere() — keep both in sync.

type Row = Record<string, unknown> & { codigo_muestra: string };

const pad4 = (n: number) => String(n).padStart(4, "0");

const foldAccents = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const keyOf = (s: string) => foldAccents(s.trim().toLowerCase()).replace(/\s+/g, " ").trim();

const ROCK_NAMES = [
  "Anfibolita", "Anortosita", "Arcillolitas", "Arena", "Caliza (packstone)",
  "Cuarzodiorita", "Cuarzodiorita, cuarcita y esquisto micáceo",
  "Cuarzodiorita y enclaves máficos de grano fino y faneríticos de grano grueso",
  "Depósito reciente",
  "Depósitos disgregados de costras de antiguas arenas de playa conformados por cuarzo, feldespatos y materia orgánica",
  "Dique", "Esquisto", "Esquisto anfibolico", "Esquisto cloritico",
  "Esquisto con anfíbol y biotita", "Esquisto cuarzo feldespático",
  "Esquisto hornbléndico", "Esquisto micáceo", "Esquisto micáceo con estaurolita",
  "Esquistos biotíticos - cuarzo feldespáticos en bandas", "Esquistos cuarzo biotíticos",
  "Esquistos miloniticos", "Granito", "Granitoide", "Granodiorita",
  "Granodiorita con moscovita", "Hornblendita con plagioclasa", "Milonita", "Neis",
  "Neis anfibolico", "Neis anortositico", "Neis augen de anfibol y cuarzo",
  "Neis cataclastico", "Neis de cuarzo y anfibol", "Neis de cuarzo y plagioclasa",
  "Plagioclasita neisica",
  "Roca metamórfica de protolito sedimentario con diques cuarzofeldespáticos",
  "Rudstone de conchas de bivalvos", "Saprolito de cuarzodiorita", "Tonalita",
  "Ultracataclasita", "Xenolito de diorita y tonalita",
].sort();

const COLLECTOR_NAMES = [
  "Andrea Carolina Matajira Pabon", "Ana Milena Cardozo Ortiz _ Viviana Monsalve",
  "Ana Milena Cardozo y Germán Pardo Torres", "Angela Rincón y Elizabeth Cortés",
  "Elizabeth Cortés & Milton Galvis", "Angela Rincón y Edgar Carrillo",
  "Alejandro Patiño y Elizabeth Cortés", "Alejandro Patiño",
  "Angela Rincón, Luis Bernal y Elizabeth Cortés", "Leopoldo Gonzalez _ Edgar Carrillo",
  "Carlos Mario Alarcón", "Ana Milena Cardozo y Natalia Cabrera Claros",
].sort();

const ANALYSIS_NAMES = [
  "Seccion Delgada", "Dataciones Radiometricas", "Analisis Macro", "Bioestratigrafia",
].sort();

export const fixtures: Row[] = [];
for (let i = 0; i < 99; i += 1) {
  const rock = i < 40 ? "Granito" : "Esquisto";
  const collector =
    i < 30 ? "Andrea Carolina Matajira Pabon" : i < 60 ? "Ana Milena Cardozo Ortiz _ Viviana Monsalve" : null;
  const analysis = i < 60 ? "Seccion Delgada" : "Analisis Macro";
  fixtures.push({
    id: i + 1,
    igm: `IGM${pad4(i)}`,
    codigo_muestra: i === 1 ? "ACM0398p" : `SMPL${pad4(i)}`,
    nombre_estacion: `Estacion ${i}`,
    estacion_companero: i % 10 === 0 ? `Companero ${i}` : null,
    simbolo_ug: null,
    ug_mapa: i < 40 ? "Batolito de Santa Marta" : "Esquistos del Gaira",
    descripcion_muestra:
      i === 0
        ? `Afloramiento "roca", con venas tafoni`
        : i < 5
          ? `Muestra con venas tafoni en ${i}`
          : `Muestra descripcion ${i}`,
    localizacion: i === 0 ? "Bogotá, D.C." : `Localidad ${i}`,
    plancha: i < 5 ? "11IVC" : "12ABC",
    norte: 1000 + i,
    este: 2000 + i,
    altura: 50 + i,
    fecha: i < 5 ? "2019-11-03" : "2021-05-20",
    existe_muestra: i === 5 ? true : null,
    nombre_roca: rock,
    nombre_colector: collector,
    tipo_analisis: analysis,
    rock_key: keyOf(rock),
    collector_key: collector === null ? null : keyOf(collector),
    analysis_key: keyOf(analysis),
  });
}

export const metaRocks = ROCK_NAMES.map((name, i) => ({ id: i + 1, name, normalized_key: keyOf(name) }));
export const metaCollectors = COLLECTOR_NAMES.map((name, i) => ({ id: i + 1, name, normalized_key: keyOf(name) }));
export const metaAnalyses = ANALYSIS_NAMES.map((name, i) => ({ id: i + 1, name, normalized_key: keyOf(name) }));

const stripLike = (p: unknown): string => {
  let s = String(p);
  if (s.startsWith("%") && s.endsWith("%") && s.length >= 2) s = s.slice(1, -1);
  return s.replace(/\\%/g, "%").replace(/\\_/g, "_").replace(/\\\\/g, "\\").toLowerCase();
};

/**
 * Map SQL placeholders to the fixed 9-slot filter order (code, rock, unit,
 * collector, analysis, plancha, dateFrom, dateTo, q). The route only pushes
 * params for present filters, so the mock derives each filter's param by
 * parsing its placeholder number out of the WHERE clause.
 */
const extractFilters = (sql: string, params: unknown[]): (unknown | undefined)[] => {
  const whereStart = sql.indexOf("WHERE");
  const limitStart = sql.indexOf("LIMIT");
  const where =
    whereStart < 0
      ? ""
      : sql.slice(whereStart + 5, limitStart < 0 ? undefined : limitStart);
  const filters: (unknown | undefined)[] = new Array(9).fill(undefined);
  const grab = (re: RegExp, slot: number) => {
    const m = re.exec(where);
    if (m !== null) filters[slot] = params[Number(m[1]) - 1];
  };
  grab(/lower\(s\.codigo_muestra\) = lower\(\$(\d+)\)/, 0);
  grab(/r\.normalized_key = \$(\d+)/, 1);
  grab(/s\.ug_mapa ILIKE \$(\d+)/, 2);
  grab(/c\.normalized_key = \$(\d+)/, 3);
  grab(/a\.normalized_key = \$(\d+)/, 4);
  grab(/s\.plancha ILIKE \$(\d+)/, 5);
  grab(/s\.fecha >= \$(\d+)/, 6);
  grab(/s\.fecha <= \$(\d+)/, 7);
  grab(/s\.descripcion_muestra ILIKE \$(\d+)/, 8);
  return filters;
};

const applyFilters = (rows: Row[], params: unknown[]): Row[] => {
  let out = rows;
  if (params[0] !== undefined) {
    out = out.filter((r) => r.codigo_muestra.toLowerCase() === String(params[0]).toLowerCase());
  }
  if (params[1] !== undefined) out = out.filter((r) => r.rock_key === params[1]);
  if (params[2] !== undefined) {
    const needle = stripLike(params[2]);
    out = out.filter(
      (r) =>
        String(r.ug_mapa ?? "").toLowerCase().includes(needle) ||
        String(r.simbolo_ug ?? "").toLowerCase().includes(needle),
    );
  }
  if (params[3] !== undefined) out = out.filter((r) => r.collector_key === params[3]);
  if (params[4] !== undefined) out = out.filter((r) => r.analysis_key === params[4]);
  if (params[5] !== undefined) out = out.filter((r) => String(r.plancha).toLowerCase().includes(stripLike(params[5])));
  if (params[6] !== undefined) out = out.filter((r) => String(r.fecha) >= String(params[6]));
  if (params[7] !== undefined) out = out.filter((r) => String(r.fecha) <= String(params[7]));
  if (params[8] !== undefined) {
    const needle = stripLike(params[8]);
    out = out.filter(
      (r) =>
        String(r.descripcion_muestra).toLowerCase().includes(needle) ||
        String(r.localizacion).toLowerCase().includes(needle),
    );
  }
  return out;
};

const sorted = (rows: Row[]) =>
  [...rows].sort((a, b) => a.codigo_muestra.localeCompare(b.codigo_muestra));

const byCode = (rows: Row[], code: string) =>
  rows.find((r) => r.codigo_muestra.toLowerCase() === code.toLowerCase());

export const lastQueries: { sql: string; params: unknown[] }[] = [];
const record = (sql: string, params: unknown[]) => {
  lastQueries.push({ sql, params });
  if (lastQueries.length > 50) lastQueries.shift();
};

const lookupId = (table: string, key: string): number => {
  if (table === "rock_types") return key === "granito" ? 1 : key === "esquisto" ? 2 : 3;
  if (table === "analysis_types") {
    if (key === "seccion delgada") return 4;
    if (key === "dataciones radiometricas") return 3;
    if (key === "bioestratigrafia") return 2;
    return 1;
  }
  return 1;
};

const idToName = (table: "rock" | "analysis" | "collector", id: number): string | null => {
  if (table === "rock") return id === 1 ? "Granito" : id === 2 ? "Esquisto" : "Otra roca";
  if (table === "analysis") {
    return id === 4 ? "Seccion Delgada" : id === 3 ? "Dataciones Radiometricas" : id === 2 ? "Bioestratigrafia" : "Analisis Macro";
  }
  return "Andrea Carolina Matajira Pabon";
};

export const handleQuery = (sql: string, params: unknown[] = []) => {
  record(sql, params);

  if (sql.startsWith("INSERT INTO samples")) {
    const code = String(params[1] ?? "");
    if (code.toLowerCase() === "acm0398p") {
      return Promise.reject(Object.assign(new Error("duplicate key"), { code: "23505" }));
    }
    const row: Row = {
      id: 1000 + fixtures.length,
      igm: params[0],
      codigo_muestra: code,
      nombre_estacion: params[2],
      estacion_companero: params[3],
      simbolo_ug: params[4],
      ug_mapa: params[5],
      descripcion_muestra: params[6],
      localizacion: params[7],
      plancha: params[8],
      norte: params[9],
      este: params[10],
      altura: params[11],
      fecha: params[12],
      nombre_colector: idToName("collector", Number(params[13])),
      existe_muestra: params[14],
      nombre_roca: idToName("rock", Number(params[15])),
      tipo_analisis: idToName("analysis", Number(params[16])),
      rock_key: keyOf(String(idToName("rock", Number(params[15])))),
      collector_key: keyOf(String(idToName("collector", Number(params[13])))),
      analysis_key: keyOf(String(idToName("analysis", Number(params[16])))),
    };
    fixtures.push(row);
    return Promise.resolve({ rows: [], rowCount: 1 });
  }

  if (sql.includes("SELECT id FROM")) {
    const m = /FROM (\w+)/.exec(sql);
    const table = m?.[1] ?? "";
    const key = String(params[0] ?? "");
    const id = lookupId(table, key);
    return Promise.resolve({ rows: [{ id }] });
  }

  if (sql.includes("BEGIN") || sql.includes("COMMIT") || sql.includes("ROLLBACK")) {
    return Promise.resolve({ rows: [], rowCount: 0 });
  }

  if (sql.includes("count(*)")) {
    return Promise.resolve({ rows: [{ n: applyFilters(fixtures, extractFilters(sql, params)).length }] });
  }

  if (/WHERE lower\(s\.codigo_muestra\) = lower\(\$1\)\s*$/.test(sql)) {
    const row = byCode(fixtures, String(params[0] ?? ""));
    return Promise.resolve({ rows: row === undefined ? [] : [row] });
  }

  if (sql.includes("FROM rock_types") || sql.includes("FROM collectors") || sql.includes("FROM analysis_types")) {
    if (sql.includes("rock_types")) return Promise.resolve({ rows: metaRocks });
    if (sql.includes("collectors")) return Promise.resolve({ rows: metaCollectors });
    return Promise.resolve({ rows: metaAnalyses });
  }

  // List / export: every other SELECT over samples.
  const filtered = applyFilters(fixtures, extractFilters(sql, params));
  if (sql.includes("LIMIT")) {
    const limit = Number(/LIMIT (\d+)/.exec(sql)?.[1] ?? 25);
    const offset = Number(/OFFSET (\d+)/.exec(sql)?.[1] ?? 0);
    return Promise.resolve({ rows: sorted(filtered).slice(offset, offset + limit) });
  }
  return Promise.resolve({ rows: sorted(filtered) });
};

export class MockPool {
  query(sql: string, params?: unknown[]) {
    return handleQuery(sql, params ?? []);
  }
  connect() {
    return Promise.resolve({ query: handleQuery, release: () => {} });
  }
}