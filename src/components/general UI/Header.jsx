import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UseSearchData } from "../../contexts/searchContext";
import { UserData } from "../../contexts/userContext";
import Notification from "./Notification";
import MainLogo from "./MainLogo";
import { ServerUrl } from "../../contexts/generalContext";

function Header() {
    const navigate = useNavigate();
    const { setFormData } = UseSearchData();
    const {user: userObj, setUser: setUserObj} = UserData();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [notificationTrigger, setNotificationTrigger] = useState(0);
    const server = useContext(ServerUrl);

    function handleSearch(formData) {
        const options = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/search/multi?query=${formData.get("search")}&include_adult=false&language=en-US&page=1`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
            }
        };

        axios
        .request(options)
        .then(res => {
            setFormData(res.data.results);
            navigate({
                pathname:`/search`,
                search: `?query=${formData.get("search")}`
            });
        })
        .catch(err => {
            setSuccess();
            setError(err);
            setNotificationTrigger(notificationTrigger + 1);
        });
    }

    async function handleLogout(){
        try {
            await axios.get(`${server}/logout/`, {withCredentials: true});
            setSuccess("You are logged out");
            setError();
            setNotificationTrigger(notificationTrigger + 1);
            setUserObj({});
        } catch (error) {
            if (error.response) {
                setError("Error: " + error.response.status + " " + error.response.data);
            } else if (error.request) {
                setError("No response from server");
            } else {
                setError("Server error, try again later");
            }
            setNotificationTrigger(prev=> prev+1);
            setSuccess();
        }
    }

    return(
        <>
            <header>
                <nav className="navbar navbar-expand-lg" aria-label="navbar">
                    <div className="container-fluid">
                        <Link to="/">
                            <MainLogo />
                        </Link>

                        <div className="d-flex form-and-toggle">
                            <form role="search" action={handleSearch} className="d-flex align-items-center me-2">
                                <input
                                name="search"
                                type="search"
                                placeholder="Movie, Series ..."
                                className="form-control"
                                aria-label="Search"
                                required
                                />
                                <button type="submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search me-1" viewBox="0 0 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                    </svg>
                                </button>
                            </form>
                            <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbar"
                            aria-controls="navbar"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list navbar-toggler-icon" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                                </svg>
                            </button>
                        </div>

                        <div className="navbar-collapse collapse justify-content-center flex-wrap align-items-center" id="navbar">
                            <ul className="nav-main-ul mb-lg-0 flex-wrap">
                                 <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Explore movies
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="m-1"><Link to="/movies/genre/28">Action</Link></li>
                                        <li className="m-1"><Link to="/movies/genre/35">Comedy</Link></li>
                                        <li className="m-1"><Link to="/movies/genre/80">Crime</Link></li>
                                        <li className="m-1"><Link to="/movies/genre/18">Drama</Link></li>
                                        <li className="m-1"><Link to="/movies/genre/27">Horror</Link></li>
                                        <li className="m-1"><Link to="/movies/genre/10749">Romance</Link></li>
                                        <li className="m-1"><Link to="/movies/genre/10752">War</Link></li>
                                        <li className="m-1"><Link to="/movies/genre/99">Documentary</Link></li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Explore series
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="m-1"><Link to="/series/genre/10759">Action & Adventure</Link></li>
                                        <li className="m-1"><Link to="/series/genre/35">Comedy</Link></li>
                                        <li className="m-1"><Link to="/series/genre/80">Crime</Link></li>
                                        <li className="m-1"><Link to="/series/genre/18">Drama</Link></li>
                                        <li className="m-1"><Link to="/series/genre/10765">Sci-Fi & Fantasy</Link></li>
                                        <li className="m-1"><Link to="/series/genre/9648">Mystery</Link></li>
                                        <li className="m-1"><Link to="/series/genre/10768">War & Politics</Link></li>
                                        <li className="m-1"><Link to="/series/genre/99">Documentary</Link></li>
                                    </ul>
                                </li>
                            </ul>

                            <div className="d-flex gap-2">
                                {userObj.user ? (
                                    <div className="dropdown"> 
                                        <a
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        >
                                            <img src={userObj.user.profile_pic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"} className="profile-header" alt="profile picture" />
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill mt-1" viewBox="0 0 16 16">
                                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                            </svg>
                                        </a>
                                        <ul className="dropdown-menu">
                                            <Link to="/user">
                                                <li className="mb-3">My profile</li>
                                            </Link>
                                            <li onClick={handleLogout} style={{color: 'var(--warning)'}}>Logout
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right ms-1" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                                                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                                                </svg>
                                            </li>
                                        </ul>
                                    </div>
                                ) : (
                                    <Link to="/login">
                                        <button className="btn btn-outline-secondary login" type="button">
                                            Login
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            {error && <Notification message={error} trigger={notificationTrigger} />}
            {success && <Notification message={success} trigger={notificationTrigger} bgColor="green" />}
        </>
    )
}

export default Header;