import React, { Component } from 'react';

const LangContext = React.createContext({
  language: {},
  error: null,
  words: [],
  head: {},
  response: [],
  currentWord: '',

  setLanguage: () => {},
  setWords: () => {},
  setHead: () => {},
  setResponse: () => {},
  setGuess: () => {},
  setError: () => {},
  clearError: () => {},

  getWordByOriginal: () => {},
  setCurrentWord: () => {},
  getWordById: () => {},
});

export default LangContext;

export class LangProvider extends Component {
  state = {
    language: {},
    error: null,
    words: [],
    head: {},
    response: {},
    currentWord: '',
  };

  setCurrentWord = (word) => {
    this.setState({ currentWord: word });
  };

  setLanguage = (language, callback) => {
    this.setState({ language }, callback);
  };

  setWords = (words, callback) => {
    this.setState({ words }, callback);
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

  getWordByOriginal = (original) => {
    return this.state.words.find((word) => word.original === original);
  };

  getWordById = (id) => {
    return this.state.words.find((word) => word.id === id);
  };
  render() {
    const value = {
      language: this.state.language,
      error: this.state.error,
      words: this.state.words,
      head: this.state.head,
      response: this.state.response,
      guess: this.state.guess,
      currentWord: this.state.currentWord,

      setCurrentWord: this.setCurrentWord,
      setLanguage: this.setLanguage,
      setWords: this.setWords,
      setHead: this.setHead,
      setResponse: this.setResponse,
      setGuess: this.setGuess,
      setError: this.setError,
      clearError: this.clearError,
      getWordByOriginal: this.getWordByOriginal,
      getWordById: this.getWordById,
    };
    return (
      <LangContext.Provider value={value}>
        {this.props.children}
      </LangContext.Provider>
    );
  }
}
