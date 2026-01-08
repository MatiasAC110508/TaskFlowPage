// Este archivo contiene la lógica para manejar el formulario e imprimir los datos en una tabla
const form = document.getElementById('myform');
const tbody = document.querySelector('#tabla tbody');
const STORAGE_KEY = 'listadoForm';

// 🔹 Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', cargarTabla);


form.addEventListener('submit', function(event) {
    event.preventDefault();


    const title = form.title.value;
    const description = form.description.value;
    const select =document.getElementById('status');
    const statusValue = select.value
    const  statusText = select.options[select.selectedIndex].text;

    const registro = {  id: Date.now(),title, description, statusValue, statusText  };

    guardarRegistro(registro);
    agregarFila(registro);
    form.reset();

})

tbody.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-delete')) {
    const fila = e.target.closest('tr');
    const id = Number(fila.dataset.id);

    eliminarRegistro(id);
    fila.remove();
  }
});

tbody.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-update')){
        


    }   
});

function eliminarRegistro(id) {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  data = data.filter(registro => registro.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  
}



function guardarRegistro(registro) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  data.push(registro);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function cargarTabla() {
    let registros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    registros.forEach(registro => {agregarFila(registro);});
}

function agregarFila({ title, description, statusText }) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${title}</td>
    <td>${description}</td>
    <td>${statusText}</td>
    <td>
      <button class="btn-delete">Delete</button>
    </td>
    <td>
      <button class="btn-update">Update</button>
    </td>
  `;
  tbody.appendChild(tr);
}

