// ==========================================
// 1. CONEXIÓN A LA BASE DE DATOS SUPABASE
// ==========================================
const supabaseUrl = 'https://ushakkxcxuuwbawbccgw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaGFra3hjeHV1d2Jhd2JjY2d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NTg5NzYsImV4cCI6MjEwNDUzNDk3Nn0.rN_VBQu5XBPfhtzQ0jwGF1vMPM8TQZYjzBkZVwWpmag';

// Usamos 'db' en lugar de 'supabase' para evitar el conflicto
const db = window.supabase.createClient(supabaseUrl, supabaseKey);

async function probarConexion() {
    console.log("Intentando conectar a Supabase...");

    const { data: jugadores, error } = await db
        .from('jugadores')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error("¡Error al conectar!", error.message);
    } else {
        console.log("¡CONEXIÓN EXITOSA! 🎉 Aquí están tus jugadores de la BBDD:");
        console.log(jugadores);
    }
}

probarConexion();



// ==========================================
// PANEL PRINCIPAL
// ==========================================

// 1. ATRAPAMOS LOS ELEMENTOS DEL HTML
const botonesJugadores = document.querySelectorAll('.btn-jugador');
const seccionLogin = document.getElementById('login_jugador');

const popupBienvenida = document.getElementById('popup_bienvenida');
const btnContinuar = document.getElementById('btn-continuar'); // <-- ¡Nuevo! Atrapamos el botón OK

const paginaPrincipal = document.getElementById('pagina_principal'); // <-- ¡Nuevo! Atrapamos la página principal

// Variable para recordar qué jugador ha iniciado sesión
let jugadorActual = null;

// SIMULACIÓN DE BASE DE DATOS: Lista de todos los jugadores de la liga para Login
const jugadoresBBDD = [
    "Alejo", "Victor Hugo", "Lavado", "Jaume", "Dani Haro",
    "Beltran", "Ivan", "Herrero", "Bujardon", "Victor Ruiz",
    "Padilla", "Dani Trenes", "Gabri", "Xavi"
];

// SIMULACIÓN DE BASE DE DATOS (Deudas pendientes actuales de la liga)
const deudasPendientesFalsas = [
    { nombre: "Victor Hugo", jornada: 1, total: 3.00 },
    { nombre: "Victor Hugo", jornada: 3, total: 2.00 },
    { nombre: "Alejo", jornada: 2, total: 15.50 },
    { nombre: "Xavi", jornada: 4, total: 5.00 }
    // Nota: Beltran, por ejemplo, no está aquí, así que al entrar le saldrá que debe 0€
];

// SIMULACIÓN BBDD: Deudas históricas totales (¡Ahora con desglose!)
const todasLasDeudasFalsas = [
    { nombre: "Victor Hugo", jornada: 1, eurosPosicion: 3.00, eurosRojas: 2.00, total: 5.00 },
    { nombre: "Alejo", jornada: 1, eurosPosicion: 15.50, eurosRojas: 0.00, total: 15.50 },
    { nombre: "Xavi", jornada: 2, eurosPosicion: 14.00, eurosRojas: 10.00, total: 24.00 },
    { nombre: "Jaume", jornada: 3, eurosPosicion: 4.00, eurosRojas: 0.00, total: 4.00 },
    { nombre: "Dani Haro", jornada: 3, eurosPosicion: 0.00, eurosRojas: 2.00, total: 2.00 }
];

// SIMULACIÓN BBDD: Nombres de los archivos de las fotos
const fotosJugadores = {
    "Victor Hugo": "foto_victor.jpeg",
    "Alejo": "foto_alejo.jpeg",
    "Xavi": "foto_prueba.jpeg", // Usamos la que ya tienes en tu carpeta para que funcione hoy
    "Jaume": "foto_jaume.jpeg"
};

