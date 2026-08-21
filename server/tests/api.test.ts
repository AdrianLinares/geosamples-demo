// API contract tests (specs admin-auth, sample-query, sample-registration,
// csv-export). The pg module is mocked (see pg-mock.ts: 99 fixture rows) so the
// app runs end-to-end through supertest without a live Postgres.

import { describe, expect, it, beforeAll, vi } from "vitest";
import request from "supertest";
import { lastQueries } from "./pg-mock.js";

vi.mock("pg", async () => ({ Pool: (await import("./pg-mock.js")).MockPool }));

// ---------------------------------------------------------------------------
// Env + app boot (env MUST be set before the app is imported).
// ---------------------------------------------------------------------------

const ADMIN_HASH = "$2b$10$eze.Lswy.UpwvMasq.GCCO1qfz5WRrPrZhXx9QfKa9xrzrOsQnMuW"; // "admin"
const SECOND_ADMIN_HASH = "$2b$10$Q52FJdcUetQ54OLcNFlH5ONm6k/L8e/s6QsYkXAJuNXTVzCcRVVtG"; // "second-pass"

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.AUTH_READS = "false";
  process.env.ADMIN_USERS = `admin:${ADMIN_HASH}`;
  process.env.DATABASE_URL = "postgres://mock:mock@localhost:5432/geosamples";
  process.env.TZ = "America/Bogota";
});

const { app } = await import("../src/index.js");

