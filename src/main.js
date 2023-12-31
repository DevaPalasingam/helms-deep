import kaboom from "kaboom";

const SPEED = 150;
const ORC_FIGHTER_SPEED = 50;
const ORC_RUNNER_SPEED = 250;
const ORC_SHAMAN_SPEED = 30;
const BOTTOM = 755;
const TOP = 590;
const LEFT_EDGE = 20;
const RIGHT_EDGE = 1420;
const DOOR_LEFT = 550;
const DOOR_RIGHT = 850;

kaboom();

loadSprite("background", "sprites/background.jpg");
loadSprite("player", "sprites/hero/walk/tile000.png");
loadSprite("orc_fighter", "sprites/enemies/orc_fighter/walk/tile000.png");
loadSprite("orc_runner", "sprites/enemies/orc_runner/walk/tile000.png");
loadSprite("orc_shaman", "sprites/enemies/orc_shaman/walk/tile000.png");

loadSprite("player_attack0", "sprites/hero/attack_1/tile000.png");
loadSprite("player_attack1", "sprites/hero/attack_1/tile001.png");
loadSprite("player_attack2", "sprites/hero/attack_1/tile002.png");
loadSprite("player_attack3", "sprites/hero/attack_1/tile003.png");

loadSprite("orc_fighter_dead0", "sprites/enemies/orc_fighter/dead/tile000.png");
loadSprite("orc_fighter_dead1", "sprites/enemies/orc_fighter/dead/tile001.png");
loadSprite("orc_fighter_dead2", "sprites/enemies/orc_fighter/dead/tile002.png");
loadSprite("orc_fighter_dead3", "sprites/enemies/orc_fighter/dead/tile003.png");

loadSprite("orc_runner_dead0", "sprites/enemies/orc_runner/dead/tile000.png");
loadSprite("orc_runner_dead1", "sprites/enemies/orc_runner/dead/tile001.png");

loadSprite("orc_shaman_dead0", "sprites/enemies/orc_shaman/dead/tile000.png");
loadSprite("orc_shaman_dead1", "sprites/enemies/orc_shaman/dead/tile001.png");
loadSprite("orc_shaman_dead2", "sprites/enemies/orc_shaman/dead/tile002.png");
loadSprite("orc_shaman_dead3", "sprites/enemies/orc_shaman/dead/tile003.png");
loadSprite("orc_shaman_dead4", "sprites/enemies/orc_shaman/dead/tile004.png");

loadSprite("orc_fighter_jump0", "sprites/enemies/orc_fighter/jump/tile000.png");
loadSprite("orc_fighter_jump1", "sprites/enemies/orc_fighter/jump/tile001.png");
loadSprite("orc_fighter_jump2", "sprites/enemies/orc_fighter/jump/tile002.png");
loadSprite("orc_fighter_jump3", "sprites/enemies/orc_fighter/jump/tile003.png");
loadSprite("orc_fighter_jump4", "sprites/enemies/orc_fighter/jump/tile004.png");

loadSprite("orc_runner_jump0", "sprites/enemies/orc_runner/jump/tile000.png");
loadSprite("orc_runner_jump1", "sprites/enemies/orc_runner/jump/tile001.png");
loadSprite("orc_runner_jump2", "sprites/enemies/orc_runner/jump/tile002.png");
loadSprite("orc_runner_jump3", "sprites/enemies/orc_runner/jump/tile003.png");
loadSprite("orc_runner_jump4", "sprites/enemies/orc_runner/jump/tile004.png");
loadSprite("orc_runner_jump5", "sprites/enemies/orc_runner/jump/tile005.png");
loadSprite("orc_runner_jump6", "sprites/enemies/orc_runner/jump/tile006.png");
loadSprite("orc_runner_jump7", "sprites/enemies/orc_runner/jump/tile007.png");

