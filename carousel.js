const buttons = document.querySelectorAll(".carousel-btn");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const offset = button.classList.contains("next") ? 1 : -1;
        const slides = button.closest(".carousel").querySelectorAll(".slide");

        const activeSlide = button.closest(".carousel").querySelector("[data-active]");
        let newIndex = [...slides].indexOf(activeSlide) + offset;

        if (newIndex < 0) newIndex = slides.length - 1;
        if (newIndex >= slides.length) newIndex = 0;

        activeSlide.removeAttribute("data-active");
        slides[newIndex].setAttribute("data-active", true);
    });
});

//code by chatgpt sorry idk js