import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from '../../contexts/UserContext';
import { LangProvider } from '../../contexts/LangContext';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <UserProvider>
        <LangProvider>
          <App />
        </LangProvider>
      </UserProvider>
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
