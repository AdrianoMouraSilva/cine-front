// js/filme.js
'use strict';

export function initCadastro() {
    // const btnCadastrar = document.getElementById("btn-cadastrar");
    const form = document.getElementById('form-cadastro');
    const inputNome = document.getElementById("nome");
    const inputEmail = document.getElementById("email");
    const inputDataNascimento = document.getElementById("data-nascimento");
    const inputPassword = document.getElementById("password");
    const inputConfimaPassword = document.getElementById("confima-password");
    const inputGeneros = obterGenerosSelecionados();
    const inputTermos = document.querySelector('#aceite-termos');

    const barraSenha = document.getElementById("minha-barra");

    // Inicializa o tooltip do Bootstrap no elemento wrapper
    // const wrapperSenha = document.getElementById('wrapper-confirma-senha');
    // const tooltipSenha = new bootstrap.Tooltip(wrapperSenha);


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

    function limparCampo() {
        // Remove as classes de cores antigas do Bootstrap
        barraSenha.classList.remove('bg-danger', 'bg-warning', 'bg-success', 'bg-info');
        barraSenha.style.width = "0%"
        barraSenha.textContent = "0%"

        inputDataNascimento.classList.remove('is-invalid');
        inputDataNascimento.classList.remove('is-valid');

        inputPassword.classList.remove('is-valid');
        inputPassword.classList.remove('is-invalid');

        inputConfimaPassword.classList.remove('is-valid');
        inputConfimaPassword.classList.remove('is-invalid');

        // Executa o reset dos campos
        form.reset();
    }

    function validarIdadeUnix(dataNascimento) {
        const agora = Date.now(); // Unix timestamp atual em ms
        const nascimento = new Date(dataNascimento).getTime(); // Unix timestamp do nascimento
        let valido = false;
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
            valido = false

        } else if (diferencaMs >= maiorAnos) {
            msg = `A idade limite para cadastro é de ${valMaiorAnos} anos.`;
            valido = false
        } else {
            valido = true
            msg = 'Idade validada com sucesso!';
        }

        return {
            valido: valido,
            msg: msg
        }
    }

    function validarSenha() {
        if (inputConfimaPassword.value.length > 0) {
            if (inputPassword.value !== inputConfimaPassword.value) {
                const msgSenha = "Senha diferentes!!!"

                inputPassword.classList.remove('is-valid');
                inputPassword.classList.add('is-invalid');
                document.getElementById("msg-erro-senha").innerHTML = msgSenha;

                inputConfimaPassword.classList.remove('is-valid');
                inputConfimaPassword.classList.add('is-invalid');

                document.getElementById("msg-erro-senha-confirma").innerHTML = msgSenha;
            } else {
                const msgSenha2 = "Sucesso !!!"

                inputPassword.classList.remove('is-invalid');
                inputPassword.classList.add('is-valid');
                document.getElementById("msg-sucesso-senha").innerHTML = msgSenha2;

                inputConfimaPassword.classList.remove('is-invalid');
                inputConfimaPassword.classList.add('is-valid');

                document.getElementById("msg-sucesso-senha-confirma").innerHTML = msgSenha2;
            }
        } else {
            inputPassword.classList.remove('is-invalid');
            inputPassword.classList.remove('is-valid');
            inputConfimaPassword.classList.remove('is-invalid');
            inputConfimaPassword.classList.remove('is-valid');
        }
    }


    inputConfimaPassword.addEventListener('input', function (event) {
        validarSenha()
    });



    inputPassword.addEventListener('input', function (event) {

        inputConfimaPassword.disabled = true;

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

            // Desabilita o campo após a validação com sucesso
            inputConfimaPassword.disabled = false;
        }
        if (inputConfimaPassword.value.length > 0) {
            validarSenha()
        }
    });

    document.querySelector('#form-cadastro').addEventListener('submit', function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Captura o elemento do botão que disparou o submit
        const botaoClicado = event.submitter;
        const valorBotao = botaoClicado ? botaoClicado.value : '';

        if (valorBotao === 'btn-cadastrar') {
            let statusErro = true;

            const generos = obterGenerosSelecionados();

            const msg = validarIdadeUnix(inputDataNascimento.value)
            if (inputPassword.value !== inputConfimaPassword.value) {
                const msgSenha = "Senha diferentes!!!"

                inputPassword.classList.remove('is-valid');
                inputPassword.classList.add('is-invalid');
                document.getElementById("msg-erro-senha").innerHTML = msgSenha;

                inputConfimaPassword.classList.remove('is-valid');
                inputConfimaPassword.classList.add('is-invalid');

                document.getElementById("msg-erro-senha-confirma").innerHTML = msgSenha;

                statusErro = false;
            } else {
                const msgSenha2 = "Sucesso !!!"

                inputPassword.classList.remove('is-invalid');
                inputPassword.classList.add('is-valid');
                document.getElementById("msg-sucesso-senha").innerHTML = msgSenha2;

                inputConfimaPassword.classList.remove('is-invalid'); // Borda vermelha
                inputConfimaPassword.classList.add('is-valid');

                document.getElementById("msg-sucesso-senha-confirma").innerHTML = msgSenha2;
            }

            if (msg.valido) {
                console.log("Idade if:", msg.msg)
                inputDataNascimento.classList.remove('is-invalid'); // Borda vermelha
                inputDataNascimento.classList.add('is-valid');
                document.getElementById("msg-sucesso-data").innerHTML = msg.msg;
            } else {
                inputDataNascimento.classList.remove('is-valid');
                inputDataNascimento.classList.add('is-invalid'); // Borda vermelha

                document.getElementById("msg-erro-data").innerHTML = msg.msg;

                statusErro = false;
            }
            alert("ANTES Limpar = " + statusErro)

            if (statusErro) {
                alert("Limpar")
                limparCampo();
            } else {
                alert("Não Limpar")
            }

        } else if (valorBotao === 'btn-limpar') {
            // Reseta o formulário via JS
            this.reset();
            alert("Formulário limpo com sucesso!");
        }
    });

    

    // Função auxiliar: quando você habilitar o input via JS, pode destruir ou desativar o aviso
    // function habilitarConfirmacaoSenha() {
    //     const inputConfirma = document.getElementById('confima-password');
    //     inputConfirma.disabled = false;

    //     // Remove a dica visual quando o campo for liberado
    //     tooltipSenha.disable();
    // }

}