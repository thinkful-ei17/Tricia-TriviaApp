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

  setSTORE(start, index, correctAnswers, totalQuestions) {
    this.STORE = {
      startQuiz: start,
      index: index,
      correctAnswers: correctAnswers,
      totalQuestions: totalQuestions,
    };
  }

  getSTORE() {
    return this.STORE;
  }

  incrementSTOREIndex() {
    this.STORE.index++;
  }

  incrementCorrectAnswers() {
    this.STORE.correctAnswers++;
  }

  startNewQuiz() {
    this.STORE.index = 0;
    this.STORE.startQuiz = false;
    this.STORE.correctAnswers = 0;
    this.totalQuestions = 0;
  }
} //TriviaApp class


class Render {
  constructor() {

  } //render app constructor

  //Private Methods
  _questionTemplate(item) {
    console.log('_questionTemplate ran');
    return `<p>Question ${quiz.STORE.index+1}: ${item.question}</p>
      <input type= "radio" name= "answer" id= "radio" value= ${item.incorrect_answers[0]}> ${item.incorrect_answers[0]}<br>
      <input type= "radio" name= "answer" id= "radio" value= ${item.correct_answer}> ${item.correct_answer}<br>
      <input type= "radio" name= "answer" id= "radio" value= ${item.incorrect_answers[2]}> ${item.incorrect_answers[2]}<br>
      <input type= "radio" name= "answer" id= "radio" value= ${item.incorrect_answers[1]}> ${item.incorrect_answers[1]}<br>`;
  } //_questionTemplate

  //Public Methods
  renderQuestion() {
    console.log('renderQuestion ran');
    $('#questions').addClass('quizContent');
    console.log('renderQuestion question =  ' + QUESTIONS[0].correct_answer);
    console.log('renderQuestion index = ' + quiz.STORE.index);
    let question = this._questionTemplate(QUESTIONS[quiz.STORE.index]);

    $('#questions').html(question);
    handleAnswerClick();

  } //renderQuestion


  renderStartNextButtons() {
    console.log('renderStartNextButtonsText ran');
    if (quiz.STORE.startQuiz) {
      $('.buttonControl').append('<button class= "next">Next</button>');
      $('.startQuiz').remove();
      handleNextClick();
    } else {
      $('.buttonControl').append('<button class= "startQuiz">Take the Quiz!</button>');
      $('.next').remove();
      handleNextClick();
    }
  } //renderStartNextButton

  renderResultsAndStatus() {
    $('p').remove();
    $('#radio').remove();
    $('#questions').html(' ');
    $('#questions').addClass('results');
    $('.results').append(`<p>Correct answer is: ${QUESTIONS[quiz.STORE.index-1].correct_answer}</p><br>`);

    if (quiz.STORE.index !== api.getTriviaInputValues().amount) {
      $('.results').append(`<p>Your current score is: ${quiz.STORE.correctAnswers} out of ${quiz.STORE.index} correct answers</p>`);
    } else {
      //start a new game
      $('.results').append(`<p>Your Final score is: ${quiz.STORE.correctAnswers} out of ${api.getTriviaInputValues().amount} correct answers</p>`);
      quiz.startNewQuiz();
      render.renderStartNextButtons();
      handleStartQuizClick();

    }
  } //renderResultsAndStatus


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
    console.log(`_setQuestion ran:  ${response.results}`);
    this.QUESTION = response.results;
  }

  //public methods
  setSessionQuestions() {
    console.log('setSessionQuestions ran');
    let url = this._buildCategoryURL();
    $.getJSON(url, function(response) {
      QUESTIONS = response.results;
      console.log('setSessionQuestions: QUESTIONS[0] = ' + QUESTIONS[0].question);
      render.renderQuestion();
    });

  }

  setSessionToken(response) {
    console.log('setSessionToken ran');
    console.log(`Session Token: ${ response.token }`);
    return response.token;
  } //API::setSessionToken

  getSessionToken() {
    console.log(`getSessionToken ran ${this.SESSION_TOKEN }`);
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

  //API::setSessionQuestions

} //Class API


function handleAnswerClick() {

  $('input[name="answer"]').on('click', event => {
    console.log('handleAnswerClick ran');
    var answer = $('input[name="answer"]:checked').val();

    if (answer === QUESTIONS[quiz.STORE.index].correct_answer) {
      quiz.incrementCorrectAnswers();
    }

    quiz.incrementSTOREIndex();
    render.renderResultsAndStatus();
    console.log(quiz.STORE.index);
    console.log(quiz.STORE.correctAnswers);

  });
}

function handleNextClick() {
  $('.next').click(event => {
    console.log('HandleNextClick ran');
    console.log(quiz.STORE.index, QUESTIONS.length);
    if (quiz.STORE.index < QUESTIONS.length)
      render.renderQuestion();
    else
      render.renderResultsAndStatus();
  });
}


function handleStartQuizClick() {
  $('.startQuiz').click(event => {
    console.log('handleStartQuizClick ran,');

    //get number of questions user input
    let number = $('#num-questions-entry').val();
    console.log('Get number = ' + number);


    //set number of questions in triviaInputValue object
    api.setTriviaInputValues(api.triviaInputValues.category, number);

    //set STORE values to start of quiz
    quiz.setSTORE(true, 0, 0, 2);

    //request questions from API and fill the QUESTIONS object
    api.setSessionQuestions();

    render.renderStartNextButtons();

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
$(handleNextClick);
$(handleAnswerClick);