// Setup de pruebas del SPA: matchers de jest-dom y limpieza automática de
// @testing-library/react tras cada test.
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
  sessionStorage.clear();
});