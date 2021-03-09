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
  async componentDidMount() {
    this.context.clearError();
    await languageApiService.getLanguageHead().then((res) => {
      this.context.setHead(res);
    });

    await languageApiService.getWords().then((res) => {
      this.context.setLanguage(res.language);
      this.context.setWords(res.words);
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

      this.context.setTotalScore(res.totalScore); // updates total score
    });
  };

  handleNextWord = (e) => {
    this.context.setGuess('');
    languageApiService.getLanguageHead().then((res) => {
      this.context.setHead(res, () => this.setState({ renderForm: true }));
    });
  };

  // Function to render form
  renderForm = () => {
    let { head } = this.context;
    // let headWord;
    let correctCount;
    let incorrectCount;
    // let totalScore;
    if (head.nextWord) {
      // headWord = head.original;
      correctCount = head.wordCorrectCount;
      incorrectCount = head.wordIncorrectCount;
    }

    return (
      <section>
        <h2>Translate the word:</h2>
        <span>
          <h3>{head.nextWord}</h3>
        </span>

        <p>{`Your total score is: ${this.context.totalScore}`}</p>
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
    console.log(this.context.response, 'THIS CONTEXT response');
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
              ? response.wordIncorrectCount
              : response.wordIncorrectCount + 1}
          </h4>
        </div>

        <div>
          <h4>
            Correct:
            {response.isCorrect
              ? response.wordCorrectCount + 1
              : response.wordCorrectCount}
          </h4>
        </div>
        <span className='word-style'>{head.nextWord}</span>
        <div className='DisplayFeedback'>
          <p>
            The correct translation for {head.nextWord} was {head.translation}{' '}
            and you chose {this.state.guess}!
          </p>
        </div>

        <Button onClick={this.handleNextWord}>Try another word!</Button>
      </section>
    );
  };

  render() {
    let displayForm = this.state.renderForm;
    return (
      <section>{displayForm ? this.renderForm() : this.userResults()}</section>
    );
  }
}

export default LearningRoute;
