// 1. ATRAPAMOS LOS ELEMENTOS DEL HTML
const botonesJugadores = document.querySelectorAll('.btn-jugador');
const seccionLogin = document.getElementById('login_jugador');

const popupBienvenida = document.getElementById('popup_bienvenida');
const btnContinuar = document.getElementById('btn-continuar'); // <-- ¡Nuevo! Atrapamos el botón OK

const paginaPrincipal = document.getElementById('pagina_principal'); // <-- ¡Nuevo! Atrapamos la página principal


// 2. LÓGICA: De Login a Popup
botonesJugadores.forEach(boton => {
    boton.addEventListener('click', () => {
        // Ocultamos login y mostramos popup
        seccionLogin.classList.add('oculto');
        popupBienvenida.classList.remove('oculto');
    });
});

// 3. LÓGICA: De Popup a Página Principal (¡Nuevo!)
btnContinuar.addEventListener('click', () => {
    // Cuando pulsen "OK", ocultamos el popup
    popupBienvenida.classList.add('oculto');

    // Y mostramos por fin la página principal con las tarjetas
    paginaPrincipal.classList.remove('oculto');
});

// 4. LÓGICA: De Página Principal de vuelta al Login
// Atrapamos el botón de la cabecera
const btnCambiarJugador = document.getElementById('btn-cambiar-jugador');

btnCambiarJugador.addEventListener('click', () => {
    // Ocultamos la página principal
    paginaPrincipal.classList.add('oculto');

    // Y volvemos a mostrar la pantalla de selección de jugadores
    seccionLogin.classList.remove('oculto');
});


// 5. LÓGICA: Popup del Farolillo Rojo
// Atrapamos los elementos
const btnGenerarUltimo = document.getElementById('btn-generar-ultimo');
const popupUltimo = document.getElementById('popup-ultimo');
const btnCerrarPopupUltimo = document.getElementById('btn-cerrar-popup-ultimo');

// Cuando pulsamos el botón rojo de la tarjeta, mostramos el popup
btnGenerarUltimo.addEventListener('click', () => {
    popupUltimo.classList.remove('oculto');
});

// Cuando pulsamos "Cerrar" dentro del popup, lo volvemos a ocultar
btnCerrarPopupUltimo.addEventListener('click', () => {
    popupUltimo.classList.add('oculto');
});


// 6. LÓGICA: Botón Copiar al portapapeles
// Atrapamos el botón y el texto que queremos copiar
const btnCopiar = document.getElementById('btn-copiar');
const textoBroma = document.getElementById('texto-popup-ultimo');

btnCopiar.addEventListener('click', () => {
    // 1. Guardamos el texto que hay dentro del párrafo en una variable
    const textoACopiar = textoBroma.textContent;

    // 2. Le decimos al navegador que lo copie al portapapeles
    navigator.clipboard.writeText(textoACopiar).then(() => {

        // 3. Feedback visual: Guardamos lo que ponía en el botón ("COPIAR")
        const textoOriginal = btnCopiar.textContent;

        // Le cambiamos el texto para avisar de que ha funcionado
        btnCopiar.textContent = '¡Copiado! ✅';

        // 4. Usamos setTimeout para esperar 2 segundos (2000 milisegundos) y devolverlo a la normalidad
        setTimeout(() => {
            btnCopiar.textContent = textoOriginal;
        }, 2000);

    });
});