// Prueba de integración del shell: carga inicial, búsqueda con filtros,
// exportación CSV y refresco tras registrar una muestra.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import type { Sample } from "./types";

vi.mock("./services/api", () => {
  class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  }
  return {
    ApiError,
    createSample: vi.fn(),
    setAuthHeader: vi.fn(),
    getAuthHeader: vi.fn(() => null),
    clearAuthHeader: vi.fn(),
    getSample: vi.fn(),
    getMeta: vi.fn(async () => ({
      rockTypes: [
        { id: 1, name: "Granito", normalizedKey: "granito" },
        { id: 2, name: "Esquisto", normalizedKey: "esquisto" },
      ],
      collectors: [
        { id: 1, name: "Andrea Carolina Matajira Pabon", normalizedKey: "andrea carolina matajira pabon" },
      ],
      analysisTypes: [
        { id: 1, name: "Seccion Delgada", normalizedKey: "seccion delgada" },
        { id: 2, name: "Analisis Macro", normalizedKey: "analisis macro" },
      ],
      constants: {
        sistemaCoordenadas: "Magna Colombia Bogotá",
        proyecto: "Investigación Maritima, Costera e Insular",
      },
    })),
    listSamples: vi.fn(),
    exportCsv: vi.fn(async () => {}),
  };
});

// eslint-disable-next-line import/no-extraneous-dependencies
import { createSample, exportCsv, listSamples } from "./services/api";

const SAMPLE: Sample = {
  id: 1,
  igm: "IGM0000",
  codigoMuestra: "ACM0398p",
  nombreEstacion: "Estacion 1",
  estacionCompanero: null,
  simboloUG: null,
  ugMapa: "Batolito de Santa Marta",
  descripcionMuestra: "Afloramiento con venas tafoni",
  nombreRoca: "Granito",
  localizacion: "Santa Marta",
  plancha: "11IVC",
  norte: 1000,
  este: 2000,
  altura: 50,
  fecha: "2019-11-03",
  nombreColector: "Andrea Carolina Matajira Pabon",
  existeMuestra: null,
  tipoAnalisis: "Seccion Delgada",
};

describe("App", () => {
  beforeEach(() => {
    vi.mocked(listSamples).mockReset();
    vi.mocked(createSample).mockReset();
    vi.mocked(exportCsv).mockReset();
  });

  it("loads metadata and the first page of samples", async () => {
    vi.mocked(listSamples).mockResolvedValue({ data: [SAMPLE], total: 1, page: 1, pageSize: 25 });
    render(<App />);

    expect(await screen.findByText("ACM0398p")).toBeInTheDocument();
    expect(
      await screen.findByText("Investigación Maritima, Costera e Insular (Magna Colombia Bogotá)"),
    ).toBeInTheDocument();
    expect(listSamples).toHaveBeenCalledWith({ page: 1, pageSize: 25 });
  });

  it("runs a filtered search and passes the filters to the API", async () => {
    const user = userEvent.setup();
    vi.mocked(listSamples).mockResolvedValue({ data: [SAMPLE], total: 1, page: 1, pageSize: 25 });
    render(<App />);
    await screen.findByText("ACM0398p");

    await user.type(screen.getByPlaceholderText("p. ej. ACM0398p"), "acm0398P");
    await user.selectOptions(screen.getByLabelText("Tipo de roca"), "Granito");
    await user.click(screen.getByRole("button", { name: "Buscar" }));

    await waitFor(() => expect(listSamples).toHaveBeenCalledTimes(2));
    const lastCall = vi.mocked(listSamples).mock.calls.at(-1)![0];
    expect(lastCall).toMatchObject({ code: "acm0398P", rock: "Granito", page: 1, pageSize: 25 });
  });

  it("exports the current filters as CSV", async () => {
    const user = userEvent.setup();
    vi.mocked(listSamples).mockResolvedValue({ data: [SAMPLE], total: 1, page: 1, pageSize: 25 });
    render(<App />);
    await screen.findByText("ACM0398p");

    await user.click(screen.getByTestId("export-button"));

    await waitFor(() => expect(exportCsv).toHaveBeenCalledTimes(1));
    expect(vi.mocked(exportCsv).mock.calls[0][0]).toMatchObject({ page: 1, pageSize: 25 });
  });

  it("refreshes the list after a successful registration", async () => {
    const user = userEvent.setup();
    vi.mocked(listSamples).mockResolvedValue({ data: [SAMPLE], total: 1, page: 1, pageSize: 25 });
    vi.mocked(createSample).mockResolvedValue(SAMPLE);
    render(<App />);
    await screen.findByText("ACM0398p");

    await user.type(screen.getByLabelText("Código *"), "ZZX9999");
    await user.type(screen.getByLabelText("Nombre de estación *"), "Estacion Nueva");
    await user.selectOptions(screen.getByLabelText("Tipo de roca *"), "Granito");
    await user.selectOptions(screen.getByLabelText("Tipo de análisis *"), "Seccion Delgada");
    await user.type(screen.getByLabelText("Fecha (AAAA-MM-DD) *"), "2024-05-01");
    await user.click(screen.getByRole("button", { name: "Registrar muestra" }));

    await screen.findByTestId("reg-success");
    await waitFor(() => expect(listSamples).toHaveBeenCalledTimes(2));
  });
});