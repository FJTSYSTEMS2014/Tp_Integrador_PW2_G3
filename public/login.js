// referencia al botón de login, para darle funcionalidad con addEventListener
const btnLogin = document.getElementById("loginButton");
btnLogin.addEventListener("click", () => login());

const formLogin = document.getElementById("login-form");
const inputUserName = document.getElementById("user_name");
const inputPassword = document.getElementById("password");

// devuelve true o false dependiendo si existe el token en localStorage o no
function isLoggedIn() {
  return Boolean(localStorage.getItem("token"));
}

function updateLoginStatus() {
  // si está logueado, oculto el formulario de login, caso contrario lo muestro
  if (isLoggedIn()) {
    formLogin.classList.add("is-hidden");
  } else {
    formLogin.classList.remove("is-hidden");
  }
}
//función que crea el endpoint /login y verifica los datos que vienen del form
async function login() {
  const username = inputUserName.value;
  const password = inputPassword.value;
  // llamo a la api para ver si el user y pass son correctos
  const response = await api("/login", "post", { username, password });
  // si no existe usuario con esos datos, devuelve error y lo lanzamos en un alert
  if (response.status === "error") {
    alert(response.error);
  } else {
    // si el usuario fue encontrado, almacenamos el token en localStorage
    localStorage.setItem("token", response.accessToken);

    // Usuario logueado
    contentUser.style.display = ""; // Muestro nuevamente el contenedor que oculté en initApp
    showUser(); // Llamo a showUser() para que cargue datos de usuario en el template

    mostrarTareas();
    updateLoginStatus();
  }
}

// cierre de sesión, se limpia la información almacenada en localStorage y se recarga la página
function logout() {
  localStorage.clear();
  location.reload();
}
//a esta función la llamo directamente para que verifique en el inicio
// sobre la condición de login y muestre o no el form de login
updateLoginStatus();
