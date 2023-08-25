import kaboom from "kaboom";

const SPEED = 150;
const ORC_FIGHTER_SPEED = 50;
const BOTTOM = 755;
const TOP = 590;
const LEFT_EDGE = 20;
const RIGHT_EDGE = 1420;

kaboom();

loadSprite("background", "sprites/background.jpg");
loadSprite("player", "sprites/hero/walk/tile000.png");
loadSprite("orc_fighter", "sprites/enemies/orc_fighter/walk/tile000.png");

loadSprite("player_attack0", "sprites/hero/attack_1/tile000.png");
loadSprite("player_attack1", "sprites/hero/attack_1/tile001.png");
loadSprite("player_attack2", "sprites/hero/attack_1/tile002.png");
loadSprite("player_attack3", "sprites/hero/attack_1/tile003.png");

scene("game", () => {
  add([sprite("background", { width: width(), height: height() }, z(0))]);
  const player = add([
    sprite("player"),
    z(1),
    pos(300, 650),
    area({ scale: 0.5 }),
    anchor("bot"),
    body(),
  ]);

  //   ------Movement functions----------------
  onKeyDown("right", () => {
    if (player.pos.x < RIGHT_EDGE) {
      player.move(SPEED, 0);
      player.flipX = false;
    }
  });
  onKeyDown("left", () => {
    if (player.pos.x > LEFT_EDGE) {
      player.move(-SPEED, 0);
      player.flipX = true;
    }
  });
  onKeyDown("up", () => {
    if (player.pos.y > TOP) {
      player.move(0, -SPEED);
    }
  });
  onKeyDown("down", () => {
    if (player.pos.y < BOTTOM) {
      player.move(0, SPEED);
    }
  });
  //   -------------------------------------

  // -----------Attack Functions-----------------
  onKeyPress("space", () => {
    let flipX = player.flipX;
    player.use(sprite("player_attack0"));
    player.flipX = flipX;
    wait(0.1, () => {
      player.use(sprite("player_attack1"));
      player.flipX = flipX;
      wait(0.1, () => {
        player.use(sprite("player_attack2"));
        player.flipX = flipX;
        wait(0.1, () => {
          player.use(sprite("player_attack3"));
          player.flipX = flipX;
          wait(0.1, () => {
            player.use(sprite("player"));
            player.flipX = flipX;
          });
        });
      });
    });
  });
  //   ----------------------------------------

  //   -----------Generate Enemies------------------
  function spawnEnemies() {
    const enemy = add([
      area(),
      pos(width(), rand(TOP, BOTTOM)),
      anchor("bot"),
      move(LEFT, ORC_FIGHTER_SPEED),
      body(),
      area({ scale: 0.5 }),
      sprite("orc_fighter"),
      "orc_fighter",
    ]);
    enemy.flipX = true;

    onKeyPress("space", () => {
      if (enemy.pos.dist(player.pos) < 70) {
        destroy(enemy);
      }
    });
    // wait a random amount of time to spawn next bean
    wait(rand(0.7, 2), spawnEnemies);
  }
  spawnEnemies();
});

go("game");
