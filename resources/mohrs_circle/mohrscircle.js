const sliderX = document.getElementById("stress-x-slider");
const inputX = document.getElementById("stress-x");

const sliderY = document.getElementById("stress-y-slider");
const inputY = document.getElementById("stress-y");

const sliderT = document.getElementById("shear-slider");
const inputT = document.getElementById("shear");

const sliderJ = document.getElementById("joint-slider");
const inputJ = document.getElementById("joint");

const Vpoint = document.getElementById("V-point");
const Hpoint = document.getElementById("H-point");
const SposPoint = document.getElementById("S-pos-point");
const SnegPoint = document.getElementById("S-neg-point");
const Jpoint = document.getElementById("J-point");
const planeLine = document.getElementById("plane-connector");
const jointLines = document.getElementById("joint-connector");
const yAxis = document.getElementById("yAxis");
const xAxisArrow = document.getElementById("xAxisArrow");
const element = document.getElementById("element");
const elementStresses = document.getElementById("element-stresses");
const minorCircle = document.getElementById("minor-circle");
const majorCircle = document.getElementById("major-circle");

const vLabel = document.getElementById("V-label");
const hLabel = document.getElementById("H-label");
const pLabel = document.getElementById("P-label");
const qLabel = document.getElementById("Q-label");
const sPosLabel = document.getElementById("S-pos-label");
const sNegLabel = document.getElementById("S-neg-label");
const cLabel = document.getElementById("C-label");

const title = document.getElementById("title");
const strainButton = document.getElementById("strain-toggle-btn");


let radius;
let center;

function linkSliderInput(slider, input) {
    slider.addEventListener('input', function () {
        input.value = Number(slider.value);
        updateValues();
    });
    input.addEventListener('input', function () {
        slider.value = Number(input.value);
        updateValues();
    })
}

function updateValues() {
    let stressX = Number(inputX.value);
    let stressY = Number(inputY.value);
    let shear = Number(inputT.value);

    center = 0.5 * (stressX + stressY);
    radius = Math.sqrt(shear ** 2 + (stressX - center) ** 2);

    let stressP = center + radius;
    let stressQ = center - radius;
    let maxShear;

    let k = -80 / radius * center;

    plotPoint(stressX, shear, Vpoint);
    plotPoint(stressY, -shear, Hpoint);

    planeLine.setAttribute("d",
        `M ${getActualPoint(stressX, shear, true)}, ${getActualPoint(stressX, shear, false)} 
        L ${getActualPoint(stressY, -shear, true)}, ${getActualPoint(stressY, -shear, false)}
        `
    );
    drawYAxis(yAxis);
    drawElement(stressX, stressY, shear);

    if (stressP * stressQ > 0) {
        maxShear = 0.5 * Math.max(Math.abs(stressP), Math.abs(stressQ));

        if (stressP > 0) {
            majorCircle.setAttribute("cx", diametricCircle(k, 80, true));
            majorCircle.setAttribute("r", diametricCircle(k, 80, false));

            minorCircle.setAttribute("cx", diametricCircle(k, -80, true));
            minorCircle.setAttribute("r", diametricCircle(k, -80, false));

            SposPoint.setAttribute("cx", diametricCircle(k, 80, true));
            SposPoint.setAttribute("cy", -diametricCircle(k, 80, false));

            SnegPoint.setAttribute("cx", diametricCircle(k, 80, true));
            SnegPoint.setAttribute("cy", diametricCircle(k, 80, false));
        } else {
            majorCircle.setAttribute("cx", diametricCircle(k, -80, true));
            majorCircle.setAttribute("r", diametricCircle(k, -80, false));

            minorCircle.setAttribute("cx", diametricCircle(k, 80, true));
            minorCircle.setAttribute("r", diametricCircle(k, 80, false));

            SposPoint.setAttribute("cx", diametricCircle(k, -80, true));
            SposPoint.setAttribute("cy", -diametricCircle(k, -80, false));

            SnegPoint.setAttribute("cx", diametricCircle(k, -80, true));
            SnegPoint.setAttribute("cy", diametricCircle(k, -80, false));
        }

    } else {
        minorCircle.setAttribute("r", 0);
        majorCircle.setAttribute("r", 0);

        SposPoint.setAttribute("cx", 0);
        SposPoint.setAttribute("cy", -80);

        SnegPoint.setAttribute("cx", 0);
        SnegPoint.setAttribute("cy", 80);

        maxShear = radius;
    }

    plotJoint(stressX, shear, center, radius);


    labelPoint(getActualPoint(stressX, shear, true), getActualPoint(stressX, shear, false), `V(${stressX}, ${shear})`, vLabel);
    labelPoint(getActualPoint(stressY, -shear, true), getActualPoint(stressY, -shear, false), `H(${stressY}, ${-shear})`, hLabel);
    labelPoint(getActualPoint(stressP, 0, true), getActualPoint(stressP, 0, false) + 8, `${stressP.toFixed(2)} N/mm²`, pLabel);
    labelPoint(getActualPoint(stressQ, 0, true), getActualPoint(stressQ, 0, false) + 8, `${stressQ.toFixed(2)} N/mm²`, qLabel);
    labelPoint(Number(SposPoint.getAttribute("cx")), Number(SposPoint.getAttribute("cy") - 10), `${maxShear.toFixed(2)} N/mm²`, sPosLabel);
    labelPoint(Number(SnegPoint.getAttribute("cx")), Number(SnegPoint.getAttribute("cy")) + 10, `${-maxShear.toFixed(2)} N/mm²`, sNegLabel);
    labelPoint(0, -10, `(${center},0)`, cLabel);
}

