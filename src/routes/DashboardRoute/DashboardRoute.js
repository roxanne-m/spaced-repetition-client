import React, { Component } from 'react'
import languageApiService from '../../services/language-api-service';
import './DashboardRoute.css';
import { Link } from 'react-router-dom';
import LangContext from '../../contexts/LangContext';

class DashboardRoute extends Component {

  static contextType = LangContext;

    componentDidMount(){
      this.context.clearError();
      languageApiService.getWords()
      .then(res => {
          this.context.setLanguage(res.language);
          this.context.setWords(res.words);
      })
    }


  render() {

    const wordListArray = this.context.words.map((word) => {
      return(
        <li className='word-list-style' key={word.id}>
         <h4>{word.original}</h4><br/>
          {`Correct: ${word.correct_count}`}<br/>
          {`Incorrect: ${word.incorrect_count}`}
        </li>
      )
    })

    return (
      <section>
        <h2>Dashboard</h2>
        <h2>{`Language: ${this.context.language}`}</h2>
        <h3>{`Words to practice`}</h3>
        <ul>
      {wordListArray}
        </ul>
        <p>{`Total correct answers: ${this.context.language.total_score}`}</p>

      <Link to='/learn'>
        <button>Start practicing</button>
      </Link>
        
      </section>
    );
  }
}

export default DashboardRoute
