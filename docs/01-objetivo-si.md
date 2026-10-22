# 01 · Objetivo del Sistema de Información — Barbería Estilo Córdoba

**"ESTILO CÓRDOBA"** es una barbería dedicada a la prestación de servicios de estética y cuidado masculino (cortes de cabello, perfilado de barba, tratamientos capilares y afeitado tradicional) y a la venta de productos de estilismo para clientes particulares en la Ciudad de Córdoba Capital.

## 1. Objetivo general del Sistema de Información

Proveer a la barbería un sistema que **gestione de manera eficiente y centralizada la atención al cliente** — transacción principal del negocio — a lo largo de todo su ciclo de vida (registrada → en proceso → finalizada → pendiente de pago → cobrada), integrando la gestión de clientes, turnos, servicios, productos, stock y compras a proveedores, con el fin de mejorar la calidad de atención, garantizar la disponibilidad de insumos y habilitar la fidelización de clientes.

## 2. Objetivos específicos

1. **Clientes**: registrar y administrar los datos personales y de contacto de los clientes (nombre, apellido, documento, teléfono, correo, localidad y redes sociales), habilitando la fidelización y el envío de notificaciones con promociones.
2. **Turnos**: gestionar la agenda de citas previas solicitadas de manera presencial o digital (WhatsApp), registrando fecha, hora, cliente y servicio principal.
3. **Atenciones (transacción principal)**: registrar cada atención con el barbero asignado, el cliente atendido, los servicios prestados y la venta opcional de productos, calculando el monto total a cobrar y el medio de pago.
4. **Ciclo de vida de la atención**: controlar los estados de la atención (Registrada, En proceso, Finalizada, Pendiente de pago, Cobrada).
5. **Catálogo**: administrar los servicios oferecidos (nombre, categoría, duración estimada y precio) y los productos de cuidado personal (nombre, marca, precio de venta y stock).
6. **Stock y compras**: registrar las compras de insumos y productos a proveedores, manteniendo la disponibilidad de stock para la operación diaria.
7. **Proveedores**: administrar los datos de los proveedores (razón social, CUIT, teléfono, correo y dirección comercial).
8. **Seguridad**: autenticar a los usuarios del sistema (administrador/barbero) y restringir las operaciones según su rol.

## 3. Alcance del software

### Dentro del alcance
- ABMC de clientes, servicios, productos, proveedores y comprás.
- Gestión de turnos (agenda).
- Registro de la atención con detalle de servicios y productos.
- Gestión de estados de la atención y su cobro.
- Cálculo de montos y registro de medios de pago (efectivo, transferencia, débito).
- Descuento automático de stock por venta de productos en atenciones.
- Login con roles de usuario.
- Dashboard con indicadores basicos del negocio.

### Fuera del alcance
- Facturación fiscal electrónica (AFIP).
- Cobros con tarjeta de crédito/gestión de pasarelas de pago reales.
- Sistema contable y administración general del negocio.
- App móvil nativa y back-end servidor (instancia: aplicación web de una sola página con persistencia local).
- Multisucursal.
- Envío automático real de notificaciones/WhatsApp (queda documentado el registro de datos para ello).

### Usuario objetivo / roles
| Rol | Descripción |Operaciones principales |
|---|---|---|
| Administrador | Dueño/encargado de la barbería | Acceso total, catálogo, compras, reportes, usuarios |
| Barbero | Profesional que atiende clientes | Turnos, registrar/actualizar atenciones, cobro |

## 4. Restricciones
- Aplicación SPA en HTML + JavaScript + Bootstrap 5, sin backend: la persistencia se realiza en el `localStorage` del navegador.
- Repositorio público en GitHub con CI/CD (GitHub Actions + GitHub Pages).
- Gestión del proyecto en Jira (Scrum), documentación en Confluence y testing documentado en Zephyr.
