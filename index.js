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

  setSTORE(start, index, correctAnswers, totalQuestions, state) {
    this.STORE = {
      startQuiz: start,
      index: index,
      correctAnswers: correctAnswers,
      totalQuestions: totalQuestions,
      quizState: state,
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
    console.log('startNewQuiz ran');
    this.STORE = {
      index: 0,
      startQuiz: false,
      correctAnswers: 0,
      totalQuestions: 0,
      quizState: 'start',
    };
    QUESTIONS = [];
  }
} //TriviaApp class


class Render {
  constructor() {

  } //render app constructor

  //Private Methods
  _questionTemplate(item) {
    console.log('_questionTemplate ran');
    return `<fieldset><legend>Question ${quiz.STORE.index+1}</legend><p>${item.question}</p>
      <input type= "radio" name= "answer" id= "radio" value= ${item.incorrect_answers[0]}> ${item.incorrect_answers[0]}<br>
      <input type= "radio" name= "answer" id= "radio" value= ${item.correct_answer}> ${item.correct_answer}<br>
      <input type= "radio" name= "answer" id= "radio" value= ${item.incorrect_answers[2]}> ${item.incorrect_answers[2]}<br>
      <input type= "radio" name= "answer" id= "radio" value= ${item.incorrect_answers[1]}> ${item.incorrect_answers[1]}<br></fieldset>`;
  } //_questionTemplate

  //Public Methods
  renderQuestion() {
    console.log('renderQuestion ran' + QUESTIONS);
    $('#questions').addClass('quizContent');
    console.log('renderQuestion question answer =  ' + QUESTIONS[0].correct_answer);
    console.log('renderQuestion index = ' + quiz.STORE.index);
    let question = this._questionTemplate(QUESTIONS[quiz.STORE.index]);

    $('#questions').html(question);
    // handleAnswerClick();

  } //renderQuestion


  renderStartNextButtons() {
    console.log('renderStartNextButtonsText ran');
    console.log('quiz state = ' + quiz.STORE.quizState);
    //change button to submit
    if (quiz.STORE.quizState === 'submit') {
      $('.buttonControl').append('<button class = "submit">Submit</button>');
      $('.startQuiz').remove();
      $('.next').remove();
      quiz.STORE.quizState = 'next';
      handleAnswerClick();
    }
    //change the button to next question
    else if (quiz.STORE.quizState === 'next') {
      $('.buttonControl').append('<button class= "next">Next</button>');
      $('.submit').remove();
      quiz.STORE.quizState = 'submit';
      handleNextClick();
    }
    //change the button to a new game
    else if (quiz.STORE.quizState === 'start') {
      $('.buttonControl').append('<button class= "startQuiz">Take the Quiz!</button>');
      $('.next').remove();
      $('.submit').remove();
      quiz.STORE.quizState = 'submit';
      handleStartQuizClick();
    }
  } //renderStartNextButton

  renderResultsAndStatus() {
    console.log('renderResultsAndStatus ran');
    $('p').remove();
    $('#radio').remove();
    $('#questions').html(' ');
    $('#questions').addClass('results');

    $('.results').append(`<p>Correct answer is: ${QUESTIONS[quiz.STORE.index-1].correct_answer}</p><br>`);

    if (quiz.STORE.index != api.getTriviaInputValues().amount) {
      $('.results').append(`<p>Your current score is: ${quiz.STORE.correctAnswers} out of ${quiz.STORE.index} correct answers</p>`);
    } else {
      //start a new game
      $('.results').append(`<p>Your Final score is: ${quiz.STORE.correctAnswers} out of ${api.getTriviaInputValues().amount} correct answers</p>`);
      quiz.startNewQuiz();
      quiz.STORE.quizState = 'start';
      console.log('start new quiz = ' + quiz.STORE.quizState);
    }
    render.renderStartNextButtons();
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
  setSessionQuestions(cb) {
    console.log('setSessionQuestions ran');
    let url = this._buildCategoryURL();
    $.getJSON(url, function(response) {
      QUESTIONS = response.results;
      cb();
      console.log('setSessionQuestions: QUESTIONS[0] = ' + QUESTIONS[0].question);
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

  setTriviaInputValues(category, amt, type = 'multiple', difficulty = 'easy') {
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

  $('.submit').on('click', event => {
    console.log('handleAnswerClick ran');
    var answer = $('input[name="answer"]:checked').val();
    console.log('answer = ' + answer);
    console.log('quiz answer = ' + QUESTIONS[quiz.STORE.index].correct_answer);
    if (answer === QUESTIONS[quiz.STORE.index].correct_answer) {
      quiz.incrementCorrectAnswers();
    }

    quiz.incrementSTOREIndex();
    render.renderResultsAndStatus();
    console.log('store index = ' + quiz.STORE.index);
    console.log('correct answers = ' + quiz.STORE.correctAnswers);

  });
}

function handleNextClick() {
  $('.next').on('click', event => {
    console.log('HandleNextClick ran');
    console.log(quiz.STORE.index, QUESTIONS.length);
    if (quiz.STORE.index < QUESTIONS.length) {
      render.renderQuestion();
      render.renderStartNextButtons();
    } else
      render.renderResultsAndStatus();
  });
}



function handleStartQuizClick() {
  $('.startQuiz').on('click', event => {
    console.log('handleStartQuizClick ran,');

    //get number of questions user input
    let number = $('#num-questions-entry').val();
    console.log('Get number = ' + number);

    //set number of questions in triviaInputValue object
    api.setTriviaInputValues(api.triviaInputValues.category, number);

    //set STORE values to start of quiz
    quiz.setSTORE(true, 0, 0, api.getTriviaInputValues.amount, 'submit');
    //change button from Start to Next
    render.renderStartNextButtons();

    //request questions from API and fill the QUESTIONS object
    api.setSessionQuestions(() => {
      render.renderQuestion();
    });

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

} //handleUserInput

//instantiate new API, Quiz and Render objects
let api = new API();
let quiz = new TriviaApp();
let render = new Render();

$(handleUserInput);
$(handleStartQuizClick);