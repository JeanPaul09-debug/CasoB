// CREAR ESTRUCTURAS TIPO VECTOR PARA GUARDAR CADA REGISTRO
let zonas = [];
let lluvias = [];
let grafica = null;
let temporizador = null;
let registroGuardado = false;

// CONSTANTES DEL CASO B
const ESTANDAR_CALI = 14;
const AJUSTE_NUBOSIDAD = 0.053;
const INICIO_NUBOSIDAD = 15 * 60; // 3:00 P.M. EN MINUTOS
const FIN_NUBOSIDAD = 18 * 60;    // 6:00 P.M. EN MINUTOS
const SEGUNDOS_RELOJ = 3;

// MUESTRA EL ESTANDAR DE CALI EN LA PANTALLA
document.getElementById("resEstandar").textContent = ESTANDAR_CALI;
reiniciarResultados();

// FUNCION INGRESAR
function ingresar() {
    let usuario = document.getElementById("usuario").value;
    let contraseña = document.getElementById("contraseña").value;
    let mensaje = document.getElementById("mensaje");

    if (usuario === "CVC" && contraseña === "Lluvias") {
        mensaje.textContent = "";
        document.getElementById("login").classList.add("oculto");
        document.getElementById("panelLluvia").classList.remove("oculto");
        iniciarCamara();
        dibujarGrafica();
    } else {
        mensaje.textContent = "USUARIO - CONTRASEÑA INCORRECTOS";
    }
}

// FUNCION PARA VOLVER AL LOGIN (BOTON CERRAR SESION O CLAVE INCORRECTA)
function volverLogin() {
    clearInterval(temporizador);
    temporizador = null;
    detenerCamara();
    limpiarCampos();
    reiniciarResultados();
    document.getElementById("btnCalcular").disabled = false;
    document.getElementById("usuario").value = "";
    document.getElementById("contraseña").value = "";
    document.getElementById("panelLluvia").classList.add("oculto");
    document.getElementById("login").classList.remove("oculto");
}

// CONVIERTE UNA HORA "HH:MM" EN MINUTOS
function convertirMinutos(hora) {
    let partes = hora.split(":");
    return parseInt(partes[0]) * 60 + parseInt(partes[1]);
}

// CREAR LA FUNCION PARA CALCULAR Y GUARDAR EL REGISTRO
function calcularRegistro() {
    let direccion = document.getElementById("direccion").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let horaInicio = document.getElementById("horaInicio").value;
    let horaFin = document.getElementById("horaFin").value;
    // convierte el dato en numero
    let precipitacion = parseFloat(document.getElementById("precipitacion").value);

    if (registroGuardado) {
        alert("REGISTRO YA GUARDADO, USE REGISTRAR OTRA ZONA");
        return;
    }

    if (!direccion || !nombre || !horaInicio || !horaFin || isNaN(precipitacion)) {
        alert("COMPLETE TODOS LOS CAMPOS");
        return;
    }

    if (precipitacion < 0) {
        alert("LA PRECIPITACION NO PUEDE SER NEGATIVA");
        return;
    }

    // TIEMPO TOTAL = HORA FIN - HORA INICIO (EN MINUTOS)
    let inicio = convertirMinutos(horaInicio);
    let duracion = convertirMinutos(horaFin) - inicio;

    if (duracion <= 0) {
        alert("LA HORA DE FIN DEBE SER MAYOR A LA HORA DE INICIO");
        return;
    }

    // AJUSTE DEL 5.3% SI LA LLUVIA INICIA ENTRE 3:00 P.M. Y 6:00 P.M.
    let ajuste = 0;
    if (inicio >= INICIO_NUBOSIDAD && inicio <= FIN_NUBOSIDAD) {
        ajuste = AJUSTE_NUBOSIDAD;
    }

    // FORMULA: PRECIPITACION * ESTANDAR * TIEMPO TOTAL
    let total = Number((precipitacion * ESTANDAR_CALI * duracion * (1 + ajuste)).toFixed(2));

    // COMPARACION DEL VALOR REGISTRADO FRENTE AL ESTANDAR
    let diferencia = Number((precipitacion - ESTANDAR_CALI).toFixed(1));
    let comparacion = "";

    if (diferencia > 0) {
        comparacion = "SUPERA EL ESTANDAR DE CALI POR " + diferencia + " mm";
    } else if (diferencia < 0) {
        comparacion = "ESTA POR DEBAJO DEL ESTANDAR DE CALI POR " + Math.abs(diferencia) + " mm";
    } else {
        comparacion = "ES IGUAL AL ESTANDAR DE CALI";
    }

    let foto = document.getElementById("foto").getAttribute("src") ? "ADJUNTA" : "SIN FOTO";

    reiniciarResultados();
    document.getElementById("btnCalcular").disabled = true;

    // EFECTO RELOJ ANTES DE CARGAR EL DATO
    iniciarReloj(function () {
        document.getElementById("resNombre").textContent = nombre;
        document.getElementById("resDuracion").textContent = duracion;
        document.getElementById("resLluvia").textContent = precipitacion;
        document.getElementById("resAjuste").textContent = Number((ajuste * 100).toFixed(1));
        document.getElementById("resFoto").textContent = foto;
        document.getElementById("resultado").textContent = total;
        document.getElementById("comparacion").textContent = comparacion;

        // GUARDAR EN LOS VECTORES Y REDIBUJAR LAS BARRAS
        zonas.push(direccion);
        lluvias.push(precipitacion);
        registroGuardado = true;
        dibujarGrafica();
        document.getElementById("btnCalcular").disabled = false;
    });
}

