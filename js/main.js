const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const rand = (n) => {
  return Math.floor(Math.random() * n);
};

const backgroundImg = new Image();
backgroundImg.src = "img/background.jpg";
var playerImg = new Image();
playerImg.src = "img/player.png";
const bulletImg = new Image();
bulletImg.src = "img/bullet.png";
const enemy1Img = new Image();
enemy1Img.src = "img/enemy1.png";
const enemy1aImg = new Image();
enemy1aImg.src = "img/enemy1a.png";
const enemy1bImg = new Image();
enemy1bImg.src = "img/enemy1b.png";
const enemy2Img = new Image();
enemy2Img.src = "img/enemy2.png";
const enemy2aImg = new Image();
enemy2aImg.src = "img/enemy2a.png";
const enemy2bImg = new Image();
enemy2bImg.src = "img/enemy2b.png";
const enemy3Img = new Image();
enemy3Img.src = "img/enemy3.png";
const enemy3aImg = new Image();
enemy3aImg.src = "img/enemy3a.png";
const enemy3bImg = new Image();
enemy3bImg.src = "img/enemy3b.png";
const explosionImg = new Image();
explosionImg.src = "img/explosion.png";
const warningImg = new Image();
warningImg.src = "img/warning.png";
const boss1Img = new Image();
boss1Img.src = "img/boss1.png";
const boss2Img = new Image();
boss2Img.src = "img/boss2.png";
const boss3Img = new Image();
boss3Img.src = "img/boss3.png";
const boss4Img = new Image();
boss4Img.src = "img/boss4.png";
const boss1BulletImg = new Image();
boss1BulletImg.src = "img/bossBullet1.png";
const boss2BulletImg = new Image();
boss2BulletImg.src = "img/bossBullet2.png";
const boss2SuperImg1 = new Image();
boss2SuperImg1.src = "img/bossSuper2_1.png";
const boss2SuperImg2 = new Image();
boss2SuperImg2.src = "img/bossSuper2_2.png";
const boss2SuperImg1a = new Image();
boss2SuperImg1a.src = "img/bossSuper2a_1.png";
const boss2SuperImg2a = new Image();
boss2SuperImg2a.src = "img/bossSuper2a_2.png";
const boss2SuperBullet = new Image();
boss2SuperBullet.src = "img/bossSuperBullet.png";
const boss3BulletImg = new Image();
boss3BulletImg.src = "img/bossBullet3.png";
const boss4BulletImg = new Image();
boss4BulletImg.src = "img/bossBullet4.png";

const music = new Audio("sounds/music1.mp3");
music.volume = 0.5;
const explosionSound = new Audio("sounds/explosion.wav");
explosionSound.volume = 0.7;
const reloadSound = new Audio("sounds/reload.mp3");
reloadSound.volume = 0.8;
const shootSound = new Audio("sounds/shoot.mp3");
shootSound.volume = 0.25;
const damagedSound = new Audio("sounds/damaged.mp3");
damagedSound.volume = 0.6;
const damagedBoss2Sound = new Audio("sounds/damagedBoss2.wav");
const missSound = new Audio("sounds/miss.wav");
missSound.volume = 0.1;
const waveSound = new Audio("sounds/wave.wav");
const loseSound = new Audio("sounds/lose.wav");
const bossComingSound = new Audio("sounds/bossComing.wav");
bossComingSound.volume = 0.4;
const boss1ShootSound = new Audio("sounds/boss4Shoot.wav");
const boss2ShootSound = new Audio("sounds/boss2Shoot.mp3");
boss2ShootSound.volume = 0.35;
const boss2ChargeSound = new Audio("sounds/boss2Charge.wav");
const boss2SuperSound = new Audio("sounds/boss2Super.wav");
const boss4ShootSound = new Audio("sounds/boss4Shoot.wav");
boss4ShootSound.volume = 0.35;

const enter = 13;
const shift = 16;
const space = 32;
const arrowLeft = 37;
const arrowRight = 39;

let gameStarted = false;
let speedBoost = 1;
let fuel = 155;
const bullets = [];
let bulletCount = 9;
let recoil = false;
let reload = false;
let reloadSpeed = 600;
const enemies = [];
let spawnEnemyCD = false;
let spawnEnemyRate = 2000;
let lastEnemyLocation = -1;
const enemyBullets = [];
const explosions = [];
let life = 200;
let armor = 0;
let gameLost = false;
let playerExplosionCount = 0;
const playerExplosionArr = [];
let score = 0;
let time = 0;
let bossTime = 0;
let waveSize = 2;
const waveEnemies = [];
const waveWarning = [];
let bossComing = false;
let bossAlive = false;
let bossDying = false;
let boss = {};
let bossLife = 150;
let bossPower = 0;
let bossPowerActive = false;
let bossAlarmCount = 0;
let bossAlarmOpacity = 0;
let bossAlarming = false;
const bossBullets = [];
let bossExplosionCount = 0;
const bossExplosions = [];
let bossLeftCannon = true;
let bossShooting = false;
let bossSuperHelper = false;
let bossSuperOpacity = 0.1;
let bossSuperBullets = [];
let level = 1;
let boss3EnemySpawn = 0;
let bossSuperSkip;

const player = {
  x: 630,
  y: 520,
  w: 80,
  h: 80,
  left: false,
  right: false,
  firing: false,
};

const heal = () => {
  if (life < 200) {
    life += 0.3;
    if (level == 2) life += 0.2;
    if (level > 2) armor += 0.2;
  } else if (armor < 200 && level > 2) {
    armor += 0.6;
  }
};

