// App.js
import { Routes, Route } from 'react-router-dom';
import Navbar from './common/Navbar';
import Login from './pages/Login';
import Top from './pages/Top';
import UserList from './pages/user/UserList';

const App = () => {
 return (
    <>
       <Routes>
          {/* <Route path="/top" element={<Navbar />} /> */}
          <Route path="/" element={<Login />} />} />
          <Route path="/top" element={<Top />} />} />
          <Route path="/user" element={<UserList />} />} />
       </Routes>
    </>
 );
};

export default App;