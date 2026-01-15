const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let balls = [];
let startTime = Date.now();

let availableColors = ["red"];
const colorUnlocks = [
    "orange", "yellow", "lime", "cyan",
    "blue", "purple", "pink", "white"
];

class Ball {
    constructor(x, y, color) {
        this.radius = 10;
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.color = color;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;

        // Vegg-kollisjon
        if (this.x < this.radius || this.x > canvas.width - this.radius) {
            this.vx *= -1;
            spawnBall();
        }
        if (this.y < this.radius || this.y > canvas.height - this.radius) {
            this.vy *= -1;
            spawnBall();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function spawnBall() {
    const color = availableColors[
        Math.floor(Math.random() * availableColors.length)
    ];
    balls.push(
        new Ball(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            color
        )
    );
    document.getElementById("counter").innerText = `Baller: ${balls.length}`;

    // Lås opp ny farge hver 50. ball
    if (balls.length % 50 === 0 && colorUnlocks.length > 0) {
        availableColors.push(colorUnlocks.shift());
    }
}

function handleCollisions() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const dx = balls[i].x - balls[j].x;
            const dy = balls[i].y - balls[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < balls[i].radius * 2) {
                // Sprett
                [balls[i].vx, balls[j].vx] = [balls[j].vx, balls[i].vx];
                [balls[i].vy, balls[j].vy] = [balls[j].vy, balls[i].vy];
                spawnBall();
            }
        }
    }
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
    const s = String(elapsed % 60).padStart(2, "0");
    document.getElementById("timer").innerText = `${h}:${m}:${s}`;
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    balls.forEach(ball => {
        ball.move();
        ball.draw();
    });

    handleCollisions();
    updateTimer();

    requestAnimationFrame(animate);
}

// Start med én ball
balls.push(new Ball(canvas.width / 2, canvas.height / 2, "red"));
animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
