import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Loading from "../general UI/Loading";
import ErrorPage from "../general UI/ErrorPage";
import { ImgsRoute } from "../../contexts/generalContext";
import SmartImage from "../general UI/SmartImage";

export default function WorkEpisodes(props) {
    const [episodes, setEpisodes] = useState("loading");
    const imgsRoute = useContext(ImgsRoute);

    useEffect(() => {
        setEpisodes("loading");
        async function fetchEpisodes() {
            try {
                const results = await axios.get(`https://api.themoviedb.org/3/tv/${props.seriesId}/season/${props.seasonNumber}?language=en-US`,
                {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
                    }
                })
                setEpisodes(results.data.episodes);
            } catch (error) {
                setEpisodes({message: error});
                console.error("error from tmdb episodes ", error);
            }
        }
        fetchEpisodes();
    }, [props.seriesId, props.seasonNumber]);

    if (episodes === "loading") {
        return (
            <Loading />
        );
    }else if (episodes.message) {
        return (
            <ErrorPage error={episodes.message} />
        );
    }else {
        return ( 
            <>
                <div className="episode-season-num mx-4 mt-3 text-center">
                    <div className="d-flex justify-content-between align-items-center">
                        <button className="btn btn-secondary mb-3 seasons-back" onClick={props.goBack}>
                                    &larr; Back to seasons
                        </button>
                        <h3 className="text-center mb-3 m-auto">{props.tmdbData.seasons.find(season => season.season_number === props.seasonNumber).name}</h3>
                    </div>
                    <p>{props.tmdbData.seasons.find(season => season.season_number === props.seasonNumber).overview}</p>
                </div>
                <section className="work-episodes-section mt-4">
                    {episodes.map((episode) =>
                        <div key={episode.id} className="work-episode-card">
                            <div className="episode-poster position-relative">
                                <SmartImage 
                                    src={episode.still_path ? imgsRoute + "w500" + episode.still_path : "https://tse2.mm.bing.net/th/id/OIP.OPC0yG5gmciVcOl_Uruz-AHaFj?rs=1&pid=ImgDetMain&o=7&rm=3"} 
                                    alt={episode.name}
                                />
                                <div className="p-1 text-center episode-rate">
                                    <span>
                                        {episode.vote_average}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-star-fill ms-1" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                        </svg>
                                    </span> 
                                    <br /> 
                                    <span id="TMDB">TMDB</span>
                                </div>
                                <div className="episode-number">
                                    <span>{episode.episode_number}</span>
                                </div>
                                <div className="episode-runtime">
                                    <span>{episode.runtime + " min" || "N/A"}</span>
                                </div>
                            </div>
                            <div className="episode-details">
                                <h4 className="text-center"><i>{episode.name}</i></h4>
                                {episode.air_date && <p className="text-center mb-1">{episode.air_date}</p>}
                                {episode.overview && <p>{episode.overview}</p>}
                            </div> 
                        </div>
                    )}
                </section>
            </>
        );
    }
};
