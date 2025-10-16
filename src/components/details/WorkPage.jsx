import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom"
import axios from "axios";
import Loading from "../general UI/Loading";
import WorkMedia from "./WorkMedia";
import Recommendatons from "./Recommendations";
import WorkCredits from "./WorkCredits";
import ErrorPage from "../general UI/ErrorPage";
import WorkDetails from "./WorkDetails";
import { ImgsRoute } from "../../contexts/generalContext";

let omdbTVImdb;
export default function WorkPage(props) {
    const {posterId} = useParams();
    const imgsRoute = useContext(ImgsRoute);
    const [omdbData, setOmdbData] = useState("loading");
    const [tmdbData, setTmdbData] = useState("loading");

    useEffect(() => { // tmdb data
        setTmdbData("loading");
        setOmdbData("loading");
        async function tmdb() {
            try {
                const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/${props.kind === "movies" ? "movie": "tv"}/${posterId}?language=en-US`,
                {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
                    }
                });

                if (props.kind === "series") { // additional request if it was a series to get its imdb data
                    const res = await axios.get(`https://api.themoviedb.org/3/tv/${posterId}/external_ids`,
                    {
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
                        }
                    });
                    omdbTVImdb = res.data.imdb_id;
                    if (!omdbTVImdb) {
                        setOmdbData(undefined);
                    }
                }
                else if(!tmdbResponse.data.imdb_id) {
                    setOmdbData(undefined);
                }

                setTmdbData(tmdbResponse.data);
            } catch (error) {
                setTmdbData({message: error});
                console.error("error from tmdb api ", error);
            }
        }
        tmdb();
    }, [posterId, props.kind]);

    useEffect(() => { // omdb data
        async function omdb() {            
            if (tmdbData.imdb_id || omdbTVImdb) {                               
                try {
                    const omdbResponse = await axios.get(`https://www.omdbapi.com/?i=${tmdbData.imdb_id || omdbTVImdb}&apikey=${import.meta.env.VITE_OMDB_KEY}`);
                    if (omdbResponse.data.Response === "False") {
                        console.error("error from omdb api ", omdbResponse.data.Error);
                        return setOmdbData(undefined);
                    }
                    
                    setOmdbData(omdbResponse.data); // use for {imdbRate, boxOffice, genre}
                } catch (error) {
                    console.log("error from omdb api " , error);
                    setTmdbData({message: error});
                }
            }
        }
        omdb();
    }, [tmdbData]);

    if (tmdbData === "loading" || omdbData === "loading") return <Loading />;

    if (tmdbData.genres) { // data arrived?
        return (
            <main className="work-main">
                <WorkDetails kind={props.kind} tmdbData={tmdbData} omdbData={omdbData} />
                <div className="work-media" style={{backgroundImage: `url(${imgsRoute + 'original' + tmdbData.backdrop_path})`}}>
                    <div>
                        <WorkCredits kind={props.kind} />
                        <WorkMedia kind={props.kind} alt={tmdbData.title || tmdbData.name} />
                        <Recommendatons kind={props.kind} alt={tmdbData.title || tmdbData.name} />
                    </div>    
                </div>
            </main>
        )
    } else if (tmdbData.message) {
        return <ErrorPage message={tmdbData.message} />
    } else {
        return <ErrorPage />
    }
}