console.log("Contacto.js cargado");

$(document).ready(function () {
  // ========== 1. VALIDACIÓN EN TIEMPO REAL ==========

  // Función de sanitización básica (previene XSS)
  function sanitizar(texto) {
    return texto
      .replace(/[<>]/g, function (match) {
        if (match === "<") return "&lt;";
        if (match === ">") return "&gt;";
        return match;
      })
      .trim();
  }

  // Validar nombre
  $("#nombre").on("input", function () {
    let valor = $(this).val();
    let sanitizado = sanitizar(valor);
    if (sanitizado !== valor) {
      $(this).val(sanitizado);
    }

    let regex = /^[A-Za-záéíóúñÑüÁÉÍÓÚÜ\s]{3,50}$/;
    if (regex.test(sanitizado) && sanitizado.length >= 3) {
      $(this).removeClass("is-invalid").addClass("is-valid");
    } else {
      $(this).removeClass("is-valid").addClass("is-invalid");
    }
    verificarFormularioCompleto();
  });

  // Validar email
  $("#email").on("input", function () {
    let valor = $(this).val();
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regex.test(valor)) {
      $(this).removeClass("is-invalid").addClass("is-valid");
    } else {
      $(this).removeClass("is-valid").addClass("is-invalid");
    }
    verificarFormularioCompleto();
  });

  // Validar teléfono (opcional)
  $("#telefono").on("input", function () {
    let valor = $(this)
      .val()
      .replace(/[^0-9]/g, "");
    $(this).val(valor);

    if (valor.length === 0) {
      $(this).removeClass("is-invalid is-valid");
    } else if (valor.length >= 8 && valor.length <= 15) {
      $(this).removeClass("is-invalid").addClass("is-valid");
    } else {
      $(this).removeClass("is-valid").addClass("is-invalid");
    }
    verificarFormularioCompleto();
  });

  // Validar asunto
  $("#asunto").on("change", function () {
    if ($(this).val() !== "") {
      $(this).removeClass("is-invalid").addClass("is-valid");
    } else {
      $(this).removeClass("is-valid").addClass("is-invalid");
    }
    verificarFormularioCompleto();
  });

  // Validar mensaje con contador de caracteres
  $("#mensaje").on("input", function () {
    let valor = $(this).val();
    let longitud = valor.length;
    $("#contadorCaracteres").text(longitud);

    if (longitud >= 10 && longitud <= 500) {
      $(this).removeClass("is-invalid").addClass("is-valid");
    } else {
      $(this).removeClass("is-valid").addClass("is-invalid");
    }
    verificarFormularioCompleto();
  });

  // Validar checkbox de privacidad
  $("#privacidad").on("change", function () {
    if ($(this).is(":checked")) {
      $(this).removeClass("is-invalid").addClass("is-valid");
    } else {
      $(this).removeClass("is-valid").addClass("is-invalid");
    }
    verificarFormularioCompleto();
  });

  // ========== 2. FUNCIÓN PARA VERIFICAR FORMULARIO COMPLETO ==========
  function verificarFormularioCompleto() {
    let nombreValido = $("#nombre").hasClass("is-valid");
    let emailValido = $("#email").hasClass("is-valid");
    let telefonoValido =
      $("#telefono").val() === "" || $("#telefono").hasClass("is-valid");
    let asuntoValido = $("#asunto").hasClass("is-valid");
    let mensajeValido = $("#mensaje").hasClass("is-valid");
    let privacidadValida = $("#privacidad").is(":checked");

    let formularioCompleto =
      nombreValido &&
      emailValido &&
      telefonoValido &&
      asuntoValido &&
      mensajeValido &&
      privacidadValida;

    $("#btnEnviar").prop("disabled", !formularioCompleto);
  }

  // ========== 3. SANITIZACIÓN DE TODOS LOS CAMPOS ANTES DE ENVIAR ==========
  function sanitizarFormulario() {
    $("#nombre").val(sanitizar($("#nombre").val()));
    $("#mensaje").val(sanitizar($("#mensaje").val()));

    // Sanitizar email (remover caracteres peligrosos)
    let email = $("#email").val();
    email = email.replace(/[<>]/g, "");
    $("#email").val(email);
  }

  // ========== 4. ENVÍO DEL FORMULARIO CON SPINNER Y MODAL ==========
  $("#contactoForm").on("submit", function (e) {
    e.preventDefault();

    // Sanitizar antes de enviar
    sanitizarFormulario();

    // Verificar nuevamente que todo esté válido
    if (!$("#btnEnviar").prop("disabled")) {
      // Mostrar spinner en el botón
      let $btn = $("#btnEnviar");
      let textoOriginal = $btn.html();
      $btn.prop("disabled", true);
      $btn.html(
        '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Enviando...',
      );

      // Simular envío a servidor (setTimeout)
      setTimeout(function () {
        // Recopilar datos del formulario
        let datos = {
          nombre: $("#nombre").val(),
          email: $("#email").val(),
          telefono: $("#telefono").val(),
          asunto: $("#asunto option:selected").text(),
          mensaje: $("#mensaje").val(),
        };

        console.log("Datos enviados (simulación):", datos);

        // Personalizar mensaje del modal
        $("#modalMensaje").html(
          `¡Gracias ${datos.nombre}! Tu mensaje ha sido enviado correctamente.`,
        );

        // Ocultar spinner y mostrar modal
        $btn.html(textoOriginal);

        // Mostrar modal de confirmación
        let modal = new bootstrap.Modal(
          document.getElementById("confirmacionModal"),
        );
        modal.show();

        // Resetear formulario después de cerrar modal
        $("#confirmacionModal").on("hidden.bs.modal", function () {
          $("#contactoForm")[0].reset();
          $(".is-valid, .is-invalid").removeClass("is-valid is-invalid");
          $("#contadorCaracteres").text("0");
          $("#btnEnviar").prop("disabled", true);
        });
      }, 2000); // Simula 2 segundos de "carga"
    }
  });

  // ========== 5. VALIDACIÓN INICIAL ==========
  verificarFormularioCompleto();
});
