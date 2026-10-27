const sesionGuardada = localStorage.getItem("sesionEstiloCordoba");

// Si no hay una sesión válida de administrador, volver al login
if (!sesionGuardada) {
  window.location.href = "login.html";
} else {
  const sesion = JSON.parse(sesionGuardada);

  if (sesion.rol !== "administrador") {
    window.location.href = "login.html";
  } else {
    const nombreUsuario = document.getElementById("nombreUsuario");
    const rolUsuario = document.getElementById("rolUsuario");

    nombreUsuario.textContent = sesion.usuario;
    rolUsuario.textContent = "Administrador";
  }
}

// Cerrar sesión
const botonCerrarSesion = document.getElementById("cerrarSesion");

botonCerrarSesion.addEventListener("click", function () {
  localStorage.removeItem("sesionEstiloCordoba");
  window.location.href = "login.html";
});

// Gestor de stock (misma clave que usa la página de atenciones)
const CLAVE_STOCK = "stockEstiloCordoba";
const listaStock = document.getElementById("listaStock");

function leerStock() {
  return JSON.parse(localStorage.getItem(CLAVE_STOCK) || "{}");
}

function guardarStock(stock) {
  localStorage.setItem(CLAVE_STOCK, JSON.stringify(stock));
}

// Agrega los productos que falten sin modificar el stock existente.
function asegurarStockInicial() {
  const iniciales = {
    "Pomada X": 5,
    "Aceite de barba": 5,
    Champú: 5,
    "Tónico capilar": 5,
  };
  const stock = leerStock();
  let huboCambios = false;

  for (const [producto, cantidad] of Object.entries(iniciales)) {
    if (!Object.prototype.hasOwnProperty.call(stock, producto)) {
      stock[producto] = cantidad;
      huboCambios = true;
    }
  }

  if (huboCambios) {
    guardarStock(stock);
  }
}

function renderizarStock() {
  const stock = leerStock();
  listaStock.replaceChildren();

  Object.entries(stock).forEach(([producto, cantidad]) => {
    const fila = document.createElement("tr");

    const celdaProducto = document.createElement("td");
    celdaProducto.textContent = producto;

    const celdaCantidad = document.createElement("td");
    celdaCantidad.textContent = cantidad;

    const celdaAcciones = document.createElement("td");

    const menos = document.createElement("button");
    menos.type = "button";
    menos.textContent = "−";
    menos.addEventListener("click", () => ajustarStock(producto, cantidad - 1));

    const mas = document.createElement("button");
    mas.type = "button";
    mas.textContent = "+";
    mas.addEventListener("click", () => ajustarStock(producto, cantidad + 1));

    celdaAcciones.append(menos, mas);
    fila.append(celdaProducto, celdaCantidad, celdaAcciones);
    listaStock.appendChild(fila);
  });
}

function ajustarStock(producto, nuevaCantidad) {
  if (!Number.isInteger(nuevaCantidad) || nuevaCantidad < 0) return;

  const stock = leerStock();
  stock[producto] = nuevaCantidad;
  guardarStock(stock);
  renderizarStock();
}

if (sesionGuardada && JSON.parse(sesionGuardada).rol === "administrador") {
  asegurarStockInicial();
  renderizarStock();
}
