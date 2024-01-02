// App.js
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Top from './pages/Top';
import UserList from './pages/user/UserList';
import DeptList from './pages/dept/DeptList';

const App = () => {
 return (
    <>
       <Routes>
          <Route path="/" element={<Login />} />} />
          <Route path="/top" element={<Top />} />} />
          <Route path="/user" element={<UserList />} />} />
          <Route path="/dept" element={<DeptList />} />} />
       </Routes>
    </>
 );
};

export default App;