# Delta de cabeceras — antes vs después (evidencia del ciclo security-headers)

Capturas crudas: `curl-antes.txt` / `curl-despues.txt` (con comentarios; la salida
cruda se recupera con `grep -v '^#' archivo | sed 's/   #.*//'`).

## Las 3 diferencias que importan

| Cabecera | Antes (helmet default) | Después (política DGI) | Lectura |
|---|---|---|---|
| `X-Frame-Options` | `SAMEORIGIN` | **`DENY`** | Ni siquiera el propio sitio puede enmarcarse: anti-clickjacking estricto |
| `Referrer-Policy` | `no-referrer` | **`strict-origin-when-cross-origin`** | De no enviar nunca referrer a enviar solo el origen en salidas cross-origin: privacidad sin romper analítica legítima |
| `Content-Security-Policy` | `...frame-ancestors 'self'...` | **`...frame-ancestors 'none'...`** | Ningún documento puede embeber esta API en un frame, de nadie |

Y una cuarta cabecera pedida por la política que **ya estaba bien**:
`X-Content-Type-Options: nosniff` — no cambió su valor; lo que cambió es que
antes no había ningún test que lo verificara. Ahora sí.

## Ruido esperado (NO forma parte del cambio)

- `Date`: reloj de cada respuesta.
- `RateLimit: remaining/reset`: estado del rate limiter entre requests.

## Por qué hay tan pocas diferencias

La API ya montaba `helmet()` con defaults desde su commit original (`fa589b6`):
la defensa base existía. El ciclo SDD hizo dos cosas que un "agregar headers"
no captura:

1. **Alineó los valores** a los exigidos por la política (los 3 cambios de arriba),
   resolviendo en puerta humana que el reemplazo literal de la CSP habría
   *debilitado* 10 directivas protectoras (se usó merge de helmet v8).
2. **Las puso bajo test por primera vez**: 10 escenarios Given/When/Then,
   incluida una guardia de regresión que fija HSTS y COOP como prueba del
   "resto del hardening intacto".
