import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import CreatePost from './pages/CreatePost.tsx';
import PostDetail from './pages/PostDetail.tsx';
import Profile from './pages/Profile.tsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;