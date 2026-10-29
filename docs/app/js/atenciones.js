const CLAVE_SESION = "sesionEstiloCordoba";
const CLAVE_ATENCIONES = "atencionesEstiloCordoba";
const CLAVE_STOCK = "stockEstiloCordoba";

const PRODUCTOS_INICIALES = {
  "Pomada X": 5,
  "Aceite de barba": 5,
  Champú: 5,
  "Tónico capilar": 5,
};

const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION) || "null");

if (!sesion || !["administrador", "barbero"].includes(sesion.rol)) {
  window.location.href = "login.html";
} else {
  iniciarPagina();
}

function leerAtenciones() {
  return JSON.parse(localStorage.getItem(CLAVE_ATENCIONES) || "[]");
}

function guardarAtenciones(atenciones) {
  localStorage.setItem(CLAVE_ATENCIONES, JSON.stringify(atenciones));
}

function leerStock() {
  return JSON.parse(localStorage.getItem(CLAVE_STOCK) || "{}");
}

function guardarStock(stock) {
  localStorage.setItem(CLAVE_STOCK, JSON.stringify(stock));
}

// Agrega los productos que falten sin modificar el stock existente.
function asegurarStockInicial() {
  const stock = leerStock();
  let huboCambios = false;

  for (const [producto, cantidad] of Object.entries(PRODUCTOS_INICIALES)) {
    if (!Object.prototype.hasOwnProperty.call(stock, producto)) {
      stock[producto] = cantidad;
      huboCambios = true;
    }
  }

  if (huboCambios) {
    guardarStock(stock);
  }
}

