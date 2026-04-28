console.log("Destinos.js cargado correctamente");

$(document).ready(function () {
  
  // ========== 1. FILTROS DINÁMICOS CON CALLBACK ==========
  function aplicarFiltro(filtro) {
    
    // Primero, eliminar mensaje existente
    $("#no-resultados").remove();
    
    if (filtro === "all") {
      // Mostrar todos con animación
      $(".destino-item").show(300, function() {
        // Callback: después de mostrar, verificar
        verificarResultadosVisibles();
      });
    } else {
      // Ocultar todos
      $(".destino-item").hide(300);
      
      // Mostrar solo los que coinciden
      setTimeout(function() {
        let elementosFiltrados = $(".destino-item").filter("." + filtro);
        
        if (elementosFiltrados.length > 0) {
          elementosFiltrados.show(300, function() {
            verificarResultadosVisibles();
          });
        } else {
          // Si no hay elementos que coincidan, mostrar mensaje inmediatamente
          mostrarMensajeSinResultados(filtro);
        }
      }, 350); // Pequeño delay para que termine el hide()
    }
    
    // Marcar botón activo
    $(".filtro-btn").removeClass("active");
    $('.filtro-btn[data-filter="' + filtro + '"]').addClass("active");
  }
  
  // ========== 2. FUNCIÓN PARA VERIFICAR RESULTADOS VISIBLES ==========
  function verificarResultadosVisibles() {
    // Esperar un momento para que jQuery termine las animaciones
    setTimeout(function() {
      let visibles = $(".destino-item:visible").length;
      let filtroActivo = $(".filtro-btn.active").data("filter");
      
      if (visibles === 0 && filtroActivo !== "all") {
        mostrarMensajeSinResultados(filtroActivo);
      }
    }, 100);
  }
  
  // ========== 3. FUNCIÓN PARA MOSTRAR MENSAJE ==========
  function mostrarMensajeSinResultados(filtro) {
    // Evitar duplicados
    if ($("#no-resultados").length > 0) return;
    
    let mensajePersonalizado = "";
    
    switch(filtro) {
      case "cultural":
        mensajePersonalizado = "🏛️ No hay destinos culturales disponibles en este momento.";
        break;
      case "naturaleza":
        mensajePersonalizado = "🌿 No hay destinos de naturaleza disponibles en este momento.";
        break;
      case "playa":
        mensajePersonalizado = "🏖️ No hay destinos de playa disponibles en este momento.";
        break;
      case "gastro":
        mensajePersonalizado = "🍷 No hay destinos gastronómicos disponibles en este momento.";
        break;
      default:
        mensajePersonalizado = "📭 No hay destinos en esta categoría.";
    }
    
    let mensajeHTML = `
      <div id="no-resultados" class="alert alert-warning text-center mt-4 animate__animated animate__fadeIn" role="alert">
        <i class="bi bi-emoji-frown fs-1"></i>
        <h5 class="mt-2">${mensajePersonalizado}</h5>
        <p class="mb-0">Pronto agregaremos más opciones. ¡Seguí explorando!</p>
        <button class="btn btn-outline-warning btn-sm mt-3" onclick="$('.filtro-btn[data-filter=\\'all\\']').click();">
          Ver todos los destinos
        </button>
      </div>
    `;
    
    $("#contenedor-destinos").after(mensajeHTML);
  }
  
  // ========== 4. EFECTO ZOOM CON JQUERY ==========
  $(".destino-card").on("mouseenter", function() {
    $(this).find("img").css({
      "transform": "scale(1.15)",
      "transition": "transform 0.5s ease"
    });
  }).on("mouseleave", function() {
    $(this).find("img").css("transform", "scale(1)");
  });
  
  // ========== 5. TOOLTIPS ==========
  function inicializarTooltips() {
    $('[data-bs-toggle="tooltip"]').tooltip();
    
    $(".table tbody tr").each(function() {
      if (!$(this).attr("data-bs-toggle")) {
        let destino = $(this).find("td:first").text();
        $(this).attr({
          "data-bs-toggle": "tooltip",
          "data-bs-placement": "top",
          "title": "¡Consultá disponibilidad para " + destino + "!"
        });
      }
    });
    $('[data-bs-toggle="tooltip"]').tooltip();
  }
  
  inicializarTooltips();
  
  // ========== 6. MANEJO DE CLICK EN BOTONES ==========
  $(".filtro-btn").click(function () {
    let filtro = $(this).data("filter");
    aplicarFiltro(filtro);
  });
  
  // ========== 7. DETECTAR URL ==========
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("cat");
  
  if (categoria) {
    aplicarFiltro(categoria);
    $('html, body').animate({
      scrollTop: $("#contenedor-destinos").offset().top - 100
    }, 500);
  } else {
    // Asegurar que el botón "Todos" esté activo al inicio
    $('.filtro-btn[data-filter="all"]').addClass("active");
  }
  
  // ========== 8. HOVER EN TABLA ==========
  $(".table tbody tr").hover(
    function() {
      $(this).css({
        "transform": "scale(1.01)",
        "transition": "transform 0.2s ease",
        "backgroundColor": "#f8f9fa"
      });
    },
    function() {
      $(this).css({
        "transform": "scale(1)",
        "backgroundColor": "transparent"
      });
    }
  );
});