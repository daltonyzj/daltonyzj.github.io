const path = document.getElementById("curve");

let time = 0;

const steps = 200;


const N = 26;
const R = [4, 7.3, 8.9];
const Q = 2;
const T = 5.2;
const offsetX = 0.9;
const offsetY = -1.2;


function drawCurves(time) {
    let d = "";

    function ellipseX(R, Q, T, t) {
        return R * Math.cos(t) * Math.cos(T) - R * Q * Math.sin(t) * Math.sin(T);
    }

    function ellipseY(R, Q, T, t) {
        return -1 * (R * Math.cos(t) * Math.sin(T) + R * Q * Math.sin(t) * Math.cos(T));
    }

    function L(input) {
        return input * 2 * Math.PI / N + time;
    }

    function LS(input) {
        if (input % 2 === 0) return (input - 0.3) * 2 * Math.PI / N + time;
        else return (input + 0.3) * 2 * Math.PI / N + time;
    }

    for (let dim = 0; dim < 2; dim++) {

        let dimX = [0, offsetX];
        let dimY = [0, offsetY];

        for (let i = 0; i <= steps; i++) {

            const t = 0 + (2 * Math.PI) * i / steps;

            const x = ellipseX(R[0], Q, T, t) + dimX[dim];

            const y = ellipseY(R[0], Q, T, t) - dimY[dim];

            if (i === 0) {
                d += `M ${x} ${y}`;
            } else {
                d += ` L ${x} ${y}`;
            }
        }

        for (let k = 0; k <= N; k += 2) {
            for (let i = 0; i <= steps; i++) {

                const t = L(k) + (L(k + 1) - L(k)) * i / steps;

                const x = ellipseX(R[1], Q, T, t) + dimX[dim];

                const y = ellipseY(R[1], Q, T, t) - dimY[dim];

                if (i === 0) {
                    d += `M ${x} ${y}`;
                } else {
                    d += ` L ${x} ${y}`;
                }
            }
        }

        for (let k = 0; k <= N - 2; k += 2) {

            let R_picked = [R[1], R[2], R[2], R[1]];
            let vertex = [L(1 + k), LS(1 + k), LS(2 + k), L(2 + k)];

            for (let i = 0; i < 4; i++) {
                const x = ellipseX(R_picked[i], Q, T, vertex[i]) + dimX[dim];
                const y = ellipseY(R_picked[i], Q, T, vertex[i]) - dimY[dim];

                if (i === 0) {
                    d += `M ${x} ${y}`;
                } else {
                    d += ` L ${x} ${y}`;
                }
            }
        }
    }

    for (let k = 0; k < N; k++){
        d += `M ${ellipseX(R[1], Q, T, L(k))} ${ellipseY(R[1], Q, T, L(k))}`;
        d += `L ${ellipseX(R[1], Q, T, L(k)) + offsetX} ${ellipseY(R[1], Q, T, L(k)) - offsetY}`;

        d += `M ${ellipseX(R[2], Q, T, LS(k))} ${ellipseY(R[2], Q, T, LS(k))}`;
        d += `L ${ellipseX(R[2], Q, T, LS(k)) + offsetX} ${ellipseY(R[2], Q, T, LS(k)) - offsetY}`;
    }

    for (const j of [-1, 1]){
        d += `M ${-j*R[0]*Q*Math.sin(T)} ${-j*R[0]*Q*Math.cos(T)}`;
        d += `L ${-j*R[0]*Q*Math.sin(T) + offsetX} ${-j*R[0]*Q*Math.cos(T) - offsetY}`;
    }

    path.setAttribute("d", d);
}

function animate() {

    time += 0.01;

    drawCurves(time);

    requestAnimationFrame(animate);
}

animate();