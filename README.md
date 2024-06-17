# Wordle_clone
### A wordle clone created using JS,CSS and HTML
#### Setup
* Download the Wordle folder.
*  Edit the paths for stylesheet and script in index.html if needed.
*  A live server is required to run the code since it imports realDictionary from dictionary.js into index.js. I used the live server extension on VScode.
*  If using vscode, right click on index.html and click run with live server. It should launch the site on the default browser of the system.
#### Note
This is my first project using the JS,CSS and HTML, which is why I am positive the code can be improved vastly. Referenced multiple tutorials for making wordle clones but implemented the word matching logic and animations by myself.
#### Future implementations (not required)
**I do not plan on implementing any of these features, I consider the project completed.**
Here is a list of features that can be implemented:
* A feature similar to the actual wordle game where refreshing a page doesnt change the word or the previous guesses can be added using cookies. This can be done by saving the state of the game and checking upon startup if a bool variable has been flipped.
* The qwerty layout of buttons can be added as seen on the actual site but I don't plan on implementing it.
* A hint feature which allows the player to get 1 green letter revealed in exchange for 1 of the remaining tries, and this can be done only once, can be added but it would require checking conditions such as if there is a spare try left which can be removed, and having to track previously green letters to avoid revealing the same letter again.

