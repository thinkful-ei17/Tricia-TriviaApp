'use strict';
/* global $ */

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

let QUESTIONS = [];

class TriviaApp {

  constructor() {
    this.STORE = {};
  } //TriviaApp::constructor

  //Public Methods

  getQuestions(triviaInputValues) {

  } //TriviaApp::getQuestion


  setSTORE(start, index, correctAnswers, totalQuestions) {
    this.STORE = {
      startQuiz: start,
      index: index,
      CORRECT_ANSWERS: correctAnswers,
      totalQuestions: totalQuestions,
    };
  }

  getSTORE() {
    return this.STORE;
  }
  /*
                                                                            setResults() {
                                                                              console.log('showResults ran');

                                                                              var finalResults = STORE.index;
                                                                              for (var i = STORE.index; i < STORE.CORRECT_ANSWERS.length; i++)
                                                                                if (STORE.CORRECT_ANSWERS[i])
                                                                                  finalResults++;
                                                                            } //TriviaApp::setResults

                                                                            setStatus() {

                                                                            } //TriviaApp::setStatus
                                                                          */
} //TriviaApp class


class Render {
  constructor() {

  } //render app constructor



  //Private Methods
  _questionTemplate(item) {
    console.log('renderQuestion ran');
    return `<p>${item.question}</p>
      <input type= "radio" name= "answer" id= "radio" value= ${item.incorrect_answers[0]}> ${item.incorrect_answers[0]}<br>
      <input type= "radio" name= "answer" id= "radio" value= ${item.correct_answer}> ${item.correct_answer}<br>
      <input type= "radio" name= "answer" id= "radio" value= ${item.incorrect_answers[2]}> ${item.incorrect_answers[2]}<br>
      <input type= "radio" name= "answer" id= "radio" value= ${item.incorrect_answers[1]}> ${item.incorrect_answers[1]}<br>`;
  } //_questionTemplate

  //Public Methods
  renderQuestion() {
    $('#questions').addClass('quizContent');
    console.log('Question number = ' + QUESTIONS[quiz.getSTORE().index]);
    let question = this._questionTemplate(QUESTIONS[quiz.getSTORE().index]);

    $('#questions').html(question);
    // handleAnswerClick();
  } //renderQuestion


  renderStartNextButtons() {
    console.log('renderStartNextButtonsText ran');
    if (quiz.STORE.startQuiz) {
      $('.buttonControl').append('<button class= "next">Next</button>');
      $('.startQuiz').remove();
      // handleNextClick();
    } else {
      $('.buttonControl').append('<button class= "startQuiz">Take the Quiz!</button>');
      $('.next').remove();
      // handleNextClick();
    }
  } //renderStartNextButton
  /*
                                                                                  renderResultsAndStatus() {
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
                                                                                      changeButton();
                                                                                      handleStartQuizClick();

                                                                                    }
                                                                                  } //renderResultsAndStatus
                                                                                */

} //class Render

class API {
  constructor() {
    this.BASE_API_URL = 'https://opentdb.com';
    this.SESSION_TOKEN = this._fetchSessionKey();
    this.triviaInputValues = {};
  }

  //private methods
  _buildSessionURL() {
    console.log('_buildSessionURL ran');
    return this.BASE_API_URL + '/api_token.php?command=request';
  }
  _buildCategoryURL() {
    console.log('_buildCategoryURL ran');
    return this.BASE_API_URL + `/api.php?amount=${this.triviaInputValues.amount}&category=${this.triviaInputValues.category}&difficulty=${this.triviaInputValues.difficulty}&type=${this.triviaInputValues.type}`;
  }
  _fetchSessionKey() {
    console.log('_fetchSessionKey ran');
    let url = this._buildSessionURL();
    $.getJSON(url, this.setSessionToken);
  }

  _setQuestions(response) {
    QUESTIONS = response.results;
    console.log('_setQuestion ran = ' + QUESTIONS);
  }

  //public methods
  setSessionToken(response) {
    console.log('setSessionToken ran');
    console.log(`Session Token: ${response.token}`);
    return response.token;
  } //API::setSessionToken

  getSessionToken() {
    console.log(`getSessionToken ran ${this.SESSION_TOKEN}`);
    return this.SESSION_TOKEN;
  }

  getTriviaInputValues() {
    return this.triviaInputValues;
  }

  setTriviaInputValues(category = 16, amt = 1, type = 'multiple', difficulty = 'easy') {
    this.triviaInputValues = {
      category: category,
      amount: amt,
      type: type,
      difficulty: difficulty,
    };
  }

  setSessionQuestions(triviaInputValues) {
    console.log('setSessionQuestions ran');
    let url = this._buildCategoryURL();
    $.getJSON(url, triviaInputValues, this._setQuestions);
    // this.getNextQuestion();;
  } //API::setSessionQuestions

} //Class API

/*
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
*/

function handleStartQuizClick() {
  $('.startQuiz').click(event => {
    console.log('handleStartQuizClick ran,');

    //get number of questions user input
    let number = $('#num-questions-entry').val();
    console.log('Get number = ' + number);

    //set number of questions in triviaInputValue object
    api.setTriviaInputValues(api.triviaInputValues.category, number);

    //request questions from API
    api.setSessionQuestions(api.getTriviaInputValues);

    //set STORE values to start of quiz
    quiz.setSTORE(true, 0, 0, QUESTIONS.length);

    render.renderStartNextButtons();
    // render.renderQuestion();
  });
}

function handleUserInput() {
  $('.triviaDropDown').on('click', event => {
    console.log('handleTriviaDropDown ran');
    let input = $('.triviaDropDown option:checked').text();

    //get quiz category from user input
    CATEGORIES.find(object => {
      if (object.name === input) {
        input = object.id;
        console.log(object);
      } //end if

      //set the category in triviaInputValues object
      api.setTriviaInputValues(input);

    }); //end find category number
  }); //end on click - category

  // $('.startQuiz').attr('enable');

} //handleUserInput

//instantiate new API, Quiz and Render objects
let api = new API();
let quiz = new TriviaApp();
let render = new Render();

$(handleUserInput);
$(handleStartQuizClick);
// $(handleNextClick);
// $(handleAnswerClick);