(makeBullet = (bulletNum) => {
  if (bulletNum >= 10) return;

  bullets[bulletNum] = {
    x: 0,
    y: 700,
    w: 15,
    h: 32,
    moving: false,
  };
  makeBullet(bulletNum + 1);
})(0);

const recoilCD = () => {
  recoil = false;
};

const addBullet = () => {
  bulletCount++;
  reloadSound.pause();
  reloadSound.currentTime = 0;
  reloadSound.play();
  if (bulletCount >= 9) clearInterval(drawReloadInterval);
};

const playerExplode = () => {
  if (playerExplosionCount == 10) clearInterval(playerExplosion);
  playerExplosionCount++;
  damagedSound.pause();
  damagedSound.currentTime = 0;
  damagedSound.play();
  let explosion = {
    x: player.x + rand(40) - 15,
    y: player.y + rand(40) - 15,
    w: 70,
    h: 70,
  };
  playerExplosionArr.push(explosion);
};

const die = () => {
  music.pause();
  loseSound.play();
  gameLost = true;
  playerExplode();
  playerExplosion = setInterval(playerExplode, 150);
  clearTimeout(waveInterval);
  clearInterval(timeInterval);
  if (typeof drawReloadInterval !== "undefined")
    clearInterval(drawReloadInterval);
};

const wave = () => {
  waveInterval = setTimeout(wave, 15000);
  if ((level == 2 || level == 3) && bossAlive) return;
  waveSound.pause();
  waveSound.currentTime = 0;
  waveSound.play();
  let waveLocation = rand(canvas.width - 500) + 100;
  let locationHelper = waveLocation;
  let waveHelper = waveSize;
  let top = 0;
  waveMark = {
    x: waveLocation,
    y: 0,
    w: 80,
    h: 80,
  };
  waveWarning.push(waveMark);
  setTimeout(() => {
    waveWarning.splice(0, 1);
    for (let i = 0; i < waveSize; i++) {
      for (let j = 0; j < waveHelper; j++) {
        waveEnemy = {
          x: locationHelper,
          y: top,
          w: 70,
          h: 70,
        };
        waveEnemies.push(waveEnemy);
        locationHelper += 35;
      }
      waveHelper--;
      waveLocation += 17.5;
      locationHelper = waveLocation;
      top += 35;
    }
  }, 1000);
};

const bossArrival = () => {
  bossComing = true;
  bossAlarming = true;
  bossComingSound.play();
  bossAlarm();
  bossAlarmInterval = setInterval(bossAlarm, 1300);
};

const bossAlarm = () => {
  if (bossAlarmCount < 3) {
    bossAlarmCount++;
    var fadeInText = setInterval(() => {
      bossAlarmOpacity += 0.035;
      if (bossAlarmOpacity >= 1) {
        let fadeOutText = setInterval(() => {
          bossAlarmOpacity -= 0.035;
          if (bossAlarmOpacity <= 0) clearInterval(fadeOutText);
        }, 20);
        clearInterval(fadeInText);
      }
    }, 20);
  } else {
    clearInterval(bossAlarmInterval);
    bossAlive = true;
    boss.x = 600;
    boss.y = -5;
    boss.w = 150;
    boss.h = 200;
    boss.left = true;

    if (level == 1) {
      bossShootInterval = setInterval(bossShoot1, 1000);
      bossImg = boss1Img;
      bossBulletImg = boss1BulletImg;
    }
    if (level == 2) {
      bossShootInterval = setInterval(bossShoot2, 1500);
      bossShooting = true;
      bossImg = boss2Img;
      bossBulletImg = boss2BulletImg;
    }
    if (level == 3) {
      bossShootInterval = setInterval(bossShoot3, 1500);
      bossShooting = true;
      bossImg = boss3Img;
      bossBulletImg = boss3BulletImg;
    }
    if (level == 4) {
      bossShootInterval = setInterval(bossShoot4, 800);
      bossImg = boss4Img;
      bossBulletImg = boss4BulletImg;
    }
  }
};

const bossFight1 = () => {
  if (gameLost) {
    clearInterval(bossShootInterval);
    return;
  }

  if (bossLife <= 0) {
    if (!bossDying) {
      bossDying = true;
      clearInterval(bossShootInterval);
      bossExplosionInterval = setInterval(() => {
        if (bossExplosionCount == 50) {
          clearInterval(bossExplosionInterval);
          bossExplosionCount = 0;
          setTimeout(() => {
            bossAlive = false;
            bossDying = false;
            spawnEnemyRate = 2000;
            level++;
            bossLife = 150;
            bossPower = 0;
            bossPowerActive = false;
            bossAlarmCount = 0;
            bossComing = false;
            reloadSpeed -= 150;

            setInterval(() => {
              bossTime += 1;
            }, 1000);
          }, 2000);
        }
        bossExplosionCount++;
        explosionSound.pause();
        explosionSound.currentTime = 0;
        explosionSound.play();
        let explosion = {
          x: boss.x + rand(120) - 30,
          y: boss.y + rand(150) - 30,
          w: 100,
          h: 100,
        };
        bossExplosions.push(explosion);
        if (life < 200) life += 0.6;
        score += 1;
      }, 50);
    }
  } else {
    let bossSpeedBoost;
    if (bossPowerActive) bossSpeedBoost = 2.5;
    else bossSpeedBoost = 1;
    if (boss.x + boss.w / 2 + 1 + bossSpeedBoost < player.x + player.w / 2)
      boss.x += 3 * bossSpeedBoost;
    else if (boss.x + boss.w / 2 - 1 - bossSpeedBoost > player.x + player.w / 2)
      boss.x -= 3 * bossSpeedBoost;

    bullets.forEach((bullet) => {
      if (
        bullet.y < boss.y + boss.h &&
        bullet.y + bullet.h > boss.y &&
        bullet.x < boss.x + boss.w &&
        bullet.x + bullet.w > boss.x
      ) {
        var explosion = {
          x: boss.x + boss.w / 2,
          y: boss.y + boss.h,
          w: 30,
          h: 30,
          removing: false,
        };
        bullet.y = 700;
        bullet.moving = false;
        explosions.push(explosion);
        explosionSound.pause();
        explosionSound.currentTime = 0;
        explosionSound.play();
        score += 1;
        bossLife -= 2.5;
        heal();
      }
    });
  }
};

