// Shell del SPA (design D1/D4): consulta + registro admin. Carga los
// catálogos de /api/meta, ejecuta búsquedas paginadas, exporta CSV y maneja
// el registro de nuevas muestras.
import { useCallback, useEffect, useState } from "react";
import type { MetaResponse, Sample, SampleFilters } from "./types";
import { exportCsv, getMeta, listSamples } from "./services/api";
import FilterBar from "./components/FilterBar";
import SampleTable from "./components/SampleTable";
import RegistrationForm from "./components/RegistrationForm";

const PAGE_SIZE = 25;

export default function App() {
  const [meta, setMeta] = useState<MetaResponse | null>(null);
  const [filters, setFilters] = useState<SampleFilters>({ pageSize: PAGE_SIZE });
  const [samples, setSamples] = useState<Sample[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMeta()
      .then(setMeta)
      .catch(() => setError("No se pudo cargar la metadata del catálogo."));
  }, []);

  const load = useCallback(async (nextFilters: SampleFilters) => {
    setLoading(true);
    setError(null);
    try {
      const result = await listSamples(nextFilters);
      setSamples(result.data);
      setTotal(result.total);
      setPage(result.page);
      setFilters({ ...nextFilters, pageSize: PAGE_SIZE });
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar las muestras.");
      setSamples([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load({ page: 1, pageSize: PAGE_SIZE });
  }, [load]);

  function handleSearch(next: SampleFilters) {
    void load({ ...next, page: 1, pageSize: PAGE_SIZE });
  }

  function handlePageChange(nextPage: number) {
    void load({ ...filters, page: nextPage, pageSize: PAGE_SIZE });
  }

  function handleExport() {
    void exportCsv({ ...filters, pageSize: PAGE_SIZE });
  }

  function handleRegistered() {
    // recarga la página actual para reflejar la nueva muestra
    void load({ ...filters, page, pageSize: PAGE_SIZE });
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="text-xl font-bold text-slate-800">Geosamples — catálogo de muestras INVEMAR</h1>
          <p className="text-sm text-slate-500">
            {meta === null ? "Cargando metadata…" : `${meta.constants.proyecto} (${meta.constants.sistemaCoordenadas})`}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" aria-label="Filtros">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Filtros</h2>
            <button
              type="button"
              onClick={handleExport}
              disabled={loading}
              className="rounded bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
              data-testid="export-button"
            >
              Exportar CSV
            </button>
          </div>
          <FilterBar
            filters={filters}
            rockTypes={meta?.rockTypes ?? []}
            collectors={meta?.collectors ?? []}
            analysisTypes={meta?.analysisTypes ?? []}
            onSearch={handleSearch}
          />
        </section>

        {error !== null && (
          <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700" data-testid="app-error">
            {error}
          </div>
        )}

        <section aria-label="Resultados">
          {loading ? (
            <div className="rounded border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Cargando muestras…</div>
          ) : (
            <SampleTable
              samples={samples}
              total={total}
              page={page}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" aria-label="Registro">
          <RegistrationForm
            rockTypes={meta?.rockTypes ?? []}
            collectors={meta?.collectors ?? []}
            analysisTypes={meta?.analysisTypes ?? []}
            onRegistered={handleRegistered}
          />
        </section>
      </main>
    </div>
  );
}