function getActualPoint(X, Y, returnX) {
    let ratio = radius / 80;
    if (returnX) return ((X - center) / ratio);
    else return -Y / ratio;
}

function plotPoint(X, Y, pointID) {
    if (X === 0 && Y === 0) pointID.setAttribute("cy", 10000);

    pointID.setAttribute("cx", getActualPoint(X, Y, true));
    pointID.setAttribute("cy", getActualPoint(X, Y, false));
}



function drawYAxis(axisID) {
    let k = -80 / radius * center;
    const axisHeight = 100;
    let d;

    if (Math.abs(k) <= 140) {
        d = `M ${k}, ${axisHeight} L ${k}, ${-axisHeight}`;
        d += `L ${k + 2}, ${-axisHeight + 4} M ${k}, ${-axisHeight} L ${k - 2}, ${-axisHeight + 4}`;
    }
    else {
        d = `M ${Math.sign(k) * 180}, ${axisHeight} L ${Math.sign(k) * 180}, ${-axisHeight}`;
        d += `L ${Math.sign(k) * 180 + 2}, ${-axisHeight + 4} M ${Math.sign(k) * 180}, ${-axisHeight} L ${Math.sign(k) * 180 - 2}, ${-axisHeight + 4}`
        d += drawAxisSquiggle(Math.sign(k) == -1);
    }

    if (k > 140) xAxisArrow.setAttribute("d", '');
    else xAxisArrow.setAttribute("d", ` M 140, 0,  L 136,2 M 140, 0 L 136, -2`);

    axisID.setAttribute("d", d);
}

function drawAxisSquiggle(onLeft) {
    if (onLeft) return `M -140, 0 L -150, 0 L -155,10 L -165,-10 L -170,0 L -180, 0`;
    else return `M 140, 0 L 150, 0 L 155,10 L 165,-10 L 170,0 L 180, 0`;
}


