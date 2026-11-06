# Sistema de Gestión para Barbería Estilo Córdoba

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

## Demo online

- **URL (deploy GitHub Pages)**: https://marcos-castillo.github.io/EstiloCordoba/app/login.html
- **Login**: elegir el perfil (Administrador o Barbero) para que coincida con el usuario ingresado.

| Usuario | Contraseña | Rol |
|---|---|---|
| admin | admin123 | Administrador |
| barbero | barbero123 | Barbero |

### Reportes (solo Administrador)

Ingresando con el perfil **Administrador** aparece la sección **"Reportes e indicadores"**, con los dos reportes principales:

- **Recaudación del día por medio de pago** (Efectivo, Transferencia, Débito) — gráfico de dona con [Chart.js](https://www.chartjs.org/).
- **Atenciones de los últimos 7 días** — gráfico de barras.

Incluye además las tarjetas de indicadores (atenciones del día, recaudación del día y productos con stock bajo) y la tabla de **stock bajo** (productos con menos de 5 unidades).

La demo **siembra datos de ejemplo la primera vez** que se inicia sesión (atenciones de los últimos 7 días y stock con productos bajos), para que los reportes se vean completos sin cargar datos a mano. Para reiniciar la demo: borrar de `localStorage` las claves `atencionesEstiloCordoba`, `stockEstiloCordoba` y `demoEstiloCordoba`.

## Estructura

- `Consigna.html` — consigna del trabajo
- `Enunciado_1-EstiloCordoba.docx` — enunciado del proyecto
- `docs/` — relevamiento, requerimientos y modelado UML
- `app/` — código funcional (en desarrollo)
