console.log("Módulo Phishing cargado");

$(document).ready(function () {
  // ===== 1. ABRIR MODAL DE SIMULACIÓN =====
  $("#btnSimularPhishing").click(function () {
    let modal = new bootstrap.Modal(document.getElementById("modalPhishing"));
    modal.show();

    // Resetear el feedback y los checkboxes al abrir
    $("#feedbackPhishing").html("");
    $(".form-check-input")
      .prop("checked", false)
      .removeClass("is-valid is-invalid");
  });

  // ===== 2. VERIFICAR RESPUESTAS DEL USUARIO =====
  $("#btnVerificarPhishing").click(function () {
    // Opciones correctas (TODAS deberían estar marcadas)
    let correctas = {
      checkUrl: true, // Dominio sospechoso
      checkUrgencia: true, // Urgencia falsa
      checkLink: true, // Link sospechoso
      checkSaludo: true, // Saludo genérico
    };

    let aciertos = 0;
    let total = Object.keys(correctas).length;

    // Verificar cada opción
    for (let [id, esCorrecta] of Object.entries(correctas)) {
      let $check = $("#" + id);
      let estaMarcado = $check.prop("checked");

      if (estaMarcado === esCorrecta) {
        aciertos++;
        $check
          .closest(".form-check")
          .addClass("border-success")
          .removeClass("border-danger");
        $check.addClass("is-valid");
      } else {
        $check
          .closest(".form-check")
          .addClass("border-danger")
          .removeClass("border-success");
        $check.addClass("is-invalid");
      }
    }

    // Generar feedback según el puntaje
    let porcentaje = (aciertos / total) * 100;
    let mensaje = "";
    let alertClass = "";

    if (porcentaje === 100) {
      mensaje =
        "🎉 ¡Excelente! Identificaste todas las señales de phishing. ¡Sos un experto en seguridad!";
      alertClass = "alert-success";
    } else if (porcentaje >= 75) {
      mensaje =
        "👍 ¡Muy bien! Identificaste la mayoría. Revisá las que fallaste para mejorar.";
      alertClass = "alert-info";
    } else if (porcentaje >= 50) {
      mensaje =
        "⚠️ ¡Vas bien! Pero hay señales importantes que pasaste por alto. Revisá las respuestas correctas.";
      alertClass = "alert-warning";
    } else {
      mensaje =
        "😟 Revisá las señales de phishing que te mostramos. Recordá: nunca compartas datos personales por email.";
      alertClass = "alert-danger";
    }

    // Mostrar feedback con jQuery
    $("#feedbackPhishing")
      .html(
        `
            <div class="alert ${alertClass} mt-3 animate__animated animate__fadeIn">
                <i class="bi bi-info-circle-fill me-2"></i>
                <strong>Resultado: ${aciertos}/${total} aciertos</strong><br>
                ${mensaje}
            </div>
        `,
      )
      .hide()
      .fadeIn(500);

    // Si no acertó todo, mostrar animación de advertencia
    if (porcentaje < 100) {
      $("#feedbackPhishing").addClass("pulse-animation");
      setTimeout(
        () => $("#feedbackPhishing").removeClass("pulse-animation"),
        1000,
      );
    } else {
      // Si acertó todo, mostrar confeti simulado (opcional)
      mostrarConfeti();
    }
  });

  // ===== 3. ANIMACIÓN DE CONFETI (cuando acierta todo) =====
  function mostrarConfeti() {
    // Simple confetti simulado con jQuery
    for (let i = 0; i < 30; i++) {
      let $confeti = $('<div class="confeti">✨</div>');
      $confeti.css({
        position: "fixed",
        left: Math.random() * window.innerWidth + "px",
        top: "-20px",
        fontSize: "20px",
        zIndex: 9999,
        pointerEvents: "none",
      });
      $("body").append($confeti);
      $confeti.animate(
        {
          top: window.innerHeight + "px",
          left: Math.random() * window.innerWidth + "px",
        },
        2000,
        function () {
          $(this).remove();
        },
      );
    }

    // También mostrar un toast de felicitaciones
    let toast = $(`
            <div class="toast align-items-center text-bg-success border-0 position-fixed top-0 start-50 translate-middle-x mt-3" 
                 style="z-index: 9999;" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        🎉 ¡Felicidades! Sos un experto identificando phishing
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `);
    $("body").append(toast);
    let bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
    toast.on("hidden.bs.toast", function () {
      $(this).remove();
    });
  }

  // ===== 4. RESETEAR AL CERRAR EL MODAL =====
  $("#modalPhishing").on("hidden.bs.modal", function () {
    $(".form-check-input").prop("checked", false);
    $("#feedbackPhishing").html("");
    $(".form-check").removeClass("border-success border-danger");
    $(".form-check-input").removeClass("is-valid is-invalid");
  });
});
