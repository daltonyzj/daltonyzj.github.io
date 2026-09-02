//document elements

const title = document.getElementById("title");
const strainButton = document.getElementById("strain-toggle-btn");
const jointButton = document.getElementById("joint-toggle-btn");

const stressItems = document.querySelectorAll(".stress");
const strainItems = document.querySelectorAll(".strain");

//stress elements
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
const mSPosLabel = document.getElementById("minor-S-pos-label");
const mSNegLabel = document.getElementById("minor-S-neg-label");
const jStressLabel = document.getElementById("J-stress-label");
const jShearLabel = document.getElementById("J-shear-label");

const pValue = document.getElementById("P-value");
const qValue = document.getElementById("Q-value");
const sPosValue = document.getElementById("S-pos-value");
const sNegValue = document.getElementById("S-neg-value");

const pAngle = document.getElementById("P-angle");
const qAngle = document.getElementById("Q-angle");
const sPosAngle = document.getElementById("S-pos-angle");
const sNegAngle = document.getElementById("S-neg-angle");
const sAngleHide = document.querySelectorAll(".to-hide");

const jStress = document.getElementById("J-stress-value");
const jShear = document.getElementById("J-shear-value");

const elementXLabel = document.getElementById("element-x-label");
const elementYLabel = document.getElementById("element-y-label");
const elementTLabel = document.getElementById("element-t-label");
const elementJLabel = document.getElementById("element-j-label");

const jointMenu = document.getElementById("joint-menu");
const sliderJBox = document.getElementById("joint-slider-box");

const xAxisLabel = document.getElementById("x-axis-label");
const yAxisLabel = document.getElementById("y-axis-label");

//strain elements
const slider1 = document.getElementById("strain-1-slider");
const input1 = document.getElementById("strain-1");
const slider2 = document.getElementById("strain-2-slider");
const input2 = document.getElementById("strain-2");
const slider3 = document.getElementById("strain-3-slider");
const input3 = document.getElementById("strain-3");
const slider4 = document.getElementById("gauge-4-slider");
const input4 = document.getElementById("gauge-4");

const rosetteButton = document.getElementById("rosette-toggle-btn");

const strain1Point = document.getElementById("strain-1-point");
const strain2Point = document.getElementById("strain-2-point");
const strain3Point = document.getElementById("strain-3-point");
const strain4Point = document.getElementById("strain-4-point");

const strainConnectors = document.getElementById("strain-connectors");

const strainGaugeRosette = document.getElementById("strain-gauge-rosette");
const rosetteGauge1 = document.getElementById("sgauge-1");
const rosetteGauge2 = document.getElementById("sgauge-2");
const rosetteGauge3 = document.getElementById("sgauge-3");
const gaugeConnector = document.getElementById("gauge-connector");




//all global variables!!!!!!!!!!!!!

//stress values
let stressX, stressY, shear, jointAngle;
let stressP, stressQ, maxShear;
let center, radius;
let baseAngle;
let scalingFactor;
let yAxisValue;
let jointStress, jointShear;
let maxShearAngle;

let drawJoint = true;
let isStressMode = true;

//strain values;

let strain1, strain2, strain3, angle4;
let strainP, strainQ;
let rosetteSetup = "rectangular";
let strainCenter, shear1, strainRadius, shear2, shear3;
let baseStrainAngle;
let strainScalingFactor;
let gaugeStrain, gaugeShear;


//functions

function linkSliderInput(slider, input) {
    slider.addEventListener('input', function () {
        input.value = Number(slider.value);
        onUpdate();
    });
    input.addEventListener('input', function () {
        slider.value = Number(input.value);
        onUpdate();
    })
}

function onUpdate() {

    //fetch values
    //stress values
    stressX = Number(inputX.value);
    stressY = Number(inputY.value);
    shear = Number(inputT.value);
    jointAngle = Number(inputJ.value) * Math.PI / 180; //angle in radians !!!!!!!!!!!!!!!

    //strain values
    strain1 = Number(input1.value);
    strain2 = Number(input2.value);
    strain3 = Number(input3.value);
    angle4 = Number(input4.value);

    if (isStressMode) {
        updateStressCircle()
    } else {
        updateStrainCircle();
    }
}

