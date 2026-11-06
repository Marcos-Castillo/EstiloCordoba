// Datos de ejemplo para la demo del sistema (atenciones y stock iniciales).
const CLAVE_ATENCIONES_DEMO = "atencionesEstiloCordoba";
const CLAVE_STOCK_DEMO = "stockEstiloCordoba";
const CLAVE_SEMILLA_DEMO = "demoEstiloCordoba";

function fechaLocalISO(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function crearAtencionDemo(id, diasAtras, datos) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - diasAtras);

  const atencion = {
    id,
    cliente: datos.cliente,
    barbero: datos.barbero,
    fecha: fechaLocalISO(fecha),
    hora: datos.hora,
    servicio: datos.servicio,
    precioServicio: datos.precioServicio,
    producto: datos.producto || "",
    cantidadProducto: datos.cantidadProducto || 0,
    total: datos.total,
    estado: datos.estado,
    fechaCobro: null,
    metodoPago: null,
  };

  if (datos.estado === "Cobrada") {
    const cobro = new Date(fecha);
    cobro.setHours(18, 30, 0, 0);

    atencion.fechaCobro = cobro.toISOString();
    atencion.metodoPago = datos.metodoPago;
  }

  return atencion;
}

function sembrarDatosDemo() {
  if (localStorage.getItem(CLAVE_SEMILLA_DEMO)) return;

  if (!localStorage.getItem(CLAVE_STOCK_DEMO)) {
    localStorage.setItem(
      CLAVE_STOCK_DEMO,
      JSON.stringify({
        "Pomada X": 2,
        "Aceite de barba": 3,
        Champú: 5,
        "Tónico capilar": 6,
      }),
    );
  }

  if (!localStorage.getItem(CLAVE_ATENCIONES_DEMO)) {
    const base = Date.now();
    const atenciones = [
      // Hoy: 2 efectivo, 1 transferencia y 1 débito (recaudación $195)
      crearAtencionDemo(base, 0, {
        cliente: "Lucía Fernández",
        barbero: "Charlie",
        hora: "10:00",
        servicio: "Corte clásico",
        precioServicio: 40,
        total: 40,
        estado: "Cobrada",
        metodoPago: "Efectivo",
      }),
      crearAtencionDemo(base - 1, 0, {
        cliente: "Martín Aguirre",
        barbero: "Charlie",
        hora: "11:30",
        servicio: "Corte clásico",
        precioServicio: 40,
        total: 40,
        estado: "Cobrada",
        metodoPago: "Efectivo",
      }),
      crearAtencionDemo(base - 2, 0, {
        cliente: "Sofía Ríos",
        barbero: "Diego",
        hora: "15:00",
        servicio: "Corte y barba",
        precioServicio: 55,
        total: 55,
        estado: "Cobrada",
        metodoPago: "Transferencia",
      }),
      crearAtencionDemo(base - 3, 0, {
        cliente: "Javier Ponce",
        barbero: "Diego",
        hora: "17:00",
        servicio: "Corte y barba",
        precioServicio: 55,
        producto: "Pomada X",
        cantidadProducto: 1,
        total: 60,
        estado: "Cobrada",
        metodoPago: "Débito",
      }),

      // Días previos: mezcla de atenciones cobradas y en curso
      crearAtencionDemo(base - 4, 1, {
        cliente: "Camila Suárez",
        barbero: "Charlie",
        hora: "09:30",
        servicio: "Corte y barba",
        precioServicio: 55,
        total: 55,
        estado: "Cobrada",
        metodoPago: "Efectivo",
      }),
      crearAtencionDemo(base - 5, 2, {
        cliente: "Nicolás Vera",
        barbero: "Diego",
        hora: "12:00",
        servicio: "Corte clásico",
        precioServicio: 40,
        total: 40,
        estado: "Cobrada",
        metodoPago: "Transferencia",
      }),
      crearAtencionDemo(base - 6, 2, {
        cliente: "Valentina Gómez",
        barbero: "Charlie",
        hora: "16:30",
        servicio: "Arreglo de barba",
        precioServicio: 25,
        total: 25,
        estado: "Finalizada",
      }),
      crearAtencionDemo(base - 7, 3, {
        cliente: "Bruno Salas",
        barbero: "Diego",
        hora: "10:30",
        servicio: "Corte clásico",
        precioServicio: 40,
        total: 40,
        estado: "Cobrada",
        metodoPago: "Débito",
      }),
      crearAtencionDemo(base - 8, 3, {
        cliente: "Florencia Paz",
        barbero: "Charlie",
        hora: "14:00",
        servicio: "Corte y barba",
        precioServicio: 55,
        total: 55,
        estado: "Pendiente de pago",
      }),
      crearAtencionDemo(base - 9, 3, {
        cliente: "Tomás Herrera",
        barbero: "Diego",
        hora: "18:00",
        servicio: "Arreglo de barba",
        precioServicio: 25,
        total: 25,
        estado: "Cobrada",
        metodoPago: "Efectivo",
      }),
      crearAtencionDemo(base - 10, 4, {
        cliente: "Agustina Molina",
        barbero: "Charlie",
        hora: "11:00",
        servicio: "Corte clásico",
        precioServicio: 40,
        producto: "Aceite de barba",
        cantidadProducto: 1,
        total: 55,
        estado: "Cobrada",
        metodoPago: "Efectivo",
      }),
      crearAtencionDemo(base - 11, 5, {
        cliente: "Franco Duarte",
        barbero: "Diego",
        hora: "13:30",
        servicio: "Corte y barba",
        precioServicio: 55,
        total: 55,
        estado: "En proceso",
      }),
      crearAtencionDemo(base - 12, 5, {
        cliente: "Micaela Torres",
        barbero: "Charlie",
        hora: "17:30",
        servicio: "Arreglo de barba",
        precioServicio: 25,
        total: 25,
        estado: "Cobrada",
        metodoPago: "Transferencia",
      }),
      crearAtencionDemo(base - 13, 6, {
        cliente: "Ramiro Castro",
        barbero: "Diego",
        hora: "12:30",
        servicio: "Corte clásico",
        precioServicio: 40,
        total: 40,
        estado: "Cobrada",
        metodoPago: "Efectivo",
      }),
    ];

    localStorage.setItem(CLAVE_ATENCIONES_DEMO, JSON.stringify(atenciones));
  }

  localStorage.setItem(CLAVE_SEMILLA_DEMO, "1");
}
