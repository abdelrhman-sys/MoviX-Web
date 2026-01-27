// for showing more discover shows based on filters (kind, country, language)

import axios from "axios";
import { useContext, useEffect, useState } from "react"
import Poster from "../general UI/Poster";
import { useSearchParams } from "react-router-dom";
import Loading from "../general UI/Loading";
import MiniLoading from "../general UI/MiniLoading";
import { ImgsRoute } from "../../contexts/generalContext";
import ErrorPage from "../general UI/ErrorPage";

export default function MoreShows() {
    const imgsRoute = useContext(ImgsRoute);
    const [data, setData] = useState({});
    const [searchParams] = useSearchParams();
    const kind = searchParams.get("kind");
    const lang = searchParams.get("language");
    const country = searchParams.get("country");
    const title = searchParams.get("title");
    const [pageCount, setPageCount] = useState(1);
    const [miniLoading, setMiniLoading] = useState(false);

    // reset data when filters change (kind/country/lang/title)
    useEffect(() => {
        setData({});
        setPageCount(1);
    }, [kind, country, lang, title]);

    useEffect(()=> {
        setMiniLoading(true);
        const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/discover/${kind == 'movies'? 'movie': 'tv'}?include_adult=false&include_video=false&language=en-US&page=${pageCount}&sort_by=revenue.desc&with_origin_country=${country}&with_original_language=${lang}`,
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
    }, [pageCount, kind, country, lang]);

    useEffect(() => {
        const lastPoster = document.querySelector(".poster-div:last-child");
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (data.page && pageCount < data.total_pages) {
                    setPageCount(prev => prev + 1);
                }
            }
        }, { threshold: .7 });

        if (lastPoster) observer.observe(lastPoster);
        return () => { if (lastPoster) observer.unobserve(lastPoster); };
    }, [data, pageCount]);

    if (data.error) {
        return <ErrorPage error={data.error.message || data.error} />;
    }

    if (data.results && data.results.length > 0) {
        const more = data.results.filter(show=> show.poster_path);
        return (
            <main className="more-shows">
                <h2 className="mb-4">{title}</h2>
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