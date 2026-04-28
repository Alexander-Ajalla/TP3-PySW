console.log("Blog.js cargado");

$(document).ready(function () {
  // ===== FILTROS =====
  $(".filtro-blog").click(function () {
    let categoria = $(this).data("categoria");

    $(".filtro-blog")
      .removeClass("btn-primary")
      .addClass("btn-outline-primary");
    $(this).removeClass("btn-outline-primary").addClass("btn-primary");

    if (categoria === "todos") {
      $(".articulo-blog").show(300);
    } else {
      $(".articulo-blog").hide(200);
      $(`.articulo-blog[data-categoria="${categoria}"]`).show(300);
    }

    let visibles = $(".articulo-blog:visible").length;
    if (visibles === 0 && categoria !== "todos") {
      if ($("#sinResultados").length === 0) {
        $("#contenedorBlog").after(
          '<div id="sinResultados" class="alert alert-warning text-center mt-4">❌ No hay artículos en esta categoría.</div>',
        );
      }
    } else {
      $("#sinResultados").remove();
    }
  });

  // ===== SCROLL ANIMATION =====
  function checkScroll() {
    $(".articulo-card").each(function () {
      let pos = $(this).offset().top;
      let winBot = $(window).scrollTop() + $(window).height();
      if (pos < winBot - 100) $(this).addClass("visible");
    });
  }
  checkScroll();
  $(window).scroll(checkScroll);

  // ===== MODAL CON ARTÍCULOS =====
  const articulos = {
    1: {
      titulo: "🏔️ Salinas Grandes",
      contenido:
        "Las Salinas Grandes están a 3.450 metros de altura, en la puna jujeña. Consejos: llevar gafas de sol, protector solar y mucha agua. El mejor horario es al atardecer, cuando el sol pinta el horizonte de colores rosados.",
    },
    2: {
      titulo: "🎒 10 cosas para tu mochila",
      contenido:
        "1. Agua (2 litros/día). 2. Protector solar FPS 50+. 3. Repelente. 4. Ropa de abrigo. 5. Calzado cómodo. 6. Cargador portátil. 7. Documentos. 8. Botiquín. 9. Snacks. 10. Ganas de aventura.",
    },
    3: {
      titulo: "🍽️ Empanadas salteñas",
      contenido:
        "Ingredientes: carne cortada a cuchillo, cebolla, morrón, papas, huevo, comino y pimentón. El secreto está en el repulgue y en hornearlas en horno de barro. Las mejores están en La Casona del Molino, Salta.",
    },
    4: {
      titulo: "🎒 Cerro de los 7 Colores",
      contenido:
        "Subir al mirador del Cerro de los 7 Colores en Purmamarca es una experiencia única. La caminata toma 20 minutos y las vistas son impagables. Recomiendo ir al atardecer.",
    },
    5: {
      titulo: "🏔️ Quebrada de Humahuaca",
      contenido:
        "Recorré Purmamarca (Cerro 7 Colores), Tilcara (Pucará), Humahuaca (Monumento a la Independencia). No te pierdas el mercado artesanal y las comidas típicas como la llama.",
    },
    6: {
      titulo: "💡 Mal de altura",
      contenido:
        "El soroche afecta arriba de 2.500m. Consejos: hidratarse, comer liviano, evitar alcohol, masticar coca, descansar el primer día y subir gradualmente.",
    },
  };

  $(".leer-mas").click(function () {
    let id = $(this).data("articulo");
    let art = articulos[id];
    $("#modalTitulo").text(art.titulo);
    $("#modalContenido").html(`<p>${art.contenido}</p>`);
    new bootstrap.Modal(document.getElementById("modalArticulo")).show();
  });

  // ===== COMENTARIOS =====
  $("#btnAgregarComentario").click(function () {
    let nombre = $("#nombreComentario").val().trim();
    let texto = $("#textoComentario").val().trim();

    if (nombre === "" || texto === "") {
      alert("Completá nombre y comentario");
      return;
    }

    let nuevo = `
            <div class="card mb-3 comentario">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h6><i class="bi bi-person-circle"></i> <strong>${escapeHtml(nombre)}</strong></h6>
                        <small class="text-muted">Recién ahora</small>
                    </div>
                    <p>${escapeHtml(texto)}</p>
                    <button class="btn btn-sm btn-outline-primary like-btn">❤️ Me gusta (0)</button>
                </div>
            </div>
        `;

    $("#listaComentarios").prepend(nuevo);
    $("#nombreComentario").val("");
    $("#textoComentario").val("");
  });

  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function (m) {
      if (m === "&") return "&amp;";
      if (m === "<") return "&lt;";
      if (m === ">") return "&gt;";
      return m;
    });
  }

  // ===== ME GUSTA =====
  $(document).on("click", ".like-btn", function () {
    let btn = $(this);
    let texto = btn.text();
    let num = parseInt(texto.match(/\d+/)) || 0;
    btn.html(`❤️ Me gusta (${num + 1})`);
    btn.css("transform", "scale(1.1)");
    setTimeout(() => btn.css("transform", "scale(1)"), 200);
  });
});