// SIMULACIÓN BBDD: Tabla de mensajes humillantes
const mensajesHumillantesBBDD = [
    "Oye {NOMBRE}, ¿el Bizum te da alergia o qué pasa?",
    "Última hora: {NOMBRE} declara la bancarrota oficial. Se aceptan donativos.",
    "Si la morosidad fuera un deporte olímpico, {NOMBRE} sería medalla de oro.",
    "Madre mía {NOMBRE}... debes más dinero que el propio F.C. Barcelona.",
    "A {NOMBRE} no le llegan los mensajes de cobro, los desvía al buzón de voz."
];

// Variable global para recordar quién es el farolillo y usar su nombre en el popup
let nombreFarolilloActual = "";


// ==========================================
// FUNCIÓN UNIVERSAL PARA COPIAR EN MÓVILES Y PC
// ==========================================
function copiarTextoSeguro(texto, boton, textoExito) {
    // Truco de la vieja escuela para móviles sin HTTPS
    const areaFalsa = document.createElement("textarea");
    areaFalsa.value = texto;
    // La escondemos fuera de la pantalla
    areaFalsa.style.position = "fixed";
    areaFalsa.style.left = "-999999px";
    document.body.appendChild(areaFalsa);

    areaFalsa.select();
    areaFalsa.setSelectionRange(0, 99999); // Para móviles

    try {
        document.execCommand("copy"); // La orden mágica que no pide permisos
        // Reutilizamos tu función de éxito si existe, si no, lo hacemos a mano
        if (typeof mostrarExitoBoton === "function") {
            mostrarExitoBoton(boton, textoExito);
        } else {
            const textoOriginal = boton.textContent;
            boton.textContent = textoExito;
            setTimeout(() => boton.textContent = textoOriginal, 2000);
        }
    } catch (err) {
        alert("Tu navegador ha bloqueado la copia. Cópialo manualmente.");
    }

    document.body.removeChild(areaFalsa); // Limpiamos la basura
}


// LÓGICA: Generar Login y Mostrar Popup mensaje aleatorio
// ==========================================

const cuadriculaJugadores = document.getElementById('cuadricula-jugadores');

// Diccionario de mensajes personalizados (como lo teníamos)
const mensajesBienvenida = {
    "Alejo": ["¡Hombre Alejo! A ver cuánto debes hoy...", "Alejo, Alejo... ¿Ya has hecho el Bizum o vienes a mirar?"],
    "Victor Hugo": ["¡Victor Hugo! El terror de las finanzas ha llegado.", "¿Traes billetes grandes o sueltos?"],
    "Xavi": ["Hombre Xavi, nuestro farolillo favorito...", "Pasa Xavi, pasa. El muro de las lamentaciones está al fondo."]
};

const mensajesPorDefecto = [
    "¡Hola! Prepárate para ver cómo van las cuentas...",
    "¡Bienvenido! Echa un vistazo a la ruina de esta temporada."
];

function obtenerMensajeAleatorio(listaMensajes) {
    const indiceAleatorio = Math.floor(Math.random() * listaMensajes.length);
    return listaMensajes[indiceAleatorio];
}

// 1.1 CONSTRUCTOR AUTOMÁTICO DE BOTONES (SUPABASE)
// CONSTRUCTOR AUTOMÁTICO DE BOTONES
async function generarBotonesLogin() {
    if (!cuadriculaJugadores) return;

    // Vaciamos por si acaso hay algo escrito en el HTML
    cuadriculaJugadores.innerHTML = '';

    // 1. Pedimos los jugadores reales a Supabase
    const { data: jugadoresReales, error } = await db
        .from('jugadores')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error("Error al cargar jugadores:", error.message);
        return;
    }

    // 2. Por cada jugador que nos devuelve Supabase...
    jugadoresReales.forEach(jugadorBBDD => {
        const btn = document.createElement('button');
        btn.className = 'btn-jugador';
        btn.textContent = jugadorBBDD.nombre;

        // Le ponemos la "oreja" para cuando hagan clic (¡Ahora es async!)
        btn.addEventListener('click', async () => {
            // Guardamos el objeto entero del jugador para usarlo en el resto de la web
            jugadorActual = jugadorBBDD;

            // --- MAGIA: PEDIR MENSAJE PERSONALIZADO A SUPABASE ---
            // Le pedimos a la BBDD solo los mensajes donde el id_jugador coincida con este jugador
            const { data: mensajesJugador, errorMensajes } = await db
                .from('mensajes_bienvenida')
                .select('mensaje')
                .eq('id_jugador', jugadorBBDD.id);

            // Si hay un error o por algún casual nos quedamos sin mensajes, ponemos uno por defecto
            if (errorMensajes || !mensajesJugador || mensajesJugador.length === 0) {
                document.getElementById('texto-mensaje-bienvenida').textContent = "¡Bienvenido a la ruina de esta temporada!";
            } else {
                // Si todo va bien, elegimos uno al azar de la lista que nos devuelve (tendrá 3)
                const indiceAleatorio = Math.floor(Math.random() * mensajesJugador.length);
                document.getElementById('texto-mensaje-bienvenida').textContent = mensajesJugador[indiceAleatorio].mensaje;
            }

            // Ocultamos login y mostramos popup
            document.getElementById('login_jugador').classList.add('oculto');
            document.getElementById('popup_bienvenida').classList.remove('oculto');
        });

        // Metemos el botón en la cuadrícula
        cuadriculaJugadores.appendChild(btn);
    });
}

