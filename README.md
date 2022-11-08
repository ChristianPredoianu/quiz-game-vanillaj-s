# Quiz Game

 <!-- PROJECT LOGO -->   
<br />
<p align="center">
  <a href="https://github.com/ChristianPredoianu/portfolio-latest">
    <img src="src/assets/game-background.jpg" alt="Logo" width="300" height="200">
  </a> 

  <h3 align="center">Quiz Game</h3>
   
  <p align="center">
    <a href="https://github.com/ChristianPredoianu/quiz-game-vanillajs"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://quiz-game-vanillajs.netlify.app/">View Demo</a>
    ·
    <a href="https://github.com/ChristianPredoianu/quiz-game-vanillajs/issues">Report Bug</a>
  </p>
</p>

  

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

A quiz game made with vanilla js.

### Built With

* [HTML5](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
* [Css3](https://developer.mozilla.org/en-US/docs/Web/CSS)
* [Sass](https://sass-lang.com/)
* [Vanilla js](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [Parcel](https://parceljs.org/)
* [Open Trivia Api](https://opentdb.com/)




<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ChristianPredoianu/quiz-game-vanillajs.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ``` 
3. Serve with hot reload at localhost
   ```sh
    npm run start
   ``` 
5. Build for production 
   ```sh
    npm run build
   
   ```

  
<!-- USAGE EXAMPLES -->
## Usage

The user must select game options before starting the game. The options are: Category, difficulty, amount of questions and questions type (multiple or true/false).
The game uses the Open trivia api. Some combinations of game options doesn't return any questions back from the api. This is a lack of questions from Open trivia api.
For example category: Politics, difficulty: hard, amount of questions: 50 and type of questions: true/false. 
The user get's notified about this and has to choose other game options. 
For every questions there is a timer set to 15s. If the user doesn't choose an answer before the timer runs out the answers will be disabled and the user gets 0 
point for that particular question. If the user doesn't choose an answer while the timer is active the user gets a notification to choose an answer. That means
that the user can't go to the next question before choosing an answer while the timer is active. When all questions are answered the user is presented the total score in %
and is asked to submit a name. When resetting the game, the game uses localstorage to set the players scores and showing the top 3 highscores at the start of the game. 

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

Christian Predoianu - [@linkedin](https://se.linkedin.com/in/christian-predoianu-369218157) - christianpredoianu@yahoo.com

Project Link: [https://github.com/ChristianPredoianu/quiz-game-vanillajs](https://github.com/ChristianPredoianu/quiz-game-vanillajs)



<!-- ACKNOWLEDGEMENTS --> 
## Acknowledgements
* [Google Fonts](https://fonts.google.com/)




