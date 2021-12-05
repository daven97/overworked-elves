import React from 'react';
import './assets/stylesheets/app.css';

import OverworkedElvesForm from './components/Form';
interface AppProps {
  children: React.ReactNode; // best, accepts everything (see edge case below)
  // functionChildren: (name: string) => React.ReactNode; // recommended function as a child render prop type
  // style?: React.CSSProperties; // to pass through style props
  // onChange?: React.FormEventHandler<HTMLInputElement>; // form events! the generic parameter is the type of event.target
};

// const test = getLocations();
// console.log(test)

function App() {
  return (
    <div className="App">
      <header className="App-header">
        #OverworkedElves {/* TODO: Make link  */}
        {/* TODO: Add Menu */}
      </header>
      <OverworkedElvesForm></OverworkedElvesForm>
    </div>
  );
}

export default App;
