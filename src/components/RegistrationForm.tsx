// Formulario de registro de muestras (spec sample-registration + admin-auth):
// validación en cliente, errores 400/409 mostrados inline y flujo de
// credenciales admin (prompt) cuando el backend responde 401.
import { useState, type FormEvent } from "react";
import type { CanonicalEntry, RegistrationPayload, Sample } from "../types";
import { ApiError, createSample as defaultCreateSample, setAuthHeader } from "../services/api";

export type RegistrationFormProps = {
  rockTypes: CanonicalEntry[];
  collectors: CanonicalEntry[];
  analysisTypes: CanonicalEntry[];
  onRegistered: (sample: Sample) => void;
  createSample?: (payload: RegistrationPayload) => Promise<Sample>;
};

type FormState = {
  codigoMuestra: string;
  nombreEstacion: string;
  nombreRoca: string;
  tipoAnalisis: string;
  fecha: string;
  nombreColector: string;
  localizacion: string;
  plancha: string;
  ugMapa: string;
  descripcionMuestra: string;
  norte: string;
  este: string;
  altura: string;
};

const EMPTY_FORM: FormState = {
  codigoMuestra: "",
  nombreEstacion: "",
  nombreRoca: "",
  tipoAnalisis: "",
  fecha: "",
  nombreColector: "",
  localizacion: "",
  plancha: "",
  ugMapa: "",
  descripcionMuestra: "",
  norte: "",
  este: "",
  altura: "",
};

