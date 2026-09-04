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


// ==========================================
// ACCESO AL PANEL DE TESORERO
// ==========================================
const btnAccesoTesorero = document.getElementById('btn-acceso-tesorero');

// NOTA: Ajusta estos dos IDs a los que estés usando en tu HTML para envolver tus pantallas
const vistaPrincipal = document.getElementById('login_jugador');
const vistaTesorero = document.getElementById('panel_tesorero');

btnAccesoTesorero.addEventListener('click', () => {
    // 1. Lanzamos la ventana emergente nativa pidiendo la clave
    const contrasena = prompt('🔒 Introduce la contraseña del Tesorero:');

    // 2. Comprobamos la contraseña (aquí ponemos '1234' de prueba)
    if (contrasena === '1234') {
        // 3. Si es correcta: escondemos la vista normal y mostramos el panel del tesorero
        vistaPrincipal.classList.add('oculto');
        vistaTesorero.classList.remove('oculto');

    } else if (contrasena !== null) {
        // 4. Si ha escrito algo mal (y no le ha dado a "Cancelar")
        alert('❌ Contraseña incorrecta. Acceso denegado.');
    }
});



// ==========================================
// NAVEGACIÓN: PESTAÑAS DEL TESORERO
// ==========================================

// 1. Seleccionamos los botones
const btnSaldar = document.getElementById('btn-tab-saldar');
const btnAnadir = document.getElementById('btn-tab-anadir');
const btnMensaje = document.getElementById('btn-tab-mensaje');

// 2. Seleccionamos los contenedores de contenido
const contenidoSaldar = document.getElementById('contenido-tab-saldar');
const contenidoAnadir = document.getElementById('contenido-tab-anadir');
const contenidoMensaje = document.getElementById('contenido-tab-mensaje');

// 3. Función maestra que hace el cambio
function cambiarPestanaTesorero(btnSeleccionado, contenidoSeleccionado) {
    // Paso A: Escondemos todos los contenidos poniéndoles la clase 'oculto'
    contenidoSaldar.classList.add('oculto');
    contenidoAnadir.classList.add('oculto');
    contenidoMensaje.classList.add('oculto');

    // Paso B: Quitamos la clase 'activo' de todos los botones para que se apaguen
    btnSaldar.classList.remove('activo');
    btnAnadir.classList.remove('activo');
    btnMensaje.classList.remove('activo');

    // Paso C: Mostramos el contenido que toca y "encendemos" su botón
    contenidoSeleccionado.classList.remove('oculto');
    btnSeleccionado.classList.add('activo');
}

// 4. Les decimos a los botones que "escuchen" (escuchadores de eventos)
btnSaldar.addEventListener('click', () => cambiarPestanaTesorero(btnSaldar, contenidoSaldar));
btnAnadir.addEventListener('click', () => cambiarPestanaTesorero(btnAnadir, contenidoAnadir));
btnMensaje.addEventListener('click', () => cambiarPestanaTesorero(btnMensaje, contenidoMensaje));

// ==========================================
// 1. VARIABLES GLOBALES Y MOCHILAS
// ==========================================

// Seleccionamos los botones de acción
const btnGuardarJornada = document.getElementById('btn-guardar-jornada');
const btnCopiarWhatsapp = document.getElementById('btn-copiar-whatsapp');
const btnCopiarGeneral = document.getElementById('btn-copiar-general');

// 🛒 CARRITO TEMPORAL (Los jugadores que ves en pantalla antes de guardar)
let carritoTemporal = [];

// 🎒 MOCHILA DEFINITIVA (Donde se guardan las jornadas confirmadas para el WhatsApp)
let mochilaDeudas = [];

// Función maestra para el efecto visual de "Éxito"
function mostrarExitoBoton(boton, textoExito) {
    const textoOriginal = boton.innerHTML;
    boton.innerHTML = `✅ ${textoExito}`;
    boton.classList.add('btn-copiado');

    setTimeout(() => {
        boton.innerHTML = textoOriginal;
        boton.classList.remove('btn-copiado');
    }, 2000);
}

// ==========================================
// 2. LÓGICA: AÑADIR JUGADOR AL CARRITO (PANTALLA)
// ==========================================
const btnAnadirLista = document.getElementById('btn-anadir-lista');
const listaDeudas = document.getElementById('lista-deudas-pendientes');
const textoListaVacia = document.getElementById('texto-lista-vacia');

const inputJugador = document.getElementById('tesorero-jugador');
const inputPosicion = document.getElementById('tesorero-posicion');
const inputRojas = document.getElementById('tesorero-rojas');

