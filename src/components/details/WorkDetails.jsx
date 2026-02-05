import { useContext, useEffect, useRef, useState } from "react";
import { ImgsRoute, ServerUrl } from "../../contexts/generalContext";
import { useNavigate, useParams } from "react-router-dom";
import { UserData } from "../../contexts/userContext";
import axios from "axios";
import MiniLoading from "../general UI/MiniLoading";
import SmartImage from "../general UI/SmartImage";

export default function WorkDetails({ kind, tmdbData, omdbData }) {
    const {user: userObj, setUser} = UserData();
    const server= useContext(ServerUrl);
    const {posterId} = useParams();
    const imgsRoute = useContext(ImgsRoute);
    const posterRef = useRef();
    const navigate = useNavigate();
    const [fav, setFav] = useState(false);
    const [later, setLater] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const [laterLoading, setLaterLoading] = useState(false);
    
    useEffect(()=> { // poster animation
        const poster= posterRef.current;
        const observer = new IntersectionObserver((entries)=> {
            entries.forEach(entry=> {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate");
                } else {
                    entry.target.classList.remove("animate");
                }
            })
        }, {threshold: .1});
        if (poster) {
            observer.observe(poster);
        }

        return(()=> { 
            observer.disconnect();
        })
    }, [tmdbData, omdbData])

     useEffect(()=> { // checking if show is fav/later
        if (tmdbData.genres) {
            if (userObj.favShows && userObj.favShows.some((show)=> show.show_id == posterId)) {
                setFav(true);
            } else {
                setFav(false);
            }

            if (userObj.laterShows && userObj.laterShows.some((show)=> show.show_id == posterId)) {
                setLater(true);
            } else {
                setLater(false);
            }
        }
    }, [posterId, tmdbData, userObj])

    async function handleFav() {
        if (userObj.user) {
            setFavLoading(true);
            if (!fav) {
                try {
                    await axios.post(`${server}/fav`, {
                        showId: posterId,
                        showType: kind , // movies / series
                        showPoster: tmdbData.poster_path,
                        showName: tmdbData.name || tmdbData.title
                    } , {headers: {'content-type': 'application/json'}, withCredentials: true});
                    setUser(prev=> ({...prev, favShows: [...userObj.favShows, { show_id: posterId, show_type: kind, show_name: tmdbData.name || tmdbData.title, show_poster: tmdbData.poster_path }]}));
                    setFav(true);
                } catch (error) {
                    console.log(error);
                    alert("An error occurred while adding to favourites."); // just for now
                }
            } else {
                try {
                    await axios.delete(`${server}/fav/${posterId}?type=${kind}`, {withCredentials: true});
                    setFav(false);

                    for (let i = 0; i < userObj.favShows.length; i++) { // remove the work from fav in user context
                        if (userObj.favShows[i].show_id == posterId) {
                            userObj.favShows.splice(i, 1);
                            setUser(prev=> ({...prev, favShows: userObj.favShows}));
                            break;
                        }
                    }
                } catch (error) {
                    console.log(error);
                    alert("An error occurred while removing from favourites."); // just for now
                }
            }
            setFavLoading(false);
        } else {
            navigate('/login');
        }
    }

    async function handleLater() {
        if (userObj.user) {
            setLaterLoading(true);
            if (!later) {
                try {
                    await axios.post(`${server}/later`, {
                        showId: posterId,
                        showType: kind , // movies / series
                        showPoster: tmdbData.poster_path,
                        showName: tmdbData.name || tmdbData.title
                    } , {headers: {'content-type': 'application/json'}, withCredentials: true});
                    setLater(true);
                    setUser(prev=> ({...prev, laterShows: [...userObj.laterShows, { show_id: posterId, show_type: kind, show_name: tmdbData.name || tmdbData.title, show_poster: tmdbData.poster_path }]}));
                } catch (error) {
                    console.log(error);
                    alert("An error occurred while adding to watchlist."); // just for now 
                }
            } else {
                try {
                    await axios.delete(`${server}/later/${posterId}?type=${kind}`, {withCredentials: true});
                    setLater(false);
    
                    for (let i = 0; i < userObj.laterShows.length; i++) { // remove the work from later in user context
                        if (userObj.laterShows[i].show_id == posterId) {
                            userObj.laterShows.splice(i, 1);
                            setUser(prev=> ({...prev, laterShows: userObj.laterShows}));
                            break;
                        }
                    }
                } catch (error) {
                    console.log(error);
                    alert("An error occurred while removing from watchlist."); // just for now
                }
            }
            setLaterLoading(false);
        } else {
            navigate('/login');
        }
    }

    return (
        <div className="work" style={{background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url(${imgsRoute + "original" + tmdbData.backdrop_path}) center/cover no-repeat`}}>
            <div className="work-poster ms-2" ref={posterRef}>
                <SmartImage src={(imgsRoute + "original" + tmdbData.poster_path) || "https://png.pngtree.com/png-clipart/20230917/original/pngtree-icon-of-unavailable-image-illustration-in-vector-with-flat-design-vector-png-image_12324700.png"} alt={tmdbData.title || tmdbData.name} />
            </div>
            <div className="work-details">
                <h1  className="mt-2">{tmdbData.title || tmdbData.name}</h1>
                <div>
                    <span className="work-rate me-2">{omdbData? omdbData.imdbRating : 'N/A'}{omdbData && (omdbData.imdbRating != 'N/A') && "/10"} <span id="imdb">IMDb</span></span>
                    <span className="work-genres">
                        {omdbData ? omdbData.Genre.split(', ').map((genre, index)=> {
                            return <span key={index} className="work-genre m-1 p-1 rounded-3">{genre}</span>
                            })
                        :
                        tmdbData.genres.map((genre, index)=> {
                            return <span key={index} className="work-genre m-1 p-1 rounded-3">{genre.name}</span>
                        })}
                    </span>
                </div>
                <div className="mt-4 work-description">
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-event-fill me-1" viewBox="0 0 16 16">
                            <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5"/>
                        </svg>
                        Release date: <span className="work-date detail">{tmdbData.release_date || (tmdbData.first_air_date + " to " + tmdbData.last_air_date)} {tmdbData.first_air_date && (tmdbData.in_production? "(In production)" : "(Completed)")}</span>
                    </p>
                    <hr />
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-globe-americas me-1" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z"/>
                        </svg>   
                        Countries: <span className="work-country detail">{omdbData ? omdbData.Country : tmdbData.origin_country?.join(', ')}</span>
                    </p>
                    <hr />
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-body-text me-1" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M0 .5A.5.5 0 0 1 .5 0h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 0 .5m0 2A.5.5 0 0 1 .5 2h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m9 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-9 2A.5.5 0 0 1 .5 4h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m5 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m7 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-12 2A.5.5 0 0 1 .5 6h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-8 2A.5.5 0 0 1 .5 8h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m7 0a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-7 2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
                        </svg>
                        Description: <span className="work-description detail">{tmdbData.overview}</span>
                    </p>
                    <hr />
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-translate me-1" viewBox="0 0 16 16">
                            <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z"/>
                            <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31"/>
                        </svg>
                        Languages: <span className="work-language detail">{tmdbData.spoken_languages?.map((lang)=> lang.english_name).join(', ') || "N/A"}</span>
                    </p>
                    <hr />
                    {tmdbData.runtime? <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock-fill me-1" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                        </svg>
                        Time: <span className="work-time detail">{tmdbData.runtime} minutes</span>
                        </p>
                        : 
                        <p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stack me-1" viewBox="0 0 16 16">
                                <path d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.6.6 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.6.6 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.6.6 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535z"/>
                                <path d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.6.6 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0z"/>
                            </svg>
                            Seasons: <span className="work-seasons detail">{tmdbData.number_of_seasons}</span>
                        </p>
                    }
                    {omdbData &&
                        <>
                            <hr />
                            {omdbData.Type == "movie" ? 
                            <p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cash-stack me-1" viewBox="0 0 16 16">
                                    <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                    <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/>
                                </svg>
                                Box office: <span className="work-office detail">{omdbData.BoxOffice}</span>
                            </p>
                            :
                            <p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list-ol me-1" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"/>
                                    <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635z"/>
                                </svg>
                                Episodes: <span className="work-episodes detail">{tmdbData.number_of_episodes}</span>
                            </p>}
                        </>
                    }
                </div>

                <div>
                    <button className="btn work-btn work-fav w-100" type="button" style={fav ? { color: 'var(--highlight)' } : {}} onClick={handleFav}>
                        {favLoading ? <MiniLoading /> : 
                            !fav ?
                                <>
                                    Add to favourites
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-star ms-1" viewBox="0 0 16 16">
                                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
                                    </svg>
                                </>
                                :
                                <>
                                    In favourites
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-star-fill ms-1" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                    </svg>
                                </>
                        }    
                    </button>
                    <button className="btn work-btn work-later w-100 mt-2" type="button" style={later ? { color: 'var(--highlight)' } : {}} onClick={handleLater}>
                        {laterLoading ? <MiniLoading /> :
                            !later?
                                <>
                                    Add to watchlist
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-bookmark-plus ms-1" viewBox="0 0 16 16">
                                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                                        <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4"/>
                                    </svg>
                                </>
                                :
                                <>
                                    In watchlist
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-bookmark-plus-fill" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5z"/>
                                    </svg>
                                </>
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}