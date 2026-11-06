const CLAVE_SESION = "sesionEstiloCordoba";
const CLAVE_ATENCIONES = "atencionesEstiloCordoba";
const CLAVE_STOCK = "stockEstiloCordoba";
const MEDIOS_PAGO = ["Efectivo", "Transferencia", "Débito"];
const STOCK_MINIMO = 5;

Chart.defaults.color = "#f5f2ec";
Chart.defaults.borderColor = "#33363b";
Chart.defaults.font.family = "'Segoe UI', Arial, sans-serif";

const sesionGuardada = localStorage.getItem(CLAVE_SESION);
let sesion = null;

if (sesionGuardada) {
  sesion = JSON.parse(sesionGuardada);
}

if (!sesion || sesion.rol !== "administrador") {
  window.location.href = "login.html";
} else {
  sembrarDatosDemo();

  document.getElementById("nombreUsuario").textContent = sesion.usuario;
  document.getElementById("rolUsuario").textContent = "Administrador";

  document.getElementById("volverPanel").addEventListener("click", () => {
    window.location.href = "admin.html";
  });

  document.getElementById("cerrarSesion").addEventListener("click", () => {
    localStorage.removeItem(CLAVE_SESION);
    window.location.href = "login.html";
  });

  renderizarReportes();
}

function leerAtenciones() {
  return JSON.parse(localStorage.getItem(CLAVE_ATENCIONES) || "[]");
}

function leerStock() {
  return JSON.parse(localStorage.getItem(CLAVE_STOCK) || "{}");
}

function formatearMoneda(valor) {
  return Number(valor).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

function calcularDatos() {
  const atenciones = leerAtenciones();
  const hoy = fechaLocalISO(new Date());

  const atencionesDelDia = atenciones.filter(
    (atencion) => atencion.fecha === hoy,
  );

  const cobradasDelDia = atenciones.filter(
    (atencion) =>
      atencion.estado === "Cobrada" &&
      atencion.fechaCobro &&
      fechaLocalISO(new Date(atencion.fechaCobro)) === hoy,
  );

  const recaudacionPorMedio = MEDIOS_PAGO.map((medio) =>
    cobradasDelDia
      .filter((atencion) => atencion.metodoPago === medio)
      .reduce((acumulado, atencion) => acumulado + Number(atencion.total || 0), 0),
  );

  const stock = leerStock();
  const stockBajo = Object.entries(stock)
    .filter(([, cantidad]) => Number(cantidad) < STOCK_MINIMO)
    .sort((a, b) => Number(a[1]) - Number(b[1]));

  const etiquetas = [];
  const atencionesPorDia = [];

  for (let diasAtras = 6; diasAtras >= 0; diasAtras -= 1) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - diasAtras);

    const fechaISO = fechaLocalISO(fecha);
    etiquetas.push(
      fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
    );
    atencionesPorDia.push(
      atenciones.filter((atencion) => atencion.fecha === fechaISO).length,
    );
  }

  return {
    atencionesDelDia,
    recaudacionPorMedio,
    stockBajo,
    etiquetas,
    atencionesPorDia,
  };
}

function renderizarReportes() {
  const {
    atencionesDelDia,
    recaudacionPorMedio,
    stockBajo,
    etiquetas,
    atencionesPorDia,
  } = calcularDatos();

  const recaudacionTotal = recaudacionPorMedio.reduce(
    (acumulado, valor) => acumulado + valor,
    0,
  );

  document.getElementById("atencionesHoy").textContent =
    atencionesDelDia.length;
  document.getElementById("recaudacionHoy").textContent =
    formatearMoneda(recaudacionTotal);
  document.getElementById("productosBajos").textContent = stockBajo.length;

  renderizarStockBajo(stockBajo);
  renderizarGraficoMedios(recaudacionPorMedio, recaudacionTotal);
  renderizarGraficoAtenciones(etiquetas, atencionesPorDia);
}

function renderizarStockBajo(stockBajo) {
  const cuerpo = document.getElementById("listaStockBajo");
  const aviso = document.getElementById("sinStockBajo");

  cuerpo.replaceChildren();

  stockBajo.forEach(([producto, cantidad]) => {
    const fila = document.createElement("tr");

    const celdaProducto = document.createElement("td");
    celdaProducto.textContent = producto;

    const celdaCantidad = document.createElement("td");
    celdaCantidad.textContent = cantidad;

    fila.append(celdaProducto, celdaCantidad);
    cuerpo.appendChild(fila);
  });

  aviso.hidden = stockBajo.length > 0;
}

function renderizarGraficoMedios(recaudacionPorMedio, recaudacionTotal) {
  const contenedor = document
    .getElementById("graficoMedios")
    .closest(".grafico");
  const aviso = document.getElementById("sinDatosMedios");

  if (recaudacionTotal === 0) {
    contenedor.hidden = true;
    aviso.hidden = false;
    return;
  }

  contenedor.hidden = false;
  aviso.hidden = true;

  new Chart(document.getElementById("graficoMedios"), {
    type: "doughnut",
    data: {
      labels: MEDIOS_PAGO,
      datasets: [
        {
          data: recaudacionPorMedio,
          backgroundColor: ["#d4ad65", "#7fb3ff", "#9fd3a8"],
          borderColor: "#1b1d20",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 14, padding: 16 },
        },
        tooltip: {
          callbacks: {
            label: (contexto) =>
              `${contexto.label}: ${formatearMoneda(contexto.parsed)}`,
          },
        },
      },
    },
  });
}

function renderizarGraficoAtenciones(etiquetas, atencionesPorDia) {
  const contenedor = document
    .getElementById("graficoAtenciones")
    .closest(".grafico");
  const aviso = document.getElementById("sinDatosAtenciones");
  const total = atencionesPorDia.reduce(
    (acumulado, valor) => acumulado + valor,
    0,
  );

  if (total === 0) {
    contenedor.hidden = true;
    aviso.hidden = false;
    return;
  }

  contenedor.hidden = false;
  aviso.hidden = true;

  new Chart(document.getElementById("graficoAtenciones"), {
    type: "bar",
    data: {
      labels: etiquetas,
      datasets: [
        {
          label: "Atenciones",
          data: atencionesPorDia,
          backgroundColor: "#d4ad65",
          borderRadius: 6,
          maxBarThickness: 42,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
        },
      },
    },
  });
}