// FUNCION DEL EFECTO RELOJ (CONTADOR SIMULADO)
function iniciarReloj(alTerminar) {
    let segundos = 0;
    let reloj = document.getElementById("reloj");

    reloj.textContent = "Calculando datos... 00:00";
    clearInterval(temporizador);

    temporizador = setInterval(() => {
        segundos++;
        reloj.textContent = "Calculando datos... 00:" + String(segundos).padStart(2, "0");

        if (segundos === SEGUNDOS_RELOJ) {
            clearInterval(temporizador);
            temporizador = null;
            reloj.textContent = "Cálculo terminado";
            alTerminar();
        }
    }, 1000);
}

// FUNCION REGISTRAR OTRA ZONA --> PIDE LA CLAVE
function nuevoRegistro() {
    if (temporizador) {
        alert("ESPERE A QUE TERMINE EL CALCULO");
        return;
    }

    if (!registroGuardado) {
        alert("PRIMERO CALCULE Y GUARDE EL REGISTRO");
        return;
    }

    let palabra = prompt("Ingrese clave para nuevo registro:");

    if (palabra === null) {
        return; // SE CANCELO LA VENTANA EMERGENTE
    }

    if (palabra === "CLIMA") {
        limpiarCampos();
        reiniciarResultados();
    } else {
        alert("CLAVE INCORRECTA");
        volverLogin();
    }
}

// FUNCION PARA LIMPIAR LAS CELDAS DEL FORMULARIO
function limpiarCampos() {
    document.getElementById("direccion").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("horaInicio").value = "";
    document.getElementById("horaFin").value = "";
    document.getElementById("precipitacion").value = "";
    document.getElementById("archivoFoto").value = "";
    document.getElementById("foto").removeAttribute("src");
    registroGuardado = false;
}

// FUNCION PARA DEJAR LOS RESULTADOS EN BLANCO
function reiniciarResultados() {
    document.getElementById("resNombre").textContent = "--";
    document.getElementById("resDuracion").textContent = "--";
    document.getElementById("resLluvia").textContent = "--";
    document.getElementById("resAjuste").textContent = "--";
    document.getElementById("resFoto").textContent = "--";
    document.getElementById("resultado").textContent = "--";
    document.getElementById("comparacion").textContent = "";
    document.getElementById("reloj").textContent = "En espera de datos";
}

// FUNCION PARA INICIAR CAMARA DESDE NAVEGADOR
function iniciarCamara() {
    const video = document.getElementById("video");
    const mensajeFoto = document.getElementById("mensajeFoto");

    mensajeFoto.textContent = "";

    if (!navigator.mediaDevices) {
        mensajeFoto.textContent = "CAMARA NO DISPONIBLE, CARGUE UN ARCHIVO";
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error("Error al acceder a la cámara:", error);
        mensajeFoto.textContent = "CAMARA NO DISPONIBLE, CARGUE UN ARCHIVO";
    });
}

// FUNCION PARA APAGAR LA CAMARA
function detenerCamara() {
    const video = document.getElementById("video");

    if (video.srcObject) {
        let pistas = video.srcObject.getTracks();
        for (let v = 0; v < pistas.length; v++) {
            pistas[v].stop();
        }
        video.srcObject = null;
    }
}

// FUNCION TOMAR FOTO --> CAPTURA FRAME
function tomarFoto() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvasFoto");
    const foto = document.getElementById("foto");

    if (!video.videoWidth) {
        alert("LA CAMARA NO ESTA DISPONIBLE, CARGUE UN ARCHIVO");
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    foto.src = canvas.toDataURL("image/png");
}

// FUNCION PARA CARGAR LA FOTO DESDE UN ARCHIVO
function cargarFoto() {
    let archivo = document.getElementById("archivoFoto").files[0];

    if (!archivo) {
        return;
    }

    let lector = new FileReader();
    lector.onload = function () {
        document.getElementById("foto").src = lector.result;
    };
    lector.readAsDataURL(archivo);
}

// GENERA UN COLOR DIFERENTE PARA CADA BARRA
function generarColores(cantidad) {
    let colores = [];
    for (let v = 0; v < cantidad; v++) {
        colores.push("hsl(" + ((v * 137.5) % 360) + ", 70%, 55%)");
    }
    return colores;
}

// DIBUJA LA LINEA PUNTEADA DEL ESTANDAR DE CALI (14 mm)
const lineaEstandar = {
    id: "lineaEstandar",
    afterDatasetsDraw(chart) {
        const ctx = chart.ctx;
        const area = chart.chartArea;
        const y = chart.scales.y.getPixelForValue(ESTANDAR_CALI);

        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = "#cc0000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(area.left, y);
        ctx.lineTo(area.right, y);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.fillStyle = "#cc0000";
        ctx.font = "12px Arial";
        ctx.textAlign = "right";
        ctx.fillText("Estándar de Cali: " + ESTANDAR_CALI + " mm", area.right, y - 6);
        ctx.restore();
    }
};

// METODO PARA DIBUJAR LA GRAFICA DE BARRAS
function dibujarGrafica() {
    let plano = document.getElementById("grafica");

    if (grafica) {
        grafica.destroy();
    }

    grafica = new Chart(plano, {
        type: "bar",
        data: {
            labels: zonas,
            datasets: [{
                label: "Precipitación registrada (mm)",
                data: lluvias,
                backgroundColor: generarColores(zonas.length),
                borderColor: "white",
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: ESTANDAR_CALI + 2,
                    title: { display: true, text: "mm" }
                }
            }
        },
        plugins: [lineaEstandar]
    });
}