function updateStressCircle() {
    //computes values (except max shear)
    updateStaticText();

    center = 0.5 * (stressX + stressY);
    radius = Math.sqrt(shear ** 2 + (stressX - center) ** 2);

    stressP = center + radius;
    stressQ = center - radius;

    baseAngle = Math.atan(shear / (stressX - center));
    if (center > stressX) baseAngle += Math.PI;
    if (baseAngle > Math.PI) baseAngle = -(2 * Math.PI - baseAngle);

    if (baseAngle > 0) maxShearAngle = baseAngle - 0.5 * Math.PI;
    else maxShearAngle = Math.sign(-baseAngle - 0.5 * Math.PI) * (Math.PI - Math.sign(-baseAngle - 0.5 * Math.PI) * (-baseAngle - 0.5 * Math.PI));



    //drawing things
    plotPoint(stressX, shear, Vpoint);
    plotPoint(stressY, -shear, Hpoint);
    planeLine.setAttribute("d", `
        M ${getActualCoords(stressX, shear, true)}, ${getActualCoords(stressX, shear, false)}
        L ${getActualCoords(stressY, -shear, true)},${getActualCoords(stressY, -shear, false)}
    `);

    drawYAxis();
    drawElement(stressX, stressY, shear);
    drawOtherCircles();
    plotJoint();



    //labelling
    labelPoint(stressX, shear, `V(${stressX}, ${shear})`, vLabel, false);
    labelPoint(stressY, -shear, `H(${stressY}, ${-shear})`, hLabel, false);
    labelPoint(0, -10, `(${center},0)`, cLabel, true);
    labelPoint(80, -7, `${stressP.toFixed(2)} N/mm²`, pLabel, true);
    labelPoint(-80, -7, `${stressQ.toFixed(2)} N/mm²`, qLabel, true);
    labelPoint(Number(SposPoint.getAttribute("cx")), -Number(SposPoint.getAttribute("cy")) + 10, `${maxShear.toFixed(2)} N/mm²`, sPosLabel, true);
    labelPoint(Number(SnegPoint.getAttribute("cx")), -Number(SnegPoint.getAttribute("cy")) - 5, `${-maxShear.toFixed(2)} N/mm²`, sNegLabel, true);

    if (stressP * stressQ > 0) {
        labelPoint(0, 80 + 5, `${radius.toFixed(2)} N/mm²`, mSPosLabel, true);
        labelPoint(0, -80, `${-radius.toFixed(2)} N/mm²`, mSNegLabel, true);

        sPosAngle.textContent = "";
        sNegAngle.textContent = "";
        sAngleHide.forEach(element => {
            element.classList.add('hide');
        });

    } else {
        mSPosLabel.textContent = "";
        mSNegLabel.textContent = "";

        sAngleHide.forEach(element => {
            element.classList.remove('hide');
        });
        sPosAngle.textContent = `${(0.5 * maxShearAngle * 180 / Math.PI).toFixed(2)}`;
        sNegAngle.textContent = `${(-0.5 * Math.sign(maxShearAngle) * (Math.PI - Math.abs(maxShearAngle)) * 180 / Math.PI).toFixed(2)}`;
    }

    pValue.textContent = `${stressP.toFixed(2)}`;
    qValue.textContent = `${stressQ.toFixed(2)}`;
    sPosValue.textContent = `${maxShear.toFixed(2)}`;
    sNegValue.textContent = `${-maxShear.toFixed(2)}`;
    jStress.textContent = `${jointStress.toFixed(2)}`;
    jShear.textContent = `${jointShear.toFixed(2)}`;

    pAngle.textContent = `${(0.5 * baseAngle * 180 / Math.PI).toFixed(2)}`;
    qAngle.textContent = `${(-0.5 * Math.sign(baseAngle) * (Math.PI - Math.abs(baseAngle)) * 180 / Math.PI).toFixed(2)}`;


    if (drawJoint) jointButton.textContent = "Disable Joint";
    else jointButton.textContent = "Enable Joint";
}


function getActualCoords(X, Y, returnX) {
    let effScalingFactor, effRadius, effCenter;

    if (isStressMode) {
        effRadius = radius;
        effCenter = center;
        scalingFactor = radius / 80;
        effScalingFactor = scalingFactor;
    } else {
        effRadius = strainRadius;
        effCenter = strainCenter;
        strainScalingFactor = strainRadius / 80;
        effScalingFactor = strainScalingFactor;
    }

    if (returnX) return ((X - effCenter) / effScalingFactor);
    else return -Y / effScalingFactor;
}