function drawElement(X, Y, T) {
    const topLeftCorner = [Number(element.getAttribute("x")), Number(element.getAttribute("y"))];
    const bottomRightCorner = [topLeftCorner[0] + Number(element.getAttribute("width")), topLeftCorner[1] + Number(element.getAttribute("height"))];
    const offset = 4;
    const directLen = 15;

    let d = '';
    if (T != 0) {
        d += `M ${topLeftCorner[0] - offset}, ${topLeftCorner[1]} 
            L ${topLeftCorner[0] - offset}  ${bottomRightCorner[1]} 
            M ${bottomRightCorner[0] + offset}, ${topLeftCorner[1]} 
            L ${bottomRightCorner[0] + offset} ${bottomRightCorner[1]}
            M ${topLeftCorner[0]}, ${topLeftCorner[1] - offset}
            L ${bottomRightCorner[0]}, ${topLeftCorner[1] - offset}
            M ${topLeftCorner[0]}, ${bottomRightCorner[1] + offset}
            L ${bottomRightCorner[0]}, ${bottomRightCorner[1] + offset}
            `;
        if (T > 0) {
            d += `M ${bottomRightCorner[0] + offset} ${bottomRightCorner[1]}
             L ${bottomRightCorner[0] + offset + 3} ${bottomRightCorner[1] - 8}`; //3 x 8 arrow
            d += `M ${topLeftCorner[0] - offset}, ${topLeftCorner[1]}
             L ${topLeftCorner[0] - offset - 3}, ${topLeftCorner[1] + 8}`;
            d += `M ${topLeftCorner[0]}, ${topLeftCorner[1] - offset}
             L ${topLeftCorner[0] + 8}, ${topLeftCorner[1] - offset - 3}`;
            d += `M ${bottomRightCorner[0]}, ${bottomRightCorner[1] + offset}
             L ${bottomRightCorner[0] - 8}, ${bottomRightCorner[1] + offset + 3}`;
        } else {
            d += `M ${bottomRightCorner[0] + offset}, ${topLeftCorner[1]}
            L ${bottomRightCorner[0] + offset + 3}, ${topLeftCorner[1] + 8}`;
            d += `M ${topLeftCorner[0] - offset}  ${bottomRightCorner[1]}
            L ${topLeftCorner[0] - offset - 3}  ${bottomRightCorner[1] - 8}`;
            d += `M ${bottomRightCorner[0]}, ${topLeftCorner[1] - offset}
            L ${bottomRightCorner[0] - 8}, ${topLeftCorner[1] - offset - 3}`;
            d += `M ${topLeftCorner[0]}, ${bottomRightCorner[1] + offset}
            L ${topLeftCorner[0] + 8}, ${bottomRightCorner[1] + offset + 3}`;
        }
    }
    if (X != 0) {
        d += `
            M ${bottomRightCorner[0] + 2 * offset}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1])}
            L ${bottomRightCorner[0] + 2 * offset + directLen}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1])}       
            M ${topLeftCorner[0] - 2 * offset}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1])}
            L ${topLeftCorner[0] - 2 * offset - directLen}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1])}      
        `;
        if (X > 0) {
            d += `
                M ${bottomRightCorner[0] + 2 * offset + directLen - 8}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1]) - 3}
                L ${bottomRightCorner[0] + 2 * offset + directLen}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1])}
                L ${bottomRightCorner[0] + 2 * offset + directLen - 8}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1]) + 3}

                M ${topLeftCorner[0] - 2 * offset - directLen + 8}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1]) - 3}
                L ${topLeftCorner[0] - 2 * offset - directLen}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1])}
                L ${topLeftCorner[0] - 2 * offset - directLen + 8}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1]) + 3}
            `;
        } else {
            d += `
                M ${bottomRightCorner[0] + 2 * offset + 8}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1]) - 3}
                L ${bottomRightCorner[0] + 2 * offset}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1])}
                L ${bottomRightCorner[0] + 2 * offset + 8}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1]) + 3}

                M ${topLeftCorner[0] - 2 * offset - 8}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1]) - 3}
                L ${topLeftCorner[0] - 2 * offset}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1])}
                L ${topLeftCorner[0] - 2 * offset - 8}, ${0.5 * (topLeftCorner[1] + bottomRightCorner[1]) + 3}
            `;
        }
    }
    if (Y != 0) {
        d += `
            M ${0.5 * (topLeftCorner[0] + bottomRightCorner[0])}, ${topLeftCorner[1] - 2 * offset}
            L ${0.5 * (topLeftCorner[0] + bottomRightCorner[0])}, ${topLeftCorner[1] - 2 * offset - directLen}
            M ${0.5 * (topLeftCorner[0] + bottomRightCorner[0])}, ${bottomRightCorner[1] + 2 * offset}
            L ${0.5 * (topLeftCorner[0] + bottomRightCorner[0])}, ${bottomRightCorner[1] + 2 * offset + directLen}
        `;
        if (Y > 0) {
            d += `
                M ${0.5 * (topLeftCorner[0] + bottomRightCorner[0]) - 3}, ${topLeftCorner[1] - 2 * offset - directLen + 8}
                L ${0.5 * (topLeftCorner[0] + bottomRightCorner[0])}, ${topLeftCorner[1] - 2 * offset - directLen}
                L ${0.5 * (topLeftCorner[0] + bottomRightCorner[0]) + 3}, ${topLeftCorner[1] - 2 * offset - directLen + 8}

                M ${0.5 * (topLeftCorner[0] + bottomRightCorner[0]) - 3}, ${bottomRightCorner[1] + 2 * offset + directLen - 8}
                L ${0.5 * (topLeftCorner[0] + bottomRightCorner[0])}, ${bottomRightCorner[1] + 2 * offset + directLen}
                L ${0.5 * (topLeftCorner[0] + bottomRightCorner[0]) + 3}, ${bottomRightCorner[1] + 2 * offset + directLen - 8}
            `;
        } else {
            d += `
                M ${0.5 * (topLeftCorner[0] + bottomRightCorner[0]) + 3}, ${topLeftCorner[1] - 2 * offset - 8}
                L ${0.5 * (topLeftCorner[0] + bottomRightCorner[0])}, ${topLeftCorner[1] - 2 * offset}
                L ${0.5 * (topLeftCorner[0] + bottomRightCorner[0]) - 3}, ${topLeftCorner[1] - 2 * offset - 8}

                M ${0.5 * (topLeftCorner[0] + bottomRightCorner[0]) + 3}, ${bottomRightCorner[1] + 2 * offset + 8}
                L ${0.5 * (topLeftCorner[0] + bottomRightCorner[0])}, ${bottomRightCorner[1] + 2 * offset}
                L ${0.5 * (topLeftCorner[0] + bottomRightCorner[0]) - 3}, ${bottomRightCorner[1] + 2 * offset + 8}
            `;
        }
    }

    if (inputJ.value >= 0 && inputJ.value <= 45) {
        d += `
            M ${topLeftCorner[0]},${bottomRightCorner[1]}
            L ${topLeftCorner[0] + Math.tan(inputJ.value * Math.PI / 180) * Number(element.getAttribute("width"))}, ${topLeftCorner[1]}
        `;
    } else if (inputJ.value >= 45 && inputJ.value <= 90) {
        d += `
            M ${topLeftCorner[0]},${bottomRightCorner[1]}
            L ${bottomRightCorner[0]}, ${bottomRightCorner[1] - Math.tan((90 - inputJ.value) * Math.PI / 180) * Number(element.getAttribute("width"))}
        `;
    } else if (inputJ.value >= -45 && inputJ.value <= 0) {
        d += `
            M ${topLeftCorner[0]}, ${topLeftCorner[1]}
            L ${topLeftCorner[0] - Math.tan(inputJ.value * Math.PI / 180) * Number(element.getAttribute("width"))}, ${bottomRightCorner[1]}
        `;
    } else {
        d += `
            M ${topLeftCorner[0]}, ${topLeftCorner[1]}
            L ${bottomRightCorner[0]}, ${topLeftCorner[1] + Math.tan((90 - Math.abs(inputJ.value)) * Math.PI / 180) * Number(element.getAttribute("width"))}
        `;
    }

    elementStresses.setAttribute("d", d);
}

