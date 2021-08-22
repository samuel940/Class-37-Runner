var player, enemy, enemyGroup, enemies, ground, sword, beam, slash, pastPosition, health;
var cooldown, cooldown2, cooldown3, cooldownBar, cooldownBar2, cooldownBar3, cooldownBar4;
var healthBar, healthBar, invincibility, gameState, randomness;
var ground_img, background_img, groundGroup, bottom, energy, points;
var a, mana, manaBar, manaBar2, medkit, medkit_img, energy_img;

function preload() {
  ground_img = loadImage("sprites/ground.png");
  background_img = loadImage("sprites/background.png");
  medkit_img = loadImage("sprites/MedPack.png");
  energy_img = loadImage("sprites/energy.png");

}

function setup() {
  
  createCanvas(windowWidth,windowHeight);
  
  randomness = 0;
  sword = createSprite(400, height/2 - 100, 50, 50);
  sword.lifetime = 1;
  beam = createSprite(400, height/2 - 100, 50, 50);
  beam.lifetime = 1;
  slash = createSprite(400, height/2 - 100, 50, 50);
  slash.lifetime = 1;
  player = createSprite(400, height/2 - 100, 50, 50);
  player.shapeColor = rgb(0,0,150);
  medkit = createSprite(1400, 550, 50, 50);
  medkit.lifetime = 1;
  energy = createSprite(1400, 550, 50, 50);
  energy.lifetime = 1;
  bottom = createSprite(width/2,height*3/4,windowWidth,height/2);
  bottom.shapeColor = rgb(147,110,79);
  cooldown = 0;
  pastPosition = player.x - 1;
  health = 100;
  invincibility = 0;
  //groundGroup = createGroup();
  enemyGroup = createGroup();
  enemies = [];
  a = -1;
  enemy = createSprite(1400, 550, 50, 50);
  enemy.shapeColor = rgb(150,150,150);
  enemy.lifetime = 1;
  healthBar = createSprite(100,150,20,150);
  healthBar.shapeColor = "red";
  healthBar2 = createSprite(100,150,20,150);
  healthBar2.shapeColor = "green";
  
  ground = createSprite(width/2,height*1/2 + 25,width,50);
  ground.shapeColor = rgb(147,110,79);
  ground.velocityX = -10;

  points = 0;
  
  fill('white');
  stroke('black');
}

