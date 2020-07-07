let x = 100, ac = 1, y = 100, angle1 = 0.0, angle2 = 0.0, segLength = 30, posX = 100, posY = 100,
    enemies = null, time = 0, spd = 1, h = 1, score = 0, lose = false, hits = 0, shot = false;

class Enemy {
    constructor(tspeed, th) {
        this.x = random(700);
        this.y = random(700);
        this.speed = tspeed;
        this.maxHealth = th;
        this.health = this.maxHealth;
    }

    display() {
        stroke(255, 0, 0, 200);
        ellipse(this.x, this.y, 20, 20);
        noStroke();
        fill(255);
        text(this.health, this.x - 4, this.y + 5);
        stroke(255, 100);
    }

    move() {
        this.y += (mouseY - this.y) / 100 * this.speed;
        this.x += (mouseX - this.x) / 100 * this.speed;
    }
}

function setup() {
    createCanvas(700, 700);
    fill(255);
    enemies = [];
    strokeWeight(20.0);
    stroke(255, 100);
}

function draw() {
    background(40);
    frameRate(80);

    if (!lose) {
        difficultyChange();
        control();
        spawn();
        moveEnemies();
        display();
        checkLose();
        noStroke();
        text("Score: " + score, 10, 15);
        text("Speed: " + spd, 10, 31);
        stroke(255, 100);
        time++;
    } else {
        noStroke();
        text("YOU LOSE", 300, 300);
        text("SCORE: " + score, 300, 350);
    }
    shot = false;
}

function segment(x, y, a) {
    push();
    translate(x, y);
    rotate(a);
    line(0, 0, segLength, 0);
    pop();
}

function mousePressed() {
    shot = true;
}

function control() {
    dx = mouseX - x;
    dy = mouseY - y;
    angle1 = atan2(dy, dx);
    angle2 = atan2(y, x);
    x = mouseX - cos(angle1) * segLength;
    y = mouseY - sin(angle1) * segLength;

    posX = mouseX - cos(angle1) * 1000;
    posY = mouseY - sin(angle1) * 1000;

    segment(x, y, angle1);
    ellipse(x, y, 20, 20);
}

function spawn() {
    stroke(255, 0, 0, 100);
    if (time == 60) {
        time = 0;
        let unit = new Enemy(spd, h);
        enemies.push(unit);
        unit = null;
        ac++;
    }
    stroke(255, 100);
}

function display() {
    for (let i = 0; i < enemies.length; i++) {
        let unit = enemies[i];
        unit.display();
        unit = null;
    }
    if (shot) {
        strokeWeight(1.0);
        line(x, y, posX, posY);
        strokeWeight(20.0);
        atk();
    }
}

function moveEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        let unit = enemies[i];
        unit.move();
        unit = null;
    }
}

function atk() {
    for (let i = 0; i < enemies.length; i++) {
        let unit = enemies[i];

        let check = path(unit.x, unit.y);
        if (check) {
            unit.health--;
            unit.display();
            if (unit.health <= 0) {
                unit = null;
                enemies.splice(i, 1);
                score += h;
            }
            score++;
        }
    }
}

function checkLose() {
    for (let i = 0; i < enemies.length; i++) {
        let unit = enemies[i];
        if (unit.x <= mouseX + 30 && unit.x >= mouseX - 30 &&
            unit.y <= mouseY + 30 && unit.y >= mouseY - 30) {
            lose = true;
        }
    }
}

function difficultyChange() {
    if (spd < 8 && ac >= 10) {
        spd = ac / 10;
    }
    if (h < 3 && ac >= 10) {
        h = int(ac / 10);
    }
}

function path(x, y) {
    let dx1, dy1, dx, dy, s, ab, res;

    dx1 = posX - mouseX;
    dy1 = posY - mouseY;

    dx = x - mouseX;
    dy = y - mouseY;

    s = dx1 * dy - dx * dy1;

    ab = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    res = s / ab;

    if (Math.abs(res) < 10) return true;
    return false;
}