loadSprite("orc_shaman_magic0", "sprites/enemies/orc_shaman/magic/tile000.png");
loadSprite("orc_shaman_magic1", "sprites/enemies/orc_shaman/magic/tile001.png");
loadSprite("orc_shaman_magic2", "sprites/enemies/orc_shaman/magic/tile002.png");
loadSprite("orc_shaman_magic3", "sprites/enemies/orc_shaman/magic/tile003.png");
loadSprite("orc_shaman_magic4", "sprites/enemies/orc_shaman/magic/tile004.png");
loadSprite("orc_shaman_magic5", "sprites/enemies/orc_shaman/magic/tile005.png");

scene("game", () => {
  add([sprite("background", { width: width(), height: height() }, z(0))]);
  const player = add([
    sprite("player"),
    z(1),
    pos(900, 650),
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
  function spawnFighters() {
    let randSpawn = rand(0, 2);
    let spawnPoint = 0;
    let enemyMove = ORC_FIGHTER_SPEED;
    let enemyFlip = false;
    if (randSpawn > 1) {
      spawnPoint = width();
      enemyMove = -ORC_FIGHTER_SPEED;
      enemyFlip = true;
    }

    const enemy = add([
      area(),
      pos(spawnPoint, rand(TOP, BOTTOM)),
      anchor("bot"),
      body(),
      area({ scale: 0.5 }),
      sprite("orc_fighter"),
      state("run", ["run", "getClose", "attack"]),
      "orc_fighter",
    ]);
    enemy.flipX = enemyFlip;

    // ----------Orc Fighter States--------------------
    let attackState = false;
    enemy.onStateUpdate("run", () => {
      enemy.move(enemyMove, 0);
      if (enemy.pos.x > DOOR_LEFT && enemy.pos.x < DOOR_RIGHT) {
        enemy.enterState("getClose");
      }
    });
    enemy.onStateUpdate("getClose", () => {
      enemy.move(0, -ORC_FIGHTER_SPEED);
      if (enemy.pos.y <= TOP) {
        enemy.enterState("attack");
      }
    });
    enemy.onStateUpdate("attack", () => {
      if (!attackState) {
        attackState = true;
        wait(0.1, () => {
          enemy.use(sprite("orc_fighter_jump0"));
          enemy.flip = enemyFlip;
          wait(0.1, () => {
            enemy.use(sprite("orc_fighter_jump1"));
            enemy.flip = enemyFlip;
            wait(0.1, () => {
              enemy.use(sprite("orc_fighter_jump2"));
              enemy.flip = enemyFlip;
              wait(0.1, () => {
                enemy.use(sprite("orc_fighter_jump3"));
                enemy.flip = enemyFlip;
                wait(0.1, () => {
                  enemy.use(sprite("orc_fighter_jump4"));
                  enemy.flip = enemyFlip;
                  wait(0.1, () => {
                    addKaboom(enemy.pos);
                    shake();
                    destroy(enemy);
                  });
                });
              });
            });
          });
        });
      }
    });
    // Orc Fighter States
    // ---------------------------------------

    // --------Orc Fighter Death Sequence-------------------
    onKeyPress("space", () => {
      wait(0.2, () => {
        if (enemy.pos.dist(player.pos) < 70) {
          let flipX = enemy.flipX;
          wait(0.1, () => {
            enemy.use(sprite("orc_fighter_dead0"));
            enemy.flipX = flipX;
            wait(0.1, () => {
              enemy.use(sprite("orc_fighter_dead1"));
              enemy.flipX = flipX;
              wait(0.1, () => {
                enemy.use(sprite("orc_fighter_dead2"));
                enemy.flipX = flipX;
                wait(0.1, () => {
                  enemy.use(sprite("orc_fighter_dead3"));
                  enemy.flipX = flipX;
                  wait(0.1, () => {
                    destroy(enemy);
                  });
                });
              });
            });
          });
        }
      });
    });
    // --------------------------------------

    // wait a random amount of time to spawn next bean
    wait(rand(0.7, 2), spawnFighters);
  }
  function spawnRunners() {
    let randSpawn = rand(0, 2);
    let spawnPoint = 0;
    let enemyMove = ORC_RUNNER_SPEED;
    let enemyFlip = false;
    if (randSpawn > 1) {
      spawnPoint = width();
      enemyMove = -ORC_RUNNER_SPEED;
      enemyFlip = true;
    }

    const enemy = add([
      area(),
      pos(spawnPoint, rand(TOP, BOTTOM)),
      anchor("bot"),
      body(),
      area({ scale: 0.5 }),
      sprite("orc_runner"),
      state("run", ["run", "getClose", "attack"]),
      "orc_runner",
    ]);
    enemy.flipX = enemyFlip;

    // ----------Orc Runner States--------------------
    let attackState = false;
    enemy.onStateUpdate("run", () => {
      enemy.move(enemyMove, 0);
      if (enemy.pos.x > DOOR_LEFT + 100 && enemy.pos.x < DOOR_RIGHT - 100) {
        enemy.enterState("getClose");
      }
    });
    enemy.onStateUpdate("getClose", () => {
      enemy.move(0, -ORC_RUNNER_SPEED);
      if (enemy.pos.y <= TOP) {
        enemy.enterState("attack");
      }
    });
    enemy.onStateUpdate("attack", () => {
      if (!attackState) {
        attackState = true;
        wait(0.1, () => {
          enemy.use(sprite("orc_runner_jump0"));
          enemy.flip = enemyFlip;
          wait(0.1, () => {
            enemy.use(sprite("orc_runner_jump1"));
            enemy.flip = enemyFlip;
            wait(0.1, () => {
              enemy.use(sprite("orc_runner_jump2"));
              enemy.flip = enemyFlip;
              wait(0.1, () => {
                enemy.use(sprite("orc_runner_jump3"));
                enemy.flip = enemyFlip;
                wait(0.1, () => {
                  enemy.use(sprite("orc_runner_jump4"));
                  enemy.flip = enemyFlip;
                  wait(0.1, () => {
                    enemy.use(sprite("orc_runner_jump5"));
                    enemy.flip = enemyFlip;
                    wait(0.1, () => {
                      enemy.use(sprite("orc_runner_jump6"));
                      enemy.flip = enemyFlip;
                      wait(0.1, () => {
                        enemy.use(sprite("orc_runner_jump7"));
                        enemy.flip = enemyFlip;
                        wait(0.1, () => {
                          addKaboom(enemy.pos);
                          shake();
                          destroy(enemy);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }
    });
    // Orc Runner States
    // ---------------------------------------

    // --------Orc Runner Death Sequence-------------------
    onKeyPress("space", () => {
      wait(0.2, () => {
        if (enemy.pos.dist(player.pos) < 70) {
          let flipX = enemy.flipX;
          wait(0.1, () => {
            enemy.use(sprite("orc_runner_dead0"));
            enemy.flipX = flipX;
            wait(0.1, () => {
              enemy.use(sprite("orc_runner_dead1"));
              enemy.flipX = flipX;
              wait(0.1, () => {
                destroy(enemy);
              });
            });
          });
        }
      });
    });
    // --------------------------------------

    // wait a random amount of time to spawn next bean
    wait(rand(6, 8), spawnRunners);
  }
  function spawnShamans() {
    let randSpawn = rand(0, 2);
    let spawnPoint = 0;
    let enemyMove = ORC_SHAMAN_SPEED;
    let enemyFlip = false;
    if (randSpawn > 1) {
      spawnPoint = width();
      enemyMove = -ORC_SHAMAN_SPEED;
      enemyFlip = true;
    }

    const enemy = add([
      area(),
      pos(spawnPoint, rand(TOP, BOTTOM)),
      anchor("bot"),
      body(),
      area({ scale: 0.5 }),
      sprite("orc_shaman"),
      state("run", ["run", "getClose", "attack"]),
      "orc_shaman",
    ]);
    enemy.flipX = enemyFlip;
    // TODO: delete
    // const shamanKaboom1 = add([pos(700, 300)]);
    // let shamanKaboom2 = shamanKaboom1;
    // shamanKaboom2.x = 600;
    // shamanKaboom2.y = 200;
    // let shamanKaboom3 = shamanKaboom1;
    // shamanKaboom3.x = 800;
    // shamanKaboom3.y = 200;
    // let shamanKaboom4 = shamanKaboom1;
    // shamanKaboom4.x = 600;
    // shamanKaboom4.y = 400;
    // let shamanKaboom5 = shamanKaboom1;
    // shamanKaboom5.x = 800;
    // shamanKaboom5.y = 400;

    // ----------Orc Shaman States--------------------
    let attackState = false;
    enemy.onStateUpdate("run", () => {
      enemy.move(enemyMove, 0);
      if (enemy.pos.x > DOOR_LEFT - 200 && enemy.pos.x < DOOR_RIGHT + 200) {
        enemy.enterState("getClose");
      }
    });
    enemy.onStateUpdate("getClose", () => {
      enemy.move(0, -ORC_SHAMAN_SPEED);
      if (enemy.pos.y <= TOP) {
        enemy.enterState("attack");
      }
    });
    enemy.onStateUpdate("attack", () => {
      if (!attackState) {
        attackState = true;
        wait(0.1, () => {
          enemy.use(sprite("orc_shaman_magic0"));
          enemy.flip = enemyFlip;
          wait(0.1, () => {
            enemy.use(sprite("orc_shaman_magic1"));
            enemy.flip = enemyFlip;
            wait(0.1, () => {
              enemy.use(sprite("orc_shaman_magic2"));
              enemy.flip = enemyFlip;
              wait(0.1, () => {
                enemy.use(sprite("orc_shaman_magic3"));
                enemy.flip = enemyFlip;
                wait(0.1, () => {
                  enemy.use(sprite("orc_shaman_magic4"));
                  enemy.flip = enemyFlip;
                  wait(0.1, () => {
                    enemy.use(sprite("orc_shaman_magic5"));
                    enemy.flip = enemyFlip;
                    wait(0.1, () => {
                      enemy.use(opacity(0));
                      enemy.pos.x = 700;
                      enemy.pos.y = 300;
                      addKaboom(enemy.pos);
                      shake(120);
                      wait(0.1, () => {
                        enemy.pos.x = 600;
                        enemy.pos.y = 200;
                        addKaboom(enemy.pos);
                        shake(120);
                        wait(0.1, () => {
                          enemy.pos.x = 800;
                          enemy.pos.y = 200;
                          addKaboom(enemy.pos);
                          shake(120);
                          wait(0.1, () => {
                            enemy.pos.x = 600;
                            enemy.pos.y = 400;
                            addKaboom(enemy.pos);
                            shake(120);
                            wait(0.1, () => {
                              enemy.pos.x = 800;
                              enemy.pos.y = 400;
                              addKaboom(enemy.pos);
                              shake(120);
                              destroy(enemy);
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }
    });
    // Orc Shaman States
    // ---------------------------------------

    // --------Orc Shaman Death Sequence-------------------
    onKeyPress("space", () => {
      wait(0.2, () => {
        if (enemy.pos.dist(player.pos) < 70) {
          let flipX = enemy.flipX;
          wait(0.1, () => {
            enemy.use(sprite("orc_shaman_dead0"));
            enemy.flipX = flipX;
            wait(0.1, () => {
              enemy.use(sprite("orc_shaman_dead1"));
              enemy.flipX = flipX;
              wait(0.1, () => {
                enemy.use(sprite("orc_shaman_dead2"));
                enemy.flipX = flipX;
                wait(0.1, () => {
                  enemy.use(sprite("orc_shaman_dead3"));
                  enemy.flipX = flipX;
                  wait(0.1, () => {
                    enemy.use(sprite("orc_shaman_dead4"));
                    enemy.flipX = flipX;
                    wait(0.1, () => {
                      destroy(enemy);
                    });
                  });
                });
              });
            });
          });
        }
      });
    });
    // --------------------------------------

    // wait a random amount of time to spawn next bean
    wait(rand(10, 12), spawnShamans);
  }
  spawnFighters();
  spawnRunners();
  spawnShamans();
  //   ------------------------------------------------------------
});

go("game");
