# 03 · Modelado UML — transacción principal: "Atención"

Los 5 diagramas modelan la **transacción principal del sistema: la Atención** (atención al cliente), su ciclo de vida y los elementos esenciales y de soporte (MODP — Modelo de Objetos del Dominio del Problema).

## 1. Diagrama de Clases (MODP)

**Herramienta**: StarUML 7 · **Imagen**: [`uml/class-diagram.png`](uml/class-diagram.png) · **Fuente**: [`uml/class-diagram.mmd`](uml/class-diagram.mmd)

Clases esenciales: `Atencion`, `DetalleAtencion`, `Cliente`, `Barbero`, `Servicio`, `Producto`.
Clases de soporte: `Turno`, `Usuario`, `Proveedor`, `Compra`, `DetalleCompra`, y las enumeraciones `EstadoAtencion` y `MedioPago`.

Relaciones clave:
- `Atencion` 1–1 con `Cliente` y `Barbero`; composición 1–\* con `DetalleAtencion`.
- Cada `DetalleAtencion` incluye **un** Servicio **o** vende **un** Producto (0..1 en cada rol).
- `Atencion` se origina opcionalmente en un `Turno`.
- `Compra` (composición con `DetalleCompra`) repone `Producto` y se realiza a un `Proveedor`.

```mermaid
classDiagram
    class Cliente {
        +int id
        +String nombre
        +String apellido
        +String tipoDocumento
        +String numeroDocumento
        +String telefono
        +String correoElectronico
        +String localidad
        +String redesSociales
        +boolean programaBeneficios
        +registrar()
        +modificar()
        +darDeBaja()
    }
    class Barbero {
        +int id
        +String nombre
        +String apellido
        +String telefono
        +boolean activo
        +atender(atencion)
    }
    class Servicio {
        +int id
        +String nombre
        +String categoria
        +int duracionEstimadaMin
        +double precioVenta
        +calcularPrecio()
    }
    class Producto {
        +int id
        +String nombre
        +String marca
        +double precioVenta
        +int stock
        +descontarStock(cantidad)
        +reponerStock(cantidad)
    }
    class Atencion {
        +int id
        +Date fecha
        +Time hora
        +EstadoAtencion estado
        +MedioPago medioPago
        +double montoTotal
        +Date fechaCobro
        +registrar()
        +iniciarProceso()
        +finalizar()
        +marcarPendientePago()
        +cobrar(medioPago)
        +calcularMontoTotal()
    }
    class DetalleAtencion {
        +int id
        +int cantidad
        +double precioUnitario
        +subtotal()
    }
    class Turno {
        +int id
        +Date fechaHoraAgendada
        +String canalSolicitud
        +String estadoTurno
        +cancelar()
        +reprogramar()
    }
    class Usuario {
        +int id
        +String usuario
        +String passwordHash
        +String rol
        +autenticar(clave)
        +cerrarSesion()
    }
    class Proveedor {
        +int id
        +String razonSocial
        +String cuit
        +String telefono
        +String correoElectronico
        +String direccion
    }
    class Compra {
        +int id
        +Date fecha
        +double total
        +registrar()
        +actualizarStock()
    }
    class DetalleCompra {
        +int id
        +int cantidad
        +double costoUnitario
        +subtotal()
    }
    class MedioPago {
        <<enumeration>>
        EFECTIVO
        TRANSFERENCIA
        DEBITO
    }
    class EstadoAtencion {
        <<enumeration>>
        REGISTRADA
        EN_PROCESO
        FINALIZADA
        PENDIENTE_PAGO
        COBRADA
    }
    Atencion "1" --> "1" Cliente : es para
    Atencion "1" --> "1" Barbero : realiza
    Atencion "1" --> "1" Turno : puede originarse en
    Atencion "1" *-- "1..*" DetalleAtencion : contiene
    Atencion --> EstadoAtencion : tiene estado
    Atencion --> MedioPago : se cobra con
    DetalleAtencion --> "0..1" Servicio : incluye
    DetalleAtencion --> "0..1" Producto : vende
    Compra "1" --> "1" Proveedor : se hace a
    Compra "1" *-- "1..*" DetalleCompra : incluye
    DetalleCompra --> "1" Producto : repone
    Usuario --> Barbero : puede ser
```

## 2. Diagrama de Estados — Atención

**Herramienta**: StarUML 7 · **Imagen**: [`uml/state-diagram.png`](uml/state-diagram.png) · **Fuente**: [`uml/state-diagram.mmd`](uml/state-diagram.mmd)

Ciclo de vida según el enunciado: **Registrada → En proceso → Finalizada → Pendiente de pago → Cobrada**.

```mermaid
stateDiagram-v2
    state "Registrada" as registrada
    state "En proceso" as enProceso
    state "Finalizada" as finalizada
    state "Pendiente de pago" as pendientePago
    state "Cobrada" as cobrada
    [*] --> registrada : registrarAtencion(cliente, barbero, servicios, productos)
    registrada --> enProceso : iniciarProceso()
    enProceso --> finalizada : finalizarServicios()
    finalizada --> pendientePago : confirmarPendienteDePago()
    finalizada --> cobrada : cobrar(medioPago)
    pendientePago --> cobrada : cobrar(medioPago)
    registrada --> [*] : cancelarAntesDeIniciar()
    cobrada --> [*] : archivar()
```

## 3. Diagrama de Casos de Uso

**Herramienta**: Excalidraw · **Online**: https://excalidraw.com/#json=BaQGcGb1mVHyUwXA7q2Q4,kEX-ziXGvICs-rdzwJWiVQ

Actores: **Cliente**, **Barbero** y **Administrador**. Foco en la interacción del usuario con la transacción principal:

- *Barbero*: **Registrar atención** (RF03/RF04) → `<<include>>` **Cambiar estado** (RF04) y **Cobrar atención** (RF05).
- *Cliente*: Iniciar sesión, Solicitar turno, Cobrar (paga).
- *Administrador*: Registrar cliente, Gestionar catálogo, Comprar insumos.

## 4. Diagrama de Componentes

**Herramienta**: Excalidraw · **Online**: https://excalidraw.com/#json=s7GNhStrsbzY6PEgm9Y2F,6ig5CftAw9FlRQKcFtYaSQ

Arquitectura en capas de la SPA:
1. **Presentación**: Login UI, Clientes UI, Turnos UI, Atenciones UI, Catálogo UI (HTML + Bootstrap 5).
2. **Lógica**: controladores JavaScript por dominio (`AuthController`, `ClientesController`, `TurnosController`, `AtencionesController`, `CatalogoController`). `AtencionesController` es el componente de la transacción principal.
3. **Acceso a datos**: `StorageService` — única puerta hacia la persistencia (abstracción para migrar a backend futuro, RNF08).
4. **Datos**: `localStorage` del navegador (JSON).

## 5. Diagrama de Despliegue

**Herramienta**: Excalidraw · **Online**: https://excalidraw.com/#json=s7GNhStrsbzY6PEgm9Y2F,6ig5CftAw9FlRQKcFtYaSQ

- `«device»` Navegador del usuario: ejecuta la SPA + `localStorage`.
- `«execution environment»` **GitHub Pages**: sirve la app estática por HTTPS.
- `«node»` **GitHub Actions (CI/CD)**: valida (lint/build) en cada push y despliega a Pages (RNF06).
- `«artifact»` **Repositorio GitHub** (`main`): código fuente que dispara el pipeline.
