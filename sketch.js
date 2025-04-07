let player, enemy, world;
let score = 0;
let music = true;
let size = [400, 600];

let explosionImage, airplaneImage, enemyImage, towerImage, backgroundImage;
let backgroundClip, explosionClip;

let jumping = false;
function preload() {
  gamefont = loadFont("assets/MotionControl-BoldItalic.otf")
  airplaneImage = loadImage("assets/airplane.png")
  enemyImage = loadImage("assets/enemy.png")
  explosionImage = loadImage("assets/explosion.png");
  towerImage = loadImage("assets/tower.png")
  backgroundImage = loadImage("assets/background.png")
  backgroundClip = loadSound("assets/background.mp3");
  explosionClip = loadSound("assets/explosion.wav");
}

function setup() {
  let cnv = createCanvas(size[0], size[1]);
  scaleFactor = windowHeight / size[1];
  let scaledWidth = size[0] * scaleFactor;
  let scaledHeight = size[1] * scaleFactor;
  let x = (windowWidth - width) / 2;
  let y = 0;
  cnv.position(x, y);
  cnv.style('transform', `scale(${scaleFactor})`);
  cnv.style('transform-origin', 'top center');

  enemy = new Enemy(size);
  player = new Player(size);
  world = new World(size);

  // backgroundClip.play();
  // backgroundClip.loop();
}

function draw() {
  clear()
  if (keyIsPressed) {
    jumping = true;
    score++;
  }

  world.update();
  enemy.update(player);
  player.update(jumping);

  let checkEnemy = enemy.checkCollision(player);
  let checkWorld = world.checkCollision(player);
  let checkAltitude = player.y > size[1];
  
  world.draw();
  // enemy.draw();
  // player.draw();
  updateScore();
  if (checkEnemy || checkWorld || checkAltitude) {
    explosionClip.play();
    image(explosionImage, player.getRect().x, player.getRect().y - 12, 64, 64);
    let restart = restartDialog();
    if (!restart) {
      backgroundClip.stop()
      noLoop();
    } else {
      setup();
    }
  }
  jumping = false;
}

function mousePressed() {
  jumping = true;
  if (!backgroundClip.isPlaying()) {
    backgroundClip.play()
    backgroundClip.loop()
  }
}

function touchStarted() {
  jumping = true;
  return false;
}

function updateScore() {
  textFont(gamefont)
  textSize(32);
  stroke(2)
  fill(250, 150, 50);
  textAlign(CENTER, CENTER);
  text(`Score: ${score}`, width/2, 16);
}

function restartDialog() {
  textFont(gamefont)
  textSize(32);
  stroke(2)
  fill(250, 70, 50);
  textAlign(CENTER, CENTER);
  text("Game Over!", width / 2, 140);
  fill(250, 150, 50);
  text(str(score), width / 2, 180);
  return keyIsPressed && (key === ' ');
}

function rectsCollide(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

class Player {
  constructor(size) {
    this.x = size[0] / 3;
    this.y = size[1] / 2;
    this.dy = 0;
    this.gravity = 0.5;
    this.jumpStrength = -8;
    this.image = airplaneImage;
    this.image.resize(40, 40);
    this.width = this.image.width;
    this.height = this.image.height;
  }

  update(jumping) {
    this.dy += this.gravity;
    if (jumping) {
      this.dy = this.jumpStrength;
    }
    this.y += this.dy;
    if (this.y < 32) {
      this.y = 32;
    }
  }

  draw() {
    image(this.image, this.x - this.width / 2, this.y - this.height / 2);
  }

  getRect() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }
}

class Projectile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 3;
    this.speed = 4;
    this.color = color(255, 0, 0);
  }

  update() {
    this.x += this.speed;
  }

  draw() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }

  getRect() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }
}

class Enemy {
  constructor(size) {
    this.width = 36;
    this.height = 32;
    this.x = 10;
    this.y = 24;
    this.image = enemyImage;
    this.image.resize(this.width, this.height);
    this.projectiles = [];
    this.lastShotTime = 0;
    this.fireRate = 1000;
  }

  update(player) {
    let currentTime = millis();
    if (player.y < 40) {
      if (currentTime - this.lastShotTime >= this.fireRate) {
        this.shoot(player);
        this.lastShotTime = currentTime;
      }
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      this.projectiles[i].update();
      if (this.projectiles[i].x > width) {
        this.projectiles.splice(i, this.projectiles.length);
      }
    }
  }

  shoot(player) {
    let projectile = new Projectile(this.x, this.y + this.height / 2);
    this.projectiles.push(projectile);
  }

  draw() {
    image(this.image, this.x, this.y);
    for (let projectile of this.projectiles) {
      projectile.draw();
    }
  }

  checkCollision(player) {
    let playerRect = player.getRect();
    for (let projectile of this.projectiles) {
      if (rectsCollide(playerRect, projectile.getRect())) {
        return true;
      }
    }
    return false;
  }
}

class Obstacle {
  constructor(x, y, width = 64, height = 480, speed = 1.5) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.image = towerImage;
    this.image.resize(this.width, this.height);
  }

  update() {
    this.x -= this.speed;
  }

  draw() {
    image(this.image, this.x, this.y);
    noStroke();
  }

  getRect() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

class World {
  constructor(size) {
    this.size = size;
    this.obstacles = [];
    this.spawnRate = 200;
    this.frameCount = 0;
    this.speed = 2;
    this.worldImage = backgroundImage;
    this.worldImages = [0, width];
    this.worldImage.resize(size[0], size[1]); 
  }

  update() {
    this.frameCount++;
    if (this.frameCount >= this.spawnRate) {
      this.spawnObstacle();
      this.frameCount = 0;
    }

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      this.obstacles[i].update();
      if (this.obstacles[i].x < -64) {
        this.obstacles.splice(i, 1);
        score++; // update score for each building pass by
      }
    }
  }

  spawnObstacle() {
    let y = random(150, 300);
    this.obstacles.push(new Obstacle(this.size[0], y));
    this.spawnRate = max(100, this.spawnRate - 0.1);
  }

  draw() {
    fill(117, 168, 250) // background sky
    rect(0, 0, width, height)
    // towers
    for (let obstacle of this.obstacles) {
      obstacle.draw();
    }
    enemy.draw()
    player.draw()
    // background buildings
    for (let i = 0; i < this.worldImages.length; i++) {
      this.worldImages[i] -= this.speed;
      if (this.worldImages[i] + width <= 0) {
        this.worldImages[i] = width
      }
      image(this.worldImage, this.worldImages[i], 0);
    }  

  }

  checkCollision(player) {
    let playerRect = player.getRect();
    for (let obstacle of this.obstacles) {
      if (rectsCollide(playerRect, obstacle.getRect())) {
        return true;
      }
    }
    return false;
  }
}