function draw() {
  background(background_img);
  player.velocityY = player.velocityY + 0.4;
  //enemyMovement();
  enemySpawn();
  camera.position.x = displayWidth/2;
  camera.position.y = player.y;
  player.collide(ground);
  enemyGroup.collide(ground);
  //medkit.collide(groundGroup);
  //energy.collide(groundGroup);
  if (health > 0) {
    enemySpawn();
  }
  
  if (player.isTouching(enemyGroup) && invincibility < 0) {
    for (var i = 0; i <= a; i+=1) {
      if (player.isTouching(enemies[i])){
        if (enemies[i].x > player.x) {
          player.x = player.x - 100;
        } else {
          player.x = player.x + 100;
        }
      }
    }
    
    health = health - 10;
    healthBar2.destroy();
    if (health > 0) {
      healthBar2 = createSprite(100,225-(3/4)*health,20,(3/2)*health);
      healthBar2.shapeColor = "green";
    }

    invincibility = 30;
    player.shapeColor = rgb(0,20,150,0.25);
  }
  

  if(invincibility >= 0) {
    player.shapeColor = rgb(0,20,150, 0.25);
    if(invincibility === 0) {
      player.shapeColor = rgb(0,20,150);
    }
    invincibility = invincibility - 1;
  }

  if(cooldown > 0){
   /* cooldownBar2 = createSprite(100,160-4*cooldown,20,8*cooldown);
    cooldownBar2.shapeColor = "red";*/
    cooldown = cooldown - 1;
  }
  
  if (ground.y - player.y <= 50 && player.velocityX != 0) {
    player.velocityX = 0;
  }
  if(ground.y - player.y <= 50 && keyWentDown("w")) {
    player.velocityY = -10;
    if (keyDown("shift") && keyDown("a")){
      player.velocityX = -10;
   } else if (keyDown("a")) {
     player.velocityX = -5;
   } else if (keyDown("shift") && keyDown("d")) {
    player.velocityX = 10;
   } else if(keyDown("d")) {
    player.velocityX = 5;
   }
   if (keyDown("a") && keyDown("d")) {
    player.velocityX = 0;
   }
  }
  if(keyDown("a") && ground.y - player.y <= 50) {
    pastPosition = player.x;
    if (keyDown("shift")) {
      player.x = player.x - 10;
    } else {
      player.x = player.x - 5;
    }
    
  }
  if(keyDown("d") && ground.y - player.y <= 50) {
    pastPosition = player.x;
    if (keyDown("shift")) {
      player.x = player.x + 10;
    } else {
      player.x = player.x + 5;
    }
  }
  if (keyWentDown("i") && cooldown === 0) {
    attack();
    cooldown = 6;
  }

  if (player.isTouching(medkit)) {
    medkit.destroy();
    if (health != 100) {
      health = health + 5;
      healthBar2.destroy();
      healthBar2 = createSprite(100,225-(3/4)*health,20,(3/2)*health);
      healthBar2.shapeColor = "green";
    }
  }
  
  if (enemyGroup.isTouching(sword)) {
    points = points + 100;
    for (var i = 0; i <= a; i+=1) {
      if (sword.isTouching(enemies[i])){
        kill = enemies[i];
        lootDrops();
        
        enemies[i].destroy();
      }
    }
  }
  
    if (frameCount%60 === 0) {
      ground.destroy();
      ground = createSprite(width/2,height*1/2 + 25,width,50);
      ground.shapeColor = "brown";
      ground.shapeColor = rgb(147,110,79);
      ground.velocityX = -10;
    }
  
  drawSprites();
  textSize(25);
  text("Points: " + points, width/2 - 50,height*1/2 + 75);
  text("a to move left, d to move right, w to jump, i to attack", width/2 - 120,height*1/2 + 300);
  
  if (health === 0) {
    textSize(50);
    text("Game Over", width/2 - 50,height*1/2 + 100 + 75);
  }
}



function attack() {
  if (player.x - pastPosition < 0) {
    sword = createSprite(player.x - 50,player.y,50,10)
  } else {
    sword = createSprite(player.x + 50,player.y,50,10)
  }
  sword.shapeColor = "white";
  sword.lifetime = 2;
}


function enemySpawn() {
  if (frameCount%60 === 0) {
    a = a + 1;
    enemy = createSprite(width*4/5, ground.y - random(50,200), 50, 50)
    enemy.velocityX = -10
    //if ()
    //console.log(enemyship.velocityY);
    enemy.lifetime = 500;
    enemyGroup.add(enemy);
    enemies.push(enemy);
    //console.log(enemies);
  }
}
function enemyMovement() {
  if (a >= 0) {
    for (var q = 0; q <= a; q+=1) {
      /*if (ground.y - enemies[q].y <= 41) {
        enemies[q].velocityY = -5;
      }*/
      enemies[q].velocityY =  enemies[q].velocityY + 0.4;

    }
  }
  }


  function lootDrops() {
    if (Math.round(random(1,10)) === 5 && medkit.lifetime === 0){
      medkit = createSprite(kill.x,kill.y,10,10);
      medkit.addImage("medkit",medkit_img);
      medkit.velocityY = 1;
      medkit.lifetime = 100;
    } else if (Math.round(random(1,10)) === 6 && medkit.lifetime === 0) {
      medkit = createSprite(kill.x,kill.y,10,10);
      medkit.addImage("medkit",medkit_img);
      medkit.velocityY = 1;
      medkit.lifetime = 100;
    }
  }