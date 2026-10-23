const formulario = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");

// Usuarios de prueba para el desarrollo
const usuarios = [
  {
    usuario: "admin",
    contrasena: "admin123",
    rol: "administrador",
  },
  {
    usuario: "barbero",
    contrasena: "barbero123",
    rol: "barbero",
  },
];

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value;
  const rol = document.getElementById("rol").value;

  const usuarioEncontrado = usuarios.find(function (u) {
    return (
      u.usuario === usuario && u.contrasena === contrasena && u.rol === rol
    );
  });

  if (usuarioEncontrado) {
    // Guardar los datos de la sesión de prueba
    const sesion = {
      usuario: usuarioEncontrado.usuario,
      rol: usuarioEncontrado.rol,
    };

    localStorage.setItem("sesionEstiloCordoba", JSON.stringify(sesion));

    mensaje.textContent = "Ingreso correcto. Abriendo el panel...";
    mensaje.style.color = "green";

    // Redirigir según el perfil seleccionado
    if (rol === "administrador") {
      window.location.href = "admin.html";
    } else if (rol === "barbero") {
      window.location.href = "barbero.html";
    }
  } else {
    mensaje.textContent = "Usuario, contraseña o rol incorrectos.";
    mensaje.style.color = "red";
  }
});
