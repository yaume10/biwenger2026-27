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
            Como pedazo de farolo tenemos a: <strong style="color: #db2028;">${jugadorFarolillo.nombre.toUpperCase()}</strong> habiendo pagado un total de <strong style="color: #db2028;">${maxDeuda.toFixed(2)}€</strong>.
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

    // ¡NUEVO! Calculamos y escribimos TODO antes de abrir el telón
    await Promise.all([
        actualizarTarjetaDeudas(),
        actualizarFarolillo(),
        actualizarClasificacionGeneral(),
        actualizarPerdedorJornada() // <--- ¡AQUÍ ESTÁ LA NUEVA FUNCIÓN!
    ]);

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
// ACCESO AL PANEL DE TESORERO (Supabase)
// ==========================================
const btnAccesoTesorero = document.getElementById('btn-acceso-tesorero');
const vistaPrincipal = document.getElementById('login_jugador');
const vistaTesorero = document.getElementById('panel_tesorero');

// ¡Le ponemos async porque vamos a consultar a la BBDD!
btnAccesoTesorero.addEventListener('click', async () => {

    // 1. Lanzamos la ventana emergente pidiendo la clave
    const contrasena = prompt('🔒 Introduce la contraseña del Tesorero:');

    // 2. Si pulsa "Cancelar" o lo deja en blanco, no hacemos nada
    if (contrasena === null || contrasena.trim() === "") return;

    // 3. Vamos a Supabase a buscar si ALGÚN jugador tiene esa clave
    const { data: tesoreroEncontrado, error } = await db
        .from('jugadores')
        .select('nombre, password')
        .eq('password', contrasena); // Busca la coincidencia exacta de la clave

    if (error) {
        alert('❌ Error de conexión al verificar la contraseña.');
        return;
    }

    // 4. Comprobamos si Supabase nos ha devuelto a alguien (en tu caso, a Iván)
    if (tesoreroEncontrado && tesoreroEncontrado.length > 0) {

        // Opcional: Le damos la bienvenida por su nombre para que quede chulo
        alert(`✅ ¡Acceso concedido!`);

        // Escondemos la vista normal y mostramos el panel del tesorero
        vistaPrincipal.classList.add('oculto');
        vistaTesorero.classList.remove('oculto');

        actualizarPantallaSaldar();

    } else {
        // No hay nadie en la base de datos con esa contraseña
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
btnSaldar.addEventListener('click', () => {
    cambiarPestanaTesorero(btnSaldar, contenidoSaldar);
    actualizarPantallaSaldar(); // ¡Novedad! Al entrar aquí, pedimos los datos a Supabase
});
btnAnadir.addEventListener('click', () => cambiarPestanaTesorero(btnAnadir, contenidoAnadir));
btnMensaje.addEventListener('click', () => {
    cambiarPestanaTesorero(btnMensaje, contenidoMensaje);
    actualizarMensajeWhatsApp(); // Se genera el texto fresquito de la BBDD al entrar
});


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
            alert("⚠️ Selecciona un jugador primero.");
            return;
        }

        const total = eurosPos + eurosRoj;

        if (total === 0) {
            alert("⚠️ El jugador no tiene ninguna deuda.");
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

// 3. EVENTO: GUARDAR JORNADA COMPLETA (¡Ahora en Supabase!)
if (btnGuardarJornada) {
    // Le ponemos ASYNC para poder mandar datos a la base de datos
    btnGuardarJornada.addEventListener('click', async () => {
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

        // Ponemos el botón en modo "cargando" para que el tesorero no haga doble clic por error
        const textoOriginalBoton = btnGuardarJornada.innerHTML;
        btnGuardarJornada.innerHTML = "⏳ Guardando Datos Jornada...";
        btnGuardarJornada.disabled = true;

        try {
            // --- PASO A: NECESITAMOS LOS IDs REALES DE LOS JUGADORES ---
            // Le pedimos a Supabase TODOS los jugadores para poder relacionar el "Nombre" del carrito con su "ID" real.
            const { data: todosLosJugadores, error: errorJugadores } = await db.from('jugadores').select('id, nombre');

            if (errorJugadores) throw new Error("Error al obtener los IDs de los jugadores.");

            // --- PASO B: PREPARAMOS EL PAQUETE PARA SUPABASE ---
            // Vamos a transformar tu 'carritoTemporal' en el formato exacto que pide la tabla 'detalle_pagos'
            const paqueteDeudas = carritoTemporal.map(ficha => {

                // Buscamos el ID del jugador cuyo nombre coincide con el de la ficha del carrito
                const jugadorEncontrado = todosLosJugadores.find(j => j.nombre === ficha.nombre);

                // Si por algún motivo el nombre del HTML no coincide con BBDD, avisamos por consola
                if (!jugadorEncontrado) console.warn(`¡Ojo! No encuentro el ID para ${ficha.nombre}`);

                return {
                    id_jugador: jugadorEncontrado ? jugadorEncontrado.id : null,
                    jornada: parseInt(numJornada),
                    importe_posicion: ficha.eurosPosicion,
                    importe_rojas: ficha.eurosRojas,
                    pagado: false // Por defecto, todas las deudas nuevas nacen sin pagar
                };
            });

            // --- PASO C: ¡ENVIAMOS TODO A SUPABASE DE GOLPE! ---
            const { error: errorInsert } = await db.from('detalle_pagos').insert(paqueteDeudas);

            if (errorInsert) throw new Error("Error al insertar las deudas: " + errorInsert.message);

            // --- PASO D: ¡ÉXITO! LIMPIAMOS Y AVISAMOS ---
            mostrarExitoBoton(btnGuardarJornada, '¡Guardado con éxito!');

            // Vaciamos el carrito de espera
            carritoTemporal = [];
            const itemsEnPantalla = document.querySelectorAll('.item-carrito');
            itemsEnPantalla.forEach(item => item.remove());

            if (textoListaVacia) {
                textoListaVacia.classList.remove('oculto');
            }

            inputJornada.value = ""; // Vaciamos la jornada del input

        } catch (error) {
            console.error(error);
            alert("❌ Ha habido un error al guardar: " + error.message);
        } finally {
            // Pase lo que pase (éxito o error), devolvemos el botón a la normalidad
            btnGuardarJornada.innerHTML = textoOriginalBoton;
            btnGuardarJornada.disabled = false;
        }
    });
}

// ==========================================
// 4. GENERADOR AUTOMÁTICO DE WHATSAPP (Conectado a BBDD)
// ==========================================
async function actualizarMensajeWhatsApp() {
    const textareaWhatsapp = document.getElementById('texto-whatsapp');
    if (!textareaWhatsapp) return;

    // 1. Ponemos un texto temporal por si tarda medio segundo en descargar
    textareaWhatsapp.value = "⏳ Generando mensaje de deudas...";

    try {
        // 2. Pedimos los jugadores y SOLO las deudas que están sin pagar
        const { data: todosLosJugadores } = await db.from('jugadores').select('id, nombre');
        const { data: deudasPendientes, error } = await db.from('detalle_pagos').select('*').eq('pagado', false);

        if (error) throw new Error("Error obteniendo las deudas.");

        let mensaje = `🚨 *DEUDAS ACTUALIZADAS* 🚨\nPara ver consultar la clasificación y otros detalles entrar en:\n👉 www.tu-web-de-la-liga.com\n\n`;

        // Si la BBDD nos dice que no hay nada pendiente...
        if (!deudasPendientes || deudasPendientes.length === 0) {
            mensaje += `✅ Todos al día, no hay deudas nuevas.\n\n`;
        } else {

            // 3. Agrupamos las deudas por número de jornada
            const deudasAgrupadas = {};

            deudasPendientes.forEach(deuda => {
                const jornada = deuda.jornada;
                const jugador = todosLosJugadores.find(j => j.id === deuda.id_jugador);
                const nombreJugador = jugador ? jugador.nombre : 'Desconocido';
                const totalEuros = deuda.importe_posicion + deuda.importe_rojas;

                // Creamos el cajón de esa jornada si no existe
                if (!deudasAgrupadas[jornada]) {
                    deudasAgrupadas[jornada] = [];
                }

                // Si el jugador ya tenía una deuda en esta jornada, se la sumamos. Si no, lo añadimos.
                const deudaExistente = deudasAgrupadas[jornada].find(d => d.nombre === nombreJugador);
                if (deudaExistente) {
                    deudaExistente.total += totalEuros;
                } else {
                    deudasAgrupadas[jornada].push({ nombre: nombreJugador, total: totalEuros });
                }
            });

            // 4. Ordenamos las jornadas de menor a mayor (Ej: 1, 2, 3...)
            const jornadasOrdenadas = Object.keys(deudasAgrupadas).sort((a, b) => parseInt(a) - parseInt(b));

            // 5. Construimos el texto final para el WhatsApp
            jornadasOrdenadas.forEach(jornada => {
                mensaje += `*Jornada ${jornada}*\n`;

                // Ordenamos a los jugadores alfabéticamente para que quede más limpio
                deudasAgrupadas[jornada].sort((a, b) => a.nombre.localeCompare(b.nombre));

                deudasAgrupadas[jornada].forEach(ficha => {
                    mensaje += `🔴 ${ficha.nombre}: ${ficha.total.toFixed(2)}€\n`;
                });
                mensaje += `\n`;
            });
        }

        mensaje += `💸 Por favor, id haciendo los Bizum al tesorero. ¡Gracias! 🙏`;

        // 6. Inyectamos el texto final en la caja de la web
        textareaWhatsapp.value = mensaje;

    } catch (error) {
        console.error("Error en WhatsApp:", error.message);
        textareaWhatsapp.value = "❌ Hubo un error al generar el mensaje. Revisa la conexión.";
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
// PESTAÑA SALDAR Y CORREGIR ERRORES (Conectado a BBDD)
// ==========================================

async function actualizarPantallaSaldar() {
    // Buscamos los contenedores
    const contenedorPendientes = document.querySelector('.tarjeta-pendientes .lista-pagos');
    const contenedorHistorial = document.querySelector('.tarjeta-historial .lista-pagos');

    if (!contenedorPendientes || !contenedorHistorial) return;

    // Ponemos un mensajito de carga mientras consultamos a Supabase
    contenedorPendientes.innerHTML = '<p style="text-align:center;">Cargando deudas...</p>';
    contenedorHistorial.innerHTML = '<p style="text-align:center;">Cargando historial...</p>';

    // 1. Nos traemos TODOS los jugadores y TODAS las deudas
    const { data: todosLosJugadores } = await db.from('jugadores').select('id, nombre');
    const { data: todasLasDeudas, error } = await db.from('detalle_pagos').select('*').order('id', { ascending: false });

    if (error) {
        contenedorPendientes.innerHTML = '<p style="color:red; text-align:center;">Error cargando datos.</p>';
        return;
    }

    // 2. Filtramos y separamos en dos montones: Las que están sin pagar y las pagadas
    const deudasPendientes = todasLasDeudas.filter(d => d.pagado === false);
    const deudasSaldadas = todasLasDeudas.filter(d => d.pagado === true);

    // Vaciamos las listas para pintarlas
    contenedorPendientes.innerHTML = '';
    contenedorHistorial.innerHTML = '';

    // --- RENDERIZAR DEUDAS PENDIENTES ---
    if (deudasPendientes.length === 0) {
        contenedorPendientes.innerHTML = `<p class="texto-ayuda-mensaje" style="text-align:center; padding: 10px;">No hay deudas pendientes.</p>`;
    } else {
        deudasPendientes.forEach(deuda => {
            const jugador = todosLosJugadores.find(j => j.id === deuda.id_jugador);
            const nombreJugador = jugador ? jugador.nombre : 'Desconocido';
            const totalEuros = deuda.importe_posicion + deuda.importe_rojas;

            const divItem = document.createElement('div');
            divItem.className = 'item-pago';
            divItem.innerHTML = `
                <button class="btn-borrar-error" title="Borrar por error">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="12" height="12">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
                <span class="jornada-pago">Jornada ${deuda.jornada}</span>
                <span class="nombre-pago">${nombreJugador}</span>
                <span class="cantidad-rojo">-${totalEuros.toFixed(2)}€</span>
                <button class="btn-cobrar" title="Marcar como pagado">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </button>
            `;

            // Acción: BORRAR POR ERROR (Papelera) -> DELETE en Supabase
            const btnBorrar = divItem.querySelector('.btn-borrar-error');
            btnBorrar.addEventListener('click', async () => {
                if (confirm(`⚠️ ¿Borrar DE LA BASE DE DATOS la deuda de ${nombreJugador} (Jornada ${deuda.jornada})?`)) {
                    await db.from('detalle_pagos').delete().eq('id', deuda.id);
                    actualizarPantallaSaldar(); // Recargamos la pantalla
                    actualizarMensajeWhatsApp();
                    actualizarMensajeGeneral();
                }
            });

            // Acción: COBRAR (Check Verde) -> UPDATE pagado = true
            const btnCobrar = divItem.querySelector('.btn-cobrar');
            btnCobrar.addEventListener('click', async () => {
                if (confirm(`¿Marcar los ${totalEuros.toFixed(2)}€ de ${nombreJugador} como PAGADOS?`)) {
                    await db.from('detalle_pagos').update({ pagado: true }).eq('id', deuda.id);
                    actualizarPantallaSaldar(); // Recargamos la pantalla
                    actualizarMensajeWhatsApp();
                }
            });

            contenedorPendientes.appendChild(divItem);
        });
    }

    // --- RENDERIZAR HISTORIAL (PAGADOS) ---
    if (deudasSaldadas.length === 0) {
        contenedorHistorial.innerHTML = `<p class="texto-ayuda-mensaje" style="text-align:center; padding: 10px;">No hay pagos recientes.</p>`;
    } else {

        // 👇 LÍNEA NUEVA: Recortamos la lista para quedarnos solo con las 15 primeras
        const ultimosPagos = deudasSaldadas.slice(0, 10);

        // 👇 CAMBIO: Ahora hacemos el forEach sobre 'ultimosPagos' en lugar de 'deudasSaldadas'
        ultimosPagos.forEach(deuda => {
            const jugador = todosLosJugadores.find(j => j.id === deuda.id_jugador);
            const nombreJugador = jugador ? jugador.nombre : 'Desconocido';
            const totalEuros = deuda.importe_posicion + deuda.importe_rojas;

            const divItem = document.createElement('div');
            divItem.className = 'item-pago';
            divItem.innerHTML = `
                <span class="jornada-pago">Jornada ${deuda.jornada}</span>
                <span class="nombre-pago">${nombreJugador}</span>
                <span class="cantidad-verde">+${totalEuros.toFixed(2)}€</span>
                <button class="btn-deshacer" title="Deshacer pago">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                        <path d="M3 7v6h6"></path>
                        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
                    </svg>
                </button>
            `;

            // Acción: DESHACER PAGO -> UPDATE pagado = false
            const btnDeshacer = divItem.querySelector('.btn-deshacer');
            btnDeshacer.addEventListener('click', async () => {
                if (confirm(`¿Deshacer el pago de ${nombreJugador} y que vuelva a aparecer como deuda?`)) {
                    await db.from('detalle_pagos').update({ pagado: false }).eq('id', deuda.id);
                    actualizarPantallaSaldar(); // Recargamos la pantalla
                    actualizarMensajeWhatsApp();
                }
            });

            contenedorHistorial.appendChild(divItem);
        });
    }
} // <-- Cierre final de la función actualizarPantallaSaldar

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
// LÓGICA: IMPORTAR CSV EN TESORERO (Conectado a BBDD)
// ==========================================
const inputCsv = document.getElementById('input-csv');

if (inputCsv) {
    // Le ponemos async porque vamos a interactuar con la nube
    inputCsv.addEventListener('change', async (evento) => {
        const archivo = evento.target.files[0];
        if (!archivo) return;

        // Efecto visual de carga en el botón
        const labelCsv = document.querySelector('.btn-csv');
        const textoOriginalLabel = labelCsv.innerHTML;
        labelCsv.innerHTML = "⏳ Subiendo a la BBDD...";

        try {
            // 1. Nos traemos la lista de jugadores reales para poder traducir "Nombres" a "IDs"
            const { data: todosLosJugadores, error: errorJugadores } = await db.from('jugadores').select('id, nombre');
            if (errorJugadores) throw new Error("No se pudo cargar la lista de jugadores para validar.");

            // 2. Leemos el archivo físico usando una Promesa para que espere
            const contenido = await new Promise((resolve, reject) => {
                const lector = new FileReader();
                lector.onload = (e) => resolve(e.target.result);
                lector.onerror = () => reject(new Error("Error leyendo el archivo físico"));
                lector.readAsText(archivo);
            });

            const lineas = contenido.split('\n');
            let paqueteDeudasCSV = [];

            // 3. Analizamos el Excel línea a línea (saltando la cabecera)
            for (let i = 1; i < lineas.length; i++) {
                const linea = lineas[i].trim();
                if (!linea) continue;

                const columnas = linea.split(';');
                if (columnas.length < 4) continue;

                const nombreExcel = columnas[0].trim();

                // Comprobamos si el nombre del Excel coincide exactamente con alguien de Supabase
                const jugadorEncontrado = todosLosJugadores.find(
                    j => j.nombre.toLowerCase() === nombreExcel.toLowerCase()
                );

                if (!jugadorEncontrado) {
                    throw new Error(`El jugador "${nombreExcel}" (Fila ${i + 1}) no existe. Revisa tildes/espacios en tu archivo.`);
                }

                // Preparamos el paquete de la misma forma que exige nuestra tabla de Supabase
                paqueteDeudasCSV.push({
                    id_jugador: jugadorEncontrado.id,
                    jornada: parseInt(columnas[1].trim()),
                    importe_posicion: parseFloat(columnas[2].trim()) || 0,
                    importe_rojas: parseFloat(columnas[3].trim()) || 0,
                    pagado: false // Las importamos como NO pagadas
                });
            }

            // 4. Si ha llegado hasta aquí sin errores, ¡hacemos un envío masivo a Supabase!
            if (paqueteDeudasCSV.length > 0) {
                const { error: errorInsert } = await db.from('detalle_pagos').insert(paqueteDeudasCSV);
                if (errorInsert) throw new Error("Fallo al insertar en Supabase: " + errorInsert.message);

                alert(`¡Éxito! ✅ Se han importado ${paqueteDeudasCSV.length} deudas desde el CSV.`);
            }

        } catch (error) {
            console.error(error);
            alert("❌ ERROR: " + error.message);
        } finally {
            // Limpiamos el input y restauramos el botón pase lo que pase
            inputCsv.value = "";
            labelCsv.innerHTML = textoOriginalLabel;
        }
    });
}


// ==========================================
// CARGAR DESPLEGABLE DE JUGADORES (Añadir Deudas)
// ==========================================
async function cargarDesplegableJugadores() {
    const selectJugador = document.getElementById('tesorero-jugador');
    if (!selectJugador) return;

    // Pedimos los nombres a Supabase ordenados de la A a la Z
    const { data: jugadores, error } = await db.from('jugadores').select('nombre').order('nombre', { ascending: true });

    if (error) {
        console.error("Error cargando el desplegable:", error.message);
        return;
    }

    // Vaciamos el desplegable por si quedaban restos del HTML y ponemos la opción por defecto
    selectJugador.innerHTML = '<option value="">-- Elige --</option>';

    // Recorremos la lista real y creamos una etiqueta <option> por cada uno
    jugadores.forEach(jugador => {
        const opcion = document.createElement('option');
        opcion.value = jugador.nombre;
        opcion.textContent = jugador.nombre;
        selectJugador.appendChild(opcion);
    });
}

// Ejecutamos la función nada más abrir la web
cargarDesplegableJugadores();



// ==========================================
// NAVEGACIÓN: PESTAÑAS JUGADOR (INICIO / CLASIFICACIÓN)
// ==========================================
const btnTabInicio = document.getElementById('btn-tab-inicio');
const btnTabClasificacion = document.getElementById('btn-tab-clasificacion');
const contenidoInicio = document.getElementById('contenido-tab-inicio');
const contenidoClasificacion = document.getElementById('contenido-tab-clasificacion');

if (btnTabInicio && btnTabClasificacion) {
    btnTabInicio.addEventListener('click', () => {
        // Mostramos Inicio, ocultamos Clasificación
        contenidoInicio.classList.remove('oculto');
        contenidoClasificacion.classList.add('oculto');
        // Cambiamos colores de los botones
        btnTabInicio.classList.add('activo');
        btnTabClasificacion.classList.remove('activo');
    });

    btnTabClasificacion.addEventListener('click', () => {
        // Mostramos Clasificación, ocultamos Inicio
        contenidoClasificacion.classList.remove('oculto');
        contenidoInicio.classList.add('oculto');
        // Cambiamos colores de los botones
        btnTabClasificacion.classList.add('activo');
        btnTabInicio.classList.remove('activo');
    });
}

// ==========================================
// LÓGICA: PERDEDOR DE LA ÚLTIMA JORNADA
// ==========================================
async function actualizarPerdedorJornada() {
    const textoPerdedor = document.getElementById('texto-perdedor-jornada');
    if (!textoPerdedor) return;

    try {
        // 1. Obtener los datos de pagos para extraer más adelante cuál es el último número de jornada y calcular los importes
        const { data: deudas, error: errorDeudas } = await db
            .from('detalle_pagos')
            .select('id_jugador, jornada, importe_posicion, importe_rojas');

        if (errorDeudas || !deudas || deudas.length === 0) {
            textoPerdedor.innerHTML = "Todavía no hay jornadas registradas.";
            return;
        }

        // 2. Averiguar cuál es el número de la última jornada
        let ultimaJornada = 0;
        deudas.forEach(d => {
            if (d.jornada > ultimaJornada) ultimaJornada = d.jornada;
        });

        // 3. Filtrar deudas SOLO de esa última jornada y sumar
        const deudasUltimaJornada = deudas.filter(d => d.jornada === ultimaJornada);

        let maxDeuda = -1;
        let idPerdedor = null;
        const totalesJornada = {};

        deudasUltimaJornada.forEach(d => {
            if (!totalesJornada[d.id_jugador]) totalesJornada[d.id_jugador] = 0;
            totalesJornada[d.id_jugador] += (d.importe_posicion + d.importe_rojas);
        });

        for (const [id, total] of Object.entries(totalesJornada)) {
            if (total > maxDeuda) {
                maxDeuda = total;
                idPerdedor = parseInt(id);
            }
        }

        if (!idPerdedor) return;

        // 4. Conseguir el nombre del perdedor
        const { data: jugadorData } = await db.from('jugadores').select('nombre').eq('id', idPerdedor).single();
        const nombrePerdedor = jugadorData ? jugadorData.nombre : "Desconocido";

        // 5. Conseguir un mensaje humillante aleatorio (los ultra-ofensivos del farolillo)
        const { data: mensajes } = await db.from('mensajes_ultimo').select('mensaje').eq('id_jugador', idPerdedor);

        let fraseElegida = "Ha hecho el ridículo más espantoso."; // Por defecto si falla
        if (mensajes && mensajes.length > 0) {
            const indice = Math.floor(Math.random() * mensajes.length);
            fraseElegida = mensajes[indice].mensaje;
        }

        // 6. Inyectar en el HTML con el formato exacto que pediste
        textoPerdedor.innerHTML = `
            El pringado de la última jornada (Jornada ${ultimaJornada}) es <strong style="color: #ff9800;">${nombrePerdedor.toUpperCase()}</strong>.
            <div style="margin-top: 15px; padding: 12px 15px; background: rgba(255, 152, 0, 0.1); border-left: 4px solid #ff9800; border-radius: 0 6px 6px 0; color: #ffffff; font-size: 15px; font-style: italic; font-weight: 500; line-height: 1.5; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                "${fraseElegida}"
            </div>
        `;

    } catch (error) {
        console.error("Error cargando al perdedor:", error);
        textoPerdedor.innerHTML = "Error cargando los datos.";
    }
}
