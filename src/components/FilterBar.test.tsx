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

  it("renders the four bounding-box inputs", () => {
    render(
      <FilterBar
        filters={{}}
        rockTypes={ROCKS}
        collectors={COLLECTORS}
        analysisTypes={ANALYSES}
        onSearch={vi.fn()}
      />,
    );
    expect(screen.getByPlaceholderText("1000")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("1010")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("2000")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("2010")).toBeInTheDocument();
  });

  it("serializes bounding-box values on submit", async () => {
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

    await user.type(screen.getByPlaceholderText("1000"), "1005");
    await user.type(screen.getByPlaceholderText("1010"), "1010");
    await user.type(screen.getByPlaceholderText("2000"), "2000");
    await user.type(screen.getByPlaceholderText("2010"), "2005");
    await user.click(screen.getByRole("button", { name: "Buscar" }));

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        norteMin: 1005,
        norteMax: 1010,
        esteMin: 2000,
        esteMax: 2005,
      }),
    );
  });

  it("omits empty bounding-box values from the submitted filters", async () => {
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

    await user.type(screen.getByPlaceholderText("1000"), "1005");
    await user.click(screen.getByRole("button", { name: "Buscar" }));

    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({ norteMin: 1005 }),
    );
    const submitted = onSearch.mock.calls[0][0] as { norteMax?: number; esteMin?: number; esteMax?: number };
    expect(submitted.norteMax).toBeUndefined();
    expect(submitted.esteMin).toBeUndefined();
    expect(submitted.esteMax).toBeUndefined();
  });

  it("clears bounding-box inputs and triggers an empty search", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(
      <FilterBar
        filters={{ norteMin: 1005, norteMax: 1010, esteMin: 2000, esteMax: 2005 }}
        rockTypes={ROCKS}
        collectors={COLLECTORS}
        analysisTypes={ANALYSES}
        onSearch={onSearch}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Limpiar" }));
    expect(onSearch).toHaveBeenCalledWith({});
    expect(screen.getByPlaceholderText("1000")).toHaveValue(null);
    expect(screen.getByPlaceholderText("1010")).toHaveValue(null);
    expect(screen.getByPlaceholderText("2000")).toHaveValue(null);
    expect(screen.getByPlaceholderText("2010")).toHaveValue(null);
  });
});