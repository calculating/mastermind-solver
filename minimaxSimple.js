var totalGuess = 0;
var guessAvg = 0;
var gamesPlayed = 0;
var maxGuesses = 0;


function play() {
    while (true) {
        postMessage("100% done with the current guess, 0% done with the current combination. average number of guesses = " + guessAvg + " after " + gamesPlayed + " games, with a maximum number of guesses at " + maxGuesses);
        game();
    }
}

play();

function allPossible() {
    possible = [];
    for (one = 0; one < 5; one++) {
        for (two = 0; two < 5; two++) {
            for (three = 0; three < 5; three++) {
                for (four = 0; four < 5; four++) {
                    possible.push([one, two, three, four]);
                }
            }
        }
    }
    return (possible);
}

function scoreThis(guessSent, codeSent) {
    score = [
        0,
        0
    ]

    guessComp = [];
    for (n = 0; n < 5; n++) {
        guessComp[n] = 0;
        for (i = 0; i < guessSent.length; i++) {
            if (guessSent[i] == n) {
                guessComp[n]++;
            }
        }
    }

    for (n = 0; n < 5; n++) {
        if (guessComp[n] < codeComp[n]) {
            score[1] += guessComp[n];
        } else {
            score[1] += codeComp[n];
        }
    }

    for (i = 0; i < 4; i++) {
        if (codeSent[i] == guessSent[i]) {
            score[0]+= 1;
            score[1]-= 1;
        }
    }

    //score[2] = 4 - score[0] - score[1];

    return (score);
}


function scoreThisLog(guessSent, codeSent) {
    score = [
        0,
        0
    ]

    guessComp = [];
    for (n = 0; n < 5; n++) {
        guessComp[n] = 0;
        for (i = 0; i < guessSent.length; i++) {
            if (guessSent[i] == n) {
                guessComp[n]++;
            }
        }
    }

    for (n = 0; n < 5; n++) {
        if (guessComp[n] < codeComp[n]) {
            score[1] += guessComp[n];
        } else {
            score[1] += codeComp[n];
        }
    }

    console.log(codeSent)
    console.log(guessSent)

    for (i = 0; i < 4; i++) {
        if (codeSent[i] == guessSent[i]) {
            console.log('eee')
            score[0]++;
            score[1]--;
        }
    }

    //score[2] = 4 - score[0] - score[1];

    console.log(score)

    return (score);
}

function newGuesses(codeUsed, guess_, guessList) {
    newList = [];
    //console.log(codeUsed + " " + guess_ + " " + guessList)
    actual = scoreThis(guess_, codeUsed);
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
        Math.floor(Math.random() * 5),
        Math.floor(Math.random() * 5),
        Math.floor(Math.random() * 5),
        Math.floor(Math.random() * 5)
    ]

    codeComp = [];
    for (n = 0; n < 5; n++) {
        codeComp[n] = 0;
        for (i = 0; i < guess.length; i++) {
            if (code[i] == n) {
                codeComp[n]++;
            }
        }
    }
    console.log("code: " + code + " codeComp: " + codeComp)

    let guessList = allPossible();
    let allPos = allPossible();
    score = [
        0,
        0,
        0
    ]
    guesses = 0;
    previousG = "N/A"
    while (score[0] !== 4) {
        let runningLow;
        let lowest;
        if (guessList.length == 1) {
            guess = guessList[0];
        } else {
            for (a = 0; a < allPos.length; a++) {
                postMessage(((a / allPos.length) * 100).toFixed(3) + "% done with the current guess, 0% done with the current combination. average number of guesses = " + guessAvg + " after " + gamesPlayed + " games, with a maximum number of guesses at " + maxGuesses);
                let total = 0;
                let runningScores = [];
                let localLow;
                for (b = 0; b < guessList.length; b++) {
                    postMessage(((a / allPos.length) * 100).toFixed(3) + "% done with the current guess, " + ((b / guessList.length) * 100).toFixed(3) + "% done with the current combination. average number of guesses = " + guessAvg + " after " + gamesPlayed + " games, with a maximum number of guesses at " + maxGuesses);
                    //total += newGuesses(guessList[b], allPos[a], guessList)
                    total = newGuesses(guessList[b], allPos[a], guessList);
                    if (!(localLow < total)) {
                        localLow = total;
                    }
                    let thisScore = scoreThis(allPos[a], guessList[b])
                    if (!(runningScores.includes(thisScore))) {
                        runningScores.push(thisScore)
                    }
                    if (runningScores.length == 10) {
                        runningScores = [];
                        b = allPos.length - 1;
                    }
                }
                if (!(runningLow < total)) {
                    runningLow = total;
                    lowest = a;
                }
            }
            guess = allPos[lowest];
        }


        guesses++;
        score = scoreThis(guess, code)
        console.log(guessList.length);
        guessList = newGuesses(code, guess, guessList);
        console.log("Guess: " + guess);
        console.log("Code:  " + code + " Score: " + score);
        //console.log("Backcheck ( possible code = " + guess + "   previous guess = " + previousG + "   backtested score = " + scoreThis(guess, previousG))
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