const inputClass =
  "w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-sky-500 focus:outline-none";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export default function RegistrationForm({
  rockTypes,
  collectors,
  analysisTypes,
  onRegistered,
  createSample = defaultCreateSample,
}: RegistrationFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [needsCredentials, setNeedsCredentials] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function setField<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setServerError(null);
    setSuccess(null);
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (form.codigoMuestra.trim() === "") next.codigoMuestra = "El código es obligatorio.";
    if (form.nombreEstacion.trim() === "") next.nombreEstacion = "El nombre de la estación es obligatorio.";
    if (form.nombreRoca === "") next.nombreRoca = "El tipo de roca es obligatorio.";
    if (form.tipoAnalisis === "") next.tipoAnalisis = "El tipo de análisis es obligatorio.";
    if (!ISO_DATE.test(form.fecha)) next.fecha = "La fecha debe tener el formato AAAA-MM-DD.";
    return next;
  }

  function toPayload(): RegistrationPayload {
    const num = (value: string): number | null => {
      const trimmed = value.trim();
      if (trimmed === "") return null;
      const parsed = Number(trimmed);
      return Number.isNaN(parsed) ? null : parsed;
    };
    return {
      codigoMuestra: form.codigoMuestra.trim(),
      nombreEstacion: form.nombreEstacion.trim(),
      nombreRoca: form.nombreRoca,
      tipoAnalisis: form.tipoAnalisis,
      fecha: form.fecha,
      nombreColector: form.nombreColector === "" ? null : form.nombreColector,
      localizacion: form.localizacion.trim(),
      plancha: form.plancha.trim(),
      ugMapa: form.ugMapa.trim() === "" ? null : form.ugMapa.trim(),
      descripcionMuestra: form.descripcionMuestra.trim(),
      norte: num(form.norte),
      este: num(form.este),
      altura: num(form.altura),
    };
  }

  async function submitWith(payload: RegistrationPayload) {
    setSubmitting(true);
    setServerError(null);
    try {
      const sample = await createSample(payload);
      setForm(EMPTY_FORM);
      setSuccess(`La muestra ${sample.codigoMuestra} se registró correctamente.`);
      onRegistered(sample);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setNeedsCredentials(true);
      } else {
        setServerError(error instanceof Error ? error.message : "Error inesperado.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    void submitWith(toPayload());
  }

  async function handleCredentials(event?: FormEvent) {
    event?.preventDefault();
    setServerError(null);
    setAuthHeader(username.trim(), password);
    try {
      await submitWith(toPayload());
      setNeedsCredentials(false);
      setUsername("");
      setPassword("");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setServerError("Credenciales de administrador no válidas. Inténtelo de nuevo.");
      } else {
        setServerError(error instanceof Error ? error.message : "Error inesperado.");
      }
      setNeedsCredentials(false);
    }
  }

  function fieldError(key: string): string | undefined {
    return errors[key];
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-3" data-testid="registration-form" noValidate>
      <h3 className="col-span-full text-base font-semibold text-slate-800">Registrar nueva muestra</h3>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Código *</span>
        <input className={inputClass} value={form.codigoMuestra} onChange={(e) => setField("codigoMuestra", e.target.value)} />
        {fieldError("codigoMuestra") !== undefined && (
          <span className="text-xs text-red-600" data-testid="err-codigoMuestra">{fieldError("codigoMuestra")}</span>
        )}
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Nombre de estación *</span>
        <input className={inputClass} value={form.nombreEstacion} onChange={(e) => setField("nombreEstacion", e.target.value)} />
        {fieldError("nombreEstacion") !== undefined && (
          <span className="text-xs text-red-600" data-testid="err-nombreEstacion">{fieldError("nombreEstacion")}</span>
        )}
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Tipo de roca *</span>
        <select className={inputClass} value={form.nombreRoca} onChange={(e) => setField("nombreRoca", e.target.value)}>
          <option value="">Seleccionar…</option>
          {rockTypes.map((r) => (
            <option key={r.id} value={r.name}>{r.name}</option>
          ))}
        </select>
        {fieldError("nombreRoca") !== undefined && (
          <span className="text-xs text-red-600" data-testid="err-nombreRoca">{fieldError("nombreRoca")}</span>
        )}
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Tipo de análisis *</span>
        <select className={inputClass} value={form.tipoAnalisis} onChange={(e) => setField("tipoAnalisis", e.target.value)}>
          <option value="">Seleccionar…</option>
          {analysisTypes.map((a) => (
            <option key={a.id} value={a.name}>{a.name}</option>
          ))}
        </select>
        {fieldError("tipoAnalisis") !== undefined && (
          <span className="text-xs text-red-600" data-testid="err-tipoAnalisis">{fieldError("tipoAnalisis")}</span>
        )}
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Fecha (AAAA-MM-DD) *</span>
        <input className={inputClass} value={form.fecha} onChange={(e) => setField("fecha", e.target.value)} placeholder="2019-11-03" />
        {fieldError("fecha") !== undefined && (
          <span className="text-xs text-red-600" data-testid="err-fecha">{fieldError("fecha")}</span>
        )}
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Colector</span>
        <select className={inputClass} value={form.nombreColector} onChange={(e) => setField("nombreColector", e.target.value)}>
          <option value="">—</option>
          {collectors.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Localidad</span>
        <input className={inputClass} value={form.localizacion} onChange={(e) => setField("localizacion", e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Plancha</span>
        <input className={inputClass} value={form.plancha} onChange={(e) => setField("plancha", e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Unidad geológica</span>
        <input className={inputClass} value={form.ugMapa} onChange={(e) => setField("ugMapa", e.target.value)} />
      </label>
      <label className="block text-sm md:col-span-2">
        <span className="mb-1 block font-medium text-slate-700">Descripción</span>
        <input className={inputClass} value={form.descripcionMuestra} onChange={(e) => setField("descripcionMuestra", e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Norte (m)</span>
        <input className={inputClass} value={form.norte} onChange={(e) => setField("norte", e.target.value)} inputMode="decimal" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Este (m)</span>
        <input className={inputClass} value={form.este} onChange={(e) => setField("este", e.target.value)} inputMode="decimal" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Altitud (m)</span>
        <input className={inputClass} value={form.altura} onChange={(e) => setField("altura", e.target.value)} inputMode="decimal" />
      </label>

      <div className="col-span-full flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          Registrar muestra
        </button>
        {success !== null && <span className="text-sm text-emerald-700" data-testid="reg-success">{success}</span>}
        {serverError !== null && <span className="text-sm text-red-600" data-testid="reg-error">{serverError}</span>}
      </div>

      {needsCredentials && (
        <div className="col-span-full rounded border border-amber-300 bg-amber-50 p-3" data-testid="credentials-prompt">
          <p className="mb-2 text-sm text-amber-800">Se requieren credenciales de administrador para registrar muestras.</p>
          <div className="flex flex-wrap items-end gap-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Usuario</span>
              <input className={inputClass} value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Contraseña</span>
              <input type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button
              type="button"
              onClick={() => void handleCredentials()}
              className="rounded bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
              data-testid="save-credentials"
            >
              Guardar y reintentar
            </button>
          </div>
        </div>
      )}
    </form>
  );
}