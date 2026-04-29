const SERVICOS = [
    { id: 1, nome: 'Corte de Cabelo', preco: 45.00, descricao: 'Corte personalizado conforme seu estilo' },
    { id: 2, nome: 'Barba',           preco: 35.00, descricao: 'Modelagem e acabamento com navalha' },
    { id: 3, nome: 'Corte + Barba',   preco: 70.00, descricao: 'Combo completo com desconto especial' },
    { id: 4, nome: 'Hidratação',      preco: 55.00, descricao: 'Tratamento profundo para cabelo e barba' },
    { id: 5, nome: 'Sobrancelha',     preco: 20.00, descricao: 'Design e alinhamento de sobrancelha' },
    { id: 6, nome: 'Pacote Completo', preco: 110.00, descricao: 'Corte, barba, sobrancelha e hidratação' },
];

const ICONES = [
    `<circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M20 4v7a7 7 0 0 1-7 7H9"></path>`,
    `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>`,
    `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>`,
    `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>`,
    `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`,
    `<polyline points="8 17 4 17 4 11 20 11 20 17 16 17"></polyline><rect x="8" y="17" width="8" height="4"></rect><path d="M4 11V7a8 8 0 0 1 16 0v4"></path>`,
];

function carregarServicos() {
    const container = document.getElementById('container-servicos');
    container.innerHTML = '';

    SERVICOS.forEach((servico, indice) => {
        const cartao = document.createElement('div');
        cartao.className = 'card-servico';
        cartao.innerHTML = `
            <svg class="icon-servico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${ICONES[indice] || ICONES[0]}
            </svg>
            <h3 class="nome-servico">${servico.nome}</h3>
            <p class="descricao-servico">${servico.descricao}</p>
            <p class="preco-servico">R$ ${servico.preco.toFixed(2)}</p>
        `;
        container.appendChild(cartao);
    });
}

document.addEventListener('DOMContentLoaded', carregarServicos);