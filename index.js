let sectors = [
    { label: "Stack" },
    { label: "10" },
    { label: "200" },
    { label: "50" },
    { label: "100" },
    { label: "5" },
    { label: "500" },
];

const rand = (m, M) => Math.random() * (M - m) + m;
const EL_spin = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext('2d');
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;

const friction = 0.993; // 0.995=soft, 0.99=mid, 0.98=hard
let angVel = 0; // Angular velocity
let ang = 0; // Angle in radians


function drawSector(sector, i) {
    if (sector.label) {
        const tot = sectors.length;
        const arc = TAU / sectors.length;
        // const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;
        const ang = arc * i;
        ctx.save();
        // COLOR
        ctx.beginPath();
        const color = Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255)
        ctx.fillStyle = 'rgba(' + color + ')';
        ctx.moveTo(rad, rad);
        ctx.arc(rad, rad, rad, ang, ang + arc);
        ctx.lineTo(rad, rad);
        ctx.fill();
        // TEXT
        ctx.translate(rad, rad);
        ctx.rotate(ang + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(sector.label, rad - 10, 10);
        //
        ctx.restore();
    };
}


function rotate() {
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    EL_spin.style.background = 'rgb(15, 214, 228)';
}

function frame() {
    if (!angVel) return;
    angVel *= friction; // Decrement velocity by friction
    if (angVel < 0.002) angVel = 0; // Bring to stop
    ang += angVel; // Update angle
    ang %= TAU; // Normalize angle
    rotate();
}

function engine() {
    frame();
    requestAnimationFrame(engine)
}

// INIT
sectors.forEach(drawSector);
rotate(); // Initial rotation
engine(); // Start engine
EL_spin.addEventListener("click", () => {
    if (!angVel) angVel = rand(0.25, 0.35);
});

const submitBtn = document.getElementById('submit')
const removeBtn = document.getElementById('remove')
const inputElement = document.getElementById('input')

submitBtn.onclick = () => {
    const inputValue = inputElement.value
    if (inputValue) {
        sectors.push({
            label: inputValue
        })

        // INIT
        sectors.forEach(drawSector);
        rotate(); // Initial rotation
        engine(); // Start engine
        EL_spin.addEventListener("click", () => {
            if (!angVel) angVel = rand(0.25, 0.35);
        });
        console.log(sectors)
    }
    inputElement.value = ""
    inputElement.focus()
}

removeBtn.onclick = () => {
    sectors = []
    ctx.clearRect(0, 0, dia, ctx.canvas.height);
    inputElement.focus()
}