const bossShoot1 = () => {
  if (!bossAlive) return;
  boss1ShootSound.pause();
  boss1ShootSound.currentTime = 0;
  boss1ShootSound.play();
  setTimeout(() => {
    boss1ShootSound.pause();
    boss1ShootSound.currentTime = 0;
    boss1ShootSound.play();
  }, 100);
  let bossBullet = {
    x: boss.x + boss.w / 2 - 15,
    y: boss.y + boss.h,
    w: 35,
    h: 50,
    speed: 30,
    damage: 30,
  };
  bossBullets.push(bossBullet);
};

const bossFight2 = () => {
  if (gameLost) {
    clearInterval(bossShootInterval);
    return;
  }

  if (bossLife <= 0) {
    if (!bossDying) {
      bossDying = true;
      boss2ChargeSound.pause();
      boss2SuperSound.pause();
      clearInterval(bossShootInterval);
      bossExplosionInterval = setInterval(() => {
        if (bossExplosionCount == 50) {
          clearInterval(bossExplosionInterval);
          setTimeout(() => {
            bossAlive = false;
            bossDying = false;
            spawnEnemyRate = 2000;
            level++;
            bossTime = 0;
            waveSize = 3;
          }, 2000);
        }
        bossExplosionCount++;
        explosionSound.pause();
        explosionSound.currentTime = 0;
        explosionSound.play();
        let explosion = {
          x: boss.x + rand(120) - 30,
          y: boss.y + rand(150) - 30,
          w: 100,
          h: 100,
        };
        bossExplosions.push(explosion);
        if (life < 200) life += 0.6;
        score += 1;
      }, 50);
    }
  } else {
    if (!bossPowerActive && bossPower < 120) {
      if (boss.left) boss.x -= 4;
      else boss.x += 4;

      if (boss.x <= 15) boss.left = false;
      if (boss.x + boss.w + 15 >= canvas.width) boss.left = true;
    }

    if (bossSuperHelper) {
      boss2SuperImg = boss2SuperImg1;
      boss2Super1Img = boss2SuperImg1a;
    } else {
      boss2SuperImg = boss2SuperImg2;
      boss2Super1Img = boss2SuperImg2a;
    }

    bossSuperHelper = !bossSuperHelper;

    if (bossPower >= 120 && !bossPowerActive) {
      boss2ChargeSound.play();
      clearInterval(bossShootInterval);
      bossSuperOpacity += 0.004;
      if (boss.x + boss.w / 2 + 1 < player.x + player.w / 2) {
        boss.x += 2.5;
        player.x -= 2;
      } else if (boss.x + boss.w / 2 - 1 > player.x + player.w / 2) {
        boss.x -= 2.5;
        player.x += 2;
      }
      fuel -= 1.5;
    }
    if (bossPowerActive) {
      bossShooting = false;
      boss2ChargeSound.pause();
      boss2ChargeSound.currentTime = 0;
      boss2SuperSound.play();

      bossSuperBullets = [];
      for (let i = 0; i < 100; i++) {
        bossSuperBullet = {
          x: boss.x - 180 + rand(500),
          y: 200 + rand(430),
          w: 50,
          h: 50,
        };
        bossSuperBullets.push(bossSuperBullet);
      }

      if (player.x + player.w >= boss.x - 175 && player.x <= boss.x + 360) {
        life -= 1;
        fuel += 3;
      }
    }
    if (!bossPowerActive && !bossShooting) {
      bossShootInterval = setInterval(bossShoot2, 1500);
      bossShooting = true;
      boss2SuperSound.pause();
      boss2SuperSound.currentTime = 0;
      bossSuperOpacity = 0.1;
    }

    bullets.forEach((bullet) => {
      if (
        bullet.y < boss.y + boss.h &&
        bullet.y + bullet.h > boss.y &&
        bullet.x < boss.x + boss.w &&
        bullet.x + bullet.w > boss.x
      ) {
        var explosion = {
          x: boss.x + boss.w / 2,
          y: boss.y + boss.h,
          w: 30,
          h: 30,
          removing: false,
        };
        bullet.y = 700;
        bullet.moving = false;
        explosions.push(explosion);
        explosionSound.pause();
        explosionSound.currentTime = 0;
        explosionSound.play();
        score += 1;
        bossLife -= 1.5;
        heal();
        heal();
      }
    });
  }
};

const bossShoot2 = () => {
  bossShooting2();
  setTimeout(bossShooting2, 100);
  setTimeout(bossShooting2, 200);
  setTimeout(bossShooting2, 300);
  setTimeout(bossShooting2, 400);
  setTimeout(bossShooting2, 500);
  setTimeout(bossShooting2, 600);
  setTimeout(bossShooting2, 700);
};

