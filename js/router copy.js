// --- FUNÇÃO AUXILIAR PARA OBTER A ROTA VIA HASH ---
function obterCaminhoAtual() {
    let hash = window.location.hash.replace('#', '');
    if (!hash || hash === '') hash = '/';
    return hash;
}

// --- 1. CONFIGURAÇÃO DO TEMA (CLARO / ESCURO) ---
const htmlRoot = document.getElementById('html-root');
const themeBtn = document.getElementById('btn-theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlRoot.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlRoot.setAttribute('data-bs-theme', newTheme);
        if (newTheme === 'dark') {
            themeIcon.className = 'bi bi-sun-fill';
            themeText.textContent = 'Claro';
        } else {
            themeIcon.className = 'bi bi-moon-stars-fill';
            themeText.textContent = 'Escuro';
        }
    });
}

// --- 2. FUNÇÃO PARA GERAR O MENU DINAMICAMENTE COM BASE NO JSON ---
async function renderizarNavbar(routes) {
    
    
    const navbarMenu = document.getElementById("navbar-menu");
    if (!navbarMenu) return;

    const path = obterCaminhoAtual();
    const routeKeys = Object.keys(routes);
    const LIMITE_MENU = 5; // Limite de itens visíveis no menu principal
    

    const chavesPrincipais = routeKeys.slice(0, LIMITE_MENU);
    const chavesExcedentes = routeKeys.slice(LIMITE_MENU);

    // Função interna para montar o HTML dos primeiros 5 itens do menu
    function gerarHtmlItem(routeKey, index) {
        const routeData = routes[routeKey];
        const iconHtml = routeData.icon ? `<i class="${routeData.icon} me-1"></i>` : '';

        // Se o item do JSON contiver subitens
        if (routeData.subitens && routeData.subitens.length > 0) {
            const dropdownId = `dropdown-${index}`;
            const subitemAtivo = routeData.subitens.some(sub => sub.link === path);
            const parentAtivo = (routeKey === path || subitemAtivo) ? "active" : "";

            const subitensHtml = routeData.subitens.map(subitem => {
                const subAtivo = subitem.link === path ? "active" : "";
                const hrefSubHash = `#${subitem.link}`;
                
                return `
                    <li>
                        <a class="dropdown-item ${subAtivo}" href="${hrefSubHash}" data-link>
                            ${subitem.titulo}
                        </a>
                    </li>
                `;
            }).join('');

            return `
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle ${parentAtivo}" href="#" id="${dropdownId}" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        ${iconHtml}${routeData.name}
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="${dropdownId}">
                        ${subitensHtml}
                    </ul>
                </li>
            `;
        }

        // Link simples
        const hrefHash = `#${routeKey}`;
        const ativo = routeKey === path ? "active" : "";

        return `
            <li class="nav-item">
                <a class="nav-link ${ativo}" href="${hrefHash}" data-link>
                    ${iconHtml}${routeData.name}
                </a>
            </li>
        `;
    }

    // 1. Renderiza até 5 itens principais
    let htmlMenu = chavesPrincipais.map((key, i) => gerarHtmlItem(key, i)).join('');

    // 2. Se existirem mais de 5 itens, insere o dropdown "Mais" com suporte a Abre/Fecha (Collapse)
    if (chavesExcedentes.length > 0) {
        const algumExcedenteAtivo = chavesExcedentes.some(key => {
            if (key === path) return true;
            if (routes[key].subitens) {
                return routes[key].subitens.some(sub => sub.link === path);
            }
            return false;
        });

        const ativoMais = algumExcedenteAtivo ? "active" : "";

        const subitensExcedentesHtml = chavesExcedentes.map((key, index) => {
            const item = routes[key];
            const iconHtml = item.icon ? `<i class="${item.icon} me-1"></i>` : '';

            // Caso o item do menu escondido POSSUA SUBITENS (Cria um botão com efeito Collapse/Sanfona)
            if (item.subitens && item.subitens.length > 0) {
                const collapseId = `collapse-mais-${index}`;
                const possuiSubAtivo = item.subitens.some(sub => sub.link === path);
                const showClass = possuiSubAtivo ? "show" : "";

                const subLista = item.subitens.map(sub => `
                    <li>
                        <a class="dropdown-item ps-4 ${sub.link === path ? 'active' : ''}" href="#${sub.link}" data-link>
                            ${sub.titulo}
                        </a>
                    </li>
                `).join('');

                return `
                    <li>
                        <!-- Botão que expande/recolhe o submenu -->
                        <button class="dropdown-item d-flex justify-content-between align-items-center ${possuiSubAtivo ? 'fw-bold' : ''}" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target="#${collapseId}" 
                                aria-expanded="${possuiSubAtivo ? 'true' : 'false'}">
                            <span>${iconHtml}${item.name}</span>
                            <i class="bi bi-chevron-down ms-2 small"></i>
                        </button>
                        
                        <!-- Conteúdo expansível do submenu -->
                        <div class="collapse ${showClass}" id="${collapseId}">
                            <ul class="list-unstyled mb-0 bg-body-tertiary rounded-2 my-1 py-1">
                                ${subLista}
                            </ul>
                        </div>
                    </li>
                `;
            }

            // Link simples dentro do menu excedente
            const subAtivo = key === path ? "active" : "";
            return `
                <li>
                    <a class="dropdown-item ${subAtivo}" href="#${key}" data-link>
                        ${iconHtml}${item.name}
                    </a>
                </li>
            `;
        }).join('');

        htmlMenu += `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle ${ativoMais}" href="#" id="dropdown-mais" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                    <i class="bi bi-three-dots me-1"></i>Mais
                </a>
                <ul class="dropdown-menu dropdown-menu-end p-2" aria-labelledby="dropdown-mais" style="min-width: 220px;">
                    ${subitensExcedentesHtml}
                </ul>
            </li>
        `;
    }
    navbarMenu.innerHTML = htmlMenu;
}

