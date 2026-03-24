/**
 * PWA Clock Application Logic
 * Este archivo contiene la lógica para actualizar la hora actual
 * y para registrar el Service Worker de la PWA.
 */

// Elementos del DOM donde se mostrará la hora y la fecha
const timeDisplayElement = document.getElementById('time-display');
const dateDisplayElement = document.getElementById('date-display');

/**
 * Función que actualiza la hora del sistema en la interfaz de usuario.
 * Se llama de forma continua cada segundo.
 */
function updateClock() {
    const now = new Date();
    
    // Formatear horas, minutos y segundos asegurando dos dígitos (ej. 09 en vez de 9)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Construir el HTML inyectando spans para animar los dos puntos de manera independiente
    timeDisplayElement.innerHTML = `${hours}<span class="colon">:</span>${minutes}<span class="colon">:</span>${seconds}`;

    // Obtener y formatear la fecha según la configuración regional en español
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('es-ES', options);
    
    // Asignar el texto de la fecha
    dateDisplayElement.textContent = dateString;
}

// Iniciar el reloj inmediatamente para evitar el estado "Cargando..." prolongado
updateClock();

// Configurar el intervalo para actualizar la hora automáticamente cada segundo (1000 milisegundos)
setInterval(updateClock, 1000);

/**
 * Registro del Service Worker para convertir la aplicación en una PWA
 * Esto habilita funcionalidades offline y permite instalar la app en dispositivos móviles.
 */
if ('serviceWorker' in navigator) {
    // Escuchar al evento 'load' de la ventana para asegurar que otros recursos vitales ya hayan cargado
    window.addEventListener('load', () => {
        // Registrar el ServiceWorker que se encuentra en la raíz
        navigator.serviceWorker.register('./src/sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado con éxito con el scope:', registration.scope);
            })
            .catch(error => {
                console.error('Error al registrar el ServiceWorker:', error);
            });
    });
}