const bossShooting2 = () => {
  if (!bossAlive) return;
  let bossBullet = {
    x: bossLeftCannon ? boss.x + boss.w / 2 - 48 : boss.x + boss.w / 2 + 12,
    y: boss.y + boss.h - 40,
    w: 40,
    h: 40,
    speed: 8,
    damage: 10,
  };
  bossBullets.push(bossBullet);

  boss2ShootSound.pause();
  boss2ShootSound.currentTime = 0;
  boss2ShootSound.play();

  bossLeftCannon = !bossLeftCannon;
};

const bossFight3 = () => {
  if (gameLost) {
    clearInterval(bossShootInterval);
    return;
  }

  if (bossLife <= 0) {
    if (!bossDying) {
      bossDying = true;
      clearInterval(bossShootInterval);
      bossExplosionInterval = setInterval(() => {
        if (bossExplosionCount == 50) {
          clearInterval(bossExplosionInterval);
          bossExplosionCount = 0;
          setTimeout(() => {
            bossAlive = false;
            bossDying = false;
            spawnEnemyRate = 2000;
            level++;
            bossLife = 150;
            bossPower = 0;
            bossPowerActive = false;
            bossAlarmCount = 0;
            bossComing = false;
            reloadSpeed -= 150;

            setInterval(() => {
              bossTime += 1;
            }, 1000);
          }, 2000);
        }
        bossExplosionCount++;
        explosionSound.pause();
        explosionSound.currentTime = 0;
        explosionSound.play();
        let explosion = {
          x: boss.x + rand(120) - 30,
          y: boss.y + rand(150) - 30,
          w: 100,
          h: 100,
        };
        bossExplosions.push(explosion);
        if (life < 200) life += 0.6;
        score += 1;
      }, 50);
    }
  } else {
    if (!bossPowerActive && bossPower < 150) {
      if (boss.left) boss.x -= 4;
      else boss.x += 4;

      if (boss.x <= 15) boss.left = false;
      if (boss.x + boss.w + 15 >= canvas.width) boss.left = true;
    }

    if (bossPower >= 150 && !bossPowerActive) {
      clearInterval(bossShootInterval);
      if (boss.x + boss.w + 20 >= canvas.width || boss.x < 20) {
        boss.left = !boss.left;
        bossPowerActive = true;

        bossSuperBullets = [];

        bossSuperSkip = rand(canvas.width - 400) + 200;
      }
      boss.x += boss.left ? -4 : 4;
    }
    if (bossPowerActive) {
      bossPower = 0;
      bossShooting = false;
      boss.x += boss.left ? -1 : 1;

      if (boss.x < bossSuperSkip || boss.x > bossSuperSkip + 100) {
        bossSuperBullet = {
          x: boss.x + boss.w / 2 - 45,
          y: boss.y + boss.h - 40,
          w: 100,
          h: 180,
        };
        bossSuperBullets.push(bossSuperBullet);
      }
    }
    if (!bossPowerActive && !bossShooting) {
      bossShootInterval = setInterval(bossShoot3, 1500);
      bossShooting = true;
    }

    bullets.forEach((bullet) => {
      if (
        bullet.y < boss.y + boss.h &&
        bullet.y + bullet.h > boss.y &&
        bullet.x < boss.x + boss.w &&
        bullet.x + bullet.w > boss.x
      ) {
        var explosion = {
          x: boss.x + boss.w / 2,
          y: boss.y + boss.h,
          w: 30,
          h: 30,
          removing: false,
        };
        bullet.y = 700;
        bullet.moving = false;
        explosions.push(explosion);
        explosionSound.pause();
        explosionSound.currentTime = 0;
        explosionSound.play();
        score += 1;
        bossLife -= 1.5;
        heal();
        heal();
      }
    });
  }
};

const bossShoot3 = () => {
  bossShooting3();
  setTimeout(bossShooting3, 200);
  setTimeout(bossShooting3, 400);
  setTimeout(bossShooting3, 700);
  setTimeout(bossShooting3, 900);
  setTimeout(bossShooting3, 1100);
};

const bossShooting3 = () => {
  if (!bossAlive) return;
  let bossBullet = {
    x: boss.x + boss.w / 2 - 30,
    y: boss.y + boss.h - 40,
    w: 70,
    h: 130,
    speed: 10,
    damage: 2.5,
  };
  bossBullets.push(bossBullet);

  boss2ShootSound.pause();
  boss2ShootSound.currentTime = 0;
  boss2ShootSound.play();
};

const bossFight4 = () => {
  if (gameLost) {
    clearInterval(bossShootInterval);
    return;
  }
  if (bossLife <= 0) {
    if (!bossDying) {
      bossDying = true;
      clearInterval(bossShootInterval);
      bossExplosionInterval = setInterval(() => {
        if (bossExplosionCount == 50) {
          clearInterval(bossExplosionInterval);
          setTimeout(() => {
            bossAlive = false;
            bossDying = false;
            spawnEnemyRate = 2000;
            level++;
          }, 2000);
        }
        bossExplosionCount++;
        explosionSound.pause();
        explosionSound.currentTime = 0;
        explosionSound.play();
        let explosion = {
          x: boss.x + rand(120) - 30,
          y: boss.y + rand(150) - 30,
          w: 100,
          h: 100,
        };
        bossExplosions.push(explosion);
      }, 50);
    }
  } else {
    if (boss.left) boss.x -= 4;
    else boss.x += 4;
    boss.y += 0.01;

    if (boss.x <= 15) boss.left = false;
    if (boss.x + boss.w + 15 >= canvas.width) boss.left = true;

    bullets.forEach((bullet) => {
      if (
        bullet.y < boss.y + boss.h &&
        bullet.y + bullet.h > boss.y &&
        bullet.x < boss.x + boss.w &&
        bullet.x + bullet.w > boss.x
      ) {
        var explosion = {
          x: boss.x + boss.w / 2,
          y: boss.y + boss.h,
          w: 30,
          h: 30,
          removing: false,
        };
        bullet.y = 700;
        bullet.moving = false;
        explosions.push(explosion);
        explosionSound.pause();
        explosionSound.currentTime = 0;
        explosionSound.play();
        score += 1;
        bossLife -= 1;
        heal();
      }
    });
  }
};

