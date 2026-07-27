document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.theme-card'));
    const viewport = document.getElementById('wheelViewport');
    const prevBtn = document.getElementById('prevCardBtn');
    const nextBtn = document.getElementById('nextCardBtn');

    let activeIndex = 0;
    const totalCards = cards.length;
    const cardHeight = 85; // Spacing offset
    const rotationStep = -3.5; // Tilt angle matching reference image

    function renderWheel() {
        cards.forEach((card, index) => {
            let offset = index - activeIndex;

            // Endless looping logic
            if (offset < -Math.floor(totalCards / 2)) {
                offset += totalCards;
            } else if (offset > Math.floor(totalCards / 2)) {
                offset -= totalCards;
            }

            const translateY = offset * cardHeight + 150;
            const scale = 1 - Math.abs(offset) * 0.05;
            const rotateZ = offset * rotationStep;
            const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.22;
            const zIndex = totalCards - Math.abs(offset);

            card.style.transform = `translateY(${translateY}px) scale(${scale}) rotate(${rotateZ}deg)`;
            card.style.zIndex = zIndex;
            card.style.opacity = opacity;
            card.style.pointerEvents = offset === 0 ? 'auto' : 'none';
        });
    }

    nextBtn.addEventListener('click', () => {
        activeIndex = (activeIndex + 1) % totalCards;
        renderWheel();
    });

    prevBtn.addEventListener('click', () => {
        activeIndex = (activeIndex - 1 + totalCards) % totalCards;
        renderWheel();
    });

    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY > 0) {
            activeIndex = (activeIndex + 1) % totalCards;
        } else {
            activeIndex = (activeIndex - 1 + totalCards) % totalCards;
        }
        renderWheel();
    }, { passive: false });

    renderWheel();
});
document.addEventListener('DOMContentLoaded', () => {
    // Select all card stack containers on the page
    const stacks = document.querySelectorAll('.card-stack');

    stacks.forEach(stack => {
        /**
         * Re-assigns positional classes (pos-0, pos-1, pos-2, etc.)
         * based on current DOM node order inside the stack.
         */
        function updateStackPositions() {
            const currentCards = Array.from(stack.querySelectorAll('.card'));
            currentCards.forEach((card, index) => {
                // Strip out previous pos-* classes
                card.className = card.className.replace(/\bpos-\d+/g, '').trim();
                // Assign new position class (pos-0 is top, higher numbers go further back)
                card.classList.add(`pos-${index}`);
            });
        }

        // Initialize positions based on starting HTML order
        updateStackPositions();

        // Single click event listener on the entire stack container
        stack.addEventListener('click', (e) => {
            const currentCards = Array.from(stack.querySelectorAll('.card'));
            if (currentCards.length < 2) return;

            const topCard = currentCards[0];

            // 1. Add shuffle animation class to slide out the current top card
            topCard.classList.add('shuffling');

            // 2. Wait for slide transition, then append top card to the back of the DOM stack
            setTimeout(() => {
                stack.appendChild(topCard);

                // Reset shuffling class and refresh layer ordering
                topCard.classList.remove('shuffling');
                updateStackPositions();
            }, 220); // Matches CSS transition duration
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Select the featured deck container on page load
    const featuredDeck = document.querySelector('.card-stack-container.featured-deck');
    
    if (featuredDeck) {
        // Ensure it is visually at the top layer
        featuredDeck.style.zIndex = '100';
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Existing Deck Click & Swap Logic
    // ----------------------------------------------------
    const stacks = document.querySelectorAll('.card-stack');

    stacks.forEach(stack => {
        function updateStackPositions() {
            const currentCards = Array.from(stack.querySelectorAll('.card'));
            currentCards.forEach((card, index) => {
                card.className = card.className.replace(/\bpos-\d+/g, '').trim();
                card.classList.add(`pos-${index}`);
            });
        }

        updateStackPositions();

        stack.addEventListener('click', () => {
            const currentCards = Array.from(stack.querySelectorAll('.card'));
            if (currentCards.length < 2) return;

            const topCard = currentCards[0];
            topCard.classList.add('shuffling');

            setTimeout(() => {
                stack.appendChild(topCard);
                topCard.classList.remove('shuffling');
                updateStackPositions();
            }, 250);
        });
    });

    // ----------------------------------------------------
    // 2. Scroll Observer to Spread Cards in Viewport Center
    // ----------------------------------------------------
    const observerOptions = {
        root: null, // Default viewport
        rootMargin: '0px -35% 0px -35%', // Active zone restricted to middle 30% of screen width
        threshold: 0.5
    };

    const centerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const container = entry.target;
            if (entry.isIntersecting) {
                container.classList.add('is-centered');
            } else {
                container.classList.remove('is-centered');
            }
        });
    }, observerOptions);

    // Observe all stack containers on the page
    const allContainers = document.querySelectorAll('.card-stack-container, .card-stack-container1');
    allContainers.forEach(container => centerObserver.observe(container));
});