# Game of Life Designer

**Motivation**

Ever since I stumbled upon Conway's Game of Life ([Wikipedia Link](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)), I wanted to try implementing it because I found it really interesting how a few simple rules can generate so much evolution.

The original game is known as a zero-player-game, meaning you mainly just watch it do its thing without interacting with it at all. <br />
I wanted to change that and make it as interactive as possible by letting the user design the initial starting points and even delete or add new cells mid game.


**Animation rules**

Each point represents a cell.

* Any live cell with two or three live neighbours survives to the next iteration.
* Any dead cell with exactly three neighbours becomes a live cell at the next iteration.
* All other live cells die at the next iteration and all other dead cells stay dead.


**Adaptation features**

* Play / Pause.
* Clear the board and use the mouse to draw your own beginnings.
* Wide choice of colours for the cells.
* Adding / Removing cells from the board at any point with a range of different sized "brushes" to add / remove from 1 to 121(11x11) cells at once.
* Customizable animation speed from 1 to 60 iterations per second. 
* Keyboard shortcuts for those who want a game-like experience and do not like buttons as much.


**Try it**

I hosted this project on Heroku here: [link](https://game-of-life-designer.herokuapp.com/)

If something seems to work incorrectly, try opening the link in a private window or delete browsing data. <br />
I noticed that when I deploy any JS changes, the browser sometimes uses the old version instead of the new and that may cause unintended issues.
