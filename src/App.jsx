import './styles/index.css';
import './styles/home.css'
import './styles/otherPages.css';
import './styles/generalUI.css';
import "./styles/intersectionAnimate.css";
import Header from './components/general UI/Header.jsx';
import Home from './components/home/Home.jsx';
import WorkPage from './components/details/WorkPage.jsx';
import Login from './components/register/Login.jsx';
import Footer from './components/general UI/Footer.jsx';
import ErrorPage from './components/general UI/ErrorPage.jsx';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/general UI/ScrollToTop.jsx';
import SearchResult from './components/search/SearchResult.jsx';
import { SearchGenre } from './components/search/SearchGenre.jsx';
import SignUp from './components/register/SignUp.jsx';
import User from './components/register/User.jsx';
import MoreShows from './components/details/MoreShows.jsx';
import MoreDiscoverShows from './components/details/MoreDiscoverShows.jsx';

function App() {
    return(
        <>
            <ScrollToTop />
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/more' element={<MoreShows />} />
                <Route path='/more/:showId' element={<MoreShows />} />
                <Route path='/discover' element={<MoreDiscoverShows />} />
                <Route path='/movies/:posterId' element={<WorkPage kind="movies" />} />
                <Route path='/series/:posterId' element={<WorkPage kind="series" />} />
                <Route path='/search' element={<SearchResult />} />
                <Route path='movies/genre/:genreId' element={<SearchGenre kind="movies" />} />
                <Route path='series/genre/:genreId' element={<SearchGenre kind="series" />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signUp' element={<SignUp />} />
                <Route path='/user' element={<User />} />
                <Route path='/laterShows' element={<User />} />
                <Route path='*' element={<ErrorPage />} />
            </Routes>
            <Footer />
        </>
    )
}

export default App;