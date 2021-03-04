import React, { Component } from 'react';

const LangContext = React.createContext({
  language: [],
  error: null,
  words: [],
  head: [],
  response: [],
  guess: '',

  setLanguage: () => {},
  setWords: () => {},
  setHead: () => {},
  setResponse: () => {},
  setGuess: () => {},
  setError: () => {},
  clearError: () => {},
});

export default LangContext;

export class LangProvider extends Component {
  state = {
    language: {},
    error: null,
    words: [],
    head: [],
    response: [],
  };

  setLanguage = (language) => {
    this.setState({ language });
  };

  setWords = (words) => {
    this.setState({ words });
  };

  setHead = (head) => {
    this.setState({ head });
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

  render() {
    const value = {
      language: this.state.language,
      error: this.state.error,
      words: this.state.words,
      head: this.state.head,
      response: this.state.response,
      guess: this.state.guess,

      setLanguage: this.setLanguage,
      setWords: this.setWords,
      setHead: this.setHead,
      setResponse: this.setResponse,
      setGuess: this.setGuess,
      setError: this.setError,
      clearError: this.clearError,
    };
    return (
      <LangContext.Provider value={value}>
        {this.props.children}
      </LangContext.Provider>
    );
  }
}
