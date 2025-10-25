document.addEventListener('DOMContentLoaded', function() {

    // --- Lógica del Quiz ---
    const quizForm = document.getElementById('loveQuiz');
    quizForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        // CAMBIA [Nombre de ella] por su nombre
       
    });

    // --- LÓGICA DE ANIMACIÓN ON-SCROLL (Igual que antes) ---
    const generalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 
    });

    const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll');
    sectionsToAnimate.forEach(section => {
        generalObserver.observe(section);
    });

    const listObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const listItems = entry.target.querySelectorAll('li');
                listItems.forEach((item, index) => {
                    item.style.animationDelay = `${index * 150}ms`;
                    item.classList.add('is-visible');
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    const staggeredList = document.querySelector('.stagger-list');
    if (staggeredList) {
        listObserver.observe(staggeredList);
    }

    // --- NUEVA LÓGICA DEL CARRUSEL DE FOTOS ---
    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let currentIndex = 0; // Índice de la foto actual

    // --- CONFIGURACIÓN: Nombres de tus fotos ---
    // Asegúrate de que los nombres de archivo sean correctos y estén en la carpeta 'images/'
    const photos = [
        'elu 1.jpeg',
        'elu 2.jpeg',
        'elu 3.jpeg',
        'javito.jpeg',
        'elu4.jpeg',
        // Añade más nombres de fotos aquí:
        // 'foto4.png',
        // 'mi_boda.jpeg',
        // etc.
    ];

    if (carouselTrack && photos.length > 0) {
        // Cargar las fotos en el carrusel
        photos.forEach(photoName => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');
            const img = document.createElement('img');
            img.src = `images/${photoName}`; // Ruta a la carpeta de imágenes
            img.alt = 'Nuestra foto de amor';
            slide.appendChild(img);
            carouselTrack.appendChild(slide);
        });

        const slides = document.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;

        function updateCarousel() {
            // Calcula el desplazamiento necesario para mostrar la foto actual
            const offset = -currentIndex * 100; // Mueve el track el 100% por cada slide
            carouselTrack.style.transform = `translateX(${offset}%)`;

            // Animación de fade para la imagen actual (re-aplica para cada cambio)
            slides.forEach(slide => {
                const img = slide.querySelector('img');
                if (img) {
                    img.style.animation = 'none'; // Resetea la animación
                    void img.offsetWidth; // Trigger reflow (Truco para reiniciar CSS animation)
                    img.style.animation = 'photoFade 1s ease-out'; // Aplica la animación
                }
            });
        }

        // Navegación hacia adelante
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides; // Vuelve al inicio si llega al final
            updateCarousel();
        });

        // Navegación hacia atrás
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // Vuelve al final si está en el inicio
            updateCarousel();
        });

        // Mostrar la primera foto al cargar
        updateCarousel(); 
    } else {
        console.warn("Carrusel de fotos no inicializado. Asegúrate de tener el track y fotos.");
    }

});
document.addEventListener('DOMContentLoaded', function() {

    // --- Lógica del Quiz (Sin cambios) ---
   const quizForm = document.getElementById('loveQuiz');

    // ¡¡¡IMPORTANTE: CONFIGURA TUS RESPUESTAS AQUÍ!!!
    // Define la respuesta correcta ('a', 'b', o 'c') para cada pregunta.
    const correctAnswers = {
        q1: 'a',
        q2: 'c',
        q3: 'b',
        q4: 'a',
        q5: 'c',
        q6: 'b',
        q7: 'a',
        q8: 'b',
        q9: 'c',
        q10: 'a',
        q11: 'b',
        q12: 'c',
        q13: 'a',
        q14: 'b',
        q15: 'c',
    };
    
    const totalQuestions = Object.keys(correctAnswers).length; // Total de preguntas (15)

    // Objeto para guardar las selecciones del usuario
    const userSelections = {};

    // 1. Manejar la SELECCIÓN de opciones
    quizForm.addEventListener('click', function(event) {
        // Usamos delegación de eventos
        const clickedButton = event.target.closest('.quiz-option');

        // Si no se hizo click en un botón de opción, no hacer nada
        if (!clickedButton) return;
        
        // Si el quiz ya fue validado, no permitir cambiar
        if (quizForm.classList.contains('validated')) return;

        const questionDiv = clickedButton.closest('.quiz-question');
        const questionId = questionDiv.id;
        const answerValue = clickedButton.dataset.answer;

        // Guardar la selección
        userSelections[questionId] = answerValue;

        // Quitar la clase 'selected' de los hermanos
        const siblingOptions = questionDiv.querySelectorAll('.quiz-option');
        siblingOptions.forEach(btn => btn.classList.remove('selected'));

        // Añadir 'selected' al botón clickeado
        clickedButton.classList.add('selected');
    });

    // 2. Manejar el ENVÍO (Validación) del quiz
    quizForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir recarga de la página

        // Si ya se validó, no hacer nada
        if (quizForm.classList.contains('validated')) return;

        // Añadir clase para bloquear botones
        quizForm.classList.add('validated');

        let score = 0; // Contador de puntaje

        // 3. Iterar y verificar cada pregunta
        for (let i = 1; i <= totalQuestions; i++) {
            const qId = 'q' + i;
            const questionDiv = document.getElementById(qId);
            const correctAnswer = correctAnswers[qId];
            const selectedAnswer = userSelections[qId];

            const correctButton = questionDiv.querySelector(`.quiz-option[data-answer="${correctAnswer}"]`);

            if (selectedAnswer) {
                // Si el usuario respondió
                const selectedButton = questionDiv.querySelector(`.quiz-option[data-answer="${selectedAnswer}"]`);
                
                if (selectedAnswer === correctAnswer) {
                    // Respuesta CORRECTA
                    score++;
                    selectedButton.classList.add('correct');
                } else {
                    // Respuesta INCORRECTA
                    selectedButton.classList.add('incorrect');
                    // Mostrar cuál era la correcta
                    correctButton.classList.add('actual-answer');
                }
            } else {
                // Si el usuario NO respondió
                questionDiv.classList.add('unanswered');
                // Mostrar cuál era la correcta
                correctButton.classList.add('actual-answer');
            }
        }

        // 4. Mostrar el puntaje final
        const resultsDiv = document.getElementById('quiz-results');
        resultsDiv.style.display = 'block'; // Hacer visible el contenedor
        
        let resultMessage = `¡Tu puntaje: ${score} de ${totalQuestions}!<br>`;
        if (score === totalQuestions) {
            resultMessage += "¡Increíble! Eres experta en nuestro 'código'. ¡Te amo!";
        } else if (score >= totalQuestions * 0.7) {
            resultMessage += "¡Casi perfecto! Nuestra 'compatibilidad' es altísima.";
        } else {
            resultMessage += "¡No importa el puntaje, te amo de forma 'descomunal'!";
        }

        // CAMBIA [Nombre de ella] por su nombre
        resultMessage += `<br>Gracias por jugar, [Nombre de ella] ❤️`;

        resultsDiv.innerHTML = resultMessage;

        // Opcional: Hacer scroll hasta los resultados
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    
    
    // ************************************************
    // * NUEVA LÓGICA DE TARJETAS GIF           *
    // ************************************************
    
    // 1. Seleccionamos todas las tarjetas GIF
    const gifCards = document.querySelectorAll('.gif-card');

    // 2. Iteramos sobre cada tarjeta
    gifCards.forEach(card => {
        
        // 3. Añadimos un 'escuchador' de click a cada una
        card.addEventListener('click', function() {
            
            // Si la tarjeta ya fue revelada, no hacemos nada
            if (card.classList.contains('is-revealed')) {
                return;
            }

            // 4. Añadimos la clase 'is-revealed'
            // Esto disparará las animaciones CSS (ocultar overlay, mostrar título y GIF)
            card.classList.add('is-revealed');

            // 5. Encontramos la imagen dentro de la tarjeta
            const img = card.querySelector('.gif-content img');
            
            // 6. Obtenemos la ruta del GIF desde el atributo 'data-src'
            const gifSrc = img.getAttribute('data-src');

            // 7. (Optimización) Asignamos la ruta al 'src'
            // Esto hace que el GIF se cargue solo cuando el usuario hace click,
            // no al cargar la página. ¡Mejora el rendimiento!
            if (gifSrc) {
                img.src = gifSrc;
            }
        });
    });

});