import axios from "axios";
import { useContext, useEffect, useState } from "react"
import PagesCount from "../general UI/PagesCount";
import Poster from "../general UI/Poster";
import { useParams, useSearchParams } from "react-router-dom";
import Loading from "../general UI/Loading";
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

    useEffect(()=> {
        if (title) {
            const options = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/${kind == 'movies'? 'movie' : 'tv'}/${showId ? (showId + '/') : ''}${title}?page=${pageCount}`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
            }}
    
            axios 
            .request(options)
            .then(res => setData(res.data)) 
            .catch(err => setData({error: err}));
        }
        else { 
            console.log("no route");
            setData({error: "404 page not found" });
        }
    }, [pageCount, title, showId, kind]);

    if (data.error) {
        return <ErrorPage error={data.error.message} />;
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
                            src={imgsRoute + "w154" + show.poster_path}  
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