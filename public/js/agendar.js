const SERVICOS = [
    { id: 1, nome: 'Corte de Cabelo', preco: 45.00 },
    { id: 2, nome: 'Barba',           preco: 35.00 },
    { id: 3, nome: 'Corte + Barba',   preco: 70.00 },
    { id: 4, nome: 'Hidratação',      preco: 55.00 },
    { id: 5, nome: 'Sobrancelha',     preco: 20.00 },
    { id: 6, nome: 'Pacote Completo', preco: 110.00 },
];

const estado = {
    servicoSelecionado: null,
    dataSelecionada:    null,
    horarioSelecionado: null,
    horariosOcupados:   [],
};

function obterAgendamentos() {
    try { return JSON.parse(localStorage.getItem('agendamentos') || '[]'); }
    catch (e) { return []; }
}

function salvarAgendamento(dadosAgendamento) {
    const agendamentos = obterAgendamentos();
    agendamentos.push(dadosAgendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

function obterHorariosOcupadosPorData(dataFormatada) {
    return obterAgendamentos()
        .filter(item => item.data === dataFormatada)
        .map(item => item.hora);
}

function carregarServicos() {
    const container = document.getElementById('container-servicos');
    container.innerHTML = '';

    SERVICOS.forEach(servico => {
        const opcao = document.createElement('button');
        opcao.type = 'button';
        opcao.className = 'opcao-servico';
        opcao.dataset.servicoId = servico.id;
        opcao.innerHTML = `
            <div class="opcao-servico-nome">${servico.nome}</div>
            <div class="opcao-servico-preco">R$ ${servico.preco.toFixed(2)}</div>
        `;
        opcao.addEventListener('click', (evento) => {
            evento.preventDefault();
            selecionarServico(servico.id, opcao);
        });
        container.appendChild(opcao);
    });
}

function selecionarServico(idServico, elementoClicado) {
    document.querySelectorAll('.opcao-servico').forEach(el => el.classList.remove('selecionado'));
    elementoClicado.classList.add('selecionado');
    estado.servicoSelecionado = idServico;
    ocultarErro();
}

function gerarProximasDatasUteis() {
    const listaDatas = [];
    const dataIteracao = new Date();
    dataIteracao.setHours(0, 0, 0, 0);

    while (listaDatas.length < 14) {
        const numeroDiaSemana = dataIteracao.getDay();
        if (numeroDiaSemana >= 1 && numeroDiaSemana <= 6) {
            listaDatas.push(new Date(dataIteracao));
        }
        dataIteracao.setDate(dataIteracao.getDate() + 1);
    }
    return listaDatas;
}

function carregarDatas() {
    const listaDatasUteis = gerarProximasDatasUteis();
    const container = document.getElementById('container-datas');
    container.innerHTML = '';

    const nomesDiasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    listaDatasUteis.forEach((data) => {
        const opcao = document.createElement('button');
        opcao.type = 'button';
        opcao.className = 'opcao-data';

        const nomeDiaSemana = nomesDiasSemana[data.getDay()];
        const numeroDia     = String(data.getDate()).padStart(2, '0');
        const numeroMes     = String(data.getMonth() + 1).padStart(2, '0');
        const numeroAno     = data.getFullYear();
        const dataFormatada = `${numeroAno}-${numeroMes}-${numeroDia}`;

        opcao.dataset.dataFormatada = dataFormatada;
        opcao.innerHTML = `
            <div class="data-dia">${nomeDiaSemana}</div>
            <div class="data-numero">${numeroDia}/${numeroMes}</div>
        `;
        opcao.addEventListener('click', (evento) => {
            evento.preventDefault();
            selecionarData(dataFormatada, opcao);
        });
        container.appendChild(opcao);
    });
}

function selecionarData(dataFormatada, elementoClicado) {
    document.querySelectorAll('.opcao-data').forEach(el => el.classList.remove('selecionado'));
    elementoClicado.classList.add('selecionado');
    estado.dataSelecionada    = dataFormatada;
    estado.horarioSelecionado = null;
    carregarHorarios(dataFormatada);
    document.getElementById('secao-horarios').style.display = 'block';
    ocultarErro();
}

function gerarTodosHorarios() {
    const listaHorarios = [];
    for (let hora = 9; hora < 18; hora++) {
        listaHorarios.push(`${String(hora).padStart(2, '0')}:00`);
    }
    return listaHorarios;
}

function carregarHorarios(dataFormatada) {
    estado.horariosOcupados   = obterHorariosOcupadosPorData(dataFormatada);
    estado.horarioSelecionado = null;

    const container = document.getElementById('container-horarios');
    container.innerHTML = '';

    gerarTodosHorarios().forEach(horario => {
        const opcao = document.createElement('button');
        opcao.type = 'button';
        opcao.className = 'opcao-horario';
        opcao.dataset.horario = horario;
        opcao.textContent = horario;

        const estaOcupado = estado.horariosOcupados.includes(horario);
        if (estaOcupado) {
            opcao.classList.add('desabilitado');
            opcao.desabilitado = true;
        } else {
            opcao.addEventListener('click', (evento) => {
                evento.preventDefault();
                selecionarHorario(horario, opcao);
            });
        }
        container.appendChild(opcao);
    });

    document.getElementById('horarios-nota').style.display =
        estado.horariosOcupados.length > 0 ? 'block' : 'none';
}

function selecionarHorario(horario, elementoClicado) {
    document.querySelectorAll('.opcao-horario:not(.desabilitado)').forEach(el => el.classList.remove('selecionado'));
    elementoClicado.classList.add('selecionado');
    estado.horarioSelecionado = horario;
    ocultarErro();
}

function mostrarErro(mensagem) {
    const containerErro = document.getElementById('mensagem-erro');
    document.getElementById('erro-texto').textContent = mensagem;
    containerErro.style.display = 'flex';
    containerErro.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ocultarErro() {
    document.getElementById('mensagem-erro').style.display = 'none';
}

function mostrarSucesso(nomeCliente, horarioMarcado, dataEscolhida) {
    const partesData   = dataEscolhida.split('-');
    const dataExibicao = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

    document.querySelector('.alert-mensagem').textContent =
        `${nomeCliente}, seu horário das ${horarioMarcado} em ${dataExibicao} foi reservado!`;
    document.querySelector('.alert-submensagem').textContent =
        'Redirecionando para página inicial em 4 segundos...';

    document.getElementById('agendamento-form').style.display = 'none';
    document.getElementById('mensagem-sucesso').style.display = 'flex';

    setTimeout(() => { window.location.href = 'index.html'; }, 4000);
}

function validarFormulario() {
    if (!estado.servicoSelecionado) {
        mostrarErro('Por favor, selecione um serviço.');
        return false;
    }
    if (!estado.dataSelecionada) {
        mostrarErro('Por favor, selecione uma data.');
        return false;
    }
    if (!estado.horarioSelecionado) {
        mostrarErro('Por favor, selecione um horário disponível.');
        return false;
    }

    const nomeCliente = document.getElementById('nome').value.trim();
    if (!nomeCliente || nomeCliente.length < 3) {
        mostrarErro('Por favor, digite um nome válido (mínimo 3 caracteres).');
        document.getElementById('nome').focus();
        return false;
    }

    const telefoneCliente = document.getElementById('telefone').value.trim();
    const apenasNumeros   = telefoneCliente.replace(/\D/g, '');
    if (!telefoneCliente || apenasNumeros.length < 10) {
        mostrarErro('Por favor, digite um telefone válido com DDD.');
        document.getElementById('telefone').focus();
        return false;
    }

    return true;
}

function confirmarAgendamento(evento) {
    evento.preventDefault();
    ocultarErro();

    if (!validarFormulario()) return;

    const nomeCliente     = document.getElementById('nome').value.trim();
    const telefoneCliente = document.getElementById('telefone').value.trim();

    const horariosAtualizados = obterHorariosOcupadosPorData(estado.dataSelecionada);
    if (horariosAtualizados.includes(estado.horarioSelecionado)) {
        mostrarErro('Este horário acabou de ser reservado. Por favor, escolha outro.');
        carregarHorarios(estado.dataSelecionada);
        estado.horarioSelecionado = null;
        return;
    }

    salvarAgendamento({
        id:        Date.now(),
        servicoId: estado.servicoSelecionado,
        data:      estado.dataSelecionada,
        hora:      estado.horarioSelecionado,
        nome:      nomeCliente,
        telefone:  telefoneCliente,
        criadoEm:  new Date().toISOString(),
    });

    mostrarSucesso(nomeCliente, estado.horarioSelecionado, estado.dataSelecionada);
}

function aplicarMascaraTelefone(evento) {
    let valorDigitado = evento.target.value.replace(/\D/g, '');
    if (valorDigitado.length <= 10) {
        valorDigitado = valorDigitado.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        valorDigitado = valorDigitado.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    evento.target.value = valorDigitado;
}

document.addEventListener('DOMContentLoaded', () => {
    carregarServicos();
    carregarDatas();

    const campoTelefone = document.getElementById('telefone');
    if (campoTelefone) campoTelefone.addEventListener('input', aplicarMascaraTelefone);

    const formulario = document.getElementById('agendamento-form');
    if (formulario) formulario.addEventListener('submit', confirmarAgendamento);
});
