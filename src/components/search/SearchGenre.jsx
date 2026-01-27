import { useEffect, useState } from "react";
import SearchData from "./SearchData";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loading from "../general UI/Loading";
import ErrorPage from "../general UI/ErrorPage";

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
    "10765": "Sci-Fi & Fantasy",
    "9648": "Mystery",
    "10768": "War & Politics",
    "99": "Documentary",
    "16": "Animation"
};

export function SearchGenre(props) {
    const {genreId} = useParams();
    const [data, setData] = useState({});
    const [pageCount, setPageCount] = useState(1);
    const [miniLoading, setMiniLoading] = useState(false);
    
    useEffect(()=> {
        setData({}); // reset data when genreId or kind changes
        setPageCount(1);
    }, [genreId, props.kind]);

    useEffect(()=> {
        setMiniLoading(true);
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
        .then(res => {setData((prev)=> ({ // appending new results to previous ones
            page: res.data.page,
            total_pages: res.data.total_pages,
            results: prev.results ? [...prev.results, ...res.data.results] : res.data.results}))
            setMiniLoading(false);
        })
        .catch(err => setData({message: err.message}));
    }, [genreId, pageCount, props.kind]);

    useEffect(()=> {
        const lastPoster = document.querySelector(".poster-div:last-child");
        console.log(lastPoster);
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                if (data.page && pageCount < data.total_pages) {
                    setPageCount((prevPage) => prevPage + 1);
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
    
    if (data.page) {
        const results = data.results.filter(show=> show.poster_path);
        const genreName = props.kind === 'movies' ? movieGenres[genreId] : tvGenres[genreId];
        
        return(
            <main className="search-genre">
                <SearchData 
                    kind={props.kind} 
                    data={results} 
                    genreName={genreName}
                    miniLoading={miniLoading}
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