if (btnAnadirLista) {
    btnAnadirLista.addEventListener('click', () => {

        // Recogemos los valores del jugador
        const jugador = inputJugador.value;
        const eurosPos = parseFloat(inputPosicion.value) || 0;
        const eurosRoj = parseFloat(inputRojas.value) || 0;

        if (jugador === "") {
            alert("⚠️ ¡Eh! Selecciona un jugador primero.");
            return;
        }

        const total = eurosPos + eurosRoj;

        if (total === 0) {
            alert("⚠️ El jugador no tiene ninguna deuda (el total es 0€).");
            return;
        }

        // --- GUARDAMOS EN EL CARRITO TEMPORAL (Todavía no hay jornada) ---
        const fichaTemporal = {
            nombre: jugador,
            eurosPosicion: eurosPos,
            eurosRojas: eurosRoj,
            total: total
        };

        carritoTemporal.push(fichaTemporal);
        // -----------------------------------------------------------------

        textoListaVacia.classList.add('oculto');

        // Creamos la fila HTML visual
        const nuevaFila = document.createElement('li');
        nuevaFila.className = 'item-carrito';
        nuevaFila.innerHTML = `
            <div class="info-carrito">
                <span class="nombre-carrito">${jugador}</span>
                <span class="detalle-carrito">Pos: ${eurosPos.toFixed(2)}€ | Roj: ${eurosRoj.toFixed(2)}€</span>
            </div>
            <div class="acciones-carrito">
                <span class="total-carrito">${total.toFixed(2)}€</span>
                <button class="btn-eliminar-carrito">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;

        // Lógica de la papelera
        const btnBorrar = nuevaFila.querySelector('.btn-eliminar-carrito');
        btnBorrar.addEventListener('click', () => {
            nuevaFila.remove(); // Borra de la pantalla

            // Borramos solo de nuestro carrito temporal
            carritoTemporal = carritoTemporal.filter(item => item !== fichaTemporal);

            if (listaDeudas.children.length === 1) {
                textoListaVacia.classList.remove('oculto');
            }
        });

        listaDeudas.appendChild(nuevaFila);

        // Limpiamos los campos para el siguiente jugador
        inputJugador.value = "";
        inputPosicion.value = "";
        inputRojas.value = "";
    });
}

// ==========================================
// 3. EVENTO: GUARDAR JORNADA COMPLETA
// ==========================================
if (btnGuardarJornada) {
    btnGuardarJornada.addEventListener('click', () => {
        const inputJornada = document.getElementById('tesorero-jornada');
        const numJornada = inputJornada.value;

        // VALIDACIÓN 1: ¿Ha puesto jornada?
        if (numJornada.trim() === "") {
            alert("⚠️ ¡Falta la Jornada! Escribe el número arriba antes de guardar.");
            inputJornada.focus();
            return;
        }

        // VALIDACIÓN 2: ¿Hay alguien en el carrito?
        if (carritoTemporal.length === 0) {
            alert("⚠️ Añade al menos a un jugador a la lista antes de guardar la jornada.");
            return;
        }

        // --- MAGIA: PASAMOS DEL CARRITO A LA MOCHILA ---
        // Le aplicamos el número de jornada a todos los que estaban esperando en el carrito
        carritoTemporal.forEach(ficha => {
            mochilaDeudas.push({
                jornada: numJornada, // Le ponemos la pegatina de la jornada a todos
                nombre: ficha.nombre,
                eurosPosicion: ficha.eurosPosicion,
                eurosRojas: ficha.eurosRojas,
                total: ficha.total
            });
        });

        // AHORA SÍ, actualizamos el WhatsApp con las deudas definitivas
        actualizarMensajeWhatsApp();

        mostrarExitoBoton(btnGuardarJornada, '¡Guardado!');

        // --- LIMPIEZA VISUAL Y DEL CARRITO TEMPORAL ---

        carritoTemporal = []; // Vaciamos el carrito de espera

        const itemsEnPantalla = document.querySelectorAll('.item-carrito');
        itemsEnPantalla.forEach(item => item.remove());

        if (textoListaVacia) {
            textoListaVacia.classList.remove('oculto');
        }

        inputJornada.value = ""; // Vaciamos la jornada
    });
}

// ==========================================
// 4. GENERADOR AUTOMÁTICO DE WHATSAPP
// ==========================================
function actualizarMensajeWhatsApp() {
    const textareaWhatsapp = document.getElementById('texto-whatsapp');
    let mensaje = `🚨 *DEUDAS PENDIENTES* 🚨\n\n`;

    // Ahora leemos de la mochila definitiva, no del carrito temporal
    if (mochilaDeudas.length === 0) {
        mensaje += `✅ Todos al día, no hay deudas nuevas.\n\n`;
    } else {
        const deudasAgrupadas = {};

        mochilaDeudas.forEach(ficha => {
            if (!deudasAgrupadas[ficha.jornada]) {
                deudasAgrupadas[ficha.jornada] = [];
            }
            deudasAgrupadas[ficha.jornada].push(ficha);
        });

        for (const jornada in deudasAgrupadas) {
            mensaje += `*Jornada ${jornada}*\n`;

            deudasAgrupadas[jornada].forEach(ficha => {
                mensaje += `🔴 ${ficha.nombre}: ${ficha.total.toFixed(2)}€\n`;
            });
            mensaje += `\n`;
        }
    }

    mensaje += `💸 Por favor, id haciendo los Bizum al tesorero. ¡Gracias! 🙏`;

    if (textareaWhatsapp) {
        textareaWhatsapp.value = mensaje;
    }
}

// ==========================================
// 5. EVENTOS: BOTONES DE COPIAR PORTAPAPELES
// ==========================================
if (btnCopiarWhatsapp) {
    btnCopiarWhatsapp.addEventListener('click', () => {
        const texto = document.getElementById('texto-whatsapp').value;
        navigator.clipboard.writeText(texto).then(() => {
            mostrarExitoBoton(btnCopiarWhatsapp, '¡Copiado!');
        });
    });
}

if (btnCopiarGeneral) {
    btnCopiarGeneral.addEventListener('click', () => {
        const texto = document.getElementById('texto-whatsapp-general').value;
        navigator.clipboard.writeText(texto).then(() => {
            mostrarExitoBoton(btnCopiarGeneral, '¡Copiado!');
        });
    });
}