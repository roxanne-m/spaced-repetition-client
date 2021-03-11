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
  componentWillMount() {
    this.context.clearError();

    languageApiService
      .getWords()
      .then((res) => {
        this.context.setLanguage(res.language);
        this.context.setCurrentWord(
          this.context.getWordById(res.language.head).original
        );
        this.context.setWords(res.words);
      })
      .catch((error) => {});

    languageApiService
      .getLanguageHead()
      .then((res) => {
        this.context.setHead(res);
      })
      .catch((error) => {});
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
    languageApiService.getWords().then((data) => {
      this.context.setCurrentWord(
        this.context.getWordById(data.language.head).original
      );
    });
    this.setState({ guess: '' });

    languageApiService.getLanguageHead().then((res) => {
      this.context.setHead(res, () => this.setState({ renderForm: true }));
    });
  };

  // Function to render form
  renderForm = () => {
    let { head } = this.context;

    let correctCount;
    let incorrectCount;

    correctCount = head.wordCorrectCount;
    incorrectCount = head.wordIncorrectCount;

    let totalScore = this.context.response.totalScore || head.totalScore;
    let currentWord = this.context.currentWord;
    if (currentWord === '') {
      if (this.context.response.nextWord) {
        currentWord = this.context.response.nextWord;
      } else {
        currentWord = head.nextWord;
      }
    }
    return (
      <section>
        <h2>Translate the word:</h2>
        <span>
          <h3>{currentWord}</h3>
        </span>

        <p>{`Your total score is: ${totalScore}`}</p>
        <form onSubmit={this.handleOnSubmit}>
          <Label htmlFor='learn-guess-input'>
            What's the translation for this word?
          </Label>
          <Input
            type='text'
            id='learn-guess-input'
            value={this.state.guess}
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
    let response = this.context.response;

    let currentWord = this.context.currentWord;
    if (currentWord === '') {
      if (this.context.head.nextWord) {
        currentWord = this.context.head.nextWord;
      } else {
        currentWord = this.context.response.nextWord;
      }
    }
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
            {response.wordIncorrectCount}
          </h4>
        </div>

        <div>
          <h4>
            Correct:
            {response.wordCorrectCount}
          </h4>
        </div>
        <span className='word-style'>{currentWord}</span>
        <div className='DisplayFeedback'>
          <p>
            The correct translation for {currentWord} was {response.answer} and
            you chose {this.state.guess}!
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
