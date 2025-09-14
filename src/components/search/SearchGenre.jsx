import { useEffect, useState } from "react";
import SearchData from "./SearchData";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loading from "../general UI/Loading";
import ErrorPage from "../general UI/ErrorPage";
import Pagecount from "../general UI/PagesCount";

// Genre ID to name mapping
const movieGenres = {
    "28": "Action",
    "35": "Comedy",
    "80": "Crime",
    "18": "Drama",
    "27": "Horror",
    "10749": "Romance",
    "10752": "War",
    "99": "Documentary"
};

const tvGenres = {
    "10759": "Action & Adventure",
    "35": "Comedy",
    "80": "Crime",
    "18": "Drama",
    "27": "Horror",
    "9648": "Mystery",
    "10768": "War & Politics",
    "99": "Documentary",
    "16": "Animation"
};

export function SearchGenre(props) {
    const {genreId} = useParams();
    const [data, setData] = useState({});
    const [pageCount, setPageCount] = useState(1);

    useEffect(()=> {
        setData({});
        const options = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/discover/${props.kind === 'movies'? 'movie': 'tv'}?include_adult=false&page=${pageCount}&sort_by=revenue.desc&with_genres=${genreId}`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
            }
        };

        axios
        .request(options)
        .then(res => setData(res.data))
        .catch(err => setData({message: err.message}));
    }, [genreId, pageCount, props.kind]);

    
    if (data.page) {
        const results = data.results.filter(show=> show.poster_path);
        const genreName = props.kind === 'movies' ? movieGenres[genreId] : tvGenres[genreId];
        
        return(
            <main className="search-genre">
                <SearchData 
                    kind={props.kind} 
                    data={results} 
                    genreName={genreName}
                />
                <Pagecount
                pageCount={pageCount} 
                next={() => setPageCount(pageCount + 1)} 
                previous={() => setPageCount(pageCount - 1)}
                totalPages={data.total_pages}
                />
            </main>
        )
    } else if (data.message) {
        return <ErrorPage error={data.message} />
    }
    else {
        return <Loading />
    }
}