// --- 3. FUNÇÃO DO ROUTER ---
async function router() {
    const path = obterCaminhoAtual();
    const appDiv = document.getElementById("app");

    try {
        const resRoutes = await fetch('/routes.json');
        if (!resRoutes.ok) throw new Error("Não foi possível carregar o arquivo routes.json");
        const routes = await resRoutes.json();

        // Renderiza o menu de navegação
        renderizarNavbar(routes);

        // Procura a rota direta ou dentro dos subitens
        let currentRoute = routes[path];
        
        if (!currentRoute) {
            Object.values(routes).forEach(route => {
                if (route.subitens) {
                    const subEncontrado = route.subitens.find(sub => sub.link === path);
                    if (subEncontrado) {
                        currentRoute = subEncontrado;
                    }
                }
            });
        }

        const pageFile = currentRoute ? currentRoute.file : "page/404.html";

        // Carrega o conteúdo HTML do arquivo referente à rota
        const response = await fetch(pageFile);
        if (!response.ok) throw new Error("Página não encontrada");
        
        const htmlContent = await response.text();
        appDiv.innerHTML = htmlContent;

        // Re-executa módulos de <script> injetados dinamicamente na página
        const scripts = appDiv.querySelectorAll("script");
        scripts.forEach(script => {
            const newScript = document.createElement("script");
            newScript.type = "module";
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript);
            script.remove();
        });

    } catch (error) {
        console.error(error);
        appDiv.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-exclamation-triangle text-danger display-4"></i>
                <h3 class="mt-3">Página não encontrada</h3>
                <p class="text-secondary">O arquivo correspondente não pôde ser carregado.</p>
                <a href="#/" class="btn btn-primary" data-link>Voltar ao Início</a>
            </div>`;
    }
}

// --- 4. EVENT LISTENERS DA APLICAÇÃO ---

// Intercepta cliques nos links com [data-link]
document.addEventListener("click", e => {
    if (e.target.matches("[data-link]") || e.target.closest("[data-link]")) {
        const link = e.target.closest("[data-link]");
        e.preventDefault();
        const href = link.getAttribute("href");
        
        if (href && href !== '#') {
            window.location.hash = href;
        }
    }
});

// Escuta a alteração da Hash na URL
window.addEventListener("hashchange", router);

// Carregamento inicial da página
window.addEventListener("DOMContentLoaded", () => {
    if (!window.location.hash) {
        window.location.hash = '#/';
    }
    router();
});