# 02 · Requerimientos del Sistema — Barbería Estilo Córdoba

## Introducción

En esta sección se detallan los requerimientos funcionales y no funcionales del Sistema de Gestión para Barbería Estilo Córdoba. Estos requerimientos establecen las funcionalidades que deberá ofrecer el sistema y las condiciones de calidad, seguridad, rendimiento y mantenimiento que deberá cumplir. Los requerimientos se identifican mediante códigos únicos y se clasifican según su prioridad utilizando el método MoSCoW. Además, se establece una referencia entre los requerimientos funcionales y las épicas definidas en Jira, para facilitar su seguimiento durante la planificación y el desarrollo del proyecto.

Leyenda de prioridad (MoSCoW): **M** = Must, **S** = Should, **C** = Could.

## Requerimientos Funcionales (RF)

| ID | Requerimiento | Descripción | Prioridad |
|---|---|---|---|
| **RF01** | Registro de clientes | El sistema debe permitir el ABMC de clientes registrando: nombre, apellido, tipo y número de documento, teléfono, correo electrónico, localidad y redes sociales. | M |
| **RF02** | Gestión de turnos | El sistema debe permitir agendar turnos (solicitud presencial o digital vía WhatsApp) registrando fecha, hora, cliente y servicio principal. | M |
| **RF03** | Registro de atención | El sistema debe permitir registrar una atención con: fecha, hora, barbero asignado, cliente atendido, uno o más servicios prestados y venta opcional de uno o más productos. | M |
| **RF04** | Ciclo de vida de la atención | El sistema debe gestionar la atención por estados: **Registrada → En proceso → Finalizada → Pendiente de pago → Cobrada**, validando las transiciones permitidas. | M |
| **RF05** | Cobro de la atención | El sistema debe calcular el monto total (servicios + productos) y registrar el medio de pago: efectivo, transferencia o débito. | M |
| **RF06** | Catálogo de servicios | El sistema debe administrar servicios con nombre, categoría (corte clásico, corte moderno, barba, tratamiento capilar), duración estimada y precio de venta. | M |
| **RF07** | Catálogo de productos | El sistema debe administrar productos con nombre, marca, precio de venta y stock disponible. | M |
| **RF08** | Actualización de stock | El sistema debe descontar el stock de los productos vendidos en una atención al registrar la venta. | M |
| **RF09** | Gestión de proveedores | El sistema debe administrar proveedores con razón social, CUIT, teléfono, correo electrónico y dirección comercial. | S |
| **RF10** | Compras de insumos | El sistema debe registrar compras de productos/insumos a proveedores (herramientas, descartables, productos para tocador y venta) y actualizar el stock. | S |
| **RF11** | Autenticación y roles | El sistema debe autenticar usuarios (login) y diferenciar roles: administrador y barbero. | M |
| **RF12** | Fidelización y promociones | El sistema debe permitir marcar clientes para el programa de beneficios y registrar/redactar promociones para su comunicación (notificaciones). | C |
| **RF13** | Historial de atenciones | El sistema debe permitir consultar el historial de atenciones por cliente, barbero, fecha y estado. | S |
| **RF14** | Indicadores (dashboard) | El sistema debe mostrar indicadores básicos: atenciones del día, recaudación por medio de pago y productos con stock bajo. | C |

## Requerimientos No Funcionales (RNF)

| ID | Categoría | Descripción | Prioridad |
|---|---|---|---|
| **RNF01** | Usabilidad | Interfaz web en español, responsive (Bootstrap 5), operable por personal no técnico con máximo 3 clics para las operaciones frecuentes. | M |
| **RNF02** | Compatibilidad | Funcionar en los navegadores modernos (Chrome, Firefox, Edge ≥ versión 2022) sin dependencias de backend ni instalación local. | M |
| **RNF03** | Persistencia | Los datos persisten en el almacenamiento del navegador (`localStorage`) y sobreviven al cierre de la sesión/pestaña; exportar/importar datos en JSON. | M |
| **RNF04** | Rendimiento | Toda operación CRUD responde en menos de 1 segundo con hasta 5.000 registros en almacenamiento local. | M |
| **RNF05** | Seguridad | Acceso mediante login; las funcionalidades según rol del usuario; no se almacenan ni transmiten credenciales en texto plano (hash). | M |
| **RNF06** | CI/CD | El repositorio debe validar automáticamente cada push (lint/build) y publicar la app en GitHub Pages al integrar `main`. | M |
| **RNF07** | Mantenibilidad | Código JavaScript modular por dominio, sin dependencias externas de npm para el frontend, con convenciones de nombres consistentes. | S |
| **RNF08** | Escalabilidad | La capa de acceso a datos debe estar aislada del resto de la UI para permitir migrar de `localStorage` a un backend futuro sin reescribir la interfaz. | S |

## Referencia cruzada RF ↔ Épicas (para Jira)

| Épica | RF asociados |
|---|---|
| ES-Gestión de Clientes | RF01, RF12, RF13 |
| ES-Gestión de Turnos | RF02 |
| ES-Gestión Transaccional (Atenciones) | RF03, RF04, RF05, RF08, RF13 |
| ES-Catálogo y Stock | RF06, RF07, RF09, RF10, RF14 |
| ES-Seguridad y Tecnología (Sprint 0) | RF11, RNF03, RNF05, RNF06 |
