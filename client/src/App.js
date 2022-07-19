import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './Pages/Login/Login';
import Register from './Pages/Login/Register';
import Posts from './Component/Posts/Posts';
import Detail from './Component/Detail/Detail';
import ProfileSettings from './Pages/ProfileSettings/ProfileSettings';
import Profile from './Pages/Profile/Profile';
import OtherProfile from './Pages/Profile/OtherProfile';
import Favourites from './Pages/Favourites/Favourites';
import Search from './../src/Component/Search/Search'
function App() {
  const user = useSelector((state) => state.user);
  const { currentUser } = user;
  const userToken = currentUser?.token;

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Navigate to="/posts" />} />
          <Route
            exact
            path="/posts"
            element={userToken ? <Posts /> : <Navigate to="/login" />}
          />
          <Route
            exact
            path="/posts/search"
            element={userToken ? <Search /> : <Navigate to="/login" />}
          />
          <Route
            path="/posts/:slug"
            element={userToken ? <Detail /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={userToken ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={userToken ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/settings"
            element={userToken ? <ProfileSettings /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={userToken ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/user/:id"
            element={userToken ? <OtherProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/favourites"
            element={userToken ? <Favourites /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
