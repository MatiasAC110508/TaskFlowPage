// Este archivo contiene la lógica para manejar el formulario e imprimir los datos en una tabla
const form = document.getElementById('myform');
const tbody = document.querySelector('#tabla tbody');



form.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    

  // Convertir FormData a un objeto (opcional, pero útil)
  const datos = Object.fromEntries(formData.entries());
  //console.log(datos); // Muestra todos los datos en la consola

  // Acceder a un campo específico
  const title = formData.get('title');
  const description = formData.get('description');
  const status = formData.get('status');

  const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${title}</td> 
        <td>${description}</td>
        <td>${status}</td>
    `;

    tbody.appendChild(tr);
    form.reset();
})
    



