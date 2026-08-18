// js/filme.js
'use strict';

export function initFilme() {
    const btnTemaFilme = document.getElementById("btnTemaFilme");

    if (btnTemaFilme) {
        btnTemaFilme.addEventListener("click", function() {
            alert("Script externo do filme funcionou!");
            document.body.classList.toggle("modo-cinema");
        });
    }
}