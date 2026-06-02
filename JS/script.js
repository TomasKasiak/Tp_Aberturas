function cambiarModo() {
  document.body.classList.toggle("modo-noche");

  let boton = document.getElementById("tema-btn");

  if (document.body.classList.contains("modo-noche")) {
    boton.innerText = "☀️ Modo Día";

    localStorage.setItem("modo", "noche");
  } else {
    boton.innerText = "🌙 Modo Noche";

    localStorage.setItem("modo", "dia");
  }
}

window.onload = function () {
  let modoGuardado = localStorage.getItem("modo");

  if (modoGuardado === "noche") {
    document.body.classList.add("modo-noche");

    let boton = document.getElementById("tema-btn");

    if (boton) {
      boton.innerText = "☀️ Modo Día";
    }
  }
};
