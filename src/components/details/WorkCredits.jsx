import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
        const actors = document.querySelectorAll(".actor");                
        const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');            
        } else {
            entry.target.classList.remove('animate');
        }
        });
        }, { threshold: 0.2 });

        if (actors && actors.length > 0) {
            actors.forEach(actor => observer.observe(actor));
        }

        return(()=> {
            if (actors && actors.length > 0) {
                actors.forEach(actor => observer.unobserve(actor));
            }
        })
    }, [credits])

    const actors = credits.filter(credit=> credit.known_for_department === "Acting" && credit.profile_path);

    return (
        <section className="work-credits-container">
            <h2>Actors</h2>
            {actors[0] ?
                <div className="work-credits">
                {actors.map((actor)=> {
                    return(
                        <div key={actor.id} className="position-relative actor">
                            <img src={imgsRoute + "w154" + actor.profile_path} alt={props.alt} loading="lazy" className="rounded-4" />
                            <div className="actor-names position-absolute">
                                <p className="actor-name m-0">{actor.original_name}</p>
                                <p className="actor-char m-0"><i>{actor.character}</i></p>
                            </div>
                        </div>
                    )
                })}
                </div>
                :
                <h3>No actors available</h3>
            }
        </section>
    )
}