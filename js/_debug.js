import levels from "./levels";

let debug = true;
if (debug) {
    const select = document.querySelector("select");
    select.style.cssText = `
        position:absolute;
        left: 10px;
        bottom: 10px;
        z-index: 1000
    `;

    levels.forEach((el, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.innerHTML = `level ${i}`;
        select.append(option);
    })

    select.onchange = function() {
        levelSelect.style.display = "none";
        startLevel(select.value)
    }
}