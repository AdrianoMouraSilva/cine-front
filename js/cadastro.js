// js/filme.js
'use strict';

export function initCadastro() {
    // Função para capturar todos os gêneros marcados
    function obterGenerosSelecionados() {
        const checkboxes = document.querySelectorAll('input[name="generos"]:checked');
        const selecionados = Array.from(checkboxes).map(checkbox => checkbox.value);

        return selecionados;
    }

    function validarIdade(dataNascimento) {
        const hoje = new Date();
        const nasc = new Date(dataNascimento);

        // Calcula a diferença básica de anos
        let idade = hoje.getFullYear() - nasc.getFullYear();

        // Ajusta caso ainda não tenha feito aniversário este ano
        const m = hoje.getMonth() - nasc.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
            idade--;
        }

        return idade >= 18 && idade < 30;
    }

    function validarIdadeUnix(dataNascimento) {
        const agora = Date.now(); // Unix timestamp atual em ms
        const nascimento = new Date(dataNascimento).getTime(); // Unix timestamp do nascimento
        let valido = true;
        let msg = 'Erro!';

        const valMenorAnos = '18'
        const valMaiorAnos = '60'


        // Conversão de anos para milissegundos
        const menorAnos = valMenorAnos * 365.25 * 24 * 60 * 60 * 1000;
        const maiorAnos = valMaiorAnos * 365.25 * 24 * 60 * 60 * 1000;

        const diferencaMs = agora - nascimento;

        // Precisa ter pelo menos 18 anos e menos de 30
        // return diferencaMs >= ms18Anos && diferencaMs < ms30Anos;
        if (diferencaMs < menorAnos) {
            msg = `É necessário ter pelo menos ${valMenorAnos} anos.`;
            valido: false
        } else if (diferencaMs >= maiorAnos) {
            msg = `A idade limite para cadastro é de ${valMaiorAnos} anos.`;
            valido: false
        } else {
            valido: true,
                msg = 'Idade validada com sucesso!';
        }

        return {
            valido: valido,
            msg: msg
        }
    }

    // const btnCadastrar = document.getElementById("btn-cadastrar");
    const inputNome = document.getElementById("nome");
    const inputEmail = document.getElementById("email");
    const inputDataNascimento = document.getElementById("data-nascimento");
    const inputPassword = document.getElementById("password");
    const inputConfimaPassword = document.getElementById("confima-password");
    const inputGeneros = obterGenerosSelecionados();
    const inputTermos = document.querySelector('#aceite-termos');


    const barraSenha = document.getElementById("minha-barra");

    inputPassword.addEventListener('input', function (event) {


        // Remove as classes de cores antigas do Bootstrap
        barraSenha.classList.remove('bg-danger', 'bg-warning', 'bg-success', 'bg-info');

        // Pega o valor atual digitado
        let tamanho = event.target.value.length;
        if (tamanho === 0) {
            barraSenha.style.width = "0%"
            barraSenha.textContent = "0%"
        } else if (tamanho < 3) {
            barraSenha.style.width = "15%"
            barraSenha.textContent = "15%"
            barraSenha.classList.add('bg-danger');   // Vermelho (0% a 39%)
        } else if (tamanho < 6) {
            barraSenha.style.width = "33%"
            barraSenha.textContent = "33%"
            barraSenha.classList.add('bg-warning');  // Amarelo (40% a 69%)
        } else if (tamanho < 10) {
            barraSenha.style.width = "66%"
            barraSenha.textContent = "66%"
            barraSenha.classList.add('bg-info');     // Azul (70% a 99%)
        } else {
            barraSenha.textContent = "100%"
            barraSenha.style.width = "100%"
            barraSenha.classList.add('bg-success');  // Verde (100%)
        }
    });

    document.querySelector('#form-cadastro').addEventListener('submit', function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Captura o elemento do botão que disparou o submit
        const botaoClicado = event.submitter;
        const valorBotao = botaoClicado ? botaoClicado.value : '';

        if (valorBotao === 'btn-cadastrar') {
            const generos = obterGenerosSelecionados();

            const msg = validarIdadeUnix(inputDataNascimento.value)
            if (inputPassword.value !== inputConfimaPassword.value) {
                console.log("Senhas diferentes!!!");
            } else {

            }

            if (msg.valido) {
                console.log("Idade if:", msg.msg)
                inputDataNascimento.classList.remove('is-invalid'); // Borda vermelha
                inputDataNascimento.classList.add('is-valid');

            } else {
                console.log("Idade else:", msg.msg)

                inputDataNascimento.classList.add('is-invalid'); // Borda vermelha
                inputDataNascimento.classList.remove('is-valid');
            }

            console.log("Gêneros selecionados:", generos);
            console.log("Gêneros selecionados inputDataNascimento:", inputDataNascimento.value);


            alert("Você clicou em Cadastrar!");

        } else if (valorBotao === 'btn-limpar') {
            // Reseta o formulário via JS
            this.reset();
            alert("Formulário limpo com sucesso!");
        }




    });

}