function iniciarPagina() {
  asegurarStockInicial();

  const formulario = document.getElementById("formAtencion");
  const campoCliente = document.getElementById("cliente");
  const campoBarbero = document.getElementById("barbero");
  const campoFecha = document.getElementById("fecha");
  const campoHora = document.getElementById("hora");
  const campoServicio = document.getElementById("servicio");
  const campoPrecio = document.getElementById("precioServicio");
  const campoProducto = document.getElementById("producto");
  const campoCantidad = document.getElementById("cantidadProducto");
  const campoTotal = document.getElementById("total");
  const campoMensaje = document.getElementById("mensaje");
  const listaAtenciones = document.getElementById("listaAtenciones");

  document.getElementById("nombreUsuario").textContent =
    sesion.nombre || sesion.usuario || "Usuario";

  document.getElementById("rolUsuario").textContent = sesion.rol;
  document.getElementById("perfilActual").textContent =
    sesion.rol === "administrador"
      ? "Panel de administración"
      : "Panel de barbero";

  // Guarda el rótulo base de cada opción y muestra el stock disponible junto a cada producto del select.
  Array.from(campoProducto.options).forEach((opcion) => {
    opcion.dataset.rotuloBase = opcion.textContent.trim();
  });

  function actualizarStickersStock() {
    const stockVigente = leerStock();

    Array.from(campoProducto.options).forEach((opcion) => {
      if (
        opcion.value &&
        Object.prototype.hasOwnProperty.call(stockVigente, opcion.value)
      ) {
        opcion.textContent = `${opcion.dataset.rotuloBase} (stock ${stockVigente[opcion.value]})`;
      }
    });
  }

  actualizarStickersStock();

  // Establece el precio del servicio seleccionado.
  campoServicio.addEventListener("change", () => {
    const opcion = campoServicio.selectedOptions[0];
    campoPrecio.value = opcion?.dataset.precio || "";
    calcularTotal();
  });

  campoPrecio.addEventListener("input", calcularTotal);
  campoProducto.addEventListener("change", calcularTotal);
  campoCantidad.addEventListener("input", calcularTotal);

  // Aviso inmediato cuando la cantidad excede el stock disponible (TC-06).
  const botonRegistrar = formulario.querySelector("button[type='submit']");

  function validarStockEnVivo() {
    const productoVivo = campoProducto.value;
    const cantidadViva = Number(campoCantidad.value || 0);
    const stockVigente = leerStock();
    const disponible = stockVigente[productoVivo];
    const sinStock =
      productoVivo &&
      Number.isInteger(cantidadViva) &&
      cantidadViva > 0 &&
      Object.prototype.hasOwnProperty.call(stockVigente, productoVivo) &&
      disponible < cantidadViva;

    if (sinStock) {
      mostrarMensaje(
        `Stock insuficiente de ${productoVivo}. Disponible: ${disponible}.`,
        true,
      );
    } else if (botonRegistrar.disabled) {
      mostrarMensaje("");
    }

    botonRegistrar.disabled = sinStock;
  }

  campoProducto.addEventListener("change", validarStockEnVivo);
  campoCantidad.addEventListener("input", validarStockEnVivo);

  function calcularTotal() {
    const precioServicio = Number(campoPrecio.value) || 0;
    const precioProducto = Number(
      campoProducto.selectedOptions[0]?.dataset.precio || 0,
    );
    const cantidad = Number(campoCantidad.value) || 0;
    const total = precioServicio + precioProducto * cantidad;

    campoTotal.textContent = total.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });
  }

  function mostrarMensaje(texto, error = false) {
    campoMensaje.textContent = texto;
    campoMensaje.style.color = error ? "red" : "green";
  }

  function nombreValido(nombre) {
    return (
      /^[\p{L}][\p{L}\s'-]*[\p{L}]$/u.test(nombre.trim()) &&
      (nombre.match(/\p{L}/gu) || []).length >= 2
    );
  }

  function fechaValida(fecha) {
    if (!fecha) return false;

    const seleccionada = new Date(`${fecha}T00:00:00`);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return !Number.isNaN(seleccionada.getTime()) && seleccionada >= hoy;
  }

  function horarioValido(hora) {
    return /^\d{2}:\d{2}$/.test(hora) && hora >= "09:00" && hora <= "19:00";
  }

  function turnoOcupado(barbero, fecha, hora, atenciones) {
    return atenciones.some((atencion) => {
      const mismoBarbero =
        atencion.barbero.trim().toLowerCase() === barbero.trim().toLowerCase();

      return (
        mismoBarbero &&
        atencion.fecha === fecha &&
        atencion.hora === hora &&
        atencion.estado !== "Cobrada"
      );
    });
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    mostrarMensaje("");

    const cliente = campoCliente.value.trim();
    const barbero = campoBarbero.value.trim();
    const fecha = campoFecha.value;
    const hora = campoHora.value;
    const servicio = campoServicio.value;
    const precioServicio = Number(campoPrecio.value);
    const producto = campoProducto.value;
    const cantidadProducto = Number(campoCantidad.value || 0);

    // TC-04: mensaje esperado cuando falta el cliente.
    if (!cliente) {
      mostrarMensaje("Debe seleccionar un cliente", true);
      return;
    }

    if (!nombreValido(cliente)) {
      mostrarMensaje("Debe seleccionar un cliente.", true);
      return;
    }

    if (!nombreValido(barbero)) {
      mostrarMensaje("Ingresá un nombre válido para el barbero.", true);
      return;
    }

    if (!servicio) {
      mostrarMensaje("Seleccioná un servicio.", true);
      return;
    }

    if (!fechaValida(fecha)) {
      mostrarMensaje("La fecha no puede ser anterior a hoy.", true);
      return;
    }

    if (!horarioValido(hora)) {
      mostrarMensaje(
        "El horario debe estar entre las 09:00 y las 19:00.",
        true,
      );
      return;
    }

    if (!Number.isFinite(precioServicio) || precioServicio < 0) {
      mostrarMensaje("Ingresá un precio de servicio válido.", true);
      return;
    }

    if (!Number.isInteger(cantidadProducto) || cantidadProducto < 0) {
      mostrarMensaje(
        "La cantidad de productos debe ser un entero igual o mayor a cero.",
        true,
      );
      return;
    }

    if (!producto && cantidadProducto > 0) {
      mostrarMensaje("Seleccioná un producto para indicar una cantidad.", true);
      return;
    }

    if (producto && cantidadProducto === 0) {
      mostrarMensaje(
        "Si seleccionás un producto, indicá una cantidad mayor que cero.",
        true,
      );
      return;
    }

    const atenciones = leerAtenciones();
    const stock = leerStock();

    if (turnoOcupado(barbero, fecha, hora, atenciones)) {
      mostrarMensaje(
        "Ese barbero ya tiene una atención registrada para esa fecha y horario.",
        true,
      );
      return;
    }

    if (producto && !Object.prototype.hasOwnProperty.call(stock, producto)) {
      mostrarMensaje(
        "El producto seleccionado no tiene stock configurado.",
        true,
      );
      return;
    }

    if (producto && stock[producto] < cantidadProducto) {
      mostrarMensaje(
        `Stock insuficiente de ${producto}. Disponible: ${stock[producto]}.`,
        true,
      );
      return;
    }

    const precioProducto = Number(
      campoProducto.selectedOptions[0]?.dataset.precio || 0,
    );

    const total = precioServicio + precioProducto * cantidadProducto;

    const nuevaAtencion = {
      id: Date.now(),
      cliente,
      barbero,
      fecha,
      hora,
      servicio,
      precioServicio,
      producto: producto || "",
      cantidadProducto,
      total,
      estado: "Registrada",
      fechaCobro: null,
      metodoPago: null,
    };

    // Descuenta solamente el producto seleccionado.
    if (producto && cantidadProducto > 0) {
      stock[producto] -= cantidadProducto;
      guardarStock(stock);
    }

    atenciones.push(nuevaAtencion);
    guardarAtenciones(atenciones);

    formulario.reset();
    campoPrecio.value = "";
    campoCantidad.value = "0";
    calcularTotal();
    actualizarStickersStock();
    validarStockEnVivo();

    mostrarMensaje("Atención registrada correctamente.");
    renderizarAtenciones();
  });

  function renderizarAtenciones() {
    const atenciones = leerAtenciones();
    listaAtenciones.replaceChildren();

    function textoEstado(atencion) {
      if (atencion.estado !== "Cobrada" || !atencion.fechaCobro) {
        return atencion.estado;
      }

      const fechaCobro = new Date(atencion.fechaCobro).toLocaleString(
        "es-AR",
        { dateStyle: "short", timeStyle: "short" },
      );

      return [atencion.estado, atencion.metodoPago, fechaCobro]
        .filter(Boolean)
        .join(" · ");
    }

    atenciones.forEach((atencion) => {
      const fila = document.createElement("tr");

      [
        atencion.cliente,
        atencion.barbero,
        atencion.fecha,
        atencion.hora,
        Number(atencion.total).toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        }),
        textoEstado(atencion),
      ].forEach((valor) => {
        const celda = document.createElement("td");
        celda.textContent = valor ?? "";
        fila.appendChild(celda);
      });

      const celdaAcciones = document.createElement("td");

      if (atencion.estado === "Registrada") {
        agregarBoton("Iniciar", () => cambiarEstado(atencion.id, "En proceso"));
        agregarAyuda("Primero debe finalizarse la atención");
      } else if (atencion.estado === "En proceso") {
        agregarBoton("Finalizar", () =>
          cambiarEstado(atencion.id, "Finalizada"),
        );
        agregarAyuda("Primero debe finalizarse la atención");
      } else if (atencion.estado === "Finalizada") {
        agregarBoton("Pendiente de pago", () =>
          cambiarEstado(atencion.id, "Pendiente de pago"),
        );
      } else if (atencion.estado === "Pendiente de pago") {
        agregarBoton("Cobrar", () => cobrarAtencion(atencion.id));
      }

      fila.appendChild(celdaAcciones);
      listaAtenciones.appendChild(fila);

      function agregarBoton(texto, accion) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = texto;
        boton.addEventListener("click", accion);
        celdaAcciones.appendChild(boton);
      }

      function agregarAyuda(texto) {
        const ayuda = document.createElement("small");
        ayuda.className = "ayuda-estado";
        ayuda.textContent = texto;
        celdaAcciones.appendChild(ayuda);
      }
    });
  }

  function cambiarEstado(id, nuevoEstado) {
    const atenciones = leerAtenciones();
    const atencion = atenciones.find((item) => item.id === id);

    if (!atencion) return;

    atencion.estado = nuevoEstado;
    guardarAtenciones(atenciones);
    renderizarAtenciones();
  }

  function cobrarAtencion(id) {
    const metodoPago = prompt(
      "Seleccioná el método de pago escribiendo una opción:\nEfectivo\nTransferencia\nDébito",
    );

    if (metodoPago === null) return;

    const metodosValidos = ["efectivo", "transferencia", "débito", "debito"];
    const metodoNormalizado = metodoPago.trim().toLowerCase();

    if (!metodosValidos.includes(metodoNormalizado)) {
      alert(
        "Método de pago no válido. Escribí Efectivo, Transferencia o Débito.",
      );
      return;
    }

    const nombreMetodo =
      metodoNormalizado === "debito" || metodoNormalizado === "débito"
        ? "Débito"
        : metodoNormalizado.charAt(0).toUpperCase() +
          metodoNormalizado.slice(1);

    const atenciones = leerAtenciones();
    const atencion = atenciones.find((item) => item.id === id);

    if (!atencion || atencion.estado !== "Pendiente de pago") return;

    atencion.estado = "Cobrada";
    atencion.metodoPago = nombreMetodo;
    atencion.fechaCobro = new Date().toISOString();

    guardarAtenciones(atenciones);
    renderizarAtenciones();
    alert(`Pago registrado mediante ${nombreMetodo}.`);
  }

  document.getElementById("volverPanel").addEventListener("click", () => {
    window.location.href =
      sesion.rol === "administrador" ? "admin.html" : "barbero.html";
  });

  document.getElementById("cerrarSesion").addEventListener("click", () => {
    localStorage.removeItem(CLAVE_SESION);
    window.location.href = "login.html";
  });

  renderizarAtenciones();
  calcularTotal();
}
