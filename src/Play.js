class Play extends Phaser.Scene {
  constructor() {
    super("playScene");

    this.score = 0;
    this.totalShots = 0;
    this.shotPercentage = 0;
  }

  init() {
    // useful variables
    this.SHOT_VELOCITY_X = 200;
    this.SHOT_VELOCITY_Y_MIN = 700;
    this.SHOT_VELOCITY_Y_MAX = 1100;
  }

  preload() {
    this.load.path = "./assets/img/";
    this.load.image("grass", "grass.jpg");
    this.load.image("cup", "cup.jpg");
    this.load.image("ball", "ball.png");
    this.load.image("wall", "wall.png");
    this.load.image("oneway", "one_way_wall.png");
  }

  create() {
    let scoreConfig = {
      fontFamily: "Courier",
      fontSize: "28px",
      backgroundColor: "#F3B141",
      color: "#FFFFFF ",
      align: "center",
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 400,
    };

    let percentageConfig = {
      fontFamily: "Courier",
      fontSize: "28px",
      backgroundColor: "#F3B141",
      color: "#FFFFFF ",
      align: "center",
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 100,
    };

    // add background grass
    this.grass = this.add.image(0, 0, "grass").setOrigin(0);

    // add cup
    this.cup = this.physics.add.sprite(width / 2, height / 10, "cup");
    this.cup.body.setCircle(this.cup.width / 4);
    this.cup.body.setOffset(this.cup.width / 4);
    this.cup.body.setImmovable(true);

    // add ball
    this.ball = this.physics.add.sprite(
      width / 2,
      height - height / 10,
      "ball"
    );

    this.ball.body.setCircle(this.ball.width / 2);
    this.ball.body.setCollideWorldBounds(true);
    this.ball.body.setBounce(0.5);
    this.ball.body.setDamping(true).setDrag(0.5);

    // add walls
    let wallA = this.physics.add.sprite(0, height / 4, "wall");
    wallA.setX(
      Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2)
    );
    wallA.body.setImmovable(true);

    this.wallB = this.physics.add.sprite(0, height / 2, "wall");
    this.wallB.setX(
      Phaser.Math.Between(
        0 + this.wallB.width / 2,
        width - this.wallB.width / 2
      )
    );

    this.wallB.setCollideWorldBounds(true);

    this.wallB.body.setImmovable(true);
    this.wallB.setBounce(1, 0);

    this.wallB.setVelocityX(100);

    this.walls = this.add.group([wallA, this.wallB]);

    // add one-way
    this.oneWay = this.physics.add.sprite(
      width / 2,
      (height / 4) * 3,
      "oneway"
    );

    this.oneWay.setX(
      Phaser.Math.Between(
        0 + this.oneWay.width / 2,
        width - this.oneWay.width / 2
      )
    );

    this.oneWay.body.setImmovable(true);

    this.oneWay.body.checkCollision.down = false;
    // add pointer input
    this.input.on("pointerdown", (pointer) => {
      this.totalShots++;
      this.scoreText.setText(
        "Score: " + this.score + " / Shots: " + this.totalShots
      );

      this.shotPercentageText.setText(this.score / this.totalShots + "%");
      let shotDirection = pointer.y <= this.ball.y ? 1 : -1;

      let xDirection = pointer.x < this.ball.x ? -1 : 1;

      this.ball.body.setVelocityX(this.SHOT_VELOCITY_X * xDirection);

      this.ball.body.setVelocityY(
        Phaser.Math.Between(
          this.SHOT_VELOCITY_Y_MIN,
          this.SHOT_VELOCITY_Y_MAX
        ) * shotDirection
      );
    });

    // cup/ball collision
    this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
      // ball.destroy();

      this.score += 1;
      this.scoreText.setText(
        "Score: " + this.score + " / Shots: " + this.totalShots
      );
      this.shotPercentageText.setText(this.score / this.totalShots + "%");
      ball.setPosition(width / 2, height - height / 10);
      ball.setVelocity(0, 0);
    });

    // ball/wall collision
    this.physics.add.collider(this.ball, this.walls);

    // ball/one-way collision
    this.physics.add.collider(this.ball, this.oneWay);

    this.scoreText = this.add.text(16, 16, "Score: 0 / Shots: 0", scoreConfig);
    this.shotPercentageText = this.add.text(16, 60, "0%", percentageConfig);
  }

  update() {}
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[C] Add ball reset logic on successful shot
[C] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[C] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/
