const CLAVE_SESION = "sesionEstiloCordoba";
const CLAVE_CLIENTES = "clientesEstiloCordoba";

const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION) || "null");

if (!sesion || sesion.rol !== "administrador") {
  window.location.href = "login.html";
} else {
  iniciarPagina();
}

function leerClientes() {
  return JSON.parse(localStorage.getItem(CLAVE_CLIENTES) || "[]");
}

function guardarClientes(clientes) {
  localStorage.setItem(CLAVE_CLIENTES, JSON.stringify(clientes));
}

function normalizar(valor) {
  return String(valor || "")
    .replace(/[^0-9a-zA-Z]/g, "")
    .toLowerCase();
}

function documentoDuplicado(tipoDocumento, numeroDocumento, excluirId) {
  const tipo = normalizar(tipoDocumento);
  const numero = normalizar(numeroDocumento);

  return leerClientes().some((cliente) => {
    return (
      cliente.id !== excluirId &&
      normalizar(cliente.tipoDocumento) === tipo &&
      normalizar(cliente.numeroDocumento) === numero
    );
  });
}

function iniciarPagina() {
  if (typeof sembrarDatosDemo === "function") sembrarDatosDemo();

  const formulario = document.getElementById("formCliente");
  const tituloFormulario = document.getElementById("tituloFormulario");
  const botonGuardar = document.getElementById("botonGuardar");
  const botonCancelar = document.getElementById("cancelarEdicion");
  const listaClientes = document.getElementById("listaClientes");
  const campoMensaje = document.getElementById("mensaje");

  const campos = {
    nombre: document.getElementById("nombre"),
    apellido: document.getElementById("apellido"),
    tipoDocumento: document.getElementById("tipoDocumento"),
    numeroDocumento: document.getElementById("numeroDocumento"),
    telefono: document.getElementById("telefono"),
    correo: document.getElementById("correo"),
    localidad: document.getElementById("localidad"),
    redesSociales: document.getElementById("redesSociales"),
    programaBeneficios: document.getElementById("programaBeneficios"),
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
    botonGuardar.textContent = "Guardar cliente";
    tituloFormulario.textContent = "Registrar cliente";
    botonCancelar.hidden = true;
  }

  function cargarCliente(cliente) {
    editandoId = cliente.id;
    campos.nombre.value = cliente.nombre;
    campos.apellido.value = cliente.apellido;
    campos.tipoDocumento.value = cliente.tipoDocumento;
    campos.numeroDocumento.value = cliente.numeroDocumento;
    campos.telefono.value = cliente.telefono || "";
    campos.correo.value = cliente.correo || "";
    campos.localidad.value = cliente.localidad || "";
    campos.redesSociales.value = cliente.redesSociales || "";
    campos.programaBeneficios.checked = Boolean(cliente.programaBeneficios);

    botonGuardar.textContent = "Guardar cambios";
    tituloFormulario.textContent = "Editar cliente";
    botonCancelar.hidden = false;
    mostrarMensaje("");
    campos.nombre.focus();
  }

  function renderizarClientes() {
    const clientes = leerClientes().sort((a, b) => {
      const apellido = a.apellido.localeCompare(b.apellido, "es");
      return apellido !== 0 ? apellido : a.nombre.localeCompare(b.nombre, "es");
    });

    listaClientes.replaceChildren();

    if (clientes.length === 0) {
      const fila = document.createElement("tr");
      const celda = document.createElement("td");
      celda.colSpan = 6;
      celda.className = "tabla-vacia";
      celda.textContent = "No hay clientes registrados.";
      fila.appendChild(celda);
      listaClientes.appendChild(fila);
      return;
    }

    clientes.forEach((cliente) => {
      const fila = document.createElement("tr");

      const contacto = [cliente.telefono, cliente.correo]
        .filter(Boolean)
        .join(" · ");

      [
        `${cliente.apellido}, ${cliente.nombre}`,
        `${cliente.tipoDocumento} ${cliente.numeroDocumento}`,
        contacto || "—",
        cliente.localidad || "—",
        cliente.programaBeneficios ? "Sí" : "No",
      ].forEach((valor) => {
        const celda = document.createElement("td");
        celda.textContent = valor;
        fila.appendChild(celda);
      });

      const celdaAcciones = document.createElement("td");

      const botonEditar = document.createElement("button");
      botonEditar.type = "button";
      botonEditar.textContent = "Editar";
      botonEditar.addEventListener("click", () => cargarCliente(cliente));

      const botonEliminar = document.createElement("button");
      botonEliminar.type = "button";
      botonEliminar.textContent = "Eliminar";
      botonEliminar.addEventListener("click", () => {
        const confirmado = window.confirm(
          `¿Eliminar el cliente ${cliente.nombre} ${cliente.apellido}?`,
        );
        if (!confirmado) return;

        guardarClientes(
          leerClientes().filter((item) => item.id !== cliente.id),
        );

        if (editandoId === cliente.id) limpiarFormulario();

        renderizarClientes();
        mostrarMensaje("Cliente eliminado.");
      });

      celdaAcciones.append(botonEditar, botonEliminar);
      fila.appendChild(celdaAcciones);
      listaClientes.appendChild(fila);
    });
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    mostrarMensaje("");

    const datos = {
      nombre: campos.nombre.value.trim(),
      apellido: campos.apellido.value.trim(),
      tipoDocumento: campos.tipoDocumento.value,
      numeroDocumento: campos.numeroDocumento.value.trim(),
      telefono: campos.telefono.value.trim(),
      correo: campos.correo.value.trim(),
      localidad: campos.localidad.value.trim(),
      redesSociales: campos.redesSociales.value.trim(),
      programaBeneficios: campos.programaBeneficios.checked,
    };

    if (!datos.nombre || !datos.apellido) {
      mostrarMensaje("Completá el nombre y el apellido del cliente.", true);
      return;
    }

    if (!/^[\p{L}][\p{L}\s'-]*$/u.test(datos.nombre)) {
      mostrarMensaje("Ingresá un nombre válido.", true);
      return;
    }

    if (!/^[\p{L}][\p{L}\s'-]*$/u.test(datos.apellido)) {
      mostrarMensaje("Ingresá un apellido válido.", true);
      return;
    }

    if (!datos.tipoDocumento || !datos.numeroDocumento) {
      mostrarMensaje(
        "Completá el tipo y el número de documento del cliente.",
        true,
      );
      return;
    }

    if (!/^[0-9A-Za-z-]{5,20}$/.test(datos.numeroDocumento)) {
      mostrarMensaje("Ingresá un número de documento válido.", true);
      return;
    }

    if (
      documentoDuplicado(
        datos.tipoDocumento,
        datos.numeroDocumento,
        editandoId,
      )
    ) {
      mostrarMensaje(
        "Ya existe un cliente con ese tipo y número de documento.",
        true,
      );
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

    const clientes = leerClientes();
    let mensaje = "Cliente registrado correctamente.";

    if (editandoId !== null) {
      const cliente = clientes.find((item) => item.id === editandoId);
      if (cliente) {
        Object.assign(cliente, datos);
        mensaje = "Cliente actualizado correctamente.";
      }
    } else {
      clientes.push({ id: Date.now(), ...datos });
    }

    guardarClientes(clientes);
    limpiarFormulario();
    renderizarClientes();
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

  renderizarClientes();
}
