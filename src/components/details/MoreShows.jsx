// for showing more shows based on a specific title (like recommendations, now playing, popular, top rated)

import axios from "axios";
import { useContext, useEffect, useState } from "react"
import Poster from "../general UI/Poster";
import { useParams, useSearchParams } from "react-router-dom";
import Loading from "../general UI/Loading";
import MiniLoading from "../general UI/MiniLoading";
import { ImgsRoute } from "../../contexts/generalContext";
import ErrorPage from "../general UI/ErrorPage";

export default function MoreShows() {
    const imgsRoute = useContext(ImgsRoute);
    const [data, setData] = useState({});
    const {showId} = useParams(); // for the more recommendations route
    const [searchParams] = useSearchParams();
    const kind = searchParams.get("kind");
    const title = searchParams.get("title");
    const [pageCount, setPageCount] = useState(1);
    const [miniLoading, setMiniLoading] = useState(false);

    useEffect(() => {
        // reset when route params change
        setData({});
        setPageCount(1);
    }, [showId, title, kind]);

    useEffect(()=> {
        if (title) {
            setMiniLoading(true);
            const options = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/${kind == 'movies'? 'movie' : 'tv'}/${showId ? (showId + '/') : ''}${title}?page=${pageCount}`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
            }}

            axios 
            .request(options)
            .then(res => setData(prev => ({
                page: res.data.page,
                total_pages: res.data.total_pages,
                results: prev.results ? [...prev.results, ...res.data.results] : res.data.results
            })))
            .catch(err => setData({error: err}))
            .finally(() => setMiniLoading(false));
        }
        else { 
            console.log("no route");
            setData({error: "404 page not found" });
        }
    }, [pageCount, title, showId, kind]);

    useEffect(() => {
        const lastPoster = document.querySelector(".poster-div:last-child");
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (data.page && pageCount < data.total_pages) {
                    setPageCount(prevPage => prevPage + 1);
                }
            }
        }, { threshold: .7 });

        if (lastPoster) {
            observer.observe(lastPoster);
        }

        return () => {
            if (lastPoster) {
                observer.unobserve(lastPoster);
            }
        };
    }, [data, pageCount]);

    if (data.error) {
        return <ErrorPage error={data.error.message || data.error} />;
    }

    if (data.results && data.results.length > 0) {
        const more = data.results.filter(show=> show.poster_path);
        const capitalTitle = title.replaceAll('_', ' ').replace(title.at(0), title.at(0).toUpperCase());

        return (
            <main className="more-shows">
                <h2 className="mb-4">{(kind === 'movies' ? 'Movies: ' : 'Series: ') + capitalTitle}</h2>
                <div className="more-posters">
                    {
                        more.map(show=> {
                            return <Poster 
                            key={show.id}
                            kind={kind}
                            name={show.title || show.name}
                            alt={show.title || show.name}
                            posterId={show.id}
                            path={show.poster_path}
                            src={imgsRoute + "w780" + show.poster_path}  
                            />
                        })
                    }
                    {miniLoading && <MiniLoading />}
                </div>
            </main>
        )
    }else {
        return <Loading />;
    }
}