const CLAVE_SESION = "sesionEstiloCordoba";
const CLAVE_PROVEEDORES = "proveedoresEstiloCordoba";
const CLAVE_COMPRAS = "comprasEstiloCordoba";
const CLAVE_STOCK = "stockEstiloCordoba";

const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION) || "null");

if (!sesion || sesion.rol !== "administrador") {
  window.location.href = "login.html";
} else {
  iniciarPagina();
}

function leerProveedores() {
  return JSON.parse(localStorage.getItem(CLAVE_PROVEEDORES) || "[]");
}

function leerCompras() {
  return JSON.parse(localStorage.getItem(CLAVE_COMPRAS) || "[]");
}

function guardarCompras(compras) {
  localStorage.setItem(CLAVE_COMPRAS, JSON.stringify(compras));
}

function leerStock() {
  return JSON.parse(localStorage.getItem(CLAVE_STOCK) || "{}");
}

function guardarStock(stock) {
  localStorage.setItem(CLAVE_STOCK, JSON.stringify(stock));
}

function fechaLocalISO(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

function formatearMoneda(valor) {
  return Number(valor).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

function iniciarPagina() {
  if (typeof sembrarDatosDemo === "function") sembrarDatosDemo();

  const formulario = document.getElementById("formCompra");
  const campoProveedor = document.getElementById("proveedor");
  const campoProducto = document.getElementById("producto");
  const campoCantidad = document.getElementById("cantidad");
  const campoCosto = document.getElementById("costoUnitario");
  const campoFecha = document.getElementById("fecha");
  const campoStockActual = document.getElementById("stockActual");
  const campoTotal = document.getElementById("totalCompra");
  const campoMensaje = document.getElementById("mensaje");
  const listaCompras = document.getElementById("listaCompras");

  document.getElementById("nombreUsuario").textContent = sesion.usuario;
  document.getElementById("rolUsuario").textContent = "Administrador";
  campoFecha.value = fechaLocalISO(new Date());

  function mostrarMensaje(texto, error = false) {
    campoMensaje.textContent = texto;
    campoMensaje.classList.toggle("mensaje-error", Boolean(error));
  }

  function cargarProveedores() {
    const proveedores = leerProveedores().sort((a, b) =>
      a.razonSocial.localeCompare(b.razonSocial, "es"),
    );

    campoProveedor.replaceChildren(new Option("Seleccioná un proveedor", ""));
    proveedores.forEach((proveedor) => {
      campoProveedor.appendChild(
        new Option(proveedor.razonSocial, proveedor.razonSocial),
      );
    });

    if (proveedores.length === 0) {
      campoProveedor.options[0].textContent = "No hay proveedores registrados";
    }
  }

  function cargarProductos() {
    const productos = Object.keys(leerStock()).sort((a, b) =>
      a.localeCompare(b, "es"),
    );

    campoProducto.replaceChildren(new Option("Seleccioná un producto", ""));
    productos.forEach((producto) => {
      campoProducto.appendChild(new Option(producto, producto));
    });

    if (productos.length === 0) {
      campoProducto.options[0].textContent = "No hay productos en el stock";
    }
  }

  function actualizarStockActual() {
    const stock = leerStock();
    const producto = campoProducto.value;

    campoStockActual.value = Object.prototype.hasOwnProperty.call(
      stock,
      producto,
    )
      ? `${stock[producto]} unidad(es)`
      : "—";
  }

  function calcularTotal() {
    const cantidad = Number(campoCantidad.value) || 0;
    const costo = Number(campoCosto.value) || 0;
    campoTotal.textContent = formatearMoneda(cantidad * costo);
  }

  campoCantidad.addEventListener("input", calcularTotal);
  campoCosto.addEventListener("input", calcularTotal);
  campoProducto.addEventListener("change", actualizarStockActual);

  function renderizarCompras() {
    const compras = leerCompras().sort((a, b) => {
      if (a.fecha !== b.fecha) return b.fecha.localeCompare(a.fecha);
      return b.id - a.id;
    });

    listaCompras.replaceChildren();

    if (compras.length === 0) {
      const fila = document.createElement("tr");
      const celda = document.createElement("td");
      celda.colSpan = 6;
      celda.className = "tabla-vacia";
      celda.textContent = "Todavía no hay compras registradas.";
      fila.appendChild(celda);
      listaCompras.appendChild(fila);
      return;
    }

    compras.forEach((compra) => {
      const fila = document.createElement("tr");

      [
        compra.fecha,
        compra.proveedor,
        compra.producto,
        compra.cantidad,
        formatearMoneda(compra.costoUnitario),
        formatearMoneda(compra.total),
      ].forEach((valor) => {
        const celda = document.createElement("td");
        celda.textContent = valor;
        fila.appendChild(celda);
      });

      listaCompras.appendChild(fila);
    });
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    mostrarMensaje("");

    const proveedor = campoProveedor.value;
    const producto = campoProducto.value;
    const cantidad = Number(campoCantidad.value);
    const costoUnitario = Number(campoCosto.value);
    const fecha = campoFecha.value;

    if (!proveedor) {
      mostrarMensaje("Seleccioná un proveedor.", true);
      return;
    }

    if (!producto) {
      mostrarMensaje("Seleccioná un producto.", true);
      return;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      mostrarMensaje("La cantidad debe ser un entero mayor que cero.", true);
      return;
    }

    if (!Number.isFinite(costoUnitario) || costoUnitario < 0) {
      mostrarMensaje("Ingresá un costo unitario válido.", true);
      return;
    }

    if (!fecha) {
      mostrarMensaje("Seleccioná la fecha de la compra.", true);
      return;
    }

    const stock = leerStock();
    if (!Object.prototype.hasOwnProperty.call(stock, producto)) {
      mostrarMensaje("El producto seleccionado no existe en el stock.", true);
      return;
    }

    const compras = leerCompras();
    compras.push({
      id: Date.now(),
      fecha,
      proveedor,
      producto,
      cantidad,
      costoUnitario,
      total: cantidad * costoUnitario,
    });

    // La compra repone el stock del producto.
    stock[producto] = Number(stock[producto]) + cantidad;

    guardarCompras(compras);
    guardarStock(stock);

    formulario.reset();
    campoFecha.value = fechaLocalISO(new Date());
    campoCantidad.value = "1";
    calcularTotal();
    cargarProveedores();
    cargarProductos();
    actualizarStockActual();
    renderizarCompras();
    mostrarMensaje(
      `Compra registrada: se repuso el stock de ${producto} (+${cantidad}).`,
    );
  });

  document.getElementById("volverPanel").addEventListener("click", () => {
    window.location.href = "admin.html";
  });

  document.getElementById("cerrarSesion").addEventListener("click", () => {
    localStorage.removeItem(CLAVE_SESION);
    window.location.href = "login.html";
  });

  cargarProveedores();
  cargarProductos();
  actualizarStockActual();
  calcularTotal();
  renderizarCompras();
}
