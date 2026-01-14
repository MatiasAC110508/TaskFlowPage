
const form = document.getElementById('myform');
const tbody = document.querySelector('#tabla tbody');
const tabla = document.getElementById('tabla');
const formSearch = document.getElementById('formSearch');
const mensaje = document.getElementById('mensaje');
const mensajeFiltro = document.getElementById('mensajeFiltro');
const searchInput = document.getElementById('searchFilter');

const STORAGE_KEY = 'listadoForm';
let editId = null;

document.addEventListener('DOMContentLoaded', cargarTabla);

formSearch.addEventListener('submit', e => e.preventDefault());

searchInput.addEventListener('input', e => {
  filtrarTabla(e.target.value.trim());
});

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
  cargarTabla();
});

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

function cargarTabla() {
  limpiarTabla();
  const data = obtenerDatos();

  if (!data.length) {
    tabla.style.display = 'none';
    return;
  }

  data.forEach(agregarFila);
  tabla.style.display = 'table';
}

function limpiarTabla() {
  tbody.innerHTML = '';
}

function agregarFila(registro) {
  const tr = document.createElement('tr');
  tr.dataset.id = registro.id;

  tr.innerHTML = `
    <th>Title</th>
    <td id="scroll">${registro.title}</td>

    <th>Description</th>
    <td id="scroll">${registro.description}</td>

    <th>Status</th>
    <td>${registro.statusText}</td>

    <th>Importance</th>
    <td>${registro.importanceText}</td>

    <th>Actions</th>
    <td>
      <button class="btn-edit">Edit</button>
      <button class="btn-delete">Delete</button>
    </td>
  `;

  tbody.appendChild(tr);
}

tbody.addEventListener('click', e => {
  const fila = e.target.closest('tr');
  if (!fila) return;

  const id = Number(fila.dataset.id);

  if (e.target.classList.contains('btn-delete')) {
    eliminarRegistro(id);
    cargarTabla();
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

function filtrarTabla(texto) {
  const filtro = texto.toLowerCase();
  let visible = false;

  tbody.querySelectorAll('tr').forEach(tr => {
    const match = tr.textContent.toLowerCase().includes(filtro);
    tr.style.display = match ? '' : 'none';
    if (match) visible = true;
  });

  tabla.style.display = visible ? 'table' : 'none';
  mensajeFiltro.textContent = visible ? '' : 'No results found';
}
