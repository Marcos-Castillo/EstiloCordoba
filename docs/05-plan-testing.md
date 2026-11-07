# 05 · Plan de Testing (Zephyr) — MVP Barbería Estilo Córdoba

> Contenido preparado para cargar en **Zephyr** del proyecto Jira **ES**.
> Pasos para activar Zephyr: Jira → Apps → "Zephyr" (o Zephyr Scale) → agregar al proyecto ES.
> Estructura usada: **Test Cycles ES-R1 a ES-R4**. La ejecución final corresponde a **ES-R4 — Regresión Sprint 2**, del 07/11/2026, con **12/12 casos Passed**.

## MVP bajo prueba (Sprint 2)

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
| 3 | Agregar 1 servicio y 1 producto (cantidad 1) | Subtotales y monto total calculado; el stock del producto se descuenta al registrar |
| 4 | Presionar "Iniciar proceso" | Estado cambia a *En proceso* |
| 5 | Presionar "Finalizar" | Estado *Finalizada* |
| 6 | Presionar "Pendiente de pago" | Estado *Pendiente de pago* |
| 7 | Presionar "Cobrar" → medio de pago Efectivo | Estado *Cobrada*; monto, medio de pago y fecha de cobro registrados |
| 8 | Ver historial de atenciones | La atención figura como Cobrada |

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
| 1 | Abrir la atención en estado *Registrada* | Sin botón de cobro para este estado; muestra el aviso "Primero debe finalizarse la atención" |
| 2 | Intentar acción de cobro (si la UI lo permite por atajo/URL) | El sistema rechaza la transición; estado permanece en *Registrada*; mensaje de flujo inválido |

## TC-06 · Venta de producto sin stock suficiente (RF07, RF08 — camino fallido)

**Precondiciones**: producto con stock 1.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Crear atención y agregar ese producto con cantidad 2 | El sistema valida y avisa "Stock insuficiente"; no permite el detalle con cantidad 2 |
| 2 | Intentar igualmente finalizar con cantidad inválida | Se bloquea el paso hasta corregir la cantidad |

## TC-07 · Alta, edición y baja de clientes (RF01)

**Precondiciones**: sesión de administrador.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ir a Clientes → completar nombre, apellido, DNI y número de documento; guardar | El cliente aparece en la tabla y persiste al recargar la página |
| 2 | Registrar otro cliente con el mismo tipo y número de documento | Aviso "Ya existe un cliente con ese tipo y número de documento"; no se registra |
| 3 | Editar el cliente creado y cambiar la localidad | Los datos se actualizan en la tabla |
| 4 | Eliminar el cliente y confirmar | El cliente desaparece del listado |

## TC-08 · Filtros del historial de atenciones (RF13)

**Precondiciones**: atenciones cargadas para distintos clientes, barberos, fechas y estados.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ir a Atenciones → filtrar por un cliente | Solo se muestran las atenciones de ese cliente |
| 2 | Combinar el filtro de cliente con un estado (por ejemplo, *Cobrada*) | Se muestran únicamente las atenciones que cumplen ambos criterios |
| 3 | Elegir una fecha sin atenciones | Se muestra el aviso "Sin resultados" sin romper la página |
| 4 | Presionar "Limpiar filtros" | Vuelve a mostrarse el historial completo |

## TC-09 · Registrar una compra y reponer stock (RF10)

**Precondiciones**: proveedor y producto existentes; sesión de administrador.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ir a Compras, elegir proveedor, producto y cantidad 10 con costo unitario 5 | Se muestra el total de la compra ($ 50,00) |
| 2 | Presionar "Registrar compra" | La compra queda registrada y el stock del producto aumenta en 10 unidades |

## TC-10 · Registrar una compra incompleta (RF10 — camino fallido)

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ir a Compras y dejar el proveedor sin seleccionar | Aviso "Seleccioná un proveedor"; no se registra la compra |
| 2 | Elegir proveedor y producto, pero indicar cantidad 0 | Aviso "La cantidad debe ser un entero mayor que cero"; el stock no cambia |

## TC-11 · Dashboard de reportes e indicadores (RF14)

**Precondiciones**: sesión de administrador; datos demo cargados con al menos una atención cobrada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Ingresar como admin y abrir Reportes | Se muestra el dashboard con los indicadores del día |
| 2 | Verificar el gráfico de recaudación por medio de pago | El gráfico de dona se renderiza con Efectivo, Transferencia y Débito |
| 3 | Verificar el gráfico de atenciones de los últimos 7 días | El gráfico de barras se renderiza |
| 4 | Verificar la tabla de stock bajo | Se listan los productos con menos de 5 unidades |

## TC-12 · Control de acceso por rol (RF11)

**Precondiciones**: sesión iniciada como Barbero.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir admin.html | Redirección a login.html |
| 2 | Abrir clientes.html | Redirección a login.html |
| 3 | Abrir proveedores.html | Redirección a login.html |
| 4 | Abrir compras.html | Redirección a login.html |
| 5 | Abrir reportes.html | Redirección a login.html |

---

## Mapa TC ↔ HU Jira

| Test Cycle | HU cobrada |
|---|---|
| TC-01, TC-02 | HU-Seguridad y Tecnología (login) |
| TC-03, TC-04, TC-05, TC-06 | HU-Gestión Transaccional (atenciones/cobro) |
| TC-07 | ES-17 — Clientes (ABMC) |
| TC-08 | ES-20 — Historial de atenciones con filtros |
| TC-09, TC-10 | ES-21 — Proveedores y compras |
| TC-11 | ES-22 — Dashboard de indicadores |
| TC-12 | ES-5 — Seguridad y Tecnología (control de acceso) |

## Registro de ejecución — ciclo ES-R4 (07/11/2026)

| TC | Estado Ejecución | Ejecutado por | Fecha | Evidencia |
|---|---|---|---|---|
| TC-01 | Passed | Equipo Estilo Córdoba | 07/11/2026 | Zephyr ES-R4 · ES-E15 |
| TC-02 | Passed | Equipo Estilo Córdoba | 07/11/2026 | Zephyr ES-R4 · ES-E16 |
| TC-03 | Passed | Equipo Estilo Córdoba | 07/11/2026 | Zephyr ES-R4 · ES-E17 |
| TC-04 | Passed | Equipo Estilo Córdoba | 07/11/2026 | Zephyr ES-R4 · ES-E18 |
| TC-05 | Passed | Equipo Estilo Córdoba | 07/11/2026 | Zephyr ES-R4 · ES-E19 |
| TC-06 | Passed | Equipo Estilo Córdoba | 07/11/2026 | Zephyr ES-R4 · ES-E20 |
| TC-07 | Passed | Equipo Estilo Córdoba | 07/11/2026 | Zephyr ES-R4 · ES-E21 |
| TC-08 | Passed | Equipo Estilo Córdoba | 07/11/2026 | Zephyr ES-R4 · ES-E22 |
| TC-09 | Passed | Equipo Estilo Córdoba | 07/11/2026 | Zephyr ES-R4 · ES-E23 |
| TC-10 | Passed | Equipo Estilo Córdoba | 07/11/2026 | Zephyr ES-R4 · ES-E24 |
| TC-11 | Passed | Equipo Estilo Córdoba | 07/11/2026 | Zephyr ES-R4 · ES-E25 |
| TC-12 | Passed | Equipo Estilo Córdoba | 07/11/2026 | Zephyr ES-R4 · ES-E26 |
