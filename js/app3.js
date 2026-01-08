const form = document.getElementById('myform');
const tbody = document.querySelector('#tabla tbody');
const tabla = document.getElementById('tabla');
const STORAGE_KEY = 'listadoForm';
const btnSubmit = form.querySelector('button[type="submit"]');

let editId = null;

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', cargarTabla);

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const title = form.title.value;
  const description = form.description.value;

  const statusSelect = document.getElementById('status');
  const statusValue = statusSelect.value;
  const statusText = statusSelect.options[statusSelect.selectedIndex].text;

  const importanceSelect = document.getElementById('importance');
  const importanceValue = importanceSelect.value;
  const importanceText =
    importanceSelect.options[importanceSelect.selectedIndex].text;

  if (editId) {
    actualizarRegistro(editId, {
      title,
      description,
      statusValue,
      statusText,
      importanceValue,
      importanceText
    });

    limpiarTabla();
    cargarTabla();

    editId = null;
    btnSubmit.textContent = 'Submit';
  } else {
    const registro = {
      id: Date.now(),
      title,
      description,
      statusValue,
      statusText,
      importanceValue,
      importanceText
    };

    guardarRegistro(registro);
    agregarFila(registro);
  }

  form.reset();
  actualizarVisibilidadTabla();
});

// Guardar en localStorage
function guardarRegistro(registro) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  data.push(registro);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Actualizar registro
function actualizarRegistro(id, nuevosDatos) {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  data = data.map(reg =>
    reg.id === id ? { ...reg, ...nuevosDatos } : reg
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Cargar tabla
function cargarTabla() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  if (data.length === 0) {
    actualizarVisibilidadTabla();
    return;
  }

  data.forEach(registro => agregarFila(registro));
  actualizarVisibilidadTabla();
}

// FILTRO AQUÍ
function agregarFila(registro) {
  // No mostrar tareas en proceso
  if (registro.statusValue === 'In Progress') return;

  const tr = document.createElement('tr');
  tr.dataset.id = registro.id;

  tr.innerHTML = `
    <td>${registro.title}</td>
    <td>${registro.description}</td>
    <td>${registro.statusText}</td>
    <td>${registro.importanceText}</td>
    <td>
      <button class="btn-edit">Edit</button>
      <button class="btn-delete">Delete</button>
    </td>
  `;

  tbody.appendChild(tr);
}

// Limpiar tabla (para refrescar al editar)
function limpiarTabla() {
  tbody.innerHTML = '';
}

// Delegación de eventos
tbody.addEventListener('click', function (e) {
  const fila = e.target.closest('tr');
  if (!fila) return;

  const id = Number(fila.dataset.id);

  if (e.target.classList.contains('btn-delete')) {
    eliminarRegistro(id);
    fila.remove();
    actualizarVisibilidadTabla();
  }

  if (e.target.classList.contains('btn-edit')) {
    cargarEnFormulario(id);
  }
});

// Eliminar
function eliminarRegistro(id) {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  data = data.filter(reg => reg.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Cargar en formulario
function cargarEnFormulario(id) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const registro = data.find(reg => reg.id === id);
  if (!registro) return;

  form.title.value = registro.title;
  form.description.value = registro.description;
  form.status.value = registro.statusValue;
  form.importance.value = registro.importanceValue;

  editId = id;
  btnSubmit.textContent = 'Save Changes';
}

// Mostrar / ocultar tabla
function actualizarVisibilidadTabla() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const visibles = data.filter(r => r.statusValue !== 'In Progress');
  tabla.style.display = visibles.length === 0 ? 'none' : 'table';
}
