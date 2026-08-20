// Barra de filtros de consulta (spec sample-query): filtros por código, roca,
// unidad, colector, análisis, plancha, rango de fechas y texto libre. Los
// selectores de roca/colector/análisis se alimentan del catálogo de /api/meta.
import { useState, type FormEvent } from "react";
import type { CanonicalEntry, SampleFilters } from "../types";

export type FilterBarProps = {
  filters: SampleFilters;
  rockTypes: CanonicalEntry[];
  collectors: CanonicalEntry[];
  analysisTypes: CanonicalEntry[];
  onSearch: (filters: SampleFilters) => void;
};

const inputClass =
  "w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-sky-500 focus:outline-none";

export default function FilterBar({
  filters,
  rockTypes,
  collectors,
  analysisTypes,
  onSearch,
}: FilterBarProps) {
  const [code, setCode] = useState(filters.code ?? "");
  const [rock, setRock] = useState(filters.rock ?? "");
  const [unit, setUnit] = useState(filters.unit ?? "");
  const [collector, setCollector] = useState(filters.collector ?? "");
  const [analysis, setAnalysis] = useState(filters.analysis ?? "");
  const [plancha, setPlancha] = useState(filters.plancha ?? "");
  const [dateFrom, setDateFrom] = useState(filters.dateFrom ?? "");
  const [dateTo, setDateTo] = useState(filters.dateTo ?? "");
  const [q, setQ] = useState(filters.q ?? "");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSearch({
      code: code.trim() === "" ? undefined : code.trim(),
      rock: rock === "" ? undefined : rock,
      unit: unit.trim() === "" ? undefined : unit.trim(),
      collector: collector === "" ? undefined : collector,
      analysis: analysis === "" ? undefined : analysis,
      plancha: plancha.trim() === "" ? undefined : plancha.trim(),
      dateFrom: dateFrom === "" ? undefined : dateFrom,
      dateTo: dateTo === "" ? undefined : dateTo,
      q: q.trim() === "" ? undefined : q.trim(),
    });
  }

  function handleClear() {
    setCode("");
    setRock("");
    setUnit("");
    setCollector("");
    setAnalysis("");
    setPlancha("");
    setDateFrom("");
    setDateTo("");
    setQ("");
    onSearch({});
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-4" data-testid="filter-bar">
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Código</span>
        <input className={inputClass} value={code} onChange={(e) => setCode(e.target.value)} placeholder="p. ej. ACM0398p" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Tipo de roca</span>
        <select className={inputClass} value={rock} onChange={(e) => setRock(e.target.value)}>
          <option value="">Cualquiera</option>
          {rockTypes.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Unidad geológica</span>
        <input className={inputClass} value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="p. ej. Batolito de Santa Marta" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Colector</span>
        <select className={inputClass} value={collector} onChange={(e) => setCollector(e.target.value)}>
          <option value="">Cualquiera</option>
          {collectors.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Análisis</span>
        <select className={inputClass} value={analysis} onChange={(e) => setAnalysis(e.target.value)}>
          <option value="">Cualquiera</option>
          {analysisTypes.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Plancha</span>
        <input className={inputClass} value={plancha} onChange={(e) => setPlancha(e.target.value)} placeholder="p. ej. 11IVC" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Fecha desde</span>
        <input type="date" className={inputClass} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Fecha hasta</span>
        <input type="date" className={inputClass} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      </label>
      <label className="block text-sm md:col-span-3">
        <span className="mb-1 block font-medium text-slate-700">Búsqueda libre</span>
        <input className={inputClass} value={q} onChange={(e) => setQ(e.target.value)} placeholder="La descripción o la localidad contiene…" />
      </label>
      <div className="flex items-end gap-2">
        <button
          type="submit"
          className="rounded bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}