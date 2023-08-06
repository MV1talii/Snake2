document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.querySelector(".game-canvas");
  const context = canvas.getContext("2d");

  const gameArea = document.querySelector(".game-area");
  const scoreDisplay = document.querySelector(".game-skore");
  const startButton = document.querySelector(".game-start");
  const resetButton = document.querySelector(".game-reset");
  const foodImage = document.querySelector(".food-image");

  const snakeImg = new Image();
  snakeImg.src = "image/snake.png";

  const foodImages = [
    { src: "image/cherry.png", points: 2 },
    { src: "image/apple.png", points: 1 },
    { src: "image/mushroom.png", points: 3 },
  ];
  let currentFoodImageIndex = 0;

  const tileSize = 20;
  const rows = canvas.height / tileSize;
  const cols = canvas.width / tileSize;

  let snake = [];
  let food = {};
  let score = 0;
  let direction = "right";
  let gameSpeed = 500; // Змінна для визначення швидкості руху змійки

  // Змінна для збереження останніх координат останнього сегменту змійки
  let tailLastPos = { x: 0, y: 0 };

  // Змінна для визначення поточного рівня швидкості змійки
  let currentLevel = 1;

  // Змінна для збереження кількості з'їденої їжі на кожному рівні
  let foodEaten = 0;

  // Функція для старту нової гри
  function startGame() {
    snake = [
      { x: 4, y: 2 },
      { x: 3, y: 2 },
      { x: 2, y: 2 },
    ];

    food = spawnFood();
    score = 0;
    direction = "right";

    scoreDisplay.textContent = "Очки: " + score;

    currentLevel = 1; // Початковий рівень
    gameSpeed = 500; // Початкова швидкість руху змійки
    clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
  }

  // Функція для відображення змійки та їжі на полі гри
  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
  }

  // Функція для відображення змійки
  function drawSnake() {
    snake.forEach((segment) => {
      context.drawImage(
        snakeImg,
        segment.x * tileSize,
        segment.y * tileSize,
        tileSize,
        tileSize
      );
    });
  }

  // Функція для відображення їжі
  function drawFood() {
    context.drawImage(
      foodImage,
      food.x * tileSize,
      food.y * tileSize,
      tileSize,
      tileSize
    );
  }

  // Функція для переміщення змійки
  function move() {
    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }

    snake.unshift(head);

    // Зберігаємо координати останнього сегменту перед переміщенням
    tailLastPos.x = snake[snake.length - 1].x;
    tailLastPos.y = snake[snake.length - 1].y;

    // Перевірка на з'їдання їжі
    if (head.x === food.x && head.y === food.y) {
      score += food.points;
      scoreDisplay.textContent = "Очки: " + score;
      changeFoodImage(); // Зміна зображення їжі
      food = spawnFood();
      increaseSpeed(); // Перевірка на зміну швидкості
    } else {
      snake.pop();
    }
  }

  // Функція для зміни зображення їжі
  function changeFoodImage() {
    currentFoodImageIndex = (currentFoodImageIndex + 1) % foodImages.length;
    foodImage.src = foodImages[currentFoodImageIndex].src;
  }

  // Функція для випадкового розміщення їжі на полі
  function spawnFood() {
    let newFood;
    let overlap;

    do {
      overlap = false;
      newFood = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
        points: foodImages[currentFoodImageIndex].points,
      };

      // Перевірка чи нові координати збігаються з координатами сегментів змійки
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === newFood.x && snake[i].y === newFood.y) {
          overlap = true;
          break;
        }
      }
    } while (overlap);

    return newFood;
  }

  // Функція для перевірки столкнення змійки з краєм поля або самою собою
  function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
      gameOver();
    }

    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        gameOver();
      }
    }
  }

  // Функція для обробки кінця гри
  function gameOver() {
    clearInterval(gameLoop);
    alert("Гру закінчено! Ваш рахунок: " + score);

    // Після закінчення гри відновлюємо останні координати останнього сегменту змійки
    snake.push({ x: tailLastPos.x, y: tailLastPos.y });
  }

  // Функція для збільшення швидкості змійки при досягненні нового рівня
  function increaseSpeed() {
    foodEaten++;
    if (foodEaten % 5 === 0 && currentLevel < 5) {
      currentLevel++;
      switch (currentLevel) {
        case 2:
          gameSpeed = 400;
          break;
        case 3:
          gameSpeed = 300;
          break;
        case 4:
          gameSpeed = 200;
          break;
        case 5:
          gameSpeed = 100;
          break;
      }
      clearInterval(gameLoop);
      gameLoop = setInterval(update, gameSpeed);
    }
  }

  // Обробник події клавіатури для керування змійкою
  function handleKeyPress(e) {
    switch (e.key) {
      case "ArrowUp":
        if (direction !== "down") {
          direction = "up";
        }
        break;
      case "ArrowDown":
        if (direction !== "up") {
          direction = "down";
        }
        break;
      case "ArrowLeft":
        if (direction !== "right") {
          direction = "left";
        }
        break;
      case "ArrowRight":
        if (direction !== "left") {
          direction = "right";
        }
        break;
    }
  }

  // Обробник події кліку кнопки Start
  startButton.addEventListener("click", function () {
    startGame();
  });

  // Обробник події кліку кнопки Restart
  resetButton.addEventListener("click", function () {
    startGame();
  });

  // Обробник події клавіатури для керування змійкою
  document.addEventListener("keydown", function (e) {
    handleKeyPress(e);
  });

  // Оновлення стану гри
  function update() {
    move();
    checkCollision();
    draw();
  }

  // Ініціалізація гри
  let gameLoop;
  //   startGame();
});
