// ===== SHOWCASE DOCS PORTAL - MAIN JAVASCRIPT =====

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializePortal();
});

// Função principal de inicialização
function initializePortal() {
    initializeNavigation();
    initializeSearch();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeTooltips();
    initializeAnalytics();
}

// ===== NAVEGAÇÃO =====
function initializeNavigation() {
    // Destacar página atual na navegação
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-main a, .sidebar-nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath || 
            (currentPath.includes(link.getAttribute('href')) && link.getAttribute('href') !== '/')) {
            link.classList.add('active');
        }
    });
    
    // Smooth scroll para links internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== SISTEMA DE BUSCA =====
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    let searchTimeout;
    
    if (!searchInput) return;
    
    // Dados de busca (simulado - em produção viria de um arquivo JSON)
    const searchData = [
        {
            title: 'Quick Start Guide',
            url: '/pages/getting-started/quick-start.html',
            category: 'Começar Agora',
            description: 'Guia rápido para começar a usar o Showcase em 5 minutos'
        },
        {
            title: 'Instalação do Player',
            url: '/pages/getting-started/installation.html',
            category: 'Começar Agora',
            description: 'Como instalar o Showcase Player em diferentes sistemas'
        },
        {
            title: 'FAQ - Perguntas Frequentes',
            url: '/pages/support/faq.html',
            category: 'Suporte',
            description: 'Respostas para as perguntas mais comuns sobre o Showcase'
        },
        {
            title: 'API Reference',
            url: '/pages/developers/api-reference.html',
            category: 'Desenvolvedores',
            description: 'Documentação completa da API do Showcase'
        },
        {
            title: 'Casos de Uso - Imobiliário',
            url: '/pages/documentation/real-estate.html',
            category: 'Documentação',
            description: 'Como usar o Showcase no setor imobiliário'
        }
    ];
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();
        
        if (query.length < 2) {
            hideSearchResults();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query, searchData);
        }, 300);
    });
    
    // Fechar resultados ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSearchResults();
        }
    });
}

function performSearch(query, data) {
    const results = data.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    displaySearchResults(results, query);
}

function displaySearchResults(results, query) {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-no-results">
                <p>Nenhum resultado encontrado para "${query}"</p>
                <p class="text-sm">Tente usar termos diferentes ou verifique a ortografia.</p>
            </div>
        `;
    } else {
        searchResults.innerHTML = results.map(result => `
            <a href="${result.url}" class="search-result-item">
                <div class="search-result-title">${highlightQuery(result.title, query)}</div>
                <div class="search-result-category">${result.category}</div>
                <div class="search-result-description">${highlightQuery(result.description, query)}</div>
            </a>
        `).join('');
    }
    
    searchResults.style.display = 'block';
}

function highlightQuery(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function hideSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// ===== MENU MOBILE =====
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuToggle || !mobileMenu) return;
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        this.classList.toggle('active');
        
        // Prevenir scroll do body quando menu estiver aberto
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Fechar menu ao clicar em um link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ===== EFEITOS DE SCROLL =====
function initializeScrollEffects() {
    // Fade in elements quando entram na viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos com classe 'animate-on-scroll'
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
    
    // Botão "Voltar ao topo"
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== TOOLTIPS =====
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            showTooltip(this);
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showTooltip(element) {
    const tooltipText = element.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    tooltip.id = 'active-tooltip';
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('active-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// ===== ANALYTICS SIMPLES =====
function initializeAnalytics() {
    // Tracking de páginas visitadas
    trackPageView();
    
    // Tracking de cliques em links importantes
    const importantLinks = document.querySelectorAll('.btn, .quick-action, .card');
    importantLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('click', this.textContent.trim() || this.getAttribute('href'));
        });
    });
    
    // Tracking de buscas
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            if (this.value.length >= 3) {
                trackEvent('search', this.value);
            }
        }, 1000));
    }
}

function trackPageView() {
    const pageData = {
        page: window.location.pathname,
        title: document.title,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
    };
    
    // Em produção, enviar para serviço de analytics
    console.log('Page view:', pageData);
    
    // Salvar no localStorage para análise local
    const analytics = JSON.parse(localStorage.getItem('showcase-analytics') || '[]');
    analytics.push(pageData);
    
    // Manter apenas os últimos 100 registros
    if (analytics.length > 100) {
        analytics.splice(0, analytics.length - 100);
    }
    
    localStorage.setItem('showcase-analytics', JSON.stringify(analytics));
}

function trackEvent(type, data) {
    const eventData = {
        type: type,
        data: data,
        page: window.location.pathname,
        timestamp: new Date().toISOString()
    };
    
    console.log('Event tracked:', eventData);
    
    // Em produção, enviar para serviço de analytics
}

// ===== UTILITÁRIOS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== FEEDBACK DO USUÁRIO =====
function initializeFeedback() {
    const feedbackButtons = document.querySelectorAll('.feedback-btn');
    
    feedbackButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isHelpful = this.dataset.helpful === 'true';
            const pageUrl = window.location.pathname;
            
            // Enviar feedback
            submitFeedback(pageUrl, isHelpful);
            
            // Mostrar mensagem de agradecimento
            showFeedbackMessage('Obrigado pelo seu feedback!');
            
            // Desabilitar botões após feedback
            feedbackButtons.forEach(btn => btn.disabled = true);
        });
    });
}

function submitFeedback(page, helpful) {
    const feedbackData = {
        page: page,
        helpful: helpful,
        timestamp: new Date().toISOString()
    };
    
    // Em produção, enviar para servidor
    console.log('Feedback submitted:', feedbackData);
    
    // Salvar localmente para análise
    const feedback = JSON.parse(localStorage.getItem('showcase-feedback') || '[]');
    feedback.push(feedbackData);
    localStorage.setItem('showcase-feedback', JSON.stringify(feedback));
}

function showFeedbackMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'feedback-message';
    messageDiv.textContent = message;
    
    const feedbackContainer = document.querySelector('.feedback-container');
    if (feedbackContainer) {
        feedbackContainer.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// ===== MODO ESCURO (FUTURO) =====
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (!darkModeToggle) return;
    
    // Verificar preferência salva
    const savedTheme = localStorage.getItem('showcase-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('showcase-theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('showcase-theme', 'light');
        }
    });
}

// ===== EXPORTAR FUNÇÕES GLOBAIS =====
window.ShowcasePortal = {
    trackEvent: trackEvent,
    showTooltip: showTooltip,
    hideTooltip: hideTooltip,
    submitFeedback: submitFeedback
};

