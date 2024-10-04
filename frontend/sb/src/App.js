import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Home from './screen/Home';
import Register from "./screen/Register";
import Main from "./screen/Main";
import Class from "./screen/Class";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/login" element={<Home />}/>
          <Route exact path="/register" element={<Register />}/>
          <Route exact path="/" element={<Main />}/>
          <Route exact path="/class" element={<Class/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
