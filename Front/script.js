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
// EFECTOS DE BOTONES: GUARDAR Y COPIAR
// ==========================================

// 1. Seleccionamos los tres botones
const btnGuardarJornada = document.getElementById('btn-guardar-jornada');
const btnCopiarWhatsapp = document.getElementById('btn-copiar-whatsapp');
const btnCopiarGeneral = document.getElementById('btn-copiar-general');

// 2. Función maestra para el efecto visual de "Éxito"
function mostrarExitoBoton(boton, textoExito) {
    // Guardamos el texto original del botón (con su icono)
    const textoOriginal = boton.innerHTML;

    // Le ponemos el texto nuevo (ej: "✅ ¡Copiado!") y la clase verde
    boton.innerHTML = `✅ ${textoExito}`;
    boton.classList.add('btn-copiado');

    // Programamos un temporizador: a los 2000 milisegundos (2 segundos), vuelve a la normalidad
    setTimeout(() => {
        boton.innerHTML = textoOriginal;
        boton.classList.remove('btn-copiado');
    }, 2000);
}

// 3. Evento para el botón de "Guardar Jornada"
if (btnGuardarJornada) {
    btnGuardarJornada.addEventListener('click', () => {
        // Por ahora solo hace el efecto visual. ¡Más adelante aquí guardaremos los datos en MySQL!
        mostrarExitoBoton(btnGuardarJornada, '¡Guardado!');
    });
}

// 4. Evento para "Copiar Mensaje" (WhatsApp)
if (btnCopiarWhatsapp) {
    btnCopiarWhatsapp.addEventListener('click', () => {
        // Cogemos el texto que hay dentro del textarea
        const texto = document.getElementById('texto-whatsapp').value;

        // Lo copiamos al portapapeles real del dispositivo
        navigator.clipboard.writeText(texto).then(() => {
            // Si se copia bien, disparamos el efecto visual
            mostrarExitoBoton(btnCopiarWhatsapp, '¡Copiado!');
        });
    });
}

// 5. Evento para "Copiar Clasificación General"
if (btnCopiarGeneral) {
    btnCopiarGeneral.addEventListener('click', () => {
        // Cogemos el texto de la segunda caja
        const texto = document.getElementById('texto-whatsapp-general').value;

        // Lo copiamos al portapapeles
        navigator.clipboard.writeText(texto).then(() => {
            mostrarExitoBoton(btnCopiarGeneral, '¡Copiado!');
        });
    });
}


// ==========================================
// LÓGICA: AÑADIR A LA LISTA DEL TESORERO
// ==========================================

// 🎒 AQUÍ ESTÁ NUESTRA MOCHILA (Array vacío)
let mochilaDeudas = [];

const btnAnadirLista = document.getElementById('btn-anadir-lista');
const listaDeudas = document.getElementById('lista-deudas-pendientes');
const textoListaVacia = document.getElementById('texto-lista-vacia');

const inputJugador = document.getElementById('tesorero-jugador');
const inputPosicion = document.getElementById('tesorero-posicion');
const inputRojas = document.getElementById('tesorero-rojas');

if (btnAnadirLista) {
    btnAnadirLista.addEventListener('click', () => {

        // 1. Recogemos los valores
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

        // --- NUEVO: GUARDAMOS EN LA MOCHILA ---
        // Creamos una "ficha" con los datos bien ordenaditos para la base de datos
        const fichaDeuda = {
            nombre: jugador,
            eurosPosicion: eurosPos,
            eurosRojas: eurosRoj,
            total: total
        };

        // Metemos la ficha en la mochila
        mochilaDeudas.push(fichaDeuda);
        actualizarMensajeWhatsApp();
        // --------------------------------------

        // 3. Ocultamos el texto de "lista vacía"
        textoListaVacia.classList.add('oculto');

        // 4. Creamos la fila HTML
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

        // 5. La papelera (borrar HTML y sacar de la mochila)
        const btnBorrar = nuevaFila.querySelector('.btn-eliminar-carrito');
        btnBorrar.addEventListener('click', () => {
            nuevaFila.remove(); // El navegador borra la fila visual

            // --- NUEVO: SACAMOS AL JUGADOR DE LA MOCHILA ---
            // Le decimos a la mochila: "Quédate solo con los que NO se llamen como este jugador"
            mochilaDeudas = mochilaDeudas.filter(item => item.nombre !== jugador);

            actualizarMensajeWhatsApp();
            // -----------------------------------------------

            if (listaDeudas.children.length === 1) {
                textoListaVacia.classList.remove('oculto');
            }
        });

        // 6. Pegamos la fila en la pantalla
        listaDeudas.appendChild(nuevaFila);

        // 7. Limpiamos los campos
        inputJugador.value = "";
        inputPosicion.value = "";
        inputRojas.value = "";
    });
}

// ==========================================
// EVENTO: ERROR BOTÓN GUARDAR JORNADA SIN JORNADA
// ==========================================
if (btnGuardarJornada) {
    btnGuardarJornada.addEventListener('click', () => {

        // 1. Miramos qué hay escrito en la caja de la jornada
        const inputJornada = document.getElementById('tesorero-jornada');

        // --- VALIDACIÓN ÚNICA: ¿Está vacío? ---
        // Si el campo está completamente vacío...
        if (inputJornada.value.trim() === "") {
            alert("⚠️ ¡Falta la Jornada! Escribe el número arriba antes de guardar.");
            inputJornada.focus(); // Este truco mueve la pantalla y pone el cursor en la caja automáticamente
            return; // El "return" frena el código aquí, no se guarda nada
        }

        // --- TRUCO PARA VER LA MOCHILA ---
        console.log("JORNADA A GUARDAR:", inputJornada.value);
        console.log("DATOS EN LA MOCHILA:", mochilaDeudas);
        // ---------------------------------

        // Si ha superado el bloqueo (sí hay un número), hacemos el efecto de éxito
        mostrarExitoBoton(btnGuardarJornada, '¡Guardado!');

        // (Aquí irá en el futuro el código para enviar los datos a MySQL)
    });
}



// ==========================================
// GENERADOR AUTOMÁTICO DE WHATSAPP
// ==========================================
function actualizarMensajeWhatsApp() {
    const inputJornada = document.getElementById('tesorero-jornada').value;
    const textareaWhatsapp = document.getElementById('texto-whatsapp');

    // Si no ha puesto jornada todavía, ponemos un texto por defecto
    const textoJornada = inputJornada.trim() !== "" ? `*Jornada ${inputJornada}*` : '*Jornada (Sin especificar)*';

    // 1. Empezamos a construir el mensaje con la cabecera
    let mensaje = `🚨 *DEUDAS PENDIENTES* 🚨\n\n${textoJornada}\n`;

    // 2. Recorremos la mochila y añadimos una línea por cada jugador
    if (mochilaDeudas.length === 0) {
        mensaje += `✅ Todos al día, no hay deudas nuevas.\n`;
    } else {
        // El forEach es un bucle que repite esta acción por cada ficha de la mochila
        mochilaDeudas.forEach(ficha => {
            mensaje += `🔴 ${ficha.nombre}: ${ficha.total.toFixed(2)}€\n`;
        });
    }

    // 3. Añadimos el texto final
    mensaje += `\n💸 Por favor, id haciendo los Bizum al tesorero. ¡Gracias! 🙏`;

    // 4. Metemos todo este texto dentro del textarea de la pestaña 3
    if (textareaWhatsapp) {
        textareaWhatsapp.value = mensaje;
    }
}

// Hacemos que si el tesorero cambia el número de jornada, se actualice el texto al instante
const inputJornada = document.getElementById('tesorero-jornada');
if (inputJornada) {
    inputJornada.addEventListener('input', actualizarMensajeWhatsApp);
}