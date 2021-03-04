import React, { Component } from 'react';
import LangContext from '../../contexts/LangContext';
import languageApiService from '../../services/language-api-service';
import { Label, Input } from '../../components/Form/Form';
import Button from '../../components/Button/Button';
import './LearningRoute.css';

class LearningRoute extends Component {
  static contextType = LangContext;

  state = {
    guess: '',
    renderForm: true,
  };
  componentDidMount() {
    this.context.clearError();
    languageApiService.getLanguageHead().then((res) => {
      this.context.setHead(res);
    });
  }

  handleOnChange = (e) => {
    e.preventDefault();
    this.setState({ guess: e.target.value });
  };

  handleOnSubmit = (e) => {
    e.preventDefault();
    languageApiService.postGuess(this.state.guess).then((res) => {
      this.context.setResponse(res);
      this.setState({ renderForm: false });
    });
  };

  handleNextWord = (e) => {
    this.context.setHead(this.context.response); // set context head to response (not head)and setting as head
    this.setState({ renderForm: true });
    this.context.setGuess('');
  };

  // Function to render form
  renderForm = () => {
    let { head } = this.context;
    let headWord = head.nextWord;
    let correctCount = head.wordCorrectCount;
    let incorrectCount = head.wordIncorrectCount;
    let totalScore = head.totalScore;
    return (
      <section>
        <h2>Translate the word:</h2>
        <span>
          <h3>{headWord}</h3>
        </span>
        <p>{`Your total score is: ${totalScore}`}</p>
        <form onSubmit={this.handleOnSubmit}>
          <Label htmlFor='learn-guess-input'>
            What's the translation for this word?
          </Label>
          <Input
            type='text'
            id='learn-guess-input'
            value={this.state.userGuess}
            onChange={this.handleOnChange}
            required
          />
          <br />
          <br />
          <button type='submit'>Submit your answer</button>
        </form>

        <p>{`You have answered this word correctly ${correctCount} times.`}</p>
        <p>{`You have answered this word incorrectly ${incorrectCount} times.`}</p>
      </section>
    );
  };

  // user results function
  userResults = () => {
    let head = this.context.head;
    let response = this.context.response;

    return (
      <section>
        <h2>
          {response.isCorrect === true
            ? 'You were correct! :D'
            : 'Good try, but not quite right :('}
        </h2>

        <div className='DisplayScore'>
          <p>Your total score is: {response.totalScore}</p>
        </div>

        <div>
          <h4>
            Incorrect:
            {response.isCorrect
              ? head.wordIncorrectCount
              : head.wordIncorrectCount + 1}
          </h4>
        </div>

        <div>
          <h4>
            Correct:
            {response.isCorrect
              ? head.wordCorrectCount + 1
              : head.wordCorrectCount}
          </h4>
        </div>
        <span className='word-style'>{head.nextWord}</span>
        <div className='DisplayFeedback'>
          <p>
            The correct translation for {head.nextWord} was {response.answer}{' '}
            and you chose {this.state.guess}!
          </p>
        </div>

        <Button onClick={this.handleNextWord}>Try another word!</Button>
      </section>
    );
  };

  render() {
    let renderForm = this.state.renderForm;
    return (
      <section>{renderForm ? this.renderForm() : this.userResults()}</section>
    );
  }
}

export default LearningRoute;
