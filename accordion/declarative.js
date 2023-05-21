(function () {
    function onAccordionClick() {
        this.classList.toggle("is-active");
        const body = this.querySelector(".accordion__body");
        if (body.style.maxHeight) {
            body.style.maxHeight = null;
        } else {
            body.style.maxHeight = body.scrollHeight + "px";
        }
    }

    function initialize() {
        const elements = document.querySelectorAll(".accordion");
        elements.forEach((element) => {
            element.addEventListener("click", onAccordionClick);
        });
    }

    window.addEventListener("load", initialize);
})();
