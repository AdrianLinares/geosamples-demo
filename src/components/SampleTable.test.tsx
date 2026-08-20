// Pruebas de la tabla de resultados: filas, estado vacío y paginación.
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SampleTable from "./SampleTable";
import type { Sample } from "../types";

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

describe("SampleTable", () => {
  it("renders sample rows", () => {
    render(
      <SampleTable samples={[SAMPLE]} total={1} page={1} pageSize={25} onPageChange={vi.fn()} />,
    );
    expect(screen.getByText("ACM0398p")).toBeInTheDocument();
    expect(screen.getByText("Granito")).toBeInTheDocument();
    expect(screen.getByText("2019-11-03")).toBeInTheDocument();
    expect(screen.getByText("1 muestra — página 1 de 1")).toBeInTheDocument();
  });

  it("shows the empty state when there are no results", () => {
    render(
      <SampleTable samples={[]} total={0} page={1} pageSize={25} onPageChange={vi.fn()} />,
    );
    expect(screen.getByTestId("empty-state")).toHaveTextContent(
      "No se encontraron muestras con los filtros actuales.",
    );
  });

  it("disables Previous on page 1 and Next on the last page", () => {
    const { rerender } = render(
      <SampleTable samples={[SAMPLE]} total={99} page={1} pageSize={25} onPageChange={vi.fn()} />,
    );
    expect(screen.getByText("99 muestras — página 1 de 4")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeEnabled();

    rerender(
      <SampleTable samples={[SAMPLE]} total={99} page={4} pageSize={25} onPageChange={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeDisabled();
  });

  it("requests the next page when Next is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <SampleTable samples={[SAMPLE]} total={99} page={2} pageSize={25} onPageChange={onPageChange} />,
    );
    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});