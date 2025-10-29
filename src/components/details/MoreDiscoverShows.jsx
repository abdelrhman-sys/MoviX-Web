import axios from "axios";
import { useContext, useEffect, useState } from "react"
import PagesCount from "../general UI/PagesCount";
import Poster from "../general UI/Poster";
import { useSearchParams } from "react-router-dom";
import Loading from "../general UI/Loading";
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

    useEffect(()=> {
        setData({});
        const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/discover/${kind == 'movies'? 'movie': 'tv'}?include_adult=false&include_video=false&language=en-US&page=${pageCount}&sort_by=revenue.desc&with_origin_country=${country}&with_original_language=${lang}`,
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
        }}

        axios 
        .request(options)
        .then(res => setData(res.data)) 
        .catch(err => setData({error: err}));
    }, [pageCount, kind, country, lang]);

    if (data.error) {
        return <ErrorPage error={data.error.message} />;
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
                </div>
                <PagesCount 
                pageCount={pageCount} 
                next={() => setPageCount(pageCount + 1)} 
                previous={() => setPageCount(pageCount - 1)}
                totalPages={data.total_pages}
                />
            </main>
        )
    }else {
        return <Loading />;
    }
}