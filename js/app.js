
const form = document.getElementById('myform');
const tbody = document.querySelector('#tabla tbody');
const tabla = document.getElementById('tabla');
const STORAGE_KEY = 'listadoForm';
const btnSubmit = form.querySelector('button[type="submit"]');

 // capturando los datos del filtro
const formSearch = document.getElementById('formSearch');
const mensajeFiltro = document.getElementById('mensajeFiltro');

let editId = null;

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', cargarTabla);


document.getElementById('searchFilter').addEventListener('input', e => {
  filtrarTabla(e.target.value.trim());
});

form.addEventListener('submit', function (event) {
  event.preventDefault();

  // Leer valores
  const title = form.title.value.trim();
  const description = form.description.value.trim();
  const statusSelect = document.getElementById('status');
  const statusValue = statusSelect.value;
  const statusText = statusSelect.options[statusSelect.selectedIndex].text;
  const importanceSelect = document.getElementById('importance');
  const importanceValue = importanceSelect.value;
  const importanceText = importanceSelect.options[importanceSelect.selectedIndex].text;
  const mensajeaDiv = document.getElementById('mensaje');
  const searchInput = document.getElementById('searchFilter').value.trim();
  
  

  // Validación: no permitir campos vacíos
  if (!title || !description) {
    console.error("Title and Description cannot be empty");
    mensajeaDiv.textContent = "Error: Title and Description cannot be empty!";
    return; // Detener submit
  }

  // Validación: no permitir "In Progress"
  if (statusValue === "In Progress") {
    console.error('Cannot add tasks with "In Progress" status');
    mensajeaDiv.textContent = 'Error: Cannot add tasks with "In Progress" status';
    return; // Detener submit
  }

  // Limpiar mensaje de error previo
  mensajeaDiv.textContent = '';

  if (editId) {
    // Editando registro
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
    // Nuevo registro
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
  data = data.map(reg => reg.id === id ? { ...reg, ...nuevosDatos } : reg);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Cargar tabla
function cargarTabla() {
  limpiarTabla()
  
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  if (data.length === 0) {
    actualizarVisibilidadTabla();
    return;
  }
  data.forEach(registro => agregarFila(registro));
  actualizarVisibilidadTabla();
}

// Agregar fila (filtra "In Progress")
function agregarFila(registro) {
  //if (registro.statusValue === 'In Progress') return;

  const tr = document.createElement('tr');
  tr.dataset.id = registro.id;

 /*  tr.innerHTML = `
    <thead>
    <tr>
      <th >Title</th><td id="scroll">${registro.title}</td>
      <th >Description</th><td id="scroll">${registro.description}</td>
      <th>Status</th><td>${registro.statusText}</td>
      <th>Importance</th><td>${registro.importanceText}</td>
      <th>Actions</th>
    </tr>
  </thead>

  <td>
    <button class="btn-edit">Edit</button>
    <button class="btn-delete">Delete</button>
  </td>
  `; */

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

// Limpiar tabla
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


// Filtrar mediante el buscador
function filtrarTabla(criterio) {
  limpiarTabla();
  mensajeFiltro.textContent = '';

  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const texto = criterio.toLowerCase();

  if (!texto) {
    // Si no hay búsqueda, mostrar todos los registros
    data.forEach(reg => agregarFila(reg));
    actualizarVisibilidadTabla();
    return;
  }

  const filtrados = data.filter(reg =>
    reg.title.toLowerCase().includes(texto) ||
    reg.description.toLowerCase().includes(texto) ||
    reg.statusText.toLowerCase().includes(texto) ||
    reg.importanceText.toLowerCase().includes(texto)
  );

  if (filtrados.length === 0) {
    mensajeFiltro.textContent = 'No se encontraron resultados para la búsqueda';
  }

  filtrados.forEach(reg => agregarFila(reg));
  actualizarVisibilidadTabla();
}