const authHeader = (user: string, pass: string) =>
  `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;

const UNATHORIZED_BODY = { error: "Unauthorized" };

// ---------------------------------------------------------------------------
// Auth (spec admin-auth)
// ---------------------------------------------------------------------------

describe("auth", () => {
  it("returns the identical 401 for missing credentials on a protected route", async () => {
    const res = await request(app).post("/api/samples").send({});
    expect(res.status).toBe(401);
    expect(res.body).toEqual(UNATHORIZED_BODY);
    expect(res.headers["www-authenticate"]).toMatch(/^Basic realm="geosamples"$/);
  });

  it("returns the identical 401 for invalid credentials on a protected route", async () => {
    const res = await request(app).post("/api/samples").set("Authorization", authHeader("admin", "wrong-password")).send({});
    expect(res.status).toBe(401);
    expect(res.body).toEqual(UNATHORIZED_BODY);
    expect(res.headers["www-authenticate"]).toMatch(/^Basic realm="geosamples"$/);
  });

  it("requires auth on read routes when AUTH_READS=true", async () => {
    process.env.AUTH_READS = "true";
    try {
      const denied = await request(app).get("/api/samples");
      expect(denied.status).toBe(401);
      expect(denied.body).toEqual(UNATHORIZED_BODY);
      const ok = await request(app).get("/api/samples").set("Authorization", authHeader("admin", "admin"));
      expect(ok.status).toBe(200);
    } finally {
      process.env.AUTH_READS = "false";
    }
  });

  it("lets anonymous reads through when AUTH_READS=false (public reads)", async () => {
    const res = await request(app).get("/api/samples");
    expect(res.status).toBe(200);
  });

  it("accepts valid admin credentials", async () => {
    const res = await request(app).get("/api/samples").set("Authorization", authHeader("admin", "admin"));
    expect(res.status).toBe(200);
  });

  it("supports multiple admins in ADMIN_USERS (R3: multiple admins supported)", async () => {
    const saved = process.env.ADMIN_USERS;
    process.env.ADMIN_USERS = `admin:${ADMIN_HASH},alice:${SECOND_ADMIN_HASH}`;
    try {
      // A 400 (validation) on the protected POST proves authentication passed.
      const resAdmin = await request(app).post("/api/samples").set("Authorization", authHeader("admin", "admin")).send({});
      expect(resAdmin.status).toBe(400);
      const resAlice = await request(app).post("/api/samples").set("Authorization", authHeader("alice", "second-pass")).send({});
      expect(resAlice.status).toBe(400);
      // A wrong password for user #1 must NOT authenticate as user #2.
      const resWrong = await request(app).post("/api/samples").set("Authorization", authHeader("admin", "second-pass")).send({});
      expect(resWrong.status).toBe(401);
      expect(resWrong.body).toEqual(UNATHORIZED_BODY);
      expect(resWrong.headers["www-authenticate"]).toMatch(/^Basic realm="geosamples"$/);
    } finally {
      process.env.ADMIN_USERS = saved;
    }
  });

  it("fails closed when ADMIN_USERS is unset or empty (R3: empty configuration fails closed)", async () => {
    const saved = process.env.ADMIN_USERS;
    try {
      delete process.env.ADMIN_USERS;
      const unset = await request(app).post("/api/samples").set("Authorization", authHeader("admin", "admin")).send({});
      expect(unset.status).toBe(401);
      expect(unset.body).toEqual(UNATHORIZED_BODY);
      expect(unset.headers["www-authenticate"]).toMatch(/^Basic realm="geosamples"$/);

      process.env.ADMIN_USERS = "";
      const empty = await request(app).post("/api/samples").set("Authorization", authHeader("admin", "admin")).send({});
      expect(empty.status).toBe(401);
      expect(empty.body).toEqual(UNATHORIZED_BODY);
      expect(empty.headers["www-authenticate"]).toMatch(/^Basic realm="geosamples"$/);
    } finally {
      process.env.ADMIN_USERS = saved;
    }
  });
});

// ---------------------------------------------------------------------------
// Sample query (spec sample-query)
// ---------------------------------------------------------------------------

describe("GET /api/samples", () => {
  it("returns the first page with total", async () => {
    const res = await request(app).get("/api/samples");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(99);
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(25);
    expect(res.body.data).toHaveLength(25);
    expect(res.body.data[0].codigoMuestra).toBe("ACM0398p"); // sorted by code
  });

  it("paginates across all pages", async () => {
    const p1 = await request(app).get("/api/samples?page=1&pageSize=25");
    const p2 = await request(app).get("/api/samples?page=2&pageSize=25");
    const p3 = await request(app).get("/api/samples?page=3&pageSize=25");
    const p4 = await request(app).get("/api/samples?page=4&pageSize=25");
    expect(p1.body.data).toHaveLength(25);
    expect(p2.body.data).toHaveLength(25);
    expect(p3.body.data).toHaveLength(25);
    expect(p4.body.data).toHaveLength(24);
    expect(p1.body.data[0].codigoMuestra).toBe("ACM0398p");
    expect(p4.body.data[23].codigoMuestra).toBe("SMPL0098"); // 99 samples → last page has 24
  });

  it("caps pageSize at 100", async () => {
    const res = await request(app).get("/api/samples?pageSize=500");
    expect(res.status).toBe(200);
    expect(res.body.pageSize).toBe(100);
    expect(res.body.data).toHaveLength(99);
  });

  it("filters by rock", async () => {
    const res = await request(app).get("/api/samples?rock=granito");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(40);
    expect(res.body.data.every((s: { nombreRoca: string }) => s.nombreRoca === "Granito")).toBe(true);
  });

  it("filters by unit (case-insensitive partial)", async () => {
    const res = await request(app).get("/api/samples?unit=bAtOlItO de santa marta");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(40);
  });

  it("combines rock + unit filters", async () => {
    const res = await request(app).get("/api/samples?rock=granito&unit=Batolito de Santa Marta");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(40);
  });

  it("filters by collector canonical name", async () => {
    const res = await request(app).get("/api/samples?collector=Andrea Carolina Matajira Pabon");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(30);
  });

  it("filters by analysis", async () => {
    const res = await request(app).get("/api/samples?analysis=seccion delgada");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(60);
  });

  it("filters by plancha (case-insensitive)", async () => {
    const res = await request(app).get("/api/samples?plancha=11ivc");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(5);
  });

  it("filters by date range", async () => {
    const from = await request(app).get("/api/samples?dateFrom=2020-01-01");
    expect(from.body.total).toBe(94);
    const to = await request(app).get("/api/samples?dateTo=2019-12-31");
    expect(to.body.total).toBe(5);
    const both = await request(app).get("/api/samples?dateFrom=2020-01-01&dateTo=2021-12-31");
    expect(both.body.total).toBe(94);
  });

  it("filters by full-text query on description and location", async () => {
    const res = await request(app).get("/api/samples?q=Tafoni");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(5);
    const none = await request(app).get("/api/samples?q=zzzzz");
    expect(none.status).toBe(200);
    expect(none.body.total).toBe(0);
    expect(none.body.data).toEqual([]);
  });

  it("filters by code case-insensitively without lowering the parameter", async () => {
    const res = await request(app).get("/api/samples?code=acm0398P");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].codigoMuestra).toBe("ACM0398p");
    const countQuery = [...lastQueries].reverse().find((q) => q.sql.includes("count(*)"));
    expect(countQuery?.params[0]).toBe("acm0398P"); // case handled by SQL lower(), not the app
  });

  it("shapes rows to the Sample contract", async () => {
    const res = await request(app).get("/api/samples?pageSize=1");
    const s = res.body.data[0];
    expect(s).toMatchObject({
      id: expect.any(Number),
      codigoMuestra: "ACM0398p",
      nombreRoca: "Granito",
      tipoAnalisis: "Seccion Delgada",
      fecha: "2019-11-03",
      existeMuestra: null,
      nombreColector: "Andrea Carolina Matajira Pabon",
    });
    expect(s.norte).toBe(1001);
  });

  it("filters by north range with inclusive bounds", async () => {
    const res = await request(app).get("/api/samples?norteMin=1005&norteMax=1010");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(6);
    expect(res.body.data.map((s: { norte: number }) => s.norte).sort((a: number, b: number) => a - b)).toEqual([
      1005, 1006, 1007, 1008, 1009, 1010,
    ]);
  });

  it("filters by a single north bound only", async () => {
    const res = await request(app).get("/api/samples?norteMin=1005");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(93);
    expect(res.body.data.every((s: { norte: number | null }) => s.norte !== null && s.norte >= 1005)).toBe(true);
  });

  it("combines bbox with attribute filters", async () => {
    const res = await request(app).get("/api/samples?rock=granito&esteMin=2000&esteMax=2005");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(6);
    expect(res.body.data.every((s: { nombreRoca: string; este: number }) => s.nombreRoca === "Granito" && s.este >= 2000 && s.este <= 2005)).toBe(true);
  });

  it("excludes samples with null coordinates when any bbox bound is present", async () => {
    const all = await request(app).get("/api/samples");
    expect(all.body.total).toBe(99);
    const filtered = await request(app).get("/api/samples?norteMin=1000");
    expect(filtered.body.total).toBe(98);
    expect(filtered.body.data.some((s: { codigoMuestra: string }) => s.codigoMuestra === "SMPL0098")).toBe(false);
  });

  it("rejects an inverted north box with 400", async () => {
    const res = await request(app).get("/api/samples?norteMin=1010&norteMax=1005");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "norteMin must be less than or equal to norteMax" });
  });

  it("rejects an inverted east box with 400", async () => {
    const res = await request(app).get("/api/samples?esteMin=2005&esteMax=2000");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "esteMin must be less than or equal to esteMax" });
  });

  it("accepts equal north bounds", async () => {
    const res = await request(app).get("/api/samples?norteMin=1005&norteMax=1005");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].norte).toBe(1005);
  });
});

// ---------------------------------------------------------------------------
// Lookup by code
// ---------------------------------------------------------------------------

describe("GET /api/samples/:code", () => {
  it("returns the sample for an exact code", async () => {
    const res = await request(app).get("/api/samples/ACM0398p");
    expect(res.status).toBe(200);
    expect(res.body.codigoMuestra).toBe("ACM0398p");
    expect(res.body.nombreRoca).toBe("Granito");
  });

  it("matches case-insensitively", async () => {
    const res = await request(app).get("/api/samples/acm0398P");
    expect(res.status).toBe(200);
    expect(res.body.codigoMuestra).toBe("ACM0398p");
  });

  it("returns 404 for an unknown code", async () => {
    const res = await request(app).get("/api/samples/ZZZ999");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Sample not found" });
  });
});

// ---------------------------------------------------------------------------
// CSV export (spec csv-export)
// ---------------------------------------------------------------------------

describe("GET /api/samples/export", () => {
  it("exports every row with a header line and no BOM", async () => {
    const res = await request(app).get("/api/samples/export");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/^text\/csv/);
    expect(res.text.charCodeAt(0)).not.toBe(0xfeff);
    const lines = res.text.split("\n");
    expect(lines).toHaveLength(100); // 99 rows + header
    expect(lines[0]).toBe(
      "IGM,CodigoMuestra,NombreEstacion,EstacionCompanero,SimboloUG,UGMapa,DescripcionMuestra,NombreRoca,Localizacion,Plancha,Norte,Este,Altura,Fecha,NombreColector,ExisteMuestra,TipoAnalisis",
    );
  });

  it("applies filters and ignores pagination", async () => {
    const res = await request(app).get("/api/samples/export?rock=granito&pageSize=25");
    expect(res.status).toBe(200);
    const lines = res.text.split("\n");
    expect(lines).toHaveLength(41); // 40 rows + header
    expect(lines.slice(1).filter((l: string) => l.includes(",Granito,"))).toHaveLength(40);
  });

  it("quotes fields containing commas, quotes or newlines and doubles inner quotes", async () => {
    const res = await request(app).get("/api/samples/export");
    const lines = res.text.split("\n");
    const row0 = lines.find((l: string) => l.startsWith("IGM0000,"));
    expect(row0).toBe(
      'IGM0000,SMPL0000,Estacion 0,Companero 0,,Batolito de Santa Marta,"Afloramiento ""roca"", con venas tafoni",Granito,"Bogotá, D.C.",11IVC,1000,2000,50,2019-11-03,Andrea Carolina Matajira Pabon,,Seccion Delgada',
    );
  });

  it("emits empty cells for null values", async () => {
    const res = await request(app).get("/api/samples/export");
    const lines = res.text.split("\n");
    const row60 = lines.find((l: string) => l.startsWith("IGM0060,"));
    expect(row60).toMatch(/2021-05-20,,,Analisis Macro$/); // null collector + null existeMuestra
  });

  it("returns only the header when no rows match", async () => {
    const res = await request(app).get("/api/samples/export?q=zzzzz");
    expect(res.status).toBe(200);
    expect(res.text.split("\n")).toHaveLength(1);
  });

  it("limits exported rows by bbox bounds", async () => {
    const res = await request(app).get("/api/samples/export?norteMin=1005&norteMax=1010");
    expect(res.status).toBe(200);
    const lines = res.text.split("\n");
    expect(lines).toHaveLength(7); // 6 data rows + header
    const norteValues = lines
      .slice(1)
      .map((l: string) => Number(l.split(",")[10]))
      .filter((n: number) => !Number.isNaN(n));
    expect(norteValues).toEqual([1005, 1006, 1007, 1008, 1009, 1010]);
  });

  it("rejects an inverted bbox on export with 400", async () => {
    const res = await request(app).get("/api/samples/export?esteMin=2005&esteMax=2000");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "esteMin must be less than or equal to esteMax" });
  });
});

// ---------------------------------------------------------------------------
// Registration (spec sample-registration)
// ---------------------------------------------------------------------------

const VALID_PAYLOAD = {
  igm: "IGMNUEVO",
  codigoMuestra: "NUEVO001",
  nombreEstacion: "Estacion Nueva",
  estacionCompanero: "Companera",
  simboloUG: null,
  ugMapa: "Batolito de Santa Marta",
  descripcionMuestra: "Muestra registrada por API",
  localizacion: "Santa Marta",
  plancha: "11IVC",
  norte: 1234.5,
  este: 9876.5,
  altura: 12,
  fecha: "2024-05-01",
  nombreColector: "Andrea Carolina Matajira Pabon",
  existeMuestra: true,
  nombreRoca: "Granito",
  tipoAnalisis: "Seccion Delgada",
};

describe("POST /api/samples", () => {
  it("rejects with 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/samples")
      .set("Authorization", authHeader("admin", "admin"))
      .send({ ...VALID_PAYLOAD, nombreRoca: undefined });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "NombreRoca is required" });
  });

  it("rejects with 400 for an impossible calendar date", async () => {
    const res = await request(app)
      .post("/api/samples")
      .set("Authorization", authHeader("admin", "admin"))
      .send({ ...VALID_PAYLOAD, fecha: "2024-13-40" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Fecha must be a valid ISO date (YYYY-MM-DD)" });
  });

  it("rejects with 400 for a non-canonical rock", async () => {
    const res = await request(app)
      .post("/api/samples")
      .set("Authorization", authHeader("admin", "admin"))
      .send({ ...VALID_PAYLOAD, nombreRoca: "Basalto" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "NombreRoca is not a canonical rock type" });
  });

  it("rejects with 400 for an unknown analysis type", async () => {
    const res = await request(app)
      .post("/api/samples")
      .set("Authorization", authHeader("admin", "admin"))
      .send({ ...VALID_PAYLOAD, tipoAnalisis: "Petrografia" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "TipoAnalisis must be one of the four canonical analysis types" });
  });

  it("rejects with 400 for a non-canonical collector", async () => {
    const res = await request(app)
      .post("/api/samples")
      .set("Authorization", authHeader("admin", "admin"))
      .send({ ...VALID_PAYLOAD, nombreColector: "Fulano de Tal" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "NombreColector is not a canonical collector" });
  });

  it("creates a sample and returns it with 201", async () => {
    const res = await request(app)
      .post("/api/samples")
      .set("Authorization", authHeader("admin", "admin"))
      .send(VALID_PAYLOAD);
    expect(res.status).toBe(201);
    expect(res.body.codigoMuestra).toBe("NUEVO001");
    expect(res.body.nombreRoca).toBe("Granito");
    expect(res.body.tipoAnalisis).toBe("Seccion Delgada");
    expect(res.body.nombreColector).toBe("Andrea Carolina Matajira Pabon");
    expect(res.body.existeMuestra).toBe(true);
    expect(res.body.fecha).toBe("2024-05-01");

    const list = await request(app).get("/api/samples");
    expect(list.body.total).toBe(100);
  });

  it("returns 409 for a duplicate code (case-insensitive)", async () => {
    const res = await request(app)
      .post("/api/samples")
      .set("Authorization", authHeader("admin", "admin"))
      .send({ ...VALID_PAYLOAD, codigoMuestra: "acm0398p" });
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: "Sample with code acm0398p already exists" });
  });
});

// ---------------------------------------------------------------------------
// Meta + misc
// ---------------------------------------------------------------------------

describe("GET /api/meta", () => {
  it("returns canonical catalogs and project constants", async () => {
    const res = await request(app).get("/api/meta");
    expect(res.status).toBe(200);
    expect(res.body.analysisTypes).toHaveLength(4);
    expect(res.body.analysisTypes.map((a: { name: string }) => a.name)).toEqual([
      "Analisis Macro", "Bioestratigrafia", "Dataciones Radiometricas", "Seccion Delgada",
    ]);
    expect(res.body.rockTypes).toHaveLength(42);
    expect(res.body.collectors).toHaveLength(12);
    expect(res.body.rockTypes.some((r: { name: string }) => r.name === "Granito")).toBe(true);
    expect(res.body.collectors.some((c: { name: string }) => c.name === "Andrea Carolina Matajira Pabon")).toBe(true);
    expect(res.body.constants).toEqual({
      sistemaCoordenadas: "Magna Colombia Bogotá",
      proyecto: "Investigación Maritima, Costera e Insular",
    });
  });
});

describe("misc", () => {
  it("returns 404 JSON for unknown API routes", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not found" });
  });

  it("exposes a health check", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});