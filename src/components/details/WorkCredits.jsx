import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ImgsRoute } from "../../contexts/generalContext";

export default function WorkCredits(props) {
    const {posterId} = useParams();
    const imgsRoute = useContext (ImgsRoute);
    const [credits, setCredits] = useState([]);

    useEffect(()=> {
        const options = {
            method: 'GET', 
            url: `https://api.themoviedb.org/3/${props.kind =="movies" ? "movie" :"tv"}/${posterId}/credits?language=en-US`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
            }
        };

        axios
        .request(options)
        .then(res => setCredits(res.data.cast))
        .catch(err => console.error(err));
    }, [posterId, props.kind])
    
    useEffect(()=> {
        const artists = document.querySelectorAll(".artist");                
        const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');            
        } else {
            entry.target.classList.remove('animate');
        }
        });
        }, { threshold: 0.2 });

        if (artists && artists.length > 0) {
            artists.forEach(artist => observer.observe(artist));
        }

        return(()=> {
            if (artists && artists.length > 0) {
                artists.forEach(artist => observer.unobserve(artist));
            }
        })
    }, [credits])

    const cast = credits.filter(credit=> credit.profile_path);

    return (
        <section className="work-credits-container">
            <h2>Cast</h2>
            {cast[0] ?
                <div className="work-credits">
                {cast.map((artist)=> {
                    return(
                        <Link to={`/artist/${artist.id}`}>
                            <div key={artist.id} className="position-relative artist">
                                <img src={imgsRoute + "w154" + artist.profile_path} alt={props.alt} loading="lazy" className="rounded-4" />
                                <div className="artist-names position-absolute">
                                    <p className="artist-name m-0">{artist.original_name}</p>
                                    <p className="artist-char m-0"><i>{artist.character}</i></p>
                                </div>
                            </div>
                        </Link>
                    )
                })}
                </div>
                :
                <h3>No cast available</h3>
            }
        </section>
    )
}