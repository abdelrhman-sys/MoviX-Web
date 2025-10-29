import { useEffect, useState, useContext } from "react";
import { ImgsRoute } from "../../contexts/generalContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import PagesCount from "../general UI/PagesCount";

export default function ShowImgs(props) {
    const imgsRoute = useContext(ImgsRoute);
    const {posterId} = useParams();
    const [imgs, setImgs] = useState([]);
    const [videos, setVideos] = useState([]);
    const [imgsCount, setImgsCount] = useState(1);
    
    useEffect(()=> {
        const options = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/${props.kind === "movies" ? "movie": "tv"}/${posterId}/images`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
            }
        };

        axios
        .request(options)
        .then(res => setImgs(res.data.backdrops))
        .catch(err => console.error(err));
    }, [posterId, props.kind])
    
    useEffect(()=> {
        const options = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/${props.kind === "movies" ? "movie": "tv"}/${posterId}/videos`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
            }
        };

        axios
        .request(options)
        .then(res => setVideos(res.data.results))
        .catch(err => console.error(err));
    }, [posterId, props.kind])

    const workVideos = videos.filter(video=> video.site==="YouTube" && video.type !=="Trailer").splice(0, 8);
    const workTrailers = videos.filter(video=> video.site==="YouTube" && video.type ==="Trailer").splice(0, 5);
    const workImgs = imgs.slice((imgsCount - 1) * 8, imgsCount * 8);

    return (
        <>
            <section className="work-imgs-container">
                <h2>Images</h2>
                <div className="work-imgs">
                    {workImgs[0]? workImgs.map((img, index)=> {
                        return(
                            <div key={index} className="work-img">
                                <img src={imgsRoute + "original" + img.file_path} alt={props.alt} loading="lazy" className="rounded-3" />
                            </div>
                        )
                    }): <h3>No images available</h3>}
                </div>
                <PagesCount 
                pageCount={imgsCount} 
                next={() => setImgsCount(imgsCount + 1)} 
                previous={() => setImgsCount(imgsCount - 1)}
                totalPages={Math.ceil(imgs.length / 10)}
                />
            </section>
            <section className="work-trailers-container">
                <h2>Trailers</h2>
                <div className="work-trailers">
                    {workTrailers[0]? workTrailers.map((video)=> {
                        return (
                            <iframe
                            key={video.id}
                            className="rounded-4"
                            width="560"
                            height="315"
                            src={`https://www.youtube.com/embed/${video.key}`}
                            title={video.name}
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            />
                        )
                    }) : <h3>No trailers available</h3>}
                </div>
            </section>
            <section className="work-vids-container">
                <h2>Videos</h2>
                <div className="work-vids">
                    {workVideos[0] ? workVideos.map((video)=> {
                        return (
                            <iframe
                            key={video.id}
                            className="rounded-4"
                            width="510"
                            height="286.8"
                            src={`https://www.youtube.com/embed/${video.key}`}
                            title={video.name}
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            />
                        )
                    }): <h3>No videos available</h3>}
                </div>
            </section>
        </>
    )
}