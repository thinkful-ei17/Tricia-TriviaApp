'use strict';
/* global $ */







const STORE = {
    startQuiz: false,
    index: 0,
    CORRECT_ANSWERS: [],
    totalQuestions: QUESTIONS.length,
};

const CATEGORIES = [{
        id: 9,
        name: 'General Knowledge',
    },
    {
        id: 18,
        name: 'Computers',
    },
    {
        id: 17,
        name: 'Science & Nature',
    },
    {
        id: 23,
        name: 'History',
    },
    {
        id: 16,
        name: 'Board Games',
    },
    {
        id: 12,
        name: 'Music',
    },
];
class TriviaApp {
    constructor(userInputs) {
        this.QUESTIONS = []


    };

} //trivia app constructor


getQuestion(triviaInputValues) {
        $.getJSON(BASE_API_URL + TRIVIA_CATAGORY_REQUEST_URL, triviaInputValues, decorateQuesition);
    } //TriviaApp::getQuestion

getNextQuestion() {
    console.log('getNextQuestion');
    const question = renderQuestion(QUESTIONS[STORE.index]);

    $('#questions').html(question);
    handleAnswerClick();
}
decorateQuesition(response) {
    console.log('Enter decorateQuestion');
    QUESTIONS = response.results;
    console.log(QUESTIONS);
    getNextQuestion();
}



setStatus() {

    } //TriviaApp::setStatus

} //TriviaApp class


class RenderApp {
    constructor(render) {

        } //render app constructor

    renderQuestion(item) {
        console.log('renderQuestion ran');
        return `<p>${item.question}</p>
      <input type= "radio" name= "answer" id= "radio" value= ${item.incorrect_answers[0]}> ${item.incorrect_answers[0]}<br>
      <input type= "radio" name= "answer" id= "radio" value= ${item.correct_answer}> ${item.correct_answer}<br>
      <input type= "radio" name= "answer" id= "radio" value= ${item.incorrect_answers[2]}> ${item.incorrect_answers[2]}<br>
      <input type= "radio" name= "answer" id= "radio" value= ${item.incorrect_answers[1]}> ${item.incorrect_answers[1]}<br>`;
    }
} //renderQuestion

renderAppStatus() {

    } //render app status

renderStartNextButtons() {
        console.log('renderStartNextButtonsText ran');

        if (STORE.startQuiz) {
            $('.buttonControl').append('<button class= "next">Next</button>');
            $('.startQuiz').remove();
            handleNextClick();
        } else {
            $('.buttonControl').append('<button class= "startQuiz">Take the Quiz!</button>');
            $('.next').remove();
            handleNextClick();
        }
    } //renderStartNextButton

renderResults() {

    } //renderResults

renderStatus() {

    } //renderStatus

}; //class renderApp

Class API {
    constructor() {

        this.SESSION_TOKEN = _fetchSessionKey;

        this.setSessionCategories(category = 16, amt = 1, type = 'multiple', difficulty = 'easy');
    }

    //private methods
    _buildSessionURL() {
        return BASE_API_URL + '/api_token.php?command=request';
    }
    _buildCategoryURL() {
        return BASE_API_URL + '/api.php?';
    }
    _fetchSessionKey() {
        let url = _buildSessionURL();
        $.getJSON(url, setSessionToken);
    }

    //public methods
    setSessionToken(response) {
            SESSION_TOKEN = response.token;
            console.log(`Session Token: ${SESSION_TOKEN}`);
            return SESSION_TOKEN;
        } //API::setSessionToken

    setSessionCategories(category, amt, type, difficulty) {
            let url = _buildCategoryURL;
            let triviaInputValues = {
                category = category,
                amount = amt,
                type = type,
                difficulty = easy,
            };
            $.getJSON(url, triviaInputValues);
        } //API::setSessionCategories




} //Class API

API.prototype.BASE_API_URL = 'https://opentdb.com';

function showResults() {
    console.log('showResults ran');

    var finalResults = STORE.index;

    for (var i = STORE.index; i < STORE.CORRECT_ANSWERS.length; i++)
        if (STORE.CORRECT_ANSWERS[i])
            finalResults++;


    $('p').remove();
    $('#radio').remove();
    $('#questions').html(' ');
    $('#questions').addClass('results');
    $('.results').append(`<p>Correct answer is: ${QUESTIONS[STORE.index-1].correct_answer}</p><br>`);
    console.log(triviaInputValues.amount);
    console.log(STORE.index);
    if (STORE.index != triviaInputValues.amount) {
        $('.results').append(`<p>Your current score is: ${finalResults} out of ${triviaInputValues.amount} correct answers</p>`);
    } else {
        $('.results').append(`<p>Your Final score is: ${finalResults} out of ${triviaInputValues.amount} correct answers</p>`);
        STORE.startQuiz = false;
        STORE.totalQuestions = STORE.index;
        STORE.index = 0;
        // STORE.CORRECT_ANSWERS = 0;
        renderStartNextButtons();
        handleStartQuizClick();

    }
}

function handleAnswerClick() {

    $('input[name="answer"]').on('click', event => {
        console.log('handleAnswerClick ran');
        var answer = $('input[name="answer"]:checked').val();

        if (answer === QUESTIONS[STORE.index].correct_answer) {
            STORE.CORRECT_ANSWERS[STORE.index] = 1;
        } else {
            STORE.CORRECT_ANSWERS[STORE.index] = STORE.index;
        }
        STORE.index++;
        showResults();
        console.log(STORE.index);
        console.log(STORE.CORRECT_ANSWERS[STORE.index]);

    });
}

function handleNextClick() {
    $('.next').click(event => {
        console.log('HandleNextClick ran');
        console.log(STORE.index, QUESTIONS.length);
        if (STORE.index < QUESTIONS.length)
            getNextQuestion();
        else
            showResults();
    });
}


function handleStartQuizClick() {
    $('.startQuiz').click(event => {
        console.log('handleStartQuizClick ran,');
        //add functionality to get values from the user and populate to triviaInputValues
        getQuestionFromApi(triviaInputValues);
        STORE.startQuiz = true;
        renderStartNextButtons();
        $('#questions').addClass('quizContent');

        console.log('num-questions-entry ran');
        let number = $('#num-questions-entry').val();
        triviaInputValues.amount = number;
        console.log(number);
    });
}

function handleUserInput() {
    $('.triviaDropDown').on('click', event => {
        console.log('handleUserInput ran');

        var input = $('.triviaDropDown option:checked').text();
        console.log(input);

        CATEGORIES.find(object => {
            if (object.name === input) {
                console.log(object);
                triviaInputValues.category = object.id;
            }
        });
    });

    $('.startQuiz').attr('enable');
}

// let quiz = new TriviaApp();


$(handleUserInput);
$(handleStartQuizClick);
$(handleNextClick);
$(handleAnswerClick);