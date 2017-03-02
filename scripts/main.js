// hide currentWord
(function() {
    //pick a letter from keyboard. Return letter chosen
    $("#alphabet-keypad").on("click", ".letter-button", function() {
        var letterPicked = $(this);
        letterPicked
            .removeClass("letter-button")
            .addClass("letter-disabled");
        letterPicked = letterPicked.html();
        handlePickedLetter(letterPicked);
    });
    // handle picked letter
    function handlePickedLetter(letterPicked) {
        var resultMatches = [];
        var index = currentWord.indexOf(letterPicked);
        // if letterPicked matches one or more letters in the current word push all instances of that letter to resultMatches
        while (index !== -1) {
            resultMatches.push(index);
            index = currentWord.indexOf(letterPicked, index + 1);
        }
        //if resultMatches is greater than 0 proceed to place them in the DOM
        if (resultMatches.length > 0) {
            var letterNode = document.getElementsByClassName("is-letter");
            resultMatches.map(function(num) {
                var DomElem = document.createElement("span");
                DomElem.innerHTML = currentWordFull[num].toUpperCase();
                letterNode[num].appendChild(DomElem);
                displayCongratulatoryMessageOnWin();
            });
            //if letterNode is not greater than 0 put the letter in the graveyard
        } else {
            var DomElem = document.createElement("div");
            DomElem.className = "grave-letter";
            DomElem.innerHTML = letterPicked;
            document.getElementById("letter-graveyard").appendChild(DomElem);
            hangmanGraphic.addBodyPart();
            displayGameOverMessageOnLose();
        }
    }
    // display Congratulatory Message
    function displayCongratulatoryMessageOnWin() {
        var correctlyGuessedLettersCount = $(".is-letter > span").length;
        if (correctlyGuessedLettersCount === currentWord.length) {
            $("#congratulatory_message").modal('show');
        }
    }
    // display gameOver Message
    function displayGameOverMessageOnLose() {
        var incorrectlyGuessedLettersCount = $("#letter-graveyard > div").length;
        //If number of letters guessed is equal to maxParts
        if (incorrectlyGuessedLettersCount === 7) {
            $("#gameover_message").modal('show');
            var gameOverMessage = "Uh oh. You took too many tries to guess the word. The correct word is - '" + currentWord + "'. Better luck next time.";
            $(".lead").text(gameOverMessage);
        }
    }
    //Hangman game graphic
    var hangmanGraphic = function() {
        var bodyParts = 0,
            maxParts = 7;
        return {
            addBodyPart: function() {
                if (bodyParts < maxParts) {
                    ++bodyParts;
                    $("#hangman-frame" + bodyParts).css("opacity", 1);
                }
            },
            reset: function() {
                $(".hangman-frames").css("opacity", 0);
                $("#hangman-frame0").css("opacity", 1);
                bodyParts = 0;
                resetAlphabetKeypad();
                removeGraveyardLetters();
                removeCorrectlyGuessedLetters();
                removeFillInTheBlanksAroundOldWord();
                setWordToBeGuessed();
            }
        };
    }();
    //refactored into interface for losing a life and reseting the game
    $(".reset").on("click", hangmanGraphic.reset);

    function resetAlphabetKeypad() {
        $("#alphabet-keypad > .letter-disabled").each(function(index, element) {
            $(element).removeClass().addClass('letter-button');
        });
    }

    function removeGraveyardLetters() {
        $('#letter-graveyard > div').each(function(index, element) {
            $(element).remove();
        });
    }

    function removeCorrectlyGuessedLetters() {
        $('#word-to-guess').each(function(index, element) {
            $(element).children().html('');
        });
    }

    function removeFillInTheBlanksAroundOldWord() {
        $("#word-to-guess").html('');
    }

    // adding dictionary and word filter
    var hangmanWords = ["beef", "beard", "curry", "jam", "stew", "butter", "cheese", "eggs"
    , "milk", "cake", "sugar", "honey", "noodles", "rice", "pizza"
    , "pepper", "salt", "biscuits", "chocolate", "bacon", "apples"
    , "beer", "bread", "chicken", "chocolate", "coffee", "donuts"
    , "grapes", "honey", "hotdogs", "icecream", "jerky", "jelly"
    , "ketchup", "meatballs", "noodles", "pizza", "yogurt"];
    /**
    cross origin
    var hangmanWords = new Array();
    $.getJSON('./data/data.json',function (data) {
    for (var i = 0; i < data.length; i++) {
        hangmanWords.push(data[i].food);
    }
  });
    */

    function wordSelect(array) {
        var num = Math.floor(Math.random() * (array.length - 1));
        var word = array[num];
        return word;
    }

    function setWordToBeGuessed() {

        currentWordFull = wordSelect(hangmanWords); //replace the number with wordSelect (the function) for production use

        //set an all upper case version of the current word
        currentWord = currentWordFull.toUpperCase();
        //creates blocks in the DOM indicating where there are letters and spaces

        currentWord.split("").map(function(character) {
            var guessWordBlock = document.getElementById("word-to-guess");

            var domElem = document.createElement("div");

            if (character.match(/[a-z]/i)) {
                domElem.className = "character-block is-letter";

            } else {
                domElem.className = "character-block";
            }

            guessWordBlock.appendChild(domElem);
        });
    }

    var currentWordFull;
    var currentWord;

    setWordToBeGuessed();
})();
