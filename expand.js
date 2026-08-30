const cards = document.querySelectorAll(".card");
const overlay = document.querySelector(".card-overlay");

let expandedCard = null;
let originalRect = null;
let placeholder = null;

cards.forEach(card => {

    card.addEventListener("click", () => {

        if (expandedCard) return;

        originalRect = card.getBoundingClientRect();
        expandedCard = card;

        // Insert a placeholder in the card's exact grid spot
        placeholder = document.createElement("div");
        placeholder.className = "card-placeholder";
        placeholder.style.width = `${originalRect.width}px`;
        placeholder.style.height = `${originalRect.height}px`;
        card.parentNode.insertBefore(placeholder, card);

        card.classList.add("expanded");

        card.style.left = `${originalRect.left}px`;
        card.style.top = `${originalRect.top}px`;
        card.style.width = `${originalRect.width}px`;
        card.style.height = `${originalRect.height}px`;

        card.offsetHeight;

        requestAnimationFrame(() => {
            card.style.left = "10vw";
            card.style.top = "10vh";
            card.style.width = "80vw";
            card.style.height = "80vh";
        });

        overlay.classList.add("active");
    });
});

overlay.addEventListener("click", () => {

    if (!expandedCard || expandedCard.classList.contains("closing")) return;

    const card = expandedCard;

    // Phase 1: fade out text only
    card.classList.add("closing");

    setTimeout(() => {
        // Phase 2: shrink card + title together, at the same instant

        card.style.left = "10vw";
        card.style.top = "10vh";
        card.style.width = "80vw";
        card.style.height = "80vh";

        card.offsetHeight;

        card.classList.add("shrinking"); // triggers both at once

        requestAnimationFrame(() => {
            card.style.left = `${originalRect.left}px`;
            card.style.top = `${originalRect.top}px`;
            card.style.width = `${originalRect.width}px`;
            card.style.height = `${originalRect.height}px`;
        });

        overlay.classList.remove("active");

        setTimeout(() => {
            card.classList.remove("expanded", "closing", "shrinking");
            card.style.left = "";
            card.style.top = "";
            card.style.width = "";
            card.style.height = "";

            // Remove placeholder now that the real card is back in flow
            if (placeholder) {
                placeholder.remove();
                placeholder = null;
            }

            expandedCard = null;
            originalRect = null;

        }, 150);

    }, 80); // matches text fadeOut duration
});