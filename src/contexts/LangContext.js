import React, { Component } from 'react';

const LangContext = React.createContext({
  language: {},
  error: null,
  words: [],
  head: {},
  response: [],
  guess: '',

  setLanguage: () => {},
  setWords: () => {},
  setHead: () => {},
  setResponse: () => {},
  setGuess: () => {},
  setError: () => {},
  clearError: () => {},
  setTotalScore: () => {},
  getWordByOriginal: () => {},
});

export default LangContext;

export class LangProvider extends Component {
  state = {
    language: {},
    error: null,
    words: [],
    head: {},
    response: [],
    totalScore: 0,
  };

  setLanguage = (language) => {
    this.setState({ language, totalScore: language.total_score });
  };

  setWords = (words) => {
    this.setState({ words });
  };

  setHead = (head, callback) => {
    this.setState({ head }, callback);
  };

  setResponse = (response) => {
    this.setState({ response });
  };

  setGuess = (guess) => {
    this.setState({ guess });
  };

  setError = (error) => {
    this.setState({ error });
  };

  clearError = () => {
    this.setState({ error: null });
  };

  setTotalScore = (newTotalScore) => {
    this.setState({ totalScore: newTotalScore });
  };

  getWordByOriginal = (original) => {
    return this.state.words.find((word) => word.original === original);
  };

  render() {
    const value = {
      language: this.state.language,
      error: this.state.error,
      words: this.state.words,
      head: this.state.head,
      response: this.state.response,
      guess: this.state.guess,
      totalScore: this.state.totalScore,

      setLanguage: this.setLanguage,
      setWords: this.setWords,
      setHead: this.setHead,
      setResponse: this.setResponse,
      setGuess: this.setGuess,
      setError: this.setError,
      clearError: this.clearError,
      getWordByOriginal: this.getWordByOriginal,
      setTotalScore: this.setTotalScore,
    };
    return (
      <LangContext.Provider value={value}>
        {this.props.children}
      </LangContext.Provider>
    );
  }
}
