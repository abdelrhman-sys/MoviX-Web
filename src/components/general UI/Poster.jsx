import { useContext } from "react"
import { ImgsRoute, ServerUrl } from "../../contexts/generalContext"
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { UserData } from "../../contexts/userContext";
import axios from "axios";
import MiniLoading from "./MiniLoading";

export default function Poster(props) {
    const imgsRoute = useContext(ImgsRoute);
    const {user: userObj, setUser} = UserData();
    const server = useContext(ServerUrl);
    const navigate = useNavigate();
    const [fav, setFav] = useState(()=> { if(userObj.favShows) return userObj.favShows.some((show)=> show.show_id == props.posterId && props.kind == show.show_type)}); // check if the show is in favShows initially
    const [later, setLater] = useState(()=> { if(userObj.laterShows) return userObj.laterShows.some((show)=> show.show_id == props.posterId && props.kind == show.show_type)}); // check if the show is in laterShows initially
    const [favLoading, setFavLoading] = useState(false);
    const [laterLoading, setLaterLoading] = useState(false)

    useEffect(()=> {
        const posters = document.querySelectorAll(".poster-div");        
        const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');            
        } else {
            entry.target.classList.remove('animate');
        }
        });
        }, { threshold: 0.1 });

        if (posters && posters.length > 0) {
            posters.forEach(poster => observer.observe(poster));
        }

        return(()=> {
            if (posters && posters.length > 0) {
                posters.forEach(poster => observer.unobserve(poster));
            }
        })
    }, [])

     useEffect(()=> { // checking if show is fav/later
        if (userObj.favShows && userObj.favShows.some((show)=> show.show_id == props.posterId)) {
            setFav(true);
        } else {
            setFav(false);
        }

        if (userObj.laterShows && userObj.laterShows.some((show)=> show.show_id == props.posterId)) {
            setLater(true);
        } else {
            setLater(false);
        }
    }, [userObj, props])

    async function handleFav() {
        if (userObj.user) {
            setFavLoading(true);
            if (!fav) {
                try {
                    await axios.post(`${server}/fav`, {
                        showId: props.posterId,
                        showType: props.kind , // movies / series
                        showPoster: props.path,
                        showName: props.name
                    } , {headers: {'content-type': 'application/json'}, withCredentials: true});
                    setUser(prev=> ({...prev, favShows: [...userObj.favShows, { show_id: props.posterId, show_type: props.kind, show_poster: props.path, show_name: props.name }]}));
                    setFav(true);
                } catch (error) {
                    console.log(error);
                    alert("An error occurred while adding to favourites."); // just for now
                }
            } else {
                try {
                    await axios.delete(`${server}/fav/${props.posterId}?type=${props.kind}`, {withCredentials: true});
                    setFav(false);
                    
                    for (let i = 0; i < userObj.favShows.length; i++) {
                        if (userObj.favShows[i].show_id == props.posterId) {
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
                        showId: props.posterId,
                        showType: props.kind , // movies / series
                        showPoster: props.path,
                        showName: props.name
                    } , {headers: {'content-type': 'application/json'}, withCredentials: true});
                    setLater(true);
                    setUser(prev=> ({...prev, laterShows: [...userObj.laterShows, { show_id: props.posterId, show_type: props.kind, show_poster: props.path, show_name: props.name }]}));
                } catch (error) {
                    console.log(error);
                    alert("An error occurred while adding to watchlist."); // just for now
                }
            } else {
                try {
                    await axios.delete(`${server}/later/${props.posterId}?type=${props.kind}`, {withCredentials: true});
                    setLater(false);
                    
                    for (let i = 0; i < userObj.laterShows.length; i++) { // delete the show from the user context
                        if (userObj.laterShows[i].show_id == props.posterId) {
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
        <div className="poster-div">
            <Link to={(props.kind === "movies"? "/movies/" : "/series/") + props.posterId}>
                <img src={imgsRoute + props.src} alt={props.alt} loading="lazy" className="poster-img"/>
                <p>{props.name}</p>
            </Link>
            <span className="poster-btn poster-fav" onClick={handleFav}>
                {favLoading ? <MiniLoading width={15} height={15} /> :
                    !fav ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-star me-1" viewBox="0 0 16 16">
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-star-fill me-1" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                }
            </span>
            <span className="poster-btn poster-later" onClick={handleLater}>
                {laterLoading ? <MiniLoading width={15} height={15} /> :
                    !later ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-bookmark-plus ms-1" viewBox="0 0 16 16">
                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                            <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-bookmark-plus-fill ms-1" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5z"/>
                        </svg>
                }
            </span>
        </div>
    )
}