import { useContext, useState } from "react";
import SmartImage from "../general UI/SmartImage";
import { ImgsRoute } from "../../contexts/generalContext";
import WorkEpisodes from "./WorkEpisodes";

export default function WorkSeasons(props) {
    const imgsRoute = useContext(ImgsRoute);
    const [season, setSeason] = useState(0);
    
    if (season) {
        return <WorkEpisodes seriesId={props.tmdbData.id} tmdbData={props.tmdbData} seasonNumber={season} goBack={()=> setSeason(0)} />;
    }

    return (
        <section className="work-seasons-section"> 
            {props.tmdbData.seasons.filter(season => parseInt(season.season_number) > 0).map((season) =>
                <div key={season.id} className="work-season-card">
                    <div className="season-poster position-relative" onClick={() => setSeason(season.season_number)}>
                        <SmartImage 
                            src={season.poster_path ? imgsRoute + "w500" + season.poster_path : "https://tse2.mm.bing.net/th/id/OIP.OPC0yG5gmciVcOl_Uruz-AHaFj?rs=1&pid=ImgDetMain&o=7&rm=3"} 
                            alt={season.name}
                        />
                        <div className="p-2 text-center season-rate">
                            <span>
                                {season.vote_average}
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-star-fill ms-1" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                            </span> 
                            <br /> 
                            <span id="TMDB">TMDB</span>
                        </div>
                    </div>
                    <div className="season-details">
                        <h4 className="text-center" onClick={()=> setSeason(season.season_number)}>
                            <i>{season.name}</i>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="orange" className="bi bi-chevron-right ms-1" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </h4>
                        {season.air_date && <p className="text-center mb-1">{season.air_date}</p>}
                        {season.overview && <p>{season.overview.length > 250 ? season.overview.substring(0, 250) + "..." : season.overview}</p>}
                    </div> 
                </div>
            )}
        </section>
    );
}