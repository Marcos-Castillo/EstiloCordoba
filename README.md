# Sistema de Gestión para Barbería Estilo Córdoba

[![CI](https://github.com/Marcos-Castillo/EstiloCordoba/actions/workflows/ci.yml/badge.svg)](https://github.com/Marcos-Castillo/EstiloCordoba/actions/workflows/ci.yml)

## Carátula

| | |
|---|---|
| **Materia** | Sistemas de Información 4 |
| **Profesor** | Roger Martínez |
| **Integrantes** | Marcos Ezequiel Castillo |
| | Raúl Alejandro Gago |
| | Victor Julián Pérez |
| | Rodrigo Leonel Fernandez |
| **Año** | 2026 |

## Documentación y gestión del proyecto

- **Jira (backlog)**: https://marcos469204.atlassian.net/jira/software/projects/ES/boards/34/backlog
- **Confluence (índice)**: https://marcos469204.atlassian.net/wiki/spaces/EstiloCrdo/pages/107347989/Indice
- **Integración continua**: [`.github/workflows/ci.yml`](.github/workflows/ci.yml) valida el HTML y el JavaScript en cada push a `main`; GitHub Pages publica automáticamente la aplicación desde esa rama.

## Demo online

- **URL (deploy GitHub Pages)**: https://marcos-castillo.github.io/EstiloCordoba/app/login.html
- **Login**: elegir el perfil (Administrador o Barbero) para que coincida con el usuario ingresado.

| Usuario | Contraseña | Rol |
|---|---|---|
| admin | admin123 | Administrador |
| barbero | barbero123 | Barbero |

### Módulos implementados

- **Login con roles** (Administrador y Barbero) y cierre de sesión.
- **Atenciones**: registro con cliente, barbero, fecha, servicio y producto opcional; ciclo de estados Registrada → En proceso → Finalizada → Pendiente de pago → Cobrada; cobro con medio de pago y descuento de stock al registrar.
- **Historial de atenciones** con filtros combinables por cliente, barbero, fecha y estado.
- **Clientes**: alta, modificación y baja con validación de documento duplicado.
- **Proveedores y compras**: ABMC de proveedores y registro de compras que reponen el stock.
- **Reportes e indicadores** (solo Administrador): recaudación del día por medio de pago y atenciones de los últimos 7 días.

### Reportes (solo Administrador)

Ingresando con el perfil **Administrador** aparece la sección **"Reportes e indicadores"**, con los dos reportes principales:

- **Recaudación del día por medio de pago** (Efectivo, Transferencia, Débito) — gráfico de dona con [Chart.js](https://www.chartjs.org/).
- **Atenciones de los últimos 7 días** — gráfico de barras.

Incluye además las tarjetas de indicadores (atenciones del día, recaudación del día y productos con stock bajo) y la tabla de **stock bajo** (productos con menos de 5 unidades).

### Datos de ejemplo

La demo **siembra datos de ejemplo la primera vez** que se inicia sesión: clientes, proveedores, atenciones de los últimos 7 días y stock con productos bajos, para que todas las pantallas se vean completas sin cargar datos a mano.

Para reiniciar la demo: borrar de `localStorage` las claves `clientesEstiloCordoba`, `proveedoresEstiloCordoba`, `comprasEstiloCordoba`, `atencionesEstiloCordoba`, `stockEstiloCordoba` y `demoEstiloCordoba`, y volver a iniciar sesión.

## Testing

Los casos de prueba TC-01 a TC-10 están documentados en [`docs/05-plan-testing.md`](docs/05-plan-testing.md). La ejecución y la evidencia se registran en **Zephyr**, dentro del proyecto Jira **ES**.

## Estructura

- `Consigna.html` — consigna del trabajo
- `Enunciado_1-EstiloCordoba.docx` — enunciado del proyecto
- `docs/01-objetivo-si.md` — objetivo y alcance del sistema
- `docs/02-requerimientos.md` — requerimientos funcionales y no funcionales
- `docs/03-uml.md` — modelado UML (clases, estados, casos de uso, componentes y despliegue)
- `docs/05-plan-testing.md` — plan y casos de prueba
- `docs/app/` — aplicación web (HTML + JavaScript, persistencia en `localStorage`)
- `.github/workflows/ci.yml` — validación automática en cada push