function labelPoint(x, y, content, labelID) {
    labelID.setAttribute("x", x + 5);
    labelID.setAttribute("y", y + 5);
    labelID.textContent = content;
}

function diametricCircle(x1, x2, returnC) {
    if (returnC) return 0.5 * (x1 + x2);
    else return 0.5 * Math.abs(x2 - x1);
}

function plotJoint(stressX, shear, center, radius) {
    let jointAngle = Number(inputJ.value) * Math.PI / 180;
    let originalAngle = Math.atan(shear / (stressX - center));

    let actualX = getActualPoint(radius * Math.cos(originalAngle - 2 * jointAngle) + center, radius * Math.sin(originalAngle - 2 * jointAngle), true);
    let actualY = getActualPoint(radius * Math.cos(originalAngle - 2 * jointAngle) + center, radius * Math.sin(originalAngle - 2 * jointAngle), false);

    Jpoint.setAttribute("cx", actualX);
    Jpoint.setAttribute("cy", actualY);

    jointLines.setAttribute("d", `
        M 0, 0
        L ${actualX},${actualY}
        L ${actualX}, 0
        M ${actualX},${actualY}
        L 0, ${actualY}
    `);

}



function toggleLabel() {
    if (title.textContent === "Mohr's Stress Circle") {
        title.textContent = "Mohr's Strain Circle";
    } else {
        title.textContent = "Mohr's Stress Circle";
    }
}


//actual code

document.addEventListener("DOMContentLoaded", function () {
    updateValues();
})

linkSliderInput(sliderX, inputX);
linkSliderInput(sliderY, inputY);
linkSliderInput(sliderT, inputT);
linkSliderInput(sliderJ, inputJ);

strainButton.addEventListener("click", function () {
    toggleLabel();
})
