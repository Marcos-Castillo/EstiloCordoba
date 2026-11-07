// Datos de ejemplo para la demo del sistema (atenciones y stock iniciales).
const CLAVE_ATENCIONES_DEMO = "atencionesEstiloCordoba";
const CLAVE_STOCK_DEMO = "stockEstiloCordoba";
const CLAVE_SEMILLA_DEMO = "demoEstiloCordoba";
const CLAVE_CLIENTES_DEMO = "clientesEstiloCordoba";
const CLAVE_PROVEEDORES_DEMO = "proveedoresEstiloCordoba";

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

function clientesDemo() {
  return [
    {
      id: 1,
      nombre: "Lucía",
      apellido: "Fernández",
      tipoDocumento: "DNI",
      numeroDocumento: "32456789",
      telefono: "351 555-1001",
      correo: "lucia.fernandez@example.com",
      localidad: "Córdoba Capital",
      redesSociales: "Instagram: @luciaf",
      programaBeneficios: true,
    },
    {
      id: 2,
      nombre: "Martín",
      apellido: "Aguirre",
      tipoDocumento: "DNI",
      numeroDocumento: "30111222",
      telefono: "351 555-1002",
      correo: "martin.aguirre@example.com",
      localidad: "Córdoba Capital",
      redesSociales: "",
      programaBeneficios: false,
    },
    {
      id: 3,
      nombre: "Sofía",
      apellido: "Ríos",
      tipoDocumento: "DNI",
      numeroDocumento: "35678901",
      telefono: "351 555-1003",
      correo: "sofia.rios@example.com",
      localidad: "Villa Allende",
      redesSociales: "Instagram: @sofiar",
      programaBeneficios: true,
    },
    {
      id: 4,
      nombre: "Javier",
      apellido: "Ponce",
      tipoDocumento: "DNI",
      numeroDocumento: "28123456",
      telefono: "351 555-1004",
      correo: "javier.ponce@example.com",
      localidad: "Córdoba Capital",
      redesSociales: "",
      programaBeneficios: false,
    },
    {
      id: 5,
      nombre: "Camila",
      apellido: "Suárez",
      tipoDocumento: "DNI",
      numeroDocumento: "33123456",
      telefono: "351 555-1005",
      correo: "camila.suarez@example.com",
      localidad: "Córdoba Capital",
      redesSociales: "Instagram: @cami.suarez",
      programaBeneficios: true,
    },
    {
      id: 6,
      nombre: "Nicolás",
      apellido: "Vera",
      tipoDocumento: "DNI",
      numeroDocumento: "31234567",
      telefono: "351 555-1006",
      correo: "nicolas.vera@example.com",
      localidad: "Córdoba Capital",
      redesSociales: "",
      programaBeneficios: false,
    },
    {
      id: 7,
      nombre: "Valentina",
      apellido: "Gómez",
      tipoDocumento: "DNI",
      numeroDocumento: "36789012",
      telefono: "351 555-1007",
      correo: "valentina.gomez@example.com",
      localidad: "La Calera",
      redesSociales: "Instagram: @valen.gomez",
      programaBeneficios: true,
    },
    {
      id: 8,
      nombre: "Bruno",
      apellido: "Salas",
      tipoDocumento: "DNI",
      numeroDocumento: "29456789",
      telefono: "351 555-1008",
      correo: "bruno.salas@example.com",
      localidad: "Córdoba Capital",
      redesSociales: "",
      programaBeneficios: false,
    },
    {
      id: 9,
      nombre: "Florencia",
      apellido: "Paz",
      tipoDocumento: "DNI",
      numeroDocumento: "34567890",
      telefono: "351 555-1009",
      correo: "florencia.paz@example.com",
      localidad: "Córdoba Capital",
      redesSociales: "Instagram: @flor.paz",
      programaBeneficios: true,
    },
    {
      id: 10,
      nombre: "Tomás",
      apellido: "Herrera",
      tipoDocumento: "DNI",
      numeroDocumento: "30555111",
      telefono: "351 555-1010",
      correo: "tomas.herrera@example.com",
      localidad: "Córdoba Capital",
      redesSociales: "",
      programaBeneficios: false,
    },
    {
      id: 11,
      nombre: "Agustina",
      apellido: "Molina",
      tipoDocumento: "DNI",
      numeroDocumento: "33888999",
      telefono: "351 555-1011",
      correo: "agustina.molina@example.com",
      localidad: "Villa Carlos Paz",
      redesSociales: "Instagram: @agus.molina",
      programaBeneficios: true,
    },
    {
      id: 12,
      nombre: "Franco",
      apellido: "Duarte",
      tipoDocumento: "DNI",
      numeroDocumento: "27777444",
      telefono: "351 555-1012",
      correo: "franco.duarte@example.com",
      localidad: "Córdoba Capital",
      redesSociales: "",
      programaBeneficios: false,
    },
    {
      id: 13,
      nombre: "Micaela",
      apellido: "Torres",
      tipoDocumento: "DNI",
      numeroDocumento: "36111222",
      telefono: "351 555-1013",
      correo: "micaela.torres@example.com",
      localidad: "Córdoba Capital",
      redesSociales: "Instagram: @mica.torres",
      programaBeneficios: true,
    },
    {
      id: 14,
      nombre: "Ramiro",
      apellido: "Castro",
      tipoDocumento: "DNI",
      numeroDocumento: "29999888",
      telefono: "351 555-1014",
      correo: "ramiro.castro@example.com",
      localidad: "Córdoba Capital",
      redesSociales: "",
      programaBeneficios: false,
    },
  ];
}

function proveedoresDemo() {
  return [
    {
      id: 1,
      razonSocial: "Insumos SRL",
      cuit: "30712345678",
      telefono: "351 422-1000",
      correo: "ventas@insumos.com.ar",
      direccion: "Av. Colón 1234, Córdoba",
    },
    {
      id: 2,
      razonSocial: "Distribuidora Norte",
      cuit: "30709876543",
      telefono: "351 455-2000",
      correo: "contacto@distrinorte.com.ar",
      direccion: "Av. Juan B. Justo 2450, Córdoba",
    },
    {
      id: 3,
      razonSocial: "Barber Supply",
      cuit: "30701122334",
      telefono: "351 411-3300",
      correo: "hola@barbersupply.com.ar",
      direccion: "Duarte Quirós 780, Córdoba",
    },
  ];
}

function sembrarDatosDemo() {
  // Clientes y proveedores se siembran por separado para que esos módulos
  // tengan datos aunque la semilla general ya exista.
  if (!localStorage.getItem(CLAVE_CLIENTES_DEMO)) {
    localStorage.setItem(CLAVE_CLIENTES_DEMO, JSON.stringify(clientesDemo()));
  }

  if (!localStorage.getItem(CLAVE_PROVEEDORES_DEMO)) {
    localStorage.setItem(
      CLAVE_PROVEEDORES_DEMO,
      JSON.stringify(proveedoresDemo()),
    );
  }

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
