var totalGuess = 0;
var guessAvg = 0;
var gamesPlayed = 0;
var maxGuesses = 0;


function play() {
    while (true) {
        postMessage("Average number of guesses = " + guessAvg + " after " + gamesPlayed + " games, with a maximum number of guesses at " + maxGuesses);
        game();
    }
}

play();

function allPossible() {
    possible = [];
    for (one = 0; one < 8; one++) {
        for (two = 0; two < 8; two++) {
            for (three = 0; three < 8; three++) {
                for (four = 0; four < 8; four++) {
                    for (five = 0; five < 8; five++) {
                        possible.push([one, two, three, four, five]);
                    }
                }
            }
        }
    }
    shuffle(possible);
    return (possible);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function scoreThis(guess, code) {
    scoreTmp = [
        0,
        0
    ]

    guessComp = [];
    codeComp = [];
    for (n = 0; n < 8; n++) {
        codeComp[n] = 0;
        guessComp[n] = 0;
        for (i = 0; i < guess.length; i++) {
            if (code[i] == n) {
                codeComp[n]++;
            }
            if (guess[i] == n) {
                guessComp[n]++;
            }
        }
    }

    for (n = 0; n < 8; n++) {
        if (guessComp[n] < codeComp[n]) {
            scoreTmp[1] += guessComp[n];
        } else {
            scoreTmp[1] += codeComp[n];
        }
    }

    for (i = 0; i < 5; i++) {
        if (code[i] == guess[i]) {
            scoreTmp[0] += 1;
            scoreTmp[1] -= 1;
        }
    }

    if (scoreTmp[0] < 0 || scoreTmp[1] < 0 || scoreTmp == 5) {
        console.log('Score check')
        console.log('guess: ' + guess)
        console.log('code:  ' + code)
        console.log('score: ' + scoreTmp)
        console.log('guess comp: ' + guessComp)
        console.log('code comp: ' + codeComp)
    }

    return (scoreTmp);
}

function newGuesses(actual, guess_, guessList) {
    newList = [];
    //console.log(codeUsed + " " + guess_ + " " + guessList)
    for (g = 0; g < guessList.length; g++) {
        trial = scoreThis(guess_, guessList[g]);
        if (
            trial[0] ==
            actual[0] &&
            trial[1] ==
            actual[1]) {
            newList.push(guessList[g]);
        }
    }
    return (newList);
}


function game() {
    guess = [0, 0, 0, 0, 0];
    code = [
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 8)
    ]

    console.log("The code is: " + code);

    let guessList = allPossible();
    let allPos = allPossible();
    score = [
        0,
        0
    ]
    guesses = 0;
    previousG = "N/A"
    while (score[0] !== 5) {

        guess = guessList[Math.floor(Math.random() * guessList.length)];

        guesses++;
        score = scoreThis(guess, code)
        //console.log(guessList.length + " possible codes for this guess");
        guessList = newGuesses(score, guess, guessList);
        console.log("Guess: " + guess);
        console.log("Code:  " + code + " Score: " + score);
        if (score[0] !== 5) {
            console.log(guessList.length + " possible codes now");
        }
        previousG = guess;
    }
    gamesPlayed++;
    totalGuess += guesses;
    if (guesses > maxGuesses) {
        maxGuesses = guesses;
    }
    guessAvg = (totalGuess / gamesPlayed).toFixed(3)

    console.log('new game')
}