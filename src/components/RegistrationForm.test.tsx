// Pruebas del formulario de registro: validación en cliente, errores 400/409
// del servidor y flujo de credenciales admin ante 401.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegistrationForm from "./RegistrationForm";
import type { CanonicalEntry, RegistrationPayload, Sample } from "../types";

vi.mock("../services/api", () => {
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
    getMeta: vi.fn(),
    listSamples: vi.fn(),
    exportCsv: vi.fn(),
  };
});

// eslint-disable-next-line import/no-extraneous-dependencies
import { ApiError, createSample, setAuthHeader } from "../services/api";

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

const CREATED: Sample = {
  id: 100,
  igm: null,
  codigoMuestra: "ZZX9999",
  nombreEstacion: "Estacion Nueva",
  estacionCompanero: null,
  simboloUG: null,
  ugMapa: null,
  descripcionMuestra: "",
  nombreRoca: "Granito",
  localizacion: "",
  plancha: "",
  norte: null,
  este: null,
  altura: null,
  fecha: "2024-05-01",
  nombreColector: null,
  existeMuestra: null,
  tipoAnalisis: "Seccion Delgada",
};

async function fillRequiredForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Código *"), "ZZX9999");
  await user.type(screen.getByLabelText("Nombre de estación *"), "Estacion Nueva");
  await user.selectOptions(screen.getByLabelText("Tipo de roca *"), "Granito");
  await user.selectOptions(screen.getByLabelText("Tipo de análisis *"), "Seccion Delgada");
  await user.type(screen.getByLabelText("Fecha (AAAA-MM-DD) *"), "2024-05-01");
}

describe("RegistrationForm", () => {
  beforeEach(() => {
    vi.mocked(createSample).mockReset();
    vi.mocked(setAuthHeader).mockReset();
  });

  it("shows client-side validation errors and does not call the API", async () => {
    const user = userEvent.setup();
    render(
      <RegistrationForm rockTypes={ROCKS} collectors={COLLECTORS} analysisTypes={ANALYSES} onRegistered={vi.fn()} />,
    );
    await user.click(screen.getByRole("button", { name: "Registrar muestra" }));

    expect(screen.getByTestId("err-codigoMuestra")).toHaveTextContent("El código es obligatorio.");
    expect(screen.getByTestId("err-nombreEstacion")).toHaveTextContent("El nombre de la estación es obligatorio.");
    expect(createSample).not.toHaveBeenCalled();
  });

  it("rejects a malformed date before calling the API", async () => {
    const user = userEvent.setup();
    render(
      <RegistrationForm rockTypes={ROCKS} collectors={COLLECTORS} analysisTypes={ANALYSES} onRegistered={vi.fn()} />,
    );
    await fillRequiredForm(user);
    await user.clear(screen.getByLabelText("Fecha (AAAA-MM-DD) *"));
    await user.type(screen.getByLabelText("Fecha (AAAA-MM-DD) *"), "not-a-date");
    await user.click(screen.getByRole("button", { name: "Registrar muestra" }));

    expect(screen.getByTestId("err-fecha")).toHaveTextContent("La fecha debe tener el formato AAAA-MM-DD.");
    expect(createSample).not.toHaveBeenCalled();
  });

  it("submits the payload and reports success", async () => {
    const user = userEvent.setup();
    const onRegistered = vi.fn();
    vi.mocked(createSample).mockResolvedValue(CREATED);
    render(
      <RegistrationForm rockTypes={ROCKS} collectors={COLLECTORS} analysisTypes={ANALYSES} onRegistered={onRegistered} />,
    );

    await fillRequiredForm(user);
    await user.click(screen.getByRole("button", { name: "Registrar muestra" }));

    await waitFor(() => expect(createSample).toHaveBeenCalledTimes(1));
    const payload = vi.mocked(createSample).mock.calls[0][0] as RegistrationPayload;
    expect(payload).toMatchObject({
      codigoMuestra: "ZZX9999",
      nombreEstacion: "Estacion Nueva",
      nombreRoca: "Granito",
      tipoAnalisis: "Seccion Delgada",
      fecha: "2024-05-01",
    });
    expect(await screen.findByTestId("reg-success")).toHaveTextContent("se registró correctamente");
    expect(onRegistered).toHaveBeenCalledWith(CREATED);
  });

  it("displays the server 400 error message", async () => {
    const user = userEvent.setup();
    vi.mocked(createSample).mockRejectedValue(
      Object.assign(new Error("NombreRoca is not a canonical rock type"), { status: 400 }),
    );
    render(
      <RegistrationForm rockTypes={ROCKS} collectors={COLLECTORS} analysisTypes={ANALYSES} onRegistered={vi.fn()} />,
    );
    await fillRequiredForm(user);
    await user.click(screen.getByRole("button", { name: "Registrar muestra" }));

    expect(await screen.findByTestId("reg-error")).toHaveTextContent(
      "NombreRoca is not a canonical rock type",
    );
  });

  it("shows the 409 duplicate error", async () => {
    const user = userEvent.setup();
    vi.mocked(createSample).mockRejectedValue(
      Object.assign(new Error("Sample with code ACM0398p already exists"), { status: 409 }),
    );
    render(
      <RegistrationForm rockTypes={ROCKS} collectors={COLLECTORS} analysisTypes={ANALYSES} onRegistered={vi.fn()} />,
    );
    await fillRequiredForm(user);
    await user.click(screen.getByRole("button", { name: "Registrar muestra" }));

    expect(await screen.findByTestId("reg-error")).toHaveTextContent("already exists");
  });

  it("prompts for admin credentials on 401, stores them and retries", async () => {
    const user = userEvent.setup();
    const onRegistered = vi.fn();
    vi.mocked(createSample)
      .mockRejectedValueOnce(new ApiError(401, "Unauthorized"))
      .mockResolvedValueOnce(CREATED);
    render(
      <RegistrationForm rockTypes={ROCKS} collectors={COLLECTORS} analysisTypes={ANALYSES} onRegistered={onRegistered} />,
    );

    await fillRequiredForm(user);
    await user.click(screen.getByRole("button", { name: "Registrar muestra" }));

    expect(await screen.findByTestId("credentials-prompt")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Usuario"), "admin");
    await user.type(screen.getByLabelText("Contraseña"), "secret");
    await user.click(screen.getByTestId("save-credentials"));

    await waitFor(() => expect(setAuthHeader).toHaveBeenCalledWith("admin", "secret"));
    await waitFor(() => expect(createSample).toHaveBeenCalledTimes(2));
    expect(await screen.findByTestId("reg-success")).toHaveTextContent("se registró correctamente");
    expect(onRegistered).toHaveBeenCalledWith(CREATED);
    expect(screen.queryByTestId("credentials-prompt")).not.toBeInTheDocument();
  });
});