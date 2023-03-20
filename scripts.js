// test arrays to render
let voiceOne = [[-4, 4], [-5, 4], [2, 4], [1, 4], [8, 4], [7, 4]];
let voiceTwo = [[-8, 4], [-1, 4], [-2, 4], [5, 4], [4, 4], [11, 4]];
let timeTotal = 2;
for (let i = 0; i < voiceOne.length; i++) {
    timeTotal += voiceOne[i][1];
}
// sets the scale of the output
const unitSize = 100;
const lineHeight = 0.24 * unitSize;
const staffThickness = unitSize / 75;
const hexRed = "#BB2F3D";
const hexBlue = "#3C5EC4";

// notation canvas dimensions
let c = document.getElementById("myCanvas");
myHeight = 6 * unitSize
c.height = myHeight;
myWidth = voiceOne.length * unitSize * 1.15;
c.width = myWidth;
let ctx = c.getContext("2d");

drawStaff(0, myWidth);
placeNotes();

// place the notes
function placeNotes() {
    let oneX = [2];
    let twoX = [2];
    for (let i = 1; i < voiceOne.length; i++) {
        oneX.push(oneX[i-1] + voiceOne[i-1][1]);
        twoX.push(twoX[i-1] + voiceTwo[i-1][1]);
    }
    // add voice crossing offsets
    for (let i = 0; i < voiceOne.length; i++) {
        for (let j = 0; j < voiceOne.length; j++) {
            if (twoX[j] === oneX[i]) {
                if (voiceOne[i][0] < voiceTwo[j][0]) {
                    oneX[i] += 0.25;
                    twoX[j] -= 0.25;
                }
                break;
            }
        }
    }
    console.log(oneX, twoX);
    for (let i = 0; i < voiceOne.length; i++) {
        noteUp(oneX[i] / timeTotal, voiceOne[i][0], hexRed);
        noteDown(twoX[i] / timeTotal, voiceTwo[i][0], hexBlue);
    }
}

// draw staff lines between two x-coordinates
function drawStaff(startX, endX) {
    for (let i = -(2 * lineHeight); i <= (2 * lineHeight); i += lineHeight) {
        ctx.moveTo(startX, myHeight / 2 + i);
        ctx.lineWidth = staffThickness;
        ctx.lineTo(endX, myHeight / 2 + i);
    }
    ctx.stroke();
}

// create a note with an upward stem
function noteUp(x, y, color) {
    drawLedger(x, y);
    drawNote(x, y, color);
    drawStemUp(x, y, color);
}

// create a note with a downward stem
function noteDown(x, y, color) {
    drawLedger(x, y);
    drawNote(x, y, color);
    drawStemDown(x, y, color);
}

// draw a notehead at a given position, plus ledgers if necessary
function drawNote(x, y, color) {
    // Draw the ellipse
    let ellipseX = myWidth * x;
    let ellipseY = myHeight / 2 + (- y * lineHeight) / 2;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(ellipseX, ellipseY, 0.46 * lineHeight, 0.66 * lineHeight,
        Math.PI / 3, 0, 2 * Math.PI);
    ctx.ellipse(ellipseX, ellipseY, 0.2 * lineHeight, 0.60 * lineHeight,
        Math.PI / 3, 0, 2 * Math.PI);
    ctx.fill("evenodd");

    // prepare stroke for stem coloring
    ctx.strokeStyle = color;
    ctx.lineWidth = staffThickness * 2;
}

// draw ledger lines as appropriate
function drawLedger(x, y, alpha = 1) {
    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.lineWidth = staffThickness * 3;
    ledgerX = myWidth * x;
    if (y > 5) {
        let baseLine = myHeight / 2 - 2 * lineHeight;
        let ledgers = (y - 4) / 2;
        for (let i = 1; i <= ledgers; i++) {
            let ledgerPos = baseLine - i * lineHeight;
            ctx.beginPath();
            ctx.moveTo(ledgerX - lineHeight, ledgerPos);
            ctx.lineTo(ledgerX + lineHeight, ledgerPos);
            ctx.stroke();
        }
    }
    if (y < -5) {
        let baseLine = myHeight / 2 + 2 * lineHeight;
        let ledgers = (-y - 4) / 2;
        for (let i = 1; i <= ledgers; i++) {
            let ledgerPos = baseLine + i * lineHeight;
            ctx.beginPath();
            ctx.moveTo(ledgerX - lineHeight, ledgerPos);
            ctx.lineTo(ledgerX + lineHeight, ledgerPos);
            ctx.stroke();
        }
    }
}

// draw an upward step to a given notehead
function drawStemUp(x, y, color) {
    // draw the stem
    let stemX = myWidth * x + 1.15 * lineHeight / 2;
    let stemStartY = myHeight / 2 - lineHeight / 5 - (y * lineHeight / 2);
    let stemEndY = myHeight / 2 - 3.5 * lineHeight - (y * lineHeight / 2);

    ctx.beginPath();
    ctx.moveTo(stemX, stemStartY);
    ctx.lineTo(stemX, stemEndY);
    ctx.stroke();
}

// draw a downward stem to a given notehead
function drawStemDown(x, y, color) {
    // draw the stem
    let stemX = myWidth * x - 1.15 * lineHeight / 2;
    let stemStartY = myHeight / 2 + lineHeight / 5 - (y * lineHeight / 2);
    let stemEndY = myHeight / 2 + 3.5 * lineHeight - (y * lineHeight / 2);

    ctx.beginPath();
    ctx.moveTo(stemX, stemStartY);
    ctx.lineTo(stemX, stemEndY);
    ctx.stroke();
}