function plotPoint(X, Y, pointID) {
    pointID.setAttribute("cx", getActualCoords(X, Y, true));
    pointID.setAttribute("cy", getActualCoords(X, Y, false));
}

function drawYAxis() {
    if (isStressMode) yAxisValue = -center / scalingFactor;
    else yAxisValue = -strainCenter / strainScalingFactor;
    const axisHeight = 100;
    let d;

    if (Math.abs(yAxisValue) <= 140) {
        d = `
        M ${yAxisValue}, ${axisHeight} L ${yAxisValue}, ${-axisHeight}
        L ${yAxisValue + 2}, ${-axisHeight + 4} M ${yAxisValue}, ${-axisHeight} L ${yAxisValue - 2}, ${-axisHeight + 4}
        `;
        labelPoint(yAxisValue, axisHeight + 5, yAxisLabel.textContent, yAxisLabel, true);
    }
    else {
        d = `
        M ${Math.sign(yAxisValue) * 180}, ${axisHeight} L ${Math.sign(yAxisValue) * 180}, ${-axisHeight}
        L ${Math.sign(yAxisValue) * 180 + 2}, ${-axisHeight + 4} M ${Math.sign(yAxisValue) * 180}, ${-axisHeight} L ${Math.sign(yAxisValue) * 180 - 2}, ${-axisHeight + 4}
        `;
        d += drawAxisSquiggle(Math.sign(yAxisValue) == -1);
        labelPoint(Math.sign(yAxisValue) * 180, axisHeight + 5, yAxisLabel.textContent, yAxisLabel, true);
    }

    if (yAxisValue > 140) xAxisArrow.setAttribute("d", '');
    else xAxisArrow.setAttribute("d", ` M 140, 0,  L 136,2 M 140, 0 L 136, -2`);

    yAxis.setAttribute("d", d);
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
    const angleRadius = 10;

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

    if (drawJoint) {
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

        if (inputJ.value >= 0 && inputJ.value <= 90) {
            d += `
                M ${topLeftCorner[0]}, ${bottomRightCorner[1] - angleRadius}
                A ${angleRadius}, ${angleRadius}, 0, 0, 1, ${topLeftCorner[0] + angleRadius * Math.sin(inputJ.value * Math.PI / 180)}, ${bottomRightCorner[1] - angleRadius * Math.cos(inputJ.value * Math.PI / 180)} 
            `;
        } else {
            d += `
                M ${topLeftCorner[0]}, ${topLeftCorner[1] + angleRadius}
                A ${angleRadius}, ${angleRadius}, 0, 0, 0, ${topLeftCorner[0] + angleRadius * Math.sin(-inputJ.value * Math.PI / 180)},  ${topLeftCorner[1] + angleRadius * Math.cos(-inputJ.value * Math.PI / 180)} 
            `;
        }
    }

    elementStresses.setAttribute("d", d);

    if (stressX != 0) labelPoint(bottomRightCorner[0] + 2 * offset + directLen, -0.5 * (topLeftCorner[1] + bottomRightCorner[1]) + 2, `${Math.abs(stressX)}`, elementXLabel, true);
    else elementXLabel.textContent = "";

    if (stressY != 0) labelPoint(0.5 * (topLeftCorner[0] + bottomRightCorner[0]), -(topLeftCorner[1] - 2 * offset - directLen) + 2, `${Math.abs(stressY)}`, elementYLabel, true);
    else elementYLabel.textContent = "";

    if (shear > 0) labelPoint(bottomRightCorner[0], -bottomRightCorner[1] - 5, `${Math.abs(shear)}`, elementTLabel, true);
    else if (shear < 0) labelPoint(bottomRightCorner[0], -topLeftCorner[1] + 9, `${Math.abs(shear)}`, elementTLabel, true);
    else elementTLabel.textContent = "";

    if (jointAngle >= 0) labelPoint(topLeftCorner[0] - 20, -bottomRightCorner[1] - 5, `${Math.abs(Number(inputJ.value))}°`, elementJLabel, true);
    else labelPoint(topLeftCorner[0] - 20, -topLeftCorner[1] + 10, `${Math.abs(Number(inputJ.value))}°`, elementJLabel, true);
}

function diametricCircle(x1, x2, returnC) {
    if (returnC) return 0.5 * (x1 + x2);
    else return 0.5 * Math.abs(x2 - x1);
}

