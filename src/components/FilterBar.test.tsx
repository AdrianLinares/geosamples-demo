// Pruebas de la barra de filtros: envío de filtros al buscar y reseteo al limpiar.
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterBar from "./FilterBar";
import type { CanonicalEntry } from "../types";

const ROCKS: CanonicalEntry[] = [
  { id: 1, name: "Granito", normalizedKey: "granito" },
  { id: 2, name: "Esquisto", normalizedKey: "esquisto" },
];
const COLLECTORS: CanonicalEntry[] = [
  { id: 1, name: "Andrea Carolina Matajira Pabon", normalizedKey: "andrea carolina matajira pabon" },
];
const ANALYSES: CanonicalEntry[] = [
  { id: 1, name: "Seccion Delgada", normalizedKey: "seccion delgada" },
];

describe("FilterBar", () => {
  it("submits the entered filters via onSearch", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(
      <FilterBar
        filters={{}}
        rockTypes={ROCKS}
        collectors={COLLECTORS}
        analysisTypes={ANALYSES}
        onSearch={onSearch}
      />,
    );

    await user.type(screen.getByPlaceholderText("p. ej. ACM0398p"), "acm0398P");
    await user.selectOptions(screen.getByLabelText("Tipo de roca"), "Granito");
    await user.type(screen.getByPlaceholderText("p. ej. 11IVC"), "11IVC");
    await user.click(screen.getByRole("button", { name: "Buscar" }));

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({ code: "acm0398P", rock: "Granito", plancha: "11IVC" }),
    );
    expect(onSearch.mock.calls[0][0].unit).toBeUndefined();
  });

  it("clears all filters and triggers an empty search", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(
      <FilterBar
        filters={{ code: "acm" }}
        rockTypes={ROCKS}
        collectors={COLLECTORS}
        analysisTypes={ANALYSES}
        onSearch={onSearch}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Limpiar" }));
    expect(onSearch).toHaveBeenCalledWith({});
  });

  it("offers canonical options in the catalog selects", () => {
    render(
      <FilterBar
        filters={{}}
        rockTypes={ROCKS}
        collectors={COLLECTORS}
        analysisTypes={ANALYSES}
        onSearch={vi.fn()}
      />,
    );
    expect(screen.getByRole("option", { name: "Granito" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Seccion Delgada" })).toBeInTheDocument();
  });
});