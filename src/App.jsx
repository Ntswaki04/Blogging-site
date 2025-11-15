import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import './components/BlogCard.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Blog from './pages/Blog';
import CreateBlog from './pages/CreateBlog';
import BlogPostPage from './pages/BlogPostPage';
import EditBlog from './pages/EditBlog';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewsLetterBanner from './components/NewsLetterBanner';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/create" element={<CreateBlog />} />
            <Route path="/edit/:id" element={<EditBlog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      <NewsLetterBanner />
      </div>
    </Router>
  );
}

export default App;