function cambiarModo() {
  document.body.classList.toggle("modo-noche");

  let boton = document.getElementById("tema-btn");

  if (document.body.classList.contains("modo-noche")) {
    boton.innerText = "Modo Dia";

    localStorage.setItem("modo", "noche");
  } else {
    boton.innerText = "Modo Noche";

    localStorage.setItem("modo", "dia");
  }
}

function obtenerCarrito() {
  let carritoGuardado = localStorage.getItem("carrito");

  if (carritoGuardado) {
    return JSON.parse(carritoGuardado);
  }

  return [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function agregarAlCarrito(producto) {
  let carrito = obtenerCarrito();
  let productoExistente = carrito.find((item) => item.nombre === producto.nombre);

  if (productoExistente) {
    productoExistente.cantidad = productoExistente.cantidad + 1;
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }

  guardarCarrito(carrito);
  mostrarMensajeCarrito(producto.nombre);
}

function eliminarDelCarrito(nombreProducto) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter((item) => item.nombre !== nombreProducto);
  guardarCarrito(carrito);
  mostrarCarrito();
}

function cambiarCantidad(nombreProducto, accion) {
  let carrito = obtenerCarrito();
  let producto = carrito.find((item) => item.nombre === nombreProducto);

  if (!producto) {
    return;
  }

  if (accion === "sumar") {
    producto.cantidad = producto.cantidad + 1;
  }

  if (accion === "restar") {
    producto.cantidad = producto.cantidad - 1;
  }

  if (producto.cantidad <= 0) {
    carrito = carrito.filter((item) => item.nombre !== nombreProducto);
  }

  guardarCarrito(carrito);
  mostrarCarrito();
}

function vaciarCarrito() {
  localStorage.removeItem("carrito");
  actualizarContadorCarrito();
  mostrarCarrito();
}

function actualizarContadorCarrito() {
  let contador = document.getElementById("carrito-contador");

  if (!contador) {
    return;
  }

  let carrito = obtenerCarrito();
  let totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);
  contador.innerText = totalProductos;
}

function mostrarMensajeCarrito(nombreProducto) {
  let mensaje = document.getElementById("mensaje-carrito");

  if (!mensaje) {
    return;
  }

  mensaje.innerText = nombreProducto + " fue agregado al carrito.";
  mensaje.classList.add("mensaje-carrito-visible");

  setTimeout(function () {
    mensaje.classList.remove("mensaje-carrito-visible");
  }, 2500);
}

function obtenerDescuentosSeleccionados() {
  let descuentoJubilado = document.getElementById("descuento-jubilado");
  let descuentoEfectivo = document.getElementById("descuento-efectivo");

  return {
    jubilado: descuentoJubilado ? descuentoJubilado.checked : false,
    efectivo: descuentoEfectivo ? descuentoEfectivo.checked : false,
  };
}

function calcularTotalesConDescuento(subtotal) {
  let descuentos = obtenerDescuentosSeleccionados();
  let descuentoJubilado = descuentos.jubilado ? subtotal * 0.10 : 0;
  let descuentoEfectivo = descuentos.efectivo ? subtotal * 0.10 : 0;
  let totalDescuentos = descuentoJubilado + descuentoEfectivo;
  let totalFinal = subtotal - totalDescuentos;

  return {
    subtotal: subtotal,
    descuentoJubilado: descuentoJubilado,
    descuentoEfectivo: descuentoEfectivo,
    totalDescuentos: totalDescuentos,
    totalFinal: totalFinal,
  };
}

function actualizarResumenCarrito(subtotal) {
  let subtotalCarrito = document.getElementById("carrito-subtotal");
  let descuentoJubiladoCarrito = document.getElementById("carrito-descuento-jubilado");
  let descuentoEfectivoCarrito = document.getElementById("carrito-descuento-efectivo");
  let descuentosTotalCarrito = document.getElementById("carrito-descuentos-total");
  let totalCarrito = document.getElementById("carrito-total");

  if (!totalCarrito) {
    return;
  }

  let totales = calcularTotalesConDescuento(subtotal);

  if (subtotalCarrito) {
    subtotalCarrito.innerText = formatearPrecio(totales.subtotal);
  }

  if (descuentoJubiladoCarrito) {
    descuentoJubiladoCarrito.innerText = "-" + formatearPrecio(totales.descuentoJubilado);
  }

  if (descuentoEfectivoCarrito) {
    descuentoEfectivoCarrito.innerText = "-" + formatearPrecio(totales.descuentoEfectivo);
  }

  if (descuentosTotalCarrito) {
    descuentosTotalCarrito.innerText = "-" + formatearPrecio(totales.totalDescuentos);
  }

  totalCarrito.innerText = formatearPrecio(totales.totalFinal);
}