const bossShoot4 = () => {
  bossShooting4();
  setTimeout(bossShooting4, 100);
  setTimeout(bossShooting4, 200);
  setTimeout(bossShooting4, 300);
  setTimeout(bossShooting4, 400);
};

const bossShooting4 = () => {
  if (!bossAlive) return;
  boss4ShootSound.pause();
  boss4ShootSound.currentTime = 0;
  boss4ShootSound.play();
  let bossBullet = {
    x: boss.x + boss.w / 2 - 15,
    y: boss.y + boss.h,
    w: 40,
    h: 40,
    speed: 10,
    damage: 10,
  };
  bossBullets.push(bossBullet);
};

const spawnEnemy = () => {
  if (spawnEnemyCD || gameLost || (bossAlive && level == 1)) return;

  if (level == 1) enemyNum = 1;

  if (level == 2) {
    if (bossAlive) enemyNum = 5;
    else {
      enemyNumHelper = rand(10);
      if (enemyNumHelper < 4) enemyNum = 1;
      else if (enemyNumHelper > 6) enemyNum = 4;
      else enemyNum = 2;
    }
  }

  if (level == 3) {
    if (bossAlive) enemyNum = 6;
    else {
      enemyNumHelper = rand(10);
      if (enemyNumHelper < 5) {
        enemyNumHelper = rand(10);
        if (enemyNumHelper < 3) enemyNum = 1;
        else if (enemyNumHelper >= 8) enemyNum = 3;
        else enemyNum = 2;
      } else if (enemyNumHelper > 7) {
        enemyNumHelper = rand(10);
        if (enemyNumHelper < 6) enemyNum = 4;
        else enemyNum = 5;
      } else enemyNum = 7;
    }
  }

  let enemyImage;
  if (enemyNum == 1) enemyImage = enemy1Img;
  else if (enemyNum == 2) enemyImage = enemy1aImg;
  else if (enemyNum == 3) enemyImage = enemy1bImg;
  else if (enemyNum == 4) enemyImage = enemy2Img;
  else if (enemyNum == 5) enemyImage = enemy2aImg;
  else if (enemyNum == 6) enemyImage = enemy2bImg;
  else if (enemyNum == 7) enemyImage = enemy3Img;

  enemy = {
    x: rand(canvas.width - 70),
    y: 0,
    w: enemyNum == 7 ? 80 : 70,
    h: 70,
    speed:
      enemyNum == 1
        ? 3
        : enemyNum == 2 || enemyNum == 3 || enemyNum == 7
        ? 2
        : 4,
    life:
      enemyNum == 2 || enemyNum == 5
        ? 2
        : enemyNum == 3 || enemyNum == 6
        ? 3
        : 1,
    image: enemyImage,
    type:
      enemyNum == 4 || enemyNum == 5 || enemyNum == 6
        ? 2
        : enemyNum == 7
        ? 3
        : 1,
    left: true,
    shootCD: false,
  };

  if (level == 1 && lastEnemyLocation != -1) {
    while (Math.abs(lastEnemyLocation - enemy.x) > 800) {
      enemy.x = rand(canvas.width - 70);
    }
  }
  lastEnemyLocation = enemy.x;

  enemies.push(enemy);
  spawnEnemyCD = true;

  if ((enemyNum == 4 || enemyNum == 5) && !bossAlive) spawnEnemyRate = 800;
  else if (enemyNum != 4 && !bossAlive) spawnEnemyRate = 1500;
  else if (level == 2 && bossAlive) spawnEnemyRate = 3000 + rand(5000);
  else if (level == 3 && bossAlive) {
    if (boss3EnemySpawn < 7) {
      spawnEnemyRate = 200;
      boss3EnemySpawn++;
    } else {
      spawnEnemyRate = 45000;
      boss3EnemySpawn = 0;
    }
  }

  setTimeout(() => {
    spawnEnemyCD = false;
  }, spawnEnemyRate);
};