// Ejecutamos la función al cargar la página
generarBotonesLogin();



// 2.1 LÓGICA TARJETA DEUDAS (Ahora conectada a Supabase)
async function actualizarTarjetaDeudas() {
    const textoDeudas = document.getElementById('texto-tus-deudas');
    if (!textoDeudas) return;

    // Mensajito rápido mientras carga
    textoDeudas.innerHTML = "";

    // 1. Pedimos a Supabase solo las deudas PENDIENTES de ESTE jugador
    const { data: misDeudas, error } = await db
        .from('detalle_pagos')
        .select('*')
        .eq('id_jugador', jugadorActual.id) // Solo de este ID
        .eq('pagado', false)                // Solo las no pagadas
        .order('jornada', { ascending: true });

    if (error) {
        console.error("Error al cargar las deudas:", error.message);
        textoDeudas.innerHTML = "Error al consultar tus deudas.";
        return;
    }

    // 2. Comprobamos si tiene deudas
    if (!misDeudas || misDeudas.length === 0) {
        // ESTÁ AL DÍA
        textoDeudas.innerHTML = "¡Estás al día! No debes nada.";
        textoDeudas.style.color = ""; // Quitamos cualquier rojo residual
    } else {
        // TIENE DEUDAS
        let sumaTotal = 0;
        let listaDesgloseHTML = `<ul style="list-style-type: none; padding-left: 0; margin-top: 10px; color: #333333; font-size: 0.9em;">`;

        misDeudas.forEach(deuda => {
            // En BBDD tenemos posición y rojas por separado, así que las sumamos
            const totalJornada = deuda.importe_posicion + deuda.importe_rojas;
            sumaTotal += totalJornada;

            // Añadimos cada jornada al HTML (incluyendo el desglose en gris)
            listaDesgloseHTML += `<li style="margin-bottom: 5px; padding-left: 10px; border-left: 3px solid #db2028;">
                Jornada ${deuda.jornada}: <strong>${totalJornada.toFixed(2)}€</strong> 
                <span style="font-size: 0.8em; color: gray;">(Pos: ${deuda.importe_posicion}€ | Roj: ${deuda.importe_rojas}€)</span>
            </li>`;
        });

        listaDesgloseHTML += `</ul>`; // Cerramos la lista

        // Inyectamos el total resaltado en rojo y la lista de desglose debajo
        textoDeudas.innerHTML = `
            <div style="color: #db2028; font-weight: bold; font-size: 1.0em; margin-bottom: 10px;">
                Debes un total de ${sumaTotal.toFixed(2)} €
            </div>
            ${listaDesgloseHTML}
        `;
        textoDeudas.style.color = "";
    }
}


