class Fora {
    constructor(first) {
        const tab_main = document.getElementById("tab_main");

        if (first) {
            var fora = document.getElementById("fora1");
            this.clearFora(fora);
            for (var i = 0; i < num_peças; i++) {
                const peça = document.createElement("div");
                peça.setAttribute("class", "peça j1");
                peça.setAttribute("id", "j1" + (i + 1));
                peça.setAttribute("draggable", "true");
                peça.setAttribute("ondragstart", "drag(event)");
                fora.appendChild(peça);
            }
        } else {
            var fora = document.getElementById("fora2");
            this.clearFora(fora);
            for (var i = 0; i < num_peças; i++) {
                const peça = document.createElement("div");
                peça.setAttribute("class", "peça j2");
                peça.setAttribute("id", "j2" + (i + 1));
                peça.setAttribute("draggable", "true");
                peça.setAttribute("ondragstart", "drag(event)");
                fora.appendChild(peça);
            }
        }
    }

    clearFora(fora) {
        while (fora.firstChild) {
            fora.removeChild(fora.firstChild);
        }
    }
}