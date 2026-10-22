# 05 · Plan de Testing (Zephyr) — MVP Barbería Estilo Córdoba

> Contenido preparado para cargar en **Zephyr** del proyecto Jira **ES**.
> Pasos para activar Zephyr: Jira → Apps → "Zephyr" (o Zephyr Scale) → agregar al proyecto ES.
> Estructura sugerida: **Test Cycle "Sprint 1 — Documentación/MVP"** + los casos de abajo.

## MVP bajo prueba (Sprint 0/1)

- RF11 Login con roles · RF03 Registro de atención · RF04 Ciclo de vida de la atención · RF05 Cobro · RF08 Descuento de stock

---

## TC-01 · Login con credenciales válidas (RF11)

**Precondiciones**: usuario `admin` con rol Administrador dado de alta. Sistema accesible en navegador.
| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `login.html` | Se muestra el formulario de login |
| 2 | Ingresar usuario y contraseña válidos | Campos aceptados |
| 3 | Presionar "Ingresar" | Redirige al dashboard; se muestra el nombre del usuario y su rol |

**Postcondiciones**: sesión almacenada en el navegador.

## TC-02 · Login con credenciales inválidas (RF11)

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `login.html` | Formulario visible |
| 2 | Ingresar usuario válido y contraseña **incorrecta** | Campos aceptados |
| 3 | Presionar "Ingresar" | Mensaje de error "Credenciales inválidas"; no se inicia sesión |

## TC-03 · Registrar una atención completa y cobrarla (RF03, RF04, RF05)

**Precondiciones**: cliente existente; al menos 2 servicios en catálogo; producto con stock; sesión de barbero o admin.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ir a Atenciones → "Nueva atención" | Formulario visible con estado *Registrada* |
| 2 | Seleccionar cliente, barbero, fecha y hora | Datos cargados |
| 3 | Agregar 1 servicio y 1 producto (cantidad 1) | Subtotales y monto total calculado |
| 4 | Presionar "Iniciar proceso" | Estado cambia a *En proceso* |
| 5 | Presionar "Finalizar" | Estado *Finalizada* |
| 6 | Presionar "Cobrar" → medio de pago Efectivo | Estado *Cobrada*; monto y medio de pago registrados; stock del producto descontado |
| 7 | Ver historial de atenciones | La atención figura como Cobrada |

## TC-04 · Atención sin cliente seleccionado (RF03 — camino fallido)

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ir a Atenciones → "Nueva atención" | Formulario visible |
| 2 | Completar barbero, fecha, servicio y producto; dejar cliente vacío | Datos cargados salvo cliente |
| 3 | Presionar "Guardar" | Validación: "Debe seleccionar un cliente"; la atención no se registra |

## TC-05 · Cobrar atención en estado incorrecto (RF04, RF05 — camino fallido)

**Precondiciones**: atención recién creada en estado *Registrada*.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la atención en estado *Registrada* | Sin botón de cobro disponible para este estado |
| 2 | Intentar acción de cobro (si la UI lo permite por atajo/URL) | El sistema rechaza la transición; estado permanece en *Registrada*; mensaje de flujo inválido |

## TC-06 · Venta de producto sin stock suficiente (RF07, RF08 — camino fallido)

**Precondiciones**: producto con stock 1.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Crear atención y agregar ese producto con cantidad 2 | El sistema valida y avisa "Stock insuficiente"; no permite el detalle con cantidad 2 |
| 2 | Intentar igualmente finalizar con cantidad inválida | Se bloquea el paso hasta corregir la cantidad |

---

## Mapa TC ↔ HU Jira

| Test Cycle | HU cobrada |
|---|---|
| TC-01, TC-02 | HU-Seguridad y Tecnología (login) |
| TC-03, TC-04, TC-05, TC-06 | HU-Gestión Transaccional (atenciones/cobro) |

## Registro de ejecución (completar en Zephyr)

| TC | Estado Ejecución | Ejecutado por | Fecha | Evidencia |
|---|---|---|---|---|
| TC-01 | (Passed/Failed — en Zephyr) | | | |
| TC-02 | | | | |
| TC-03 | | | | |
| TC-04 | | | | |
| TC-05 | | | | |
| TC-06 | | | | |