function guardarDescuentosSeleccionados() {
  let descuentos = obtenerDescuentosSeleccionados();
  localStorage.setItem("descuentoJubilado", descuentos.jubilado ? "si" : "no");
  localStorage.setItem("descuentoEfectivo", descuentos.efectivo ? "si" : "no");
}

function iniciarDescuentosCarrito() {
  let descuentoJubilado = document.getElementById("descuento-jubilado");
  let descuentoEfectivo = document.getElementById("descuento-efectivo");

  if (descuentoJubilado) {
    descuentoJubilado.checked = localStorage.getItem("descuentoJubilado") === "si";
    descuentoJubilado.addEventListener("change", function () {
      guardarDescuentosSeleccionados();
      mostrarCarrito();
    });
  }

  if (descuentoEfectivo) {
    descuentoEfectivo.checked = localStorage.getItem("descuentoEfectivo") === "si";
    descuentoEfectivo.addEventListener("change", function () {
      guardarDescuentosSeleccionados();
      mostrarCarrito();
    });
  }
}

function mostrarCarrito() {
  let contenedor = document.getElementById("carrito-listado");

  if (!contenedor) {
    return;
  }

  let carrito = obtenerCarrito();
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = '<div class="carrito-vacio"><h3>El carrito esta vacio</h3><p>Agrega productos desde la seccion de puertas o ventanas.</p><a href="puertas.html" class="btn">Ver productos</a></div>';
    actualizarResumenCarrito(0);
    return;
  }

  let total = 0;

  carrito.forEach(function (item) {
    let subtotal = item.precio * item.cantidad;
    total = total + subtotal;

    let productoHTML = document.createElement("div");
    productoHTML.classList.add("carrito-item");

    productoHTML.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}">
      <div class="carrito-info">
        <h3>${item.nombre}</h3>
        <p>${item.descripcion}</p>
        <p>Medida: ${item.medida}</p>
        <strong>${formatearPrecio(item.precio)}</strong>
      </div>
      <div class="carrito-cantidad">
        <button onclick="cambiarCantidad('${item.nombre}', 'restar')">-</button>
        <span>${item.cantidad}</span>
        <button onclick="cambiarCantidad('${item.nombre}', 'sumar')">+</button>
      </div>
      <div class="carrito-subtotal">
        <strong>${formatearPrecio(subtotal)}</strong>
        <button class="btn-eliminar" onclick="eliminarDelCarrito('${item.nombre}')">Eliminar</button>
      </div>
    `;

    contenedor.appendChild(productoHTML);
  });

  actualizarResumenCarrito(total);
}

function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-AR");
}

function iniciarBotonesCarrito() {
  let botones = document.querySelectorAll(".agregar-carrito");

  botones.forEach(function (boton) {
    boton.addEventListener("click", function () {
      let tarjeta = boton.closest(".card");

      let producto = {
        nombre: tarjeta.dataset.nombre,
        descripcion: tarjeta.dataset.descripcion,
        medida: tarjeta.dataset.medida,
        precio: Number(tarjeta.dataset.precio),
        imagen: tarjeta.dataset.imagen,
      };

      agregarAlCarrito(producto);
    });
  });
}

window.onload = function () {
  let modoGuardado = localStorage.getItem("modo");

  if (modoGuardado === "noche") {
    document.body.classList.add("modo-noche");

    let boton = document.getElementById("tema-btn");

    if (boton) {
      boton.innerText = "Modo Dia";
    }
  }

  iniciarBotonesCarrito();
  iniciarDescuentosCarrito();
  actualizarContadorCarrito();
  mostrarCarrito();
};
