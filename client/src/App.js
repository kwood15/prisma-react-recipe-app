import React, { Component } from 'react';

import AllRecipesContainer from '../containers/AllRecipesContainer';

import 'main.css';

class App extends Component {
  render() {
    return (
      <div className="app-container cover">
        <AllRecipesContainer />
      </div>
    );
  }
}

export default App;
