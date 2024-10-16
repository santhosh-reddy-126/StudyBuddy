import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Home from './screen/Home';
import Register from "./screen/Register";
import Main from "./screen/Main";
import Class from "./screen/Class";
import Assignments from "./screen/Assignments";
import Resource from "./screen/Resource";
import Session from "./screen/Session";
import Study from "./screen/Study";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/login" element={<Home />}/>
          <Route exact path="/register" element={<Register />}/>
          <Route exact path="/" element={<Main />}/>
          <Route exact path="/class" element={<Class/>}/>
          <Route exact path="/assignments" element={<Assignments />}/>
          <Route exact path="/resource" element={<Resource />}/>
          <Route exact path="/study" element={<Study />}/>
          <Route exact path="study/session/:id" element={<Session />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
