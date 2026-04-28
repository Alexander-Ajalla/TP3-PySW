console.log("Agencias.js cargado");

$(document).ready(function() {
    
    // ========== 1. EFECTO FLIP CON jQuery TOGGLE ==========
    $(".flip-card").click(function(e) {
        // Evitar que el click en las estrellas active el flip
        if ($(e.target).closest('.stars').length) {
            return;
        }
        $(this).toggleClass("flipped");
    });
    
    // ========== 2. SISTEMA DE RATING CON ESTRELLAS ==========
    // Objeto para almacenar calificaciones (simulado)
    let calificaciones = {
        andes: [],
        norte: [],
        valles: []
    };
    
    // Cargar calificaciones guardadas (si existen)
    if (localStorage.getItem("agenciasRatings")) {
        calificaciones = JSON.parse(localStorage.getItem("agenciasRatings"));
        actualizarTodosLosRatings();
    }
    
    // Evento: click en estrella
    $(".stars i").click(function(e) {
        e.stopPropagation(); // Evitar que active el flip
        
        let rating = parseInt($(this).data("rating"));
        let agencia = $(this).closest(".rating-container").data("agencia");
        
        // Agregar nueva calificación
        if (!calificaciones[agencia]) {
            calificaciones[agencia] = [];
        }
        calificaciones[agencia].push(rating);
        
        // Guardar en localStorage
        localStorage.setItem("agenciasRatings", JSON.stringify(calificaciones));
        
        // Actualizar estrellas para esta agencia
        actualizarEstrellas(agencia);
        
        // Mostrar feedback con animación
        mostrarFeedback(agencia, rating);
    });
    
    // Función para actualizar estrellas de una agencia
    function actualizarEstrellas(agencia) {
        let contenedor = $(`.rating-container[data-agencia="${agencia}"]`);
        let promedio = calcularPromedio(agencia);
        let estrellas = contenedor.find(".stars i");
        
        // Actualizar estrellas según el promedio
        estrellas.each(function(index) {
            let starValue = index + 1;
            if (promedio >= starValue) {
                $(this).removeClass("bi-star").addClass("bi-star-fill");
            } else if (promedio > starValue - 0.5 && promedio < starValue) {
                $(this).removeClass("bi-star bi-star-fill").addClass("bi-star-half");
            } else {
                $(this).removeClass("bi-star-fill bi-star-half").addClass("bi-star");
            }
        });
        
        // Actualizar texto del promedio
        contenedor.find(".rating-promedio").text(`(${promedio.toFixed(1)})`);
        
        // También actualizar el badge en la card frontal
        let badgeTexto = "";
        if (promedio > 0) {
            badgeTexto = `⭐ ${promedio.toFixed(1)}`;
        } else {
            badgeTexto = "⭐ Sin calificaciones";
        }
        $(`.flip-card[data-agencia="${agencia}"] .flip-card-front .badge`).text(badgeTexto);
    }
    
    // Función para calcular promedio
    function calcularPromedio(agencia) {
        let ratings = calificaciones[agencia];
        if (!ratings || ratings.length === 0) return 0;
        let suma = ratings.reduce((a, b) => a + b, 0);
        return suma / ratings.length;
    }
    
    // Función para actualizar todos los ratings
    function actualizarTodosLosRatings() {
        for (let agencia in calificaciones) {
            if (calificaciones.hasOwnProperty(agencia)) {
                actualizarEstrellas(agencia);
            }
        }
    }
    
    // Feedback visual al calificar
    function mostrarFeedback(agencia, rating) {
        let contenedor = $(`.rating-container[data-agencia="${agencia}"]`);
        
        // Crear toast de feedback
        let toast = $(`
            <div class="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3" role="alert" style="z-index: 9999;">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi bi-star-fill"></i> ¡Gracias! Calificaste con ${rating} estrella${rating > 1 ? 's' : ''}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `);
        
        $("body").append(toast);
        let bsToast = new bootstrap.Toast(toast, { delay: 2000 });
        bsToast.show();
        
        // Eliminar del DOM después de ocultar
        toast.on("hidden.bs.toast", function() {
            $(this).remove();
        });
    }
    
    // ========== 3. RESET PARA PRUEBAS (opcional) ==========
    // Agregar botón de reset en consola (opcional)
    window.resetRatings = function() {
        if (confirm("¿Resetear todas las calificaciones?")) {
            calificaciones = { andes: [], norte: [], valles: [] };
            localStorage.removeItem("agenciasRatings");
            actualizarTodosLosRatings();
            location.reload();
        }
    };
    
    console.log("Sistema de rating listo. Usá window.resetRatings() para resetear");
});