// Simplificar y asegurar que la navegación funcione
document.addEventListener('DOMContentLoaded', function () {
    // Verificar que las secciones y sus IDs son correctos
    console.log('=== Secciones detectadas ===');
    document.querySelectorAll('.menu-section').forEach(section => {
        console.log(`ID: "${section.id}" - Título: "${section.querySelector('h2').textContent}"`);
    });    // Mejorar las etiquetas de "Nuevo" y "Recomendado"
    document.querySelectorAll('.menu-item').forEach(item => {
        const tag = item.getAttribute('data-tags');
        if (tag === 'Recomendado') {
            // Agregar efecto de destello para items recomendados
            item.classList.add('recommended-item');

            // Crear un efecto de "pulso" para los elementos recomendados
            const pulse = document.createElement('div');
            pulse.className = 'recommendation-pulse';
            item.appendChild(pulse);

            // Añadir un pequeño badge con estrellas para los recomendados
            const badge = document.createElement('div');
            badge.className = 'recommendation-badge';
            badge.innerHTML = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>';
            item.appendChild(badge);
        }

        if (tag === 'Nuevo') {
            // Agregar clase para animación de "nuevo"
            item.classList.add('new-item');

            // Añadir un badge para nuevos elementos
            const newBadge = document.createElement('div');
            newBadge.className = 'new-badge';
            newBadge.innerHTML = '<i class="fas fa-certificate"></i>';
            item.appendChild(newBadge);
        }
    });

    // Verificar que los botones están configurados correctamente
    console.log('=== Botones detectados ===');
    document.querySelectorAll('.filter-btn').forEach(btn => {
        console.log(`Botón: "${btn.textContent.trim()}" - Filtro: "${btn.dataset.filter}"`);
    });

    // Función de navegación directa y simple
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function () {
            // Actualizar clase activa
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            // Obtener el filtro
            const filter = this.dataset.filter;
            console.log(`Botón clickeado: ${filter}`);

            // Navegación simple
            if (filter === 'all') {
                // Ir al inicio
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Ir a la sección específica
                const section = document.getElementById(filter);
                if (section) {
                    console.log(`Navegando a sección: ${filter}`);
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    console.error(`⚠️ No se encontró la sección con ID: ${filter}`);
                    // Buscar por texto de encabezado como fallback
                    document.querySelectorAll('.menu-section h2').forEach(heading => {
                        if (heading.textContent.toLowerCase().replace(/ /g, '-') === filter) {
                            console.log(`Navegando por título a: ${heading.textContent}`);
                            heading.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    });
                }
            }
        });
    });// Mejorar la experiencia táctil
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
        // Hacer que los elementos del menú sean más fáciles de tocar
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.add('touch-friendly');

            // Efecto de tap para dispositivos táctiles
            item.addEventListener('touchstart', function () {
                this.classList.add('tapped');

                // Hacer brillar las etiquetas al tocar
                if (this.getAttribute('data-tags') === 'Nuevo') {
                    this.classList.add('new-tapped');
                }

                if (this.getAttribute('data-tags') === 'Recomendado') {
                    this.classList.add('recommended-tapped');
                }
            });

            item.addEventListener('touchend', function () {
                this.classList.remove('tapped');
                this.classList.remove('new-tapped');
                this.classList.remove('recommended-tapped');

                // Pequeña pausa antes de eliminar el efecto de hover
                setTimeout(() => {
                    this.classList.remove('hovered');
                }, 300);
            });
        });

        // Mejorar la experiencia de scroll en dispositivos táctiles
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('touchend', function (e) {
                // Prevenir el comportamiento predeterminado para evitar problemas de scroll
                e.preventDefault();
                // Ejecutar el click después de un pequeño retraso para mejorar la experiencia
                setTimeout(() => {
                    this.click();
                }, 50);
            });
        });
    }

    // Modo oscuro
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;

    // Verificar si hay una preferencia guardada
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Aplicar el modo oscuro si estaba guardado
    if (isDarkMode) {
        body.classList.add('dark-mode');
        // Cambiar el icono a sol
        const moonIcon = darkModeToggle.querySelector('i');
        moonIcon.classList.remove('fa-moon');
        moonIcon.classList.add('fa-sun');
    }

    // Detectar preferencia del sistema si no hay preferencia guardada
    if (localStorage.getItem('darkMode') === null) {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
            // Cambiar el icono a sol
            const moonIcon = darkModeToggle.querySelector('i');
            moonIcon.classList.remove('fa-moon');
            moonIcon.classList.add('fa-sun');
        }
    }

    // Cambiar entre modos al hacer clic en el botón
    darkModeToggle.addEventListener('click', function () {
        // Alternar la clase dark-mode en el body
        body.classList.toggle('dark-mode');

        // Guardar la preferencia en localStorage
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);        // Cambiar el icono según el modo
        const icon = this.querySelector('i');
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Mostrar la pantalla de carga al cargar la página
    const loadingScreen = document.createElement('div');
    loadingScreen.classList.add('loading-screen');
    loadingScreen.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loadingScreen);

    // Ocultar la pantalla de carga después de 2 segundos
    window.addEventListener('load', function () {
        // Ocultar spinner después de que todo cargue
        setTimeout(() => {
            loadingScreen.style.display = 'none';

            // Añadir clase de animación solo a los elementos visibles
            document.querySelectorAll('.menu-item').forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 100); // Retardo escalonado
            });
        }, 2000);
    });

    // Actualizar la barra de progreso al desplazarse
    window.addEventListener('scroll', function () {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / docHeight) * 100;
        document.getElementById('progress-bar').style.width = progress + '%';
    });

    // Crear partículas animadas en el fondo
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particle-container';
    document.body.appendChild(particleContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDuration = Math.random() * 5 + 3 + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particleContainer.appendChild(particle);
    }
});