const move = () => {
  if (gameLost) return;
  if (fuel <= 0) speedBoost = 1;
  if (player.left && player.x > -10) player.x -= 6 * speedBoost;
  if (player.right && player.x < canvas.width - player.w + 10)
    player.x += 6 * speedBoost;

  if ((speedBoost < 2 || (!player.left && !player.right)) && fuel < 155)
    fuel += 0.7;
  else if ((speedBoost == 2 && fuel >= 0 && player.left) || player.right)
    fuel -= 2;

  bullets.forEach((bullet) => {
    if (bullet.moving) bullet.y -= 15;
    if (bullet.y <= 0) {
      missSound.pause();
      missSound.currentTime = 0;
      missSound.play();
      bullet.y = 700;
      bullet.moving = false;
      if (score > 0) score--;
    }
  });

  enemies.forEach((enemy, index) => {
    if (enemy.type != 2 || enemy.y <= 200) enemy.y += enemy.speed;

    if (enemy.y + enemy.h > canvas.height) {
      var explosion = {
        x: enemy.x,
        y: enemy.y,
        w: enemy.w,
        h: enemy.h,
        removing: false,
      };
      explosions.push(explosion);
      enemies.splice(index, 1);
      if (armor > 50) armor -= 50;
      else {
        life -= 50 - armor;
        armor = 0;
      }
      damagedSound.pause();
      damagedSound.currentTime = 0;
      damagedSound.play();
    }

    if (enemy.type == 2 && enemy.y >= 200) {
      if (enemy.left) enemy.x -= 2;
      else enemy.x += 2;

      if (enemy.x <= 2) enemy.left = false;
      if (enemy.x + enemy.w + 2 >= canvas.width) enemy.left = true;

      if (!enemy.shootCD) {
        let bullet = {
          x: enemy.x + enemy.w / 2,
          y: enemy.y + enemy.h,
          w: 25,
          h: 20,
          damage: 15,
          speed: 6,
        };

        enemyBullets.push(bullet);
        enemy.shootCD = true;
        setTimeout(() => {
          enemy.shootCD = false;
        }, 1000);
      }
    }

    if (enemy.type == 3) {
      if (!enemy.shootCD) {
        let bullet = {
          x: enemy.x + enemy.w / 2 - 15,
          y: enemy.y + enemy.h,
          w: 25,
          h: 20,
          damage: 10,
          speed: 6,
        };

        enemyBullets.push(bullet);
        enemy.shootCD = true;
        setTimeout(() => {
          enemy.shootCD = false;
        }, 1500);
      }
    }

    bullets.forEach((bullet) => {
      if (
        bullet.y < enemy.y + enemy.h &&
        bullet.y + bullet.h > enemy.y &&
        bullet.x < enemy.x + enemy.w &&
        bullet.x + bullet.w > enemy.x
      ) {
        if (enemy.life == 1) {
          var explosion = {
            x: enemy.x,
            y: enemy.y,
            w: enemy.w,
            h: enemy.h,
            removing: false,
          };
          explosions.push(explosion);
          enemies.splice(index, 1);
        } else {
          var explosion = {
            x: bullet.x,
            y: bullet.y,
            w: enemy.w / 2,
            h: enemy.h / 2,
            removing: false,
          };
          explosions.push(explosion);
          enemy.life--;
        }
        bullet.y = 700;
        bullet.moving = false;
        explosionSound.pause();
        explosionSound.currentTime = 0;
        explosionSound.play();
        score += 3;
        heal();
      }
    });
  });

  enemyBullets.forEach((bullet, index) => {
    bullet.y += bullet.speed;
    if (
      bullet.y < player.y + player.h &&
      bullet.y + bullet.h > player.y &&
      bullet.x < player.x + player.w &&
      bullet.x + bullet.w > player.x
    ) {
      var explosion = {
        x: bullet.x,
        y: player.y - 20,
        w: 40,
        h: 40,
        removing: false,
      };
      explosions.push(explosion);
      enemyBullets.splice(index, 1);
      if (armor > bullet.damage) armor -= bullet.damage;
      else {
        life -= bullet.damage - armor;
        armor = 0;
      }
      damagedSound.pause();
      damagedSound.currentTime = 0;
      damagedSound.play();
    }

    if (bullet.y + bullet.h >= canvas.height) enemyBullets.splice(index, 1);
  });

  waveEnemies.forEach((enemy, index) => {
    if (!gameLost) enemy.y += 2;
    if (enemy.y + enemy.h > canvas.height) {
      var explosion = {
        x: enemy.x,
        y: enemy.y,
        w: enemy.w,
        h: enemy.h,
        removing: false,
      };
      explosions.push(explosion);
      waveEnemies.splice(index, 1);
      if (armor > 50) armor -= 50;
      else {
        life -= 50 - armor;
        armor = 0;
      }
      damagedSound.pause();
      damagedSound.currentTime = 0;
      damagedSound.play();
    }

    bullets.forEach((bullet) => {
      if (
        bullet.y < enemy.y + enemy.h &&
        bullet.y + bullet.h > enemy.y &&
        bullet.x < enemy.x + enemy.w &&
        bullet.x + bullet.w > enemy.x
      ) {
        var explosion = {
          x: enemy.x,
          y: enemy.y,
          w: enemy.w,
          h: enemy.h,
          removing: false,
        };
        bullet.y = 700;
        bullet.moving = false;
        waveEnemies.splice(index, 1);
        explosions.push(explosion);
        explosionSound.pause();
        explosionSound.currentTime = 0;
        explosionSound.play();
        score += 3;
        heal();
      }
    });
  });

  if (bossAlive) {
    bossBullets.forEach((bullet, index) => {
      bullet.y += bullet.speed;
      if (
        bullet.y < player.y + player.h &&
        bullet.y + bullet.h > player.y &&
        bullet.x < player.x + player.w &&
        bullet.x + bullet.w > player.x + 5
      ) {
        var explosion = {
          x: bullet.x,
          y: player.y - 20,
          w: 40,
          h: 40,
          removing: false,
        };
        if (level == 1) explosions.push(explosion);
        if (level != 3) bossBullets.splice(index, 1);
        if (armor > bullet.damage) armor -= bullet.damage;
        else {
          life -= bullet.damage - armor;
          armor = 0;
        }
        if (level == 2) {
          damagedBoss2Sound.pause();
          damagedBoss2Sound.currentTime = 0;
          damagedBoss2Sound.play();
        } else {
          damagedSound.pause();
          damagedSound.currentTime = 0;
          damagedSound.play();
        }
      }

      if (bullet.y + bullet.h >= canvas.height) bossBullets.splice(index, 1);

      if (level == 2) {
        if (bullet.x + bullet.w / 2 - 1 <= player.x + player.w / 2)
          bullet.x += 3;
        if (bullet.x + bullet.w / 2 + 1 >= player.x + player.w / 2)
          bullet.x -= 3;
      }
    });

    if (!bossDying) {
      if (level == 1) {
        if (bossPowerActive) {
          bossPower -= 1.5;
          if (bossPower <= 0) bossPowerActive = false;
        } else {
          bossPower += 0.5;
          if (bossPower >= 150) bossPowerActive = true;
        }
      } else if (level == 2) {
        if (bossPowerActive) {
          bossPower -= 1;
          if (bossPower <= 0) bossPowerActive = false;
        } else {
          bossPower += 0.15;
          if (bossPower >= 150) bossPowerActive = true;
        }
      } else if (level == 3) {
        if (bossPowerActive) {
          bossPower == 0;
          if (boss.x <= 15 || boss.x + boss.w + 15 >= canvas.width)
            bossPowerActive = false;
        } else if (bossPower < 150) {
          bossPower += 0.5;
        }
      }
    }
  }

  if (life < 200) life += 0.01;
  if (life > 200) life = 200;
  if (armor > 200) armor = 200;
  else if (armor < 200 && level > 2) {
    if (life < 200) armor += 0.005;
    else armor += 0.01;
  }
  if (life <= 0) {
    die();
    life = 0;
  }

  if (time == 60 && !bossComing) bossArrival();
  if (bossTime == 90 && !bossComing) bossArrival();
};

