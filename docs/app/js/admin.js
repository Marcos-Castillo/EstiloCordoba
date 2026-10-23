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
