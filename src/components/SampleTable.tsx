// Tabla de resultados (spec sample-query): filas de muestras, paginación
// estable y estado vacío cuando no hay coincidencias.
import type { Sample } from "../types";

export type SampleTableProps = {
  samples: Sample[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

const cellClass = "px-3 py-2 text-sm";
const headClass = "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";

export default function SampleTable({ samples, total, page, pageSize, onPageChange }: SampleTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (samples.length === 0) {
    return (
      <div className="rounded border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500" data-testid="empty-state">
        No se encontraron muestras con los filtros actuales.
      </div>
    );
  }

  return (
    <div data-testid="sample-table">
      <div className="overflow-x-auto rounded border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className={headClass}>Código</th>
              <th className={headClass}>Tipo de roca</th>
              <th className={headClass}>Unidad</th>
              <th className={headClass}>Fecha</th>
              <th className={headClass}>Localidad</th>
              <th className={headClass}>Análisis</th>
              <th className={headClass}>Colector</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {samples.map((sample) => (
              <tr key={sample.id} className="hover:bg-slate-50">
                <td className={`${cellClass} font-medium text-sky-700`}>{sample.codigoMuestra}</td>
                <td className={cellClass}>{sample.nombreRoca}</td>
                <td className={cellClass}>{sample.ugMapa ?? sample.simboloUG ?? "—"}</td>
                <td className={cellClass}>{sample.fecha}</td>
                <td className={cellClass}>{sample.localizacion}</td>
                <td className={cellClass}>{sample.tipoAnalisis}</td>
                <td className={cellClass}>{sample.nombreColector ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
        <span data-testid="total-count">
          {total} muestra{total === 1 ? "" : "s"} — página {page} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="rounded border border-slate-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="rounded border border-slate-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}