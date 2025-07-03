# 🐮 SuperFarmer – Browser Game

SuperFarmer is a browser version of the classic board game where you manage your own farm. Breed animals, trade them, and protect them from foxes and wolves. Play alone or with friends in local multiplayer mode!

## 🎮 Features

- 🔄 Turns for 2–4 players
- 🐰 Animal drawing system with a risk of a fox or wolf attack
- ♻️ Intelligent animal trade system
- 🏆 Victory conditions with a confetti effect
- 📜 Event log of the last moves

## 🧱 Technologies

- ⚡ [Vite](https://vitejs.dev/) – super fast bundler
- ⚛️ React + TypeScript – user interface and game logic
- 🎨 CSS – styling elements and animations

## 🚀 How to run the project

```bash
  npm install
  npm run dev
```
Visit the following address in your browser:

http://localhost:5173

## 🐮 SuperFarmer Game Start Screen

After launching the application, the user is greeted with an atmospheric main screen and the title **SuperFarmer**.

Below is the player selection panel — the following options are available:

- `2 graczy`
- `3 graczy`
- `4 graczy`

Clicking on one of them starts the game.

![alt text](image.png)

## 🎯 Gameplay Screen – Player's Turn

After selecting the number of players, the actual game begins. The turn interface includes:

- **Header** with the current player number.
- **Possible trades panel** on the left – the player can trade animals according to the established rules by clicking the `Wybierz` button.
- **Farm status** in the center – shows the current number of owned animals.
- **`Rzuć kośćmi 🎲` button**, which activates the drawing of two animals and any special events (e.g., wolf or fox attack).
- **Game log** on the right – records every move, dice rolls, breeding, trades, and other important events in the game.

![alt text](image-1.png)

## 🏆 Victory

To win the game **SuperFarmer**, the player must collect the following animals:

- 🐇 1 Rabbit
- 🐑 1 Sheep
- 🐖 1 Pig
- 🐄 1 Cow
- 🐎 1 Horse

The game starts with 1 Rabbit.

Once these conditions are met:

- A **victory message** appears on the screen, e.g., `🏆 Gracz 3 wygrał grę!`
- **Confetti starts falling** from the sky in random colors and animations.
- A **"Play Again 🔁"** button appears, which when clicked **takes the player back to the start screen**, where a new number of players can be selected, and a new game can begin.

![alt text](image-2.png)