function drawOtherCircles() { //also finds max shear
    if (stressP * stressQ > 0) {
        maxShear = 0.5 * Math.max(Math.abs(stressP), Math.abs(stressQ));

        if (stressP > 0) {
            majorCircle.setAttribute("cx", diametricCircle(yAxisValue, 80, true));
            majorCircle.setAttribute("r", diametricCircle(yAxisValue, 80, false));

            minorCircle.setAttribute("cx", diametricCircle(yAxisValue, -80, true));
            minorCircle.setAttribute("r", diametricCircle(yAxisValue, -80, false));

            SposPoint.setAttribute("cx", diametricCircle(yAxisValue, 80, true));
            SposPoint.setAttribute("cy", -diametricCircle(yAxisValue, 80, false));

            SnegPoint.setAttribute("cx", diametricCircle(yAxisValue, 80, true));
            SnegPoint.setAttribute("cy", diametricCircle(yAxisValue, 80, false));
        } else {
            majorCircle.setAttribute("cx", diametricCircle(yAxisValue, -80, true));
            majorCircle.setAttribute("r", diametricCircle(yAxisValue, -80, false));

            minorCircle.setAttribute("cx", diametricCircle(yAxisValue, 80, true));
            minorCircle.setAttribute("r", diametricCircle(yAxisValue, 80, false));

            SposPoint.setAttribute("cx", diametricCircle(yAxisValue, -80, true));
            SposPoint.setAttribute("cy", -diametricCircle(yAxisValue, -80, false));

            SnegPoint.setAttribute("cx", diametricCircle(yAxisValue, -80, true));
            SnegPoint.setAttribute("cy", diametricCircle(yAxisValue, -80, false));
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
}

function plotJoint() { //also finds joint stresses
    if (drawJoint) {

        let effectiveYAxis = yAxisValue;
        if (Math.abs(yAxisValue) >= 140) effectiveYAxis = Math.sign(yAxisValue) * 180;

        jointStress = radius * Math.cos(baseAngle - 2 * jointAngle) + center;
        jointShear = radius * Math.sin(baseAngle - 2 * jointAngle)

        let actualX = getActualCoords(jointStress, jointShear, true);
        let actualY = getActualCoords(jointStress, jointShear, false);

        Jpoint.classList.remove("hide");
        jointLines.classList.remove("hide");
        jointMenu.classList.remove("hide");
        sliderJBox.classList.remove("hide");
        jStressLabel.classList.remove("hide");
        jShearLabel.classList.remove("hide");

        Jpoint.setAttribute("cx", actualX);
        Jpoint.setAttribute("cy", actualY);

        jointLines.setAttribute("d", `
            M 0, 0
            L ${actualX},${actualY}
            L ${actualX}, 0
            M ${actualX},${actualY}
            L ${effectiveYAxis}, ${actualY}
        `);

        labelPoint(actualX, 12, `${jointStress.toFixed(2)} N/mm²`, jStressLabel, true);
        if (effectiveYAxis > 0) labelPoint(effectiveYAxis, -actualY - 5, `${jointShear.toFixed(2)} N/mm²`, jShearLabel, true);
        else labelPoint(effectiveYAxis - 60, -actualY - 5, `${jointShear.toFixed(2)} N/mm²`, jShearLabel, true);
    } else {
        Jpoint.classList.add("hide");
        jointLines.classList.add("hide");
        jointMenu.classList.add("hide");
        sliderJBox.classList.add("hide");
        jStressLabel.classList.add("hide");
        jShearLabel.classList.add("hide");
    }
}

function labelPoint(x, y, content, labelID, override) {
    if (!override) {
        labelID.setAttribute("x", getActualCoords(x, y, true) + 5);
        labelID.setAttribute("y", getActualCoords(x, y, false) + 5);
    } else {
        labelID.setAttribute("x", x + 5);
        labelID.setAttribute("y", -y + 5);
    }

    labelID.textContent = content;
}

function toggleStressStrainHides() {
    if (isStressMode) {
        stressItems.forEach(element => { element.classList.remove('hide') });
        strainItems.forEach(element => { element.classList.add('hide') });
    }
    else {
        stressItems.forEach(element => { element.classList.add('hide') });
        strainItems.forEach(element => { element.classList.remove('hide') });
    }
}

function updateStrainCircle() {
    updateStaticText();

    //calculate things
    if (rosetteSetup === "rectangular") {
        strainCenter = 0.5 * (strain1 + strain3);
        shear1 = -2 * strain2 + strain1 + strain3;
    } else if (rosetteSetup === "delta") {
        strainCenter = 0.5 * (strain1 + (2 * (strain2 + strain3) - strain1) / 3);
        shear1 = -2 / Math.sqrt(3) * (strain3 - strain2);
    } else if (rosetteSetup === "star") {
        strainCenter = 0.5 * (strain1 + (2 * (strain2 + strain3) - strain1) / 3);
        shear1 = -2 / Math.sqrt(3) * (strain3 - strain2);
    }
    strainRadius = Math.sqrt((0.5 * shear1) ** 2 + (strain1 - strainCenter) ** 2);

    baseStrainAngle = Math.atan(0.5 * shear1 / (strain1 - strainCenter));
    if (strainCenter > strain1) baseStrainAngle += Math.PI;
    if (baseStrainAngle > Math.PI) baseStrainAngle = -(2 * Math.PI - baseStrainAngle);

    //draw things
    plotPoint(strain1, 0.5 * shear1, strain1Point);

    if (rosetteSetup === "rectangular") {
        shear2 = drawStrainPoint(strain2, shear2, -0.5 * Math.PI, strain2Point);
        shear3 = drawStrainPoint(strain3, shear3, -Math.PI, strain3Point);
    } else {
        shear2 = drawStrainPoint(strain2, shear2, 2 / 3 * Math.PI, strain2Point);
        shear3 = drawStrainPoint(strain3, shear3, -2 / 3 * Math.PI, strain3Point);
        console.log(rosetteSetup);
    }
    drawStrainConnectors();
    drawYAxis();
    drawRosette();
    drawExtraGauge();

}

function drawStrainPoint(strain, shearStrain, angle, pointID) {
    strain = strainRadius * Math.cos(baseStrainAngle - angle) + strainCenter;
    shearStrain = 2 * strainRadius * Math.sin(baseStrainAngle - angle);

    plotPoint(strain, 0.5 * shearStrain, pointID);
    return shearStrain;
}

function updateStaticText() {
    if (isStressMode) {
        title.textContent = "Mohr's Stress Circle";
        jointButton.textContent = "Disable Joint";
        strainButton.textContent = "Toggle to Strain";
        xAxisLabel.textContent = "+σ";
        yAxisLabel.textContent = "+𝜏";
    } else {
        title.textContent = "Mohr's Strain Circle";
        jointButton.textContent = "Disable Extra Gauge";
        strainButton.textContent = "Toggle to Stress";
        xAxisLabel.textContent = "+ε x 10⁻⁶";
        yAxisLabel.textContent = "+½𝜙x 10⁻⁶"
    }

}

function toggleRosette() {
    if (rosetteSetup === "rectangular") rosetteSetup = "delta";
    else if (rosetteSetup === "delta") rosetteSetup = "star";
    else if (rosetteSetup === "star") rosetteSetup = "rectangular";
    onUpdate();
}

function drawStrainConnectors() {
    let d = ``;
    const strains = [strain1, strain2, strain3];
    const shearStrains = [shear1, shear2, shear3];
    const vLineHeight = 90;

    for (let i = 0; i < 3; i++) {
        d += `
            M 0, 0
            L ${getActualCoords(strains[i], 0.5 * shearStrains[i], true)}, ${getActualCoords(strains[i], 0.5 * shearStrains[i], false)}
        `;
        d += `
            M ${getActualCoords(strains[i], 0.5 * shearStrains[i], true)}, ${-vLineHeight}
            L ${getActualCoords(strains[i], 0.5 * shearStrains[i], true)}, ${vLineHeight}
        `;
    }
    console.log(d);
    strainConnectors.setAttribute("d", d);
}

function drawRosette() {
    const gaugeLength = 45;
    let d = "", d1 = "", d2 = "", d3 = "";
    if (rosetteSetup === "rectangular") {
        d += `
            M -220, -120
            v ${-gaugeLength}
            m 0, ${gaugeLength}
            h ${gaugeLength}
            m ${-gaugeLength}, 0
            l ${gaugeLength - 5}, ${-gaugeLength + 5}
        `;

        d1 += `
            M -220, -120
            m ${0.3 * gaugeLength}, 0
            h ${0.4 * gaugeLength}
        `;

        d2 += `
            M -220 -120
            m ${0.3 * gaugeLength}, ${-0.3 * gaugeLength}
            l ${0.32 * gaugeLength}, ${-0.32 * gaugeLength}
        `;

        d3 += `
            M -220 -120
            m 0, ${-0.3 * gaugeLength}
            v ${-0.4 * gaugeLength}
        `;
    } else if (rosetteSetup === "delta") {
        d += `
            M -220, -120
            h ${gaugeLength}
            l ${-0.5 * gaugeLength}, ${-Math.sqrt(3) / 2 * gaugeLength}
            z
        `;

        d1 += `
            M -220, -120
            m ${0.3 * gaugeLength}, 0
            h ${0.4 * gaugeLength}
        `;

        d2 += `
            M -220, -120
            m ${0.85 * gaugeLength}, ${-0.3 * Math.sqrt(3) / 2 * gaugeLength}
            l ${-0.2 * gaugeLength}, ${-0.4 * Math.sqrt(3) / 2 * gaugeLength}
        `;

        d3 += `
            M -220, -120
            m ${0.15 * gaugeLength}, ${-0.3 * Math.sqrt(3) / 2 * gaugeLength}
            l ${0.2 * gaugeLength}, ${-0.4 * Math.sqrt(3) / 2 * gaugeLength}
        `;
    } else {
        d += `
            M -195, -130
            v ${-gaugeLength}
            M -195, -130
            l ${Math.sqrt(3) / 2 * gaugeLength}, ${0.5 * gaugeLength}
            M -195, -130
            l ${-Math.sqrt(3) / 2 * gaugeLength}, ${0.5 * gaugeLength}
        `;

        d1 += `
            M -195, -130
            m 0, ${-0.3 * gaugeLength}
            v ${-0.4 * gaugeLength}
        `;

        d2 += `
            M -195, -130
            m ${-0.3 * Math.sqrt(3) / 2 * gaugeLength}, ${0.15 * gaugeLength}
            l ${-0.4 * Math.sqrt(3) / 2 * gaugeLength}, ${0.2 * gaugeLength} 
        `;

        d3 += `
            M -195, -130
            m ${0.3 * Math.sqrt(3) / 2 * gaugeLength}, ${0.15 * gaugeLength}
            l ${0.4 * Math.sqrt(3) / 2 * gaugeLength}, ${0.2 * gaugeLength} 
        `;
    }

    strainGaugeRosette.setAttribute("d", d);
    rosetteGauge1.setAttribute("d", d1);
    rosetteGauge2.setAttribute("d", d2);
    rosetteGauge3.setAttribute("d", d3);
}

function drawExtraGauge() {
    gaugeAngle = Number(input4.value) * Math.PI / 180;

    let effectiveYAxis = yAxisValue;
    if (Math.abs(yAxisValue) >= 140) effectiveYAxis = Math.sign(yAxisValue) * 180;

    gaugeStrain = strainRadius * Math.cos(baseStrainAngle - 2 * gaugeAngle) + strainCenter;
    gaugeShear = 2 * strainRadius * Math.sin(baseStrainAngle - 2 * gaugeAngle);

    let actualX = getActualCoords(gaugeStrain, 0.5 * gaugeShear, true);
    let actualY = getActualCoords(gaugeStrain, 0.5 * gaugeShear, false);

    strain4Point.setAttribute("cx", actualX);
    strain4Point.setAttribute("cy", actualY);

    gaugeConnector.setAttribute("d", `
        M 0, 0
        L ${actualX},${actualY}
        L ${actualX}, 0
        M ${actualX},${actualY}
        L ${effectiveYAxis}, ${actualY}
    `);

}







//actual executed code

document.addEventListener("DOMContentLoaded", function () {
    onUpdate();
    toggleStressStrainHides();
})

linkSliderInput(sliderX, inputX);
linkSliderInput(sliderY, inputY);
linkSliderInput(sliderT, inputT);
linkSliderInput(sliderJ, inputJ);
linkSliderInput(slider1, input1);
linkSliderInput(slider2, input2);
linkSliderInput(slider3, input3);
linkSliderInput(slider4, input4);

jointButton.addEventListener("click", function () {
    drawJoint = !drawJoint;
    onUpdate();
});

strainButton.addEventListener("click", function () {
    isStressMode = !isStressMode;
    onUpdate();
    toggleStressStrainHides();
});

rosetteButton.addEventListener("click", function () {
    toggleRosette();
});

