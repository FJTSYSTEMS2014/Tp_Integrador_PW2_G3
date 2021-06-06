// Referencia al div contenedor de tareas
const contentTable = document.getElementById("contentTable");
// Tomo el template de tareas y su contenido
const row = document.getElementById("contentRow").content;
// Referencia al div contenedor de datos del usuario
const contentUser = document.getElementById("contentUser");
// Tomo el template de usuario y su contenido
const userRow = document.getElementById("contentUserRow").content;

// Referencia al panel de listado de tareas, para ocultar o mostrar dependiendo si está logueado o no
const panelTareas = document.getElementById("panel_tareas");

// Referencias a elementos del formulario para cargar nueva tarea
const tituloText = document.getElementById("titulo");
const descripcionText = document.getElementById("descripcion");

// En estos elementos es donde se mostrarán los errores para nueva tarea y editar tarea
const tituloHelp = document.getElementById("inputTituloHelp");

// Referencia al formulario para cargar nueva tarea
const createTaskFormContent = document.getElementById("form-create");
const createTaskForm = document.getElementById("createTaskForm");

// Referencia al botón de crear tarea y funcionalidad para llamar a función crearTarea()
const btnCreate = document.getElementById("createButton");
btnCreate.addEventListener("click", () => crearTarea());

function addRow(titulo, estado, created, id_tarea) {
  // Clono el template en una nueva variable
  const fila = row.cloneNode(true);
  // Agrego dinámicamente los datos que vienen por parámetro
  fila.querySelector(".txtTitulo").innerText = titulo;
  fila.querySelector(".txtEstado").innerText = estado;
  fila.querySelector(".dateCreated").innerText = created;
  // Agrego botones para cada fila, y le doy funcionalidad con el addEventListener
  // !!!! Ojo !! hay que hacer las funciones para completar tarea y eliminar tarea
  fila
    .querySelector(".btnDelete")
    .addEventListener("click", () => eliminarTarea(id_tarea));
  fila
    .querySelector(".btnUpdate")
    .addEventListener("click", () => completarTarea(id_tarea));
  // Acá hacemos lo que hizo Juan en una clase, de agregar un dataset para tener el id de cada una
  fila.querySelector(".row").dataset.id = id_tarea;

  // Inserto la nueva fila en la tabla
  contentTable.appendChild(fila);
}

/**
 *
 * @param {'get'|'post'|'put'|'delete'} method
 * @param {'/tareas'|'/tareas/:dni_usuario'|'/usuarios'|'/usuarios/:dni_usuario'} endpoint
 * @returns
 */

// Función principal api, recibe los parámetros arriba indicados y un body opcional para los post y put
async function api(endpoint, method, body = undefined) {
  if (body) {
    body = JSON.stringify(body);
  }

  const token = localStorage.getItem("token");
  const headers = {
    "Content-type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    method,
    body,
    headers,
  });

  const data = await response.json();

  return data;
}

// Aquí inicia la App
async function initApp() {
  if (localStorage.getItem("token")) {
    // Si hay token (ojo, puede estar vencido, controlar eso) entonces
    // capturo dni de usuario para mostrar sus datos y sus tareas
    const dni = localStorage.getItem("dni_usuario");

    // !!!!! Ojo! el dni de usuario lo tenemos que obtener directamente del token, cambiar esto

    showUser(dni); // Muestra datos del usuario en el panel superior
    await mostrarTareas(dni); // Muestra tareas del usuario en el panel central
    createTaskFormContent.style.display = ""; // Muestro formulario de carga de nueva tarea
  } else {
    // Usuario no logueado, oculto el contenedor que muestra bienvenida al usuario y botón de logout
    contentUser.style.display = "none";
    panelTareas.classList.add("is-hidden");
    // oculto formulario para cargar nueva tarea
    createTaskFormContent.style.display = "none";
  }
}

function aplicaEstilos() {
  contentUser.style.width = "90%";
  panelTareas.style.width = "90%";
  panelTareas.style.padding = "1rem";
  panelTareas.classList.remove("is-hidden");
  createTaskFormContent.style.width = "90%";
  createTaskFormContent.style.padding = "1rem";
  createTaskFormContent.children[1].style.justifyContent = "left";
}

async function mostrarTareas(dni_usuario) {
  // verifico que esté logueado antes de mostrar sus tareas
  if (localStorage.getItem("token")) {
    aplicaEstilos();
    //// Ésta es una iteración para eliminar todos los elementos, menos el 1º que es la fila cabecera
    while (contentTable.children.length > 1) {
      let item = contentTable.lastElementChild;
      contentTable.removeChild(item);
    }
    // obtengo tareas usando la api
    const data = await api(`/tareas/${dni_usuario}`, "get");
    // para cada fila de tareas, uso el template llamando a la función addRow
    data.forEach(({ titulo, estado, created }) =>
      addRow(titulo, estado, created)
    );
  }
}

// Función para mostrar información del usuario en el panel superior, una vez que hizo login
async function showUser(dni_usuario) {
  // Obtengo datos usando la api
  const user = await api(`/usuarios/${dni_usuario}`, "get");

  // Clono el template en una nueva variable
  const userBlock = userRow.cloneNode(true);
  // Utilizo elementos del dom para agregar texto dinámicamente, en este caso nombre y apellido que devuelve la api
  userBlock.querySelector(
    ".usrInfo"
  ).innerText = `Bienvenido ${user.nombre_apellido}`;
  // Aquí se agrega funcionalidad para el botón de logout
  userBlock
    .querySelector("#logoutButton")
    .addEventListener("click", () => logout());

  // Inserto userBlock con la nueva info, en su contenedor
  contentUser.appendChild(userBlock);
}

// Función para agregar nueva tarea usando la API
/**
 * Crear tarea
 */
async function crearTarea() {
  const titulo = tituloText.value;
  const descripcion = descripcionText.value;

  const dni_usuario = localStorage.getItem("dni_usuario");

  resetearErrores(tituloText, tituloHelp);

  const response = await api(`/tareas/add/${dni_usuario}`, "post", {
    titulo,
    descripcion,
  });

  if (response.error) {
    showFormErrors(response.error, "create");
  } else {
    createTaskForm.reset();
    mostrarTareas(dni_usuario);
  }
}

function resetearErrores(input, inputHelp) {
  inputHelp.classList.add("is-hidden");
  input.classList.remove("is-danger");
}

function showFormErrors(errors, action) {
  if (action == "create") {
    errors.forEach((error) => {
      switch (error.field) {
        case "titulo":
          tituloHelp.innerText = error.msg;
          tituloHelp.classList.remove("is-hidden");
          tituloText.classList.add("is-danger");
          break;
        default:
          break;
      }
    });
  } else {
    // action == "update"
    errors.forEach((error) => {
      switch (error.field) {
        case "name":
          tituloHelpUpd.innerText = error.msg;
          tituloHelpUpd.classList.remove("is-hidden");
          tituloTextUpd.classList.add("is-danger");
          break;
        default:
          break;
      }
    });
  }
}