const shoot = () => {
  if (!player.firing || recoil || gameLost) return;
  if (typeof autoReload != "undefined") {
    clearTimeout(autoReload);
  }
  if (reload) {
    if (bulletCount > -1) reload = false;
    else return;
    if (typeof drawReloadInterval != "undefined")
      clearInterval(drawReloadInterval);
  }
  bullets[bulletCount].x = player.x + 33;
  bullets[bulletCount].y = player.y - 30;
  bullets[bulletCount].moving = true;
  shootSound.pause();
  shootSound.currentTime = 0;
  shootSound.play();
  if (bulletCount == 0) {
    bulletCount = -1;
    reload = true;
    player.firing = false;
    drawReloadInterval = setInterval(addBullet, reloadSpeed);
  } else {
    bulletCount--;
  }
  recoil = true;
  setTimeout(recoilCD, 150);
  autoReload = setTimeout(() => {
    if (reload == true) return;
    reload = true;
    drawReloadInterval = setInterval(addBullet, reloadSpeed);
  }, 600);
};

const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  explosions.forEach((explosion, index) => {
    context.drawImage(
      explosionImg,
      explosion.x,
      explosion.y,
      explosion.w,
      explosion.h
    );
    if (!explosion.removing) {
      explosion.removing = true;
      setTimeout(() => {
        explosions.splice(0, 1);
      }, 750);
    }
  });

  enemies.forEach((enemy) => {
    context.drawImage(enemy.image, enemy.x, enemy.y, enemy.w, enemy.h);
    if (enemy.image == enemy1aImg || enemy.image == enemy2aImg) {
      context.fillStyle = "red";
      context.fillRect(enemy.x + 10, enemy.y + enemy.h + 5, enemy.w - 20, 3);
      context.fillStyle = "green";
      context.fillRect(
        enemy.x + 10,
        enemy.y + enemy.h + 5,
        enemy.life * (enemy.w / 2 - 10),
        3
      );
    }
    if (enemy.image == enemy1bImg || enemy.image == enemy2bImg) {
      context.fillStyle = "red";
      context.fillRect(enemy.x + 10, enemy.y + enemy.h + 5, enemy.w - 20, 3);
      context.fillStyle = "green";
      context.fillRect(
        enemy.x + 10,
        enemy.y + enemy.h + 5,
        enemy.life * (enemy.w / 3 - 6.67),
        3
      );
    }
  });

  enemyBullets.forEach((bullet) => {
    context.drawImage(boss4BulletImg, bullet.x, bullet.y, bullet.w, bullet.h);
  });

  waveEnemies.forEach((waveEnemy) => {
    context.drawImage(
      enemy1Img,
      waveEnemy.x,
      waveEnemy.y,
      waveEnemy.w,
      waveEnemy.h
    );
  });

  context.drawImage(playerImg, player.x, player.y, player.w, player.h);

  bullets.forEach((bullet) => {
    context.drawImage(bulletImg, bullet.x, bullet.y, bullet.w, bullet.h);
  });

  waveWarning.forEach((item) => {
    context.drawImage(warningImg, item.x, item.y, item.w, item.h);
  });

  if (bossAlarming) {
    context.beginPath();
    context.fillStyle = "rgba(255, 0, 0, " + bossAlarmOpacity + ")";
    context.fillRect(430, 20, 445, 100);
    context.fillStyle = "rgba(0, 0, 0, " + bossAlarmOpacity + ")";
    context.font = "bold 80px sans-serif";
    context.fillText("WARNING!", 450, 100);
  }

  if (bossAlive) {
    context.drawImage(bossImg, boss.x, boss.y, boss.w, boss.h);
    context.beginPath();
    context.lineWidth = "2";
    context.strokeStyle = "black";
    context.rect(boss.x - 1, boss.y + boss.h - 1, boss.w + 2, 12);
    context.stroke();
    context.fillStyle = "red";
    context.fillRect(boss.x, boss.y + boss.h, boss.w, 10);
    context.fillStyle = "green";
    context.fillRect(boss.x, boss.y + boss.h, bossLife, 10);
    context.fillStyle = "yellow";
    context.fillRect(boss.x, boss.y + boss.h + 8, bossPower, 2);

    bossBullets.forEach((bullet) => {
      context.drawImage(bossBulletImg, bullet.x, bullet.y, bullet.w, bullet.h);
    });

    if (level == 2 && !bossPowerActive && bossPower >= 120) {
      context.globalAlpha = bossSuperOpacity;
      context.drawImage(
        boss2SuperImg,
        boss.x - 10,
        boss.y + boss.h - 35,
        120,
        340
      );
      context.drawImage(
        boss2SuperImg,
        boss.x + 50,
        boss.y + boss.h - 35,
        120,
        340
      );
      context.globalAlpha = 1;
    }

    if (level == 2 && bossPowerActive && bossLife > 0) {
      context.drawImage(boss2Super1Img, boss.x - 90, 430, 280, 190);
      context.drawImage(boss2Super1Img, boss.x - 30, 430, 280, 190);

      context.globalAlpha = 0.5;
      context.drawImage(
        boss2SuperImg,
        boss.x - 10,
        boss.y + boss.h - 35,
        120,
        340
      );
      context.drawImage(
        boss2SuperImg,
        boss.x + 50,
        boss.y + boss.h - 35,
        120,
        340
      );
      context.globalAlpha = 1;

      bossSuperBullets.forEach((bullet) => {
        context.drawImage(
          boss2SuperBullet,
          bullet.x,
          bullet.y,
          bullet.w,
          bullet.h
        );
      });
    }

    if (level == 3 && bossLife > 0) {
      bossSuperBullets.forEach((bullet, index) => {
        context.drawImage(
          boss3BulletImg,
          bullet.x,
          bullet.y,
          bullet.w,
          bullet.h
        );
        bullet.y += 15;
        if (bullet.y >= canvas.height - 100) bossSuperBullets.splice(index, 1);
      });
    }
  }

  if (bossDying) {
    bossExplosions.forEach((item) => {
      context.drawImage(explosionImg, item.x, item.y, item.w, item.h);
    });
  }

  playerExplosionArr.forEach((item) => {
    context.drawImage(explosionImg, item.x, item.y, item.w, item.h);
  });

  context.beginPath();
  context.fillStyle = "darkgreen";
  context.fillRect(1, 1, 155, 44);
  context.lineWidth = "4";
  context.strokeStyle = "black";
  context.rect(1, 1, 156, 45);
  context.stroke();
  for (i = 0; i < bulletCount + 1; i++)
    context.drawImage(bulletImg, i * 15, 3, 23, 40);

  if (level > 1) {
    context.beginPath();
    context.fillStyle = "red";
    context.fillRect(1, 44, 155, 20);
    context.fillStyle = "darkorange";
    context.fillRect(1, 44, fuel, 20);
    context.lineWidth = "4";
    context.strokeStyle = "black";
    context.rect(1, 44, 156, 20);
    context.stroke();
    context.fillStyle = "black";
    context.font = "bold 15px sans-serif";
    context.fillText("BOOST", 10, 59);
  }

  context.beginPath();
  context.lineWidth = "2";
  context.strokeStyle = "black";
  context.rect(0, canvas.height - 12, 202, 12);
  context.stroke();
  context.fillStyle = "red";
  context.fillRect(1, canvas.height - 11, 200, 10);
  context.fillStyle = "green";
  context.fillRect(1, canvas.height - 11, life, 10);
  context.fillStyle = "darkorange";
  context.fillRect(1, canvas.height - 6, armor, 5);
  context.fillStyle = "black";
  context.font = "bold 15px sans-serif";
  context.fillText(
    "HP: " + (life == 200 ? life : life == 0 ? 0 : life.toFixed(1)),
    1,
    canvas.height - 15
  );
  if (level > 2)
    context.fillText(
      "Armor: " + (armor == 200 ? armor : armor == 0 ? 0 : armor.toFixed(1)),
      110,
      canvas.height - 15
    );

  context.fillStyle = "black";
  context.font = "bold 20px sans-serif";
  context.fillText("Score: " + score, canvas.width - 120, 30);
  context.fillText("Time: " + time, canvas.width - 111, 60);
};

const loop = () => {
  spawnEnemy();
  move();
  shoot();
  if (bossAlive && level == 1) bossFight1();
  if (bossAlive && level == 2) bossFight2();
  if (bossAlive && level == 3) bossFight3();
  if (bossAlive && level == 4) bossFight4();
  draw();
  requestAnimationFrame(loop);
};

const gameStart = () => {
  gameStarted = true;
  music.loop = true;
  music.play();
  waveInterval = setTimeout(wave, 14000);
  timeInterval = setInterval(() => {
    time++;
  }, 1000);
  loop();
};

$(document).keydown(function (e) {
  if (e.keyCode == arrowLeft) player.left = true;
  if (e.keyCode == arrowRight) player.right = true;
  if (e.keyCode == space) player.firing = true;
  if (e.keyCode == shift && level > 1) speedBoost = 2;
  if (e.keyCode == enter && !gameStarted) gameStart();
  if (e.keyCode == enter && gameLost) location.reload();
});

$(document).keyup(function (e) {
  if (e.keyCode == arrowLeft) player.left = false;
  if (e.keyCode == arrowRight) player.right = false;
  if (e.keyCode == space) player.firing = false;
  if (e.keyCode == shift) speedBoost = 1;
});
