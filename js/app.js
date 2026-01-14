const form = document.getElementById('myform');
const formSearch = document.getElementById('formSearch');
const mensaje = document.getElementById('mensaje');
const mensajeFiltro = document.getElementById('mensajeFiltro');
const searchInput = document.getElementById('searchFilter');
const contenedor = document.getElementById('contenedor-tablas');

const STORAGE_KEY = 'listadoForm';
let editId = null;

document.addEventListener('DOMContentLoaded', cargarTareas);

formSearch.addEventListener('submit', e => e.preventDefault());

searchInput.addEventListener('input', e => {
  filtrarTareas(e.target.value.trim());
});

/* ======================
   Submit del formulario
====================== */

form.addEventListener('submit', e => {
  e.preventDefault();

  const title = form.title.value.trim();
  const description = form.description.value.trim();

  if (!title || !description) {
    mensaje.textContent = 'Title and Description are required';
    return;
  }

  mensaje.textContent = '';

  const statusSelect = form.status;
  const importanceSelect = form.importance;

  const registro = {
    id: editId || Date.now(),
    title,
    description,
    statusValue: statusSelect.value,
    statusText: statusSelect.options[statusSelect.selectedIndex].text,
    importanceValue: importanceSelect.value,
    importanceText: importanceSelect.options[importanceSelect.selectedIndex].text
  };

  editId ? actualizarRegistro(registro) : guardarRegistro(registro);

  form.reset();
  editId = null;
  cargarTareas();
});

/* ======================
   LocalStorage
====================== */

function obtenerDatos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function guardarRegistro(reg) {
  const data = obtenerDatos();
  data.push(reg);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function actualizarRegistro(registro) {
  const data = obtenerDatos().map(r =>
    r.id === registro.id ? registro : r
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function eliminarRegistro(id) {
  const data = obtenerDatos().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ======================
   Render de tareas
====================== */

function cargarTareas() {
  contenedor.innerHTML = '';
  const data = obtenerDatos();

  if (!data.length) {
    mensajeFiltro.textContent = 'No tasks yet';
    return;
  }

  mensajeFiltro.textContent = '';
  data.forEach(crearCard);
}

function crearCard(registro) {
  const card = document.createElement('div');
  card.classList.add('task-card');
  card.dataset.id = registro.id;

  card.innerHTML = `
    <table>
      <tr>
        <th>Title</th>
        <td>${registro.title}</td>
      </tr>
      <tr>
        <th>Description</th>
        <td>${registro.description}</td>
      </tr>
      <tr>
        <th>Status</th>
        <td>${registro.statusText}</td>
      </tr>
      <tr>
        <th>Importance</th>
        <td>${registro.importanceText}</td>
      </tr>
      <tr>
        <th>Actions</th>
        <td>
          <button class="btn-edit">Edit</button>
          <button class="btn-delete">Delete</button>
        </td>
      </tr>
    </table>
  `;

  contenedor.appendChild(card);
}

/* ======================
   Editar / Eliminar
====================== */

contenedor.addEventListener('click', e => {
  const card = e.target.closest('.task-card');
  if (!card) return;

  const id = Number(card.dataset.id);

  if (e.target.classList.contains('btn-delete')) {
    eliminarRegistro(id);
    cargarTareas();
  }

  if (e.target.classList.contains('btn-edit')) {
    const reg = obtenerDatos().find(r => r.id === id);
    if (!reg) return;

    form.title.value = reg.title;
    form.description.value = reg.description;
    form.status.value = reg.statusValue;
    form.importance.value = reg.importanceValue;
    editId = id;
  }
});

/* ======================
   Filtro de búsqueda
====================== */

function filtrarTareas(texto) {
  const filtro = texto.toLowerCase();
  let visible = false;

  contenedor.querySelectorAll('.task-card').forEach(card => {
    const match = card.textContent.toLowerCase().includes(filtro);
    card.style.display = match ? '' : 'none';
    if (match) visible = true;
  });

  mensajeFiltro.textContent = visible ? '' : 'No results found';
}
