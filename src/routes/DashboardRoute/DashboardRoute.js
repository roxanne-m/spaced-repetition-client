import React, { Component } from 'react'
import languageApiService from '../../services/language-api-service';
import './DashboardRoute.css';
import { Link } from 'react-router-dom';
import LangContext from '../../contexts/LangContext';

class DashboardRoute extends Component {

    state = { 
      words: [],
      language: '',
      totalCorrect: 0
    }

    componentDidMount(){
      languageApiService.getWords()
      .then(res => {
        console.log(res);
        this.setState({
          words: res.words,
          language: res.language.name,
          totalCorrect: res.language.total_score
        })
      })
    }


  render() {

    const wordListArray = this.state.words.map((word) => {
      return(
        <li className='word-list-style' key={word.id}>
         <h4>{`${word.original}`}</h4><br/>
          {`Correct: ${word.correct_count}`}<br/>
          {`Incorrect: ${word.incorrect_count}`}
        </li>
      )
    })

    return (
      <section>
        <h2>Dashboard</h2>
        <h2>{`Language: ${this.state.language}`}</h2>
        <h3>{`Words to practice`}</h3>
        <ul>
      {wordListArray}
        </ul>
        <p>{`Total correct answers: ${this.state.totalCorrect}`}</p>

      <Link to='/learn'>
        <button>Start practicing</button>
      </Link>
        
        
      </section>
    );
  }
}

export default DashboardRoute
