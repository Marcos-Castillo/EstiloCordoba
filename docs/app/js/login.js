const formulario = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value;
  const rol = document.getElementById("rol").value;

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

  const usuarioEncontrado = usuarios.find(function (u) {
    return (
      u.usuario === usuario && u.contrasena === contrasena && u.rol === rol
    );
  });

  if (usuarioEncontrado) {
    mensaje.textContent = "¡Bienvenido! Rol: " + rol;
    mensaje.style.color = "green";
  } else {
    mensaje.textContent = "Usuario, contraseña o rol incorrectos.";
    mensaje.style.color = "red";
  }
});
