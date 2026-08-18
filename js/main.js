'use strict'

const botao = document.getElementById("btnSinopse")

// const sinopse = document.getElementById('app')

botao.addEventListener("click", function() {
       alert("foi");
    // sinopse.classList.toggle("d-none")
})

const btnTema = document.getElementById("btnTema")

btnTema.addEventListener("click", function() {
    alert("foi");

    document.body.classList.toggle("modo-cinema")
})




