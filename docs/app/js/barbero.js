const sesionGuardada = localStorage.getItem("sesionEstiloCordoba");

// Verificar que exista una sesión
if (!sesionGuardada) {
  window.location.href = "login.html";
} else {
  const sesion = JSON.parse(sesionGuardada);

  // Este panel solo permite el perfil barbero
  if (sesion.rol !== "barbero") {
    window.location.href = "login.html";
  } else {
    document.getElementById("nombreUsuario").textContent = sesion.usuario;
    document.getElementById("rolUsuario").textContent = "Barbero";
  }
}

// Cerrar sesión
const botonCerrarSesion = document.getElementById("cerrarSesion");

botonCerrarSesion.addEventListener("click", function () {
  localStorage.removeItem("sesionEstiloCordoba");
  window.location.href = "login.html";
});
