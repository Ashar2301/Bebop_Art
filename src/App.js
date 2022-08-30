
import {BrowserRouter as Router,Route,Switch,Routes} from 'react-router-dom';
import './App.css';
import LogIn  from './LogIn';
import SignUp from './SignUp';
import IndexPage from './IndexPage'
import Home from './Home';
import Classes from './App.module.css'
import Header from './Header';
import Header2 from './Header2';
function App() {
  return (
      <Router>  
        <Route path="/home" exact component={Header}></Route>
        <Route path="/" exact component={Header2}></Route>
      <Switch>
        
      <Route path="/" exact component={IndexPage}></Route> 
      {/* <Route path="/SignUp" exact component={SignUp}></Route> */}
      
      <Route path="/home" exact component={Home}></Route>

      </Switch>
      
    </Router>
  );
}

export default App;
