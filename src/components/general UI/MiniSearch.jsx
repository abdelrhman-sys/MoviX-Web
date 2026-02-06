import { useContext } from "react";
import SmartImage from "../general UI/SmartImage";
import { ImgsRoute } from "../../contexts/generalContext";
import { Link } from "react-router-dom";

export default function MiniSearch(props) {
    const imgsroute = useContext(ImgsRoute);

    return (
        <section className="mini-search" ref={props.ref}>
            {props.results.filter(result => result.poster_path || result.profile_path).map(result=>
                <Link to={`/${result.media_type == "movie" ? "movies" : result.media_type == "tv" ? "series" : "artist"}/${result.id}`}>
                    <div key={result.id} className="mini-search-result mb-3">
                        <SmartImage src={imgsroute + "w185" + (result.profile_path || result.poster_path)} alt={result.title} className="mini-search-poster" />
                        <div className="mini-search-info">
                            <h5>{result.title || result.name}</h5>
                            {(result.release_date || result.first_air_date || result.birthday) && <span>{result.release_date || result.first_air_date || result.birthday}</span>}
                            {result.media_type && <span><i>{result.media_type}</i></span>}
                        </div>
                    </div>
                </Link>
            )}
        </section>
    )
}