// ==========================================
// 2.2 LÓGICA: Tarjeta del Farolillo Rojo (Conectada a BBDD)
// ==========================================
async function actualizarFarolillo() {
    // 1. Pedimos TODAS las deudas y TODOS los jugadores a Supabase
    const { data: todasLasDeudas, errorDeudas } = await db.from('detalle_pagos').select('*');
    const { data: todosLosJugadores, errorJugadores } = await db.from('jugadores').select('*');

    if (errorDeudas || errorJugadores) {
        console.error("Error al cargar datos para el farolillo.");
        return;
    }

    // 2. Sumamos la deuda total generada por cada ID de jugador
    const totalesPorId = {};
    todasLasDeudas.forEach(deuda => {
        if (!totalesPorId[deuda.id_jugador]) {
            totalesPorId[deuda.id_jugador] = 0;
        }
        // Sumamos posición + rojas
        totalesPorId[deuda.id_jugador] += (deuda.importe_posicion + deuda.importe_rojas);
    });

    // 3. Buscamos el ID que ha generado la deuda más alta
    let maxDeuda = -1;
    let idFarolillo = null;

    for (const [id_jugador, total] of Object.entries(totalesPorId)) {
        if (total > maxDeuda) {
            maxDeuda = total;
            idFarolillo = parseInt(id_jugador);
        }
    }

    // 4. Buscamos los datos de ese desgraciado en la lista de jugadores
    const jugadorFarolillo = todosLosJugadores.find(j => j.id === idFarolillo);

    // 5. Inyectamos los datos en el HTML
    const textoFarolillo = document.getElementById('texto-el-ultimo');
    if (textoFarolillo && jugadorFarolillo) {

        // Guardamos el nombre globalmente para que el botón de insultar sepa a quién va dirigido
        nombreFarolilloActual = jugadorFarolillo.nombre;
        idFarolilloActual = jugadorFarolillo.id;

        textoFarolillo.innerHTML = `
            Como pedazo de farolo tenemos a: <strong>${jugadorFarolillo.nombre.toUpperCase()}</strong> habiendo pagado un total de <strong>${maxDeuda.toFixed(2)}€</strong>.
            <br><br>
            ¡No pierdas la oportunidad de reírte de él y envíale un mensaje ahora mismo!
        `;
    }

    // 6. Cambiamos la foto usando el nombre del archivo de la BBDD
    const imagenFarolillo = document.querySelector('.foto-farolillo');
    if (imagenFarolillo && jugadorFarolillo) {
        // Si el jugador tiene foto en la BBDD la usa, si no, usa la de prueba
        imagenFarolillo.src = jugadorFarolillo.foto || "foto_prueba.jpeg";
    }
}


// ==========================================
// 2.3 LÓGICA: Tabla de Clasificación General (Conectada a BBDD)
// ==========================================
async function actualizarClasificacionGeneral() {
    const cuerpoTabla = document.getElementById('cuerpo-tabla-clasificacion');
    if (!cuerpoTabla) return;



    // 1. Pedimos TODOS los jugadores y TODAS las deudas a Supabase
    const { data: todosLosJugadores, errorJugadores } = await db.from('jugadores').select('*');
    const { data: todasLasDeudas, errorDeudas } = await db.from('detalle_pagos').select('*');

    if (errorJugadores || errorDeudas) {
        console.error("Error al cargar la clasificación.");
        cuerpoTabla.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Error al cargar datos.</td></tr>';
        return;
    }

    // ==== MAGIA 1: CONTAR JORNADAS ÚNICAS REALES ====
    const listaDeJornadas = todasLasDeudas.map(deuda => deuda.jornada);
    const jornadasUnicas = new Set(listaDeJornadas);
    const numeroJornadasJugadas = jornadasUnicas.size; // Esto sabrá automáticamente si vais por la 4 o por la 15

    // 2. Preparamos el resumen para cada jugador usando su ID real
    const resumenJugadores = {};
    todosLosJugadores.forEach(jugador => {
        resumenJugadores[jugador.id] = {
            nombre: jugador.nombre,
            eurosPosicion: 0,
            eurosRojas: 0,
            total: 0
        };
    });

    // 3. Sumamos los euros reales de la BBDD a cada jugador
    todasLasDeudas.forEach(deuda => {
        // En BBDD las columnas se llaman importe_posicion e importe_rojas
        if (resumenJugadores[deuda.id_jugador]) {
            resumenJugadores[deuda.id_jugador].eurosPosicion += deuda.importe_posicion;
            resumenJugadores[deuda.id_jugador].eurosRojas += deuda.importe_rojas;
            resumenJugadores[deuda.id_jugador].total += (deuda.importe_posicion + deuda.importe_rojas);
        }
    });

    // 4. Ordenamos a los jugadores de menor a mayor deuda
    const listaClasificacion = Object.values(resumenJugadores);
    listaClasificacion.sort((a, b) => a.total - b.total);

    // Vaciamos el HTML
    cuerpoTabla.innerHTML = '';

    let boteTotalGlobal = 0;

    // 5. Pintamos las filas una a una
    listaClasificacion.forEach((jugador, index) => {
        boteTotalGlobal += jugador.total;

        // Proyección individual automática a 38 jornadas
        let proyeccion = 0;
        if (numeroJornadasJugadas > 0) {
            proyeccion = (jugador.total / numeroJornadasJugadas) * 38;
        }

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${jugador.nombre}</strong></td>
            <td><strong>${jugador.total.toFixed(2)} €</strong></td>
            <td>${jugador.eurosPosicion.toFixed(2)} €</td>
            <td>${jugador.eurosRojas.toFixed(2)} €</td>
            <td class="texto-gris">${proyeccion.toFixed(2)} €</td>
        `;
        cuerpoTabla.appendChild(fila);
    });

    // ==== MAGIA 2: ACTUALIZAR TARJETAS GLOBALES ====
    const spanTotal = document.getElementById('total-pagado-global');
    const spanProyeccion = document.getElementById('proyeccion-global');
    const spanComida = document.getElementById('comida-persona');

    if (spanTotal) spanTotal.textContent = boteTotalGlobal.toFixed(2) + ' €';

    let proyeccionGlobal = 0;
    if (numeroJornadasJugadas > 0) {
        proyeccionGlobal = (boteTotalGlobal / numeroJornadasJugadas) * 38;
    }

    if (spanProyeccion) {
        spanProyeccion.textContent = proyeccionGlobal.toFixed(2) + ' €';
    }

    if (spanComida) {
        // Dividimos entre los 14 jugadores que sois realmente en la base de datos
        const precioComidaPersona = proyeccionGlobal / todosLosJugadores.length;
        spanComida.textContent = precioComidaPersona.toFixed(2) + ' €';
    }
}


// 3. LÓGICA: De Popup a Página Principal (¡Nuevo!)
btnContinuar.addEventListener('click', async () => {
    // Cuando pulsen "OK", ocultamos el popup
    popupBienvenida.classList.add('oculto');

    // ¡NUEVO! Calculamos y escribimos las deudas antes de abrir el telón
    await actualizarTarjetaDeudas();

    await actualizarFarolillo();

    await actualizarClasificacionGeneral();

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


// ==========================================
// 5. LÓGICA: Popup del Farolillo Rojo (Conectado a Supabase por ID)
// ==========================================
// Atrapamos los elementos
const btnGenerarUltimo = document.getElementById('btn-generar-ultimo');
const popupUltimo = document.getElementById('popup-ultimo');
const btnCerrarPopupUltimo = document.getElementById('btn-cerrar-popup-ultimo');
const textoPopupUltimo = document.getElementById('texto-popup-ultimo'); // Atrapamos el texto

// Cuando pulsamos el botón rojo de la tarjeta, descargamos una frase de ESTE jugador
btnGenerarUltimo.addEventListener('click', async () => {

    // 1. Mostramos el popup con un texto de "Cargando..."
    textoPopupUltimo.textContent = "Cargando...";
    popupUltimo.classList.remove('oculto');

    // Si por algún motivo no tenemos el ID, cortamos aquí
    if (!idFarolilloActual) return;

    // 2. Pedimos a Supabase los mensajes, PERO SOLO LOS DE ESTE JUGADOR
    const { data: mensajesHumillantes, error } = await db
        .from('mensajes_ultimo')
        .select('mensaje')
        .eq('id_jugador', idFarolilloActual); // Aquí está el filtro mágico

    // 3. Si hay un error de conexión o no hay mensajes para él en la BBDD
    if (error || !mensajesHumillantes || mensajesHumillantes.length === 0) {
        textoPopupUltimo.textContent = `Madre mía ${nombreFarolilloActual}... ¿haces las alineaciones con los ojos cerrados?`;
        return;
    }

    // 4. Elegimos uno al azar de SU propia lista
    const indice = Math.floor(Math.random() * mensajesHumillantes.length);
    const fraseElegida = mensajesHumillantes[indice].mensaje;

    // 5. Lo inyectamos en el popup (ya vienen personalizados desde la BBDD)
    textoPopupUltimo.textContent = fraseElegida;
});

// Cuando pulsamos "Cerrar" dentro del popup, lo volvemos a ocultar
btnCerrarPopupUltimo.addEventListener('click', () => {
    popupUltimo.classList.add('oculto');
});


// 6. LÓGICA: Botón Copiar al portapapeles (FAROLILLO ROJO)
const btnCopiarFarolillo = document.getElementById('btn-copiar');
const textoBroma = document.getElementById('texto-popup-ultimo');

if (btnCopiarFarolillo && textoBroma) {
    btnCopiarFarolillo.addEventListener('click', () => {
        const textoACopiar = textoBroma.textContent;
        copiarTextoSeguro(textoACopiar, btnCopiarFarolillo, '¡Copiado! ✅');
    });
}


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
// SALIR DEL PANEL DE TESORERO
// ==========================================
// NOTA: Comprueba que el ID sea el mismo que tienes en tu archivo HTML
const btnVolverTesorero = document.getElementById('btn-volver-tesorero');

if (btnVolverTesorero) {
    btnVolverTesorero.addEventListener('click', () => {
        // Escondemos el panel del tesorero
        vistaTesorero.classList.add('oculto');
        // Mostramos la vista principal (el login)
        vistaPrincipal.classList.remove('oculto');
    });
}

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
//  PESTAÑA AÑADIR DEUDAS
// ==========================================

// 1. VARIABLES GLOBALES Y MOCHILAS
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

// 2. LÓGICA: AÑADIR JUGADOR AL CARRITO (PANTALLA)
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

// 3. EVENTO: GUARDAR JORNADA COMPLETA
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
        actualizarPantallaSaldar();
        actualizarMensajeGeneral();

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

// 4. GENERADOR AUTOMÁTICO DE WHATSAPP
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

// 5. EVENTOS: BOTONES DE COPIAR PORTAPAPELES (TESORERO)
if (btnCopiarWhatsapp) {
    btnCopiarWhatsapp.addEventListener('click', () => {
        const texto = document.getElementById('texto-whatsapp').value;
        copiarTextoSeguro(texto, btnCopiarWhatsapp, '¡Copiado!');
    });
}

if (btnCopiarGeneral) {
    btnCopiarGeneral.addEventListener('click', () => {
        const texto = document.getElementById('texto-whatsapp-general').value;
        copiarTextoSeguro(texto, btnCopiarGeneral, '¡Copiado!');
    });
}


// ==========================================
// PESTAÑA SALDAR Y CORREGIR ERRORES
// ==========================================

// Mochila para los pagos realizados (historial)
let historialPagos = [];

function actualizarPantallaSaldar() {
    // Buscamos tus contenedores exactos
    const contenedorPendientes = document.querySelector('.tarjeta-pendientes .lista-pagos');
    const contenedorHistorial = document.querySelector('.tarjeta-historial .lista-pagos');

    if (!contenedorPendientes || !contenedorHistorial) return;

    // 1. Vaciamos las listas para volver a pintarlas actualizadas
    contenedorPendientes.innerHTML = '';
    contenedorHistorial.innerHTML = '';

    // --- RENDERIZAR DEUDAS PENDIENTES ---
    if (mochilaDeudas.length === 0) {
        contenedorPendientes.innerHTML = `<p class="texto-ayuda-mensaje" style="text-align:center; padding: 10px;">No hay deudas pendientes.</p>`;
    } else {
        mochilaDeudas.forEach((ficha, index) => {
            const divItem = document.createElement('div');
            divItem.className = 'item-pago'; // Usamos tu clase exacta

            // Inyectamos tu HTML con la papelera de 12x12 a la izquierda
            divItem.innerHTML = `
                <button class="btn-borrar-error" title="Borrar por error">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="12" height="12">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>

                <span class="jornada-pago">Jornada ${ficha.jornada}</span>
                <span class="nombre-pago">${ficha.nombre}</span>
                <span class="cantidad-rojo">-${ficha.total.toFixed(2)}€</span>
                
                <button class="btn-cobrar" title="Marcar como pagado">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </button>
            `;

            // Acción: BORRAR POR ERROR (Papelera)
            const btnBorrar = divItem.querySelector('.btn-borrar-error');
            btnBorrar.addEventListener('click', () => {
                if (confirm(`⚠️ ¿Borrar la deuda de ${ficha.nombre} (Jornada ${ficha.jornada})?`)) {
                    mochilaDeudas.splice(index, 1); // Se elimina totalmente
                    actualizarPantallaSaldar();
                    actualizarMensajeWhatsApp();
                    actualizarMensajeGeneral();
                }
            });

            // Acción: COBRAR (Verde)
            const btnCobrar = divItem.querySelector('.btn-cobrar');
            btnCobrar.addEventListener('click', () => {
                if (confirm(`¿Marcar los ${ficha.total.toFixed(2)}€ de ${ficha.nombre} como PAGADOS?`)) {
                    const [deudaCobrada] = mochilaDeudas.splice(index, 1);
                    historialPagos.unshift(deudaCobrada); // Pasa al principio del historial
                    actualizarPantallaSaldar();
                    actualizarMensajeWhatsApp();
                }
            });

            contenedorPendientes.appendChild(divItem);
        });
    }

    // --- RENDERIZAR HISTORIAL DE ÚLTIMOS PAGOS ---
    if (historialPagos.length === 0) {
        contenedorHistorial.innerHTML = `<p class="texto-ayuda-mensaje" style="text-align:center; padding: 10px;">No hay pagos recientes.</p>`;
    } else {
        historialPagos.forEach((ficha, index) => {
            const divItem = document.createElement('div');
            divItem.className = 'item-pago';

            divItem.innerHTML = `
                <span class="jornada-pago">Jornada ${ficha.jornada}</span>
                <span class="nombre-pago">${ficha.nombre}</span>
                <span class="cantidad-verde">+${ficha.total.toFixed(2)}€</span>
                <button class="btn-deshacer" title="Deshacer pago">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                        <path d="M3 7v6h6"></path>
                        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
                    </svg>
                </button>
            `;

            // Acción: DESHACER PAGO
            const btnDeshacer = divItem.querySelector('.btn-deshacer');
            btnDeshacer.addEventListener('click', () => {
                if (confirm(`¿Deshacer el pago de ${ficha.nombre} y que vuelva a aparecer como deuda?`)) {
                    const [pagoDevuelto] = historialPagos.splice(index, 1);
                    mochilaDeudas.push(pagoDevuelto); // Vuelve a Pendientes
                    actualizarPantallaSaldar();
                    actualizarMensajeWhatsApp();
                }
            });

            contenedorHistorial.appendChild(divItem);
        });
    }
}

// ==========================================
//  MENSAJE AUTOMÁTICO: CLASIFICACIÓN GENERAL
// ==========================================
function actualizarMensajeGeneral() {
    const textareaGeneral = document.getElementById('texto-whatsapp-general');
    if (!textareaGeneral) return; // Si no existe la caja, no hacemos nada

    // 1. Juntamos todas las deudas (las pendientes y las ya pagadas)
    const todasLasDeudas = [...mochilaDeudas, ...historialPagos];

    // 2. Sumamos el total por cada jugador
    const totalesPorJugador = {};
    todasLasDeudas.forEach(ficha => {
        if (!totalesPorJugador[ficha.nombre]) {
            totalesPorJugador[ficha.nombre] = 0;
        }
        totalesPorJugador[ficha.nombre] += ficha.total;
    });

    // 3. Convertimos ese resumen en una lista
    const listaJugadores = Object.keys(totalesPorJugador).map(nombre => {
        return {
            nombre: nombre,
            total: totalesPorJugador[nombre]
        };
    });

    // 4. Los ordenamos alfabéticamente para que la lista quede ordenada
    listaJugadores.sort((a, b) => a.nombre.localeCompare(b.nombre));

    // 5. Construimos el mensaje de WhatsApp (Enlace arriba del todo)
    let mensaje = `🏆 *Clasificación Actualizada* 🏆\n\n`;
    mensaje += `Podéis ver todos los detalles aquí:\nhttps://tu-web-de-la-liga.com\n\n`;

    if (listaJugadores.length === 0) {
        mensaje += `Todavía no hay deudas registradas.\n`;
    } else {
        listaJugadores.forEach(jugador => {
            // Usamos Math.abs() por si acaso para asegurar que el número siempre sea positivo,
            // y hemos quitado el "-" que había antes del símbolo del euro.
            const importeLimpio = Math.abs(jugador.total).toFixed(2);
            mensaje += `${jugador.nombre}: ${importeLimpio}€\n`;
        });
    }

    // 6. Inyectamos el texto en su caja correspondiente
    textareaGeneral.value = mensaje;
}

// ==========================================
// LÓGICA: IMPORTAR CSV EN TESORERO
// ==========================================

const inputCsv = document.getElementById('input-csv');

if (inputCsv) {
    inputCsv.addEventListener('change', (evento) => {
        const archivo = evento.target.files[0];
        if (!archivo) return;

        const lector = new FileReader();

        lector.onload = (e) => {
            const contenido = e.target.result;
            const lineas = contenido.split('\n');

            let deudasTemporales = [];
            let huboError = false;

            for (let i = 1; i < lineas.length; i++) {
                const linea = lineas[i].trim();
                if (!linea) continue;

                const columnas = linea.split(';');
                if (columnas.length < 4) continue;

                const nombre = columnas[0].trim();

                // ==== VALIDACIÓN DE NOMBRE ====
                // IMPORTANTE: Asegúrate de que la variable "jugadoresBBDD" 
                // esté declarada arriba del todo en tu archivo JS.
                if (!jugadoresBBDD.includes(nombre)) {
                    alert(`❌ ERROR: El jugador "${nombre}" no existe en la base de datos (Fila ${i + 1}). Revisa las mayúsculas, tildes o espacios en el CSV. Importación cancelada.`);
                    huboError = true;
                    break;
                }

                const jornada = parseInt(columnas[1].trim());

                // ==== LECTURA DE EUROS ====
                const eurosPos = parseFloat(columnas[2].trim()) || 0;
                const eurosRoj = parseFloat(columnas[3].trim()) || 0;
                const total = eurosPos + eurosRoj;

                // Lo metemos en la mochila temporal
                deudasTemporales.push({
                    nombre: nombre,
                    jornada: jornada,
                    eurosPosicion: eurosPos,
                    eurosRojas: eurosRoj,
                    total: total
                });
            }

            // Si el bucle terminó sin errores, guardamos de verdad
            if (!huboError) {

                // Volcamos todas las deudas del Excel a la mochila real del tesorero
                mochilaDeudas.push(...deudasTemporales);

                // ¡AQUÍ ESTÁ LA MAGIA! Llamamos a tus propias funciones para que se repinte todo
                actualizarPantallaSaldar();
                actualizarMensajeWhatsApp();
                actualizarMensajeGeneral();

                alert(`¡Éxito! ✅ Se han añadido ${deudasTemporales.length} deudas nuevas desde el CSV.`);
            }

            // Vaciamos el input siempre
            inputCsv.value = "";
        };

        lector.readAsText(archivo);
    });
}