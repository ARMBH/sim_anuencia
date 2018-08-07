import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

//COMPONENTS
import Routes from './routes';
import Header from './components/header';


const App = () => {

    return (
        <div>

            

                <BrowserRouter>
                    <div>
                        <header>
                            <Header />
                        </header>
                        
                            <Routes />
                        
                    </div>
                </BrowserRouter>

            
        </div>
    )

};

ReactDOM.render(<App />, document.getElementById('root'))
