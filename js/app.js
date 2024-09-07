// Selección de elementos del DOM
const reservaForm = document.getElementById('reservaForm');
const reservasDiv = document.getElementById('reservas');
const mensajeError = document.createElement('p'); // Para mostrar mensajes de error
mensajeError.style.color = 'red';
document.body.appendChild(mensajeError); // Añadir mensaje de error al DOM

// Función para mostrar reservas desde el archivo JSON
async function mostrarReservas() {
    try {
        const response = await fetch('reservas.json'); // Leer el archivo JSON
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo JSON.');
        }

        const data = await response.json();
        const reservas = data.reservas;

        reservasDiv.innerHTML = reservas.map(reserva => `
            <div class="card mt-3">
                <div class="card-body">
                    <h5 class="card-title">${reserva.nombre}</h5>
                    <p class="card-text">Servicio: ${reserva.servicio}</p>
                    <p class="card-text">Fecha: ${reserva.fecha}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        mostrarError('Error al cargar las reservas: ' + error.message);
    }
}

// Función para guardar una nueva reserva
function guardarReserva(e) {
    e.preventDefault();

    try {
        const nombre = document.getElementById('nombre').value;
        const servicio = document.getElementById('servicio').value;
        const fecha = document.getElementById('fecha').value;

        if (!nombre || !servicio || !fecha) {
            throw new Error('Todos los campos son obligatorios.');
        }

        // Recuperar reservas actuales de localStorage
        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

        const nuevaReserva = { nombre, servicio, fecha };

        // Añadir nueva reserva
        reservas.push(nuevaReserva);

        // Guardar reservas en localStorage (simulando escritura en JSON)
        localStorage.setItem('reservas', JSON.stringify(reservas));

        mostrarReservas();
        ocultarError();

    } catch (error) {
        mostrarError(error.message);
    } finally {
        reservaForm.reset();
    }
}

// Mostrar errores de forma amigable
function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.style.display = 'block';
}

// Ocultar el mensaje de error
function ocultarError() {
    mensajeError.style.display = 'none';
}

// Mostrar reservas almacenadas en LocalStorage al cargar la página
document.addEventListener('DOMContentLoaded', mostrarReservas);

// Añadir evento para guardar reservas
reservaForm.addEventListener('submit', guardarReserva);

// Obtener el contenedor donde se mostrarán las reservas
const reservasContainer = document.getElementById('reservas');

// Función para obtener datos de reservas desde el archivo JSON
async function obtenerReservas() {
    try {
        const response = await fetch('/data/reservas.json'); // Ruta al archivo JSON
        if (!response.ok) {
            throw new Error('Error al obtener las reservas.');
        }
        
        const data = await response.json();
        mostrarReservas(data.reservas);
    } catch (error) {
        console.error(error);
        mostrarError('No se pudieron cargar las reservas.');
    }
}

// Función para mostrar las reservas en la interfaz
function mostrarReservas(reservas) {
    reservasContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar las reservas

    reservas.forEach((reserva) => {
        const reservaDiv = document.createElement('div');
        reservaDiv.classList.add('reserva');
        reservaDiv.innerHTML = `
            <h3>${reserva.nombre}</h3>
            <p>Servicio: ${reserva.servicio}</p>
            <p>Fecha: ${reserva.fecha}</p>
        `;
        reservasContainer.appendChild(reservaDiv);
    });
}

// Función para mostrar un mensaje de error si ocurre algo
function mostrarError(mensaje) {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('alert', 'alert-danger');
    errorDiv.textContent = mensaje;
    reservasContainer.appendChild(errorDiv);
}

// Cargar las reservas cuando la página esté lista
document.addEventListener('DOMContentLoaded', obtenerReservas);
