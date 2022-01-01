var totalGuess = 0;
var guessAvg = 0;
var gamesPlayed = 0;
var maxGuesses = 0;
var guessList = allPossible();
var allPos = allPossible();

onmessage = function (e) {
    console.log('Message received from main script ' + e.data[0] + " " + e.data[1]);
    game(e.data[0], e.data[1], e.data[2])
}

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


function game(prevGuess, prevScore, accuracy) {
    console.log(prevGuess)
    console.log(prevScore)
    guessList = newGuesses(prevScore, prevGuess, guessList);
    guess = [0, 0, 0, 0, 0];
    guesses = 0;
    if (guessList.length == 1) {
        guess = guessList[0];
    } else {
        let highestLow;
        let highestLowKey;
        let similarG;
        for (a = 0; a < accuracy; a++) {
            let total = 0;
            let runningScores = [
                [3, 0],
                [3, 1],
                [4, 0],
                [5, 0],
                [3, 2],
                [2, 2],
                [2, 3],
                [2, 1],
                [2, 0],
                [1, 3],
                [1, 2],
                [1, 1],
                [1, 4],
                [1, 0],
                [0, 3],
                [0, 2],
                [0, 1],
                [0, 4],
                [0, 0]
            ];
            let localLow;
            /*for (b = 0; b < guessList.length; b++) {
                postMessage(((a / allPos.length) * 100).toFixed(3) + "% done with the current guess, " + ((b / guessList.length) * 100).toFixed(3) + "% done with the current combination. average number of guesses = " + guessAvg + " after " + gamesPlayed + " games, with a maximum number of guesses at " + maxGuesses);
                let points = scoreThis(allPos[a], guessList[b])

                if ( !(runningScores.includes(points[0] + ' ' + points[1])) ) {
                    runningScores.push(points[0] + ' ' + points[1])
                }
                if (runningScores.length == 87354 || guesses == 0) {
                    if (guesses !== 0) {
                        console.log(((b / guessList.length) * 100).toFixed(1) + "%")
                    }
                    runningScores = [];
                    b = allPos.length - 1;
                }
            }*/
            postMessage(((a / accuracy) * 100).toFixed(3) + "% done with the current guess, average number of guesses = " + guessAvg + " after " + gamesPlayed + " games, with a maximum number of guesses at " + maxGuesses);
            for (d = 0; d < runningScores.length; d++) {
                //let scoreConvert = [];
                //scoreConvert.push(parseInt(runningScores[d].charAt(0)));
                //scoreConvert.push(parseInt(runningScores[d].charAt(1)));
                total = guessList.length - newGuesses(runningScores[d], allPos[a], guessList).length;
                if (!(localLow < total)) {
                    localLow = total;
                }
            }
            if (highestLow == localLow) {
                similarG.push(allPos[highestLowKey])
            } else if (!(highestLow > localLow)) {
                highestLow = localLow;
                highestLowKey = a;
                similarG = [];
            }
        }
        guess = allPos[highestLowKey];
        //console.log('should decrease by ' + highestLow)
        //console.log(similarG.length + " guess candidates")

        for (e = 0; e < similarG.length; e++) {
            //console.log(similarG[e])
            for (f = 0; f < guessList.length; f++) {
                //console.log(guessList[f])
                if (guessList[f][0] == similarG[e][0] &&
                    guessList[f][1] == similarG[e][1] &&
                    guessList[f][2] == similarG[e][2] &&
                    guessList[f][3] == similarG[e][3] &&
                    guessList[f][4] == similarG[e][4]) {
                    //console.log('good guess')
                    guess = similarG[e];
                }
            }
        }

        if (highestLow == 0) {
            guess = guessList[Math.floor(Math.random() * guessList.length)];
        }
    }

    //console.log(guessList.length + " possible codes for this guess");
    console.log("Guess: " + guess + "   " + guessList.length + " remaining possible codes.")
}