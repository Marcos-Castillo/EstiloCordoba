const CLAVE_SESION = "sesionEstiloCordoba";
const CLAVE_PROVEEDORES = "proveedoresEstiloCordoba";

const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION) || "null");

if (!sesion || sesion.rol !== "administrador") {
  window.location.href = "login.html";
} else {
  iniciarPagina();
}

function leerProveedores() {
  return JSON.parse(localStorage.getItem(CLAVE_PROVEEDORES) || "[]");
}

function guardarProveedores(proveedores) {
  localStorage.setItem(CLAVE_PROVEEDORES, JSON.stringify(proveedores));
}

function normalizarCuit(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function cuitDuplicado(cuit, excluirId) {
  const normalizado = normalizarCuit(cuit);

  return leerProveedores().some((proveedor) => {
    return (
      proveedor.id !== excluirId &&
      normalizarCuit(proveedor.cuit) === normalizado
    );
  });
}

function iniciarPagina() {
  if (typeof sembrarDatosDemo === "function") sembrarDatosDemo();

  const formulario = document.getElementById("formProveedor");
  const tituloFormulario = document.getElementById("tituloFormulario");
  const botonGuardar = document.getElementById("botonGuardar");
  const botonCancelar = document.getElementById("cancelarEdicion");
  const listaProveedores = document.getElementById("listaProveedores");
  const campoMensaje = document.getElementById("mensaje");

  const campos = {
    razonSocial: document.getElementById("razonSocial"),
    cuit: document.getElementById("cuit"),
    telefono: document.getElementById("telefono"),
    correo: document.getElementById("correo"),
    direccion: document.getElementById("direccion"),
  };

  let editandoId = null;

  document.getElementById("nombreUsuario").textContent = sesion.usuario;
  document.getElementById("rolUsuario").textContent = "Administrador";

  function mostrarMensaje(texto, error = false) {
    campoMensaje.textContent = texto;
    campoMensaje.classList.toggle("mensaje-error", Boolean(error));
  }

  function limpiarFormulario() {
    formulario.reset();
    editandoId = null;
    botonGuardar.textContent = "Guardar proveedor";
    tituloFormulario.textContent = "Registrar proveedor";
    botonCancelar.hidden = true;
  }

  function cargarProveedor(proveedor) {
    editandoId = proveedor.id;
    campos.razonSocial.value = proveedor.razonSocial;
    campos.cuit.value = proveedor.cuit;
    campos.telefono.value = proveedor.telefono || "";
    campos.correo.value = proveedor.correo || "";
    campos.direccion.value = proveedor.direccion || "";

    botonGuardar.textContent = "Guardar cambios";
    tituloFormulario.textContent = "Editar proveedor";
    botonCancelar.hidden = false;
    mostrarMensaje("");
    campos.razonSocial.focus();
  }

  function renderizarProveedores() {
    const proveedores = leerProveedores().sort((a, b) =>
      a.razonSocial.localeCompare(b.razonSocial, "es"),
    );

    listaProveedores.replaceChildren();

    if (proveedores.length === 0) {
      const fila = document.createElement("tr");
      const celda = document.createElement("td");
      celda.colSpan = 5;
      celda.className = "tabla-vacia";
      celda.textContent = "No hay proveedores registrados.";
      fila.appendChild(celda);
      listaProveedores.appendChild(fila);
      return;
    }

    proveedores.forEach((proveedor) => {
      const fila = document.createElement("tr");

      const contacto = [proveedor.telefono, proveedor.correo]
        .filter(Boolean)
        .join(" · ");

      [
        proveedor.razonSocial,
        proveedor.cuit,
        contacto || "—",
        proveedor.direccion || "—",
      ].forEach((valor) => {
        const celda = document.createElement("td");
        celda.textContent = valor;
        fila.appendChild(celda);
      });

      const celdaAcciones = document.createElement("td");

      const botonEditar = document.createElement("button");
      botonEditar.type = "button";
      botonEditar.textContent = "Editar";
      botonEditar.addEventListener("click", () => cargarProveedor(proveedor));

      const botonEliminar = document.createElement("button");
      botonEliminar.type = "button";
      botonEliminar.textContent = "Eliminar";
      botonEliminar.addEventListener("click", () => {
        const confirmado = window.confirm(
          `¿Eliminar el proveedor ${proveedor.razonSocial}?`,
        );
        if (!confirmado) return;

        guardarProveedores(
          leerProveedores().filter((item) => item.id !== proveedor.id),
        );

        if (editandoId === proveedor.id) limpiarFormulario();

        renderizarProveedores();
        mostrarMensaje("Proveedor eliminado.");
      });

      celdaAcciones.append(botonEditar, botonEliminar);
      fila.appendChild(celdaAcciones);
      listaProveedores.appendChild(fila);
    });
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    mostrarMensaje("");

    const datos = {
      razonSocial: campos.razonSocial.value.trim(),
      cuit: campos.cuit.value.trim(),
      telefono: campos.telefono.value.trim(),
      correo: campos.correo.value.trim(),
      direccion: campos.direccion.value.trim(),
    };

    if (!datos.razonSocial) {
      mostrarMensaje("Ingresá la razón social del proveedor.", true);
      return;
    }

    if (normalizarCuit(datos.cuit).length !== 11) {
      mostrarMensaje("El CUIT debe tener 11 dígitos.", true);
      return;
    }

    if (cuitDuplicado(datos.cuit, editandoId)) {
      mostrarMensaje("Ya existe un proveedor con ese CUIT.", true);
      return;
    }

    if (datos.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) {
      mostrarMensaje("Ingresá un correo electrónico válido.", true);
      return;
    }

    const telefonoDigitos = datos.telefono.replace(/\D/g, "");
    if (datos.telefono && telefonoDigitos.length < 6) {
      mostrarMensaje("Ingresá un teléfono válido.", true);
      return;
    }

    const proveedores = leerProveedores();
    let mensaje = "Proveedor registrado correctamente.";

    if (editandoId !== null) {
      const proveedor = proveedores.find((item) => item.id === editandoId);
      if (proveedor) {
        Object.assign(proveedor, datos);
        mensaje = "Proveedor actualizado correctamente.";
      }
    } else {
      proveedores.push({ id: Date.now(), ...datos });
    }

    guardarProveedores(proveedores);
    limpiarFormulario();
    renderizarProveedores();
    mostrarMensaje(mensaje);
  });

  botonCancelar.addEventListener("click", () => {
    limpiarFormulario();
    mostrarMensaje("");
  });

  document.getElementById("volverPanel").addEventListener("click", () => {
    window.location.href = "admin.html";
  });

  document.getElementById("cerrarSesion").addEventListener("click", () => {
    localStorage.removeItem(CLAVE_SESION);
    window.location.href = "login.html";
  });

  renderizarProveedores();
}
