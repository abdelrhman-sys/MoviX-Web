import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ImgsRoute } from "../../contexts/generalContext";
import SmartImage from "../general UI/SmartImage";

export default function WorkCredits(props) {
    const {posterId} = useParams();
    const imgsRoute = useContext (ImgsRoute);
    const [credits, setCredits] = useState([]);
    const creditsRef = useRef(null);
    const [showShadowRight, setShowShadowRight] = useState(true);
    const [showShadowLeft, setShowShadowLeft] = useState(false);

    useEffect(()=> {
        const options = {
            method: 'GET', 
            url: `https://api.themoviedb.org/3/${props.kind =="movies" ? "movie" :"tv"}/${posterId}/${props.kind =="movies" ? "credits" :"aggregate_credits"}?language=en-US`,
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

    useEffect(() => { // handle scroll shadow
        const creditsDiv = creditsRef.current;
        if (!creditsDiv) return;

        const handleScroll = () => {
            const { scrollLeft, scrollWidth, clientWidth } = creditsDiv;
            const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5; // 5px threshold
            setShowShadowRight(!isAtEnd);
            setShowShadowLeft(scrollLeft > 5);
        };

        handleScroll();

        creditsDiv.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);

        return () => {
            creditsDiv.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [credits]);

    const cast = credits.filter(credit=> credit.profile_path);

    return (
        <section className="work-credits-container">
            <h2>Cast</h2>
            {cast[0] ?
                <div className="work-credits-wrapper">
                    {showShadowLeft && <div className="work-credits-shadow-left"></div>}
                    <div className="work-credits" ref={creditsRef}>
                        {cast.map((artist)=> {
                            return(
                                <Link to={`/artist/${artist.id}`} key={artist.id}>
                                    <div key={artist.id} className="position-relative artist">
                                        <SmartImage src={imgsRoute + "w780" + artist.profile_path} alt={props.alt} className="rounded-4" />
                                        <div className="artist-names position-absolute">
                                            <p className="artist-name m-0">{artist.original_name}</p>
                                            <p className="artist-char m-0"><i>{props.kind =="movies" ? artist.character : artist.roles[0]?.character}</i></p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                    {showShadowRight && <div className="work-credits-shadow-right"></div>}
                </div>
                :
                <h3>No cast available</h3>
            }
        </section>
    )
}