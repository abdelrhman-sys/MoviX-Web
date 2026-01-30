import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../general UI/Loading";
import SearchData from "./SearchData";
import ErrorPage from "../general UI/ErrorPage";

export default function SearchResult() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [formData, setFormData] = useState();
    const [error, setError] = useState();
    
    useEffect(()=> {         
        setError(null); // reset error before new request
        setFormData(null); // reset formData to show loading component during new request   
        const options = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=1`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
            }
        };
        
        axios
        .request(options)
        .then(res => {
            setFormData(res.data.results);
        })
        .catch(err => {
            setError(err);
        });
    }, [query]);
    
    if (formData) {
        const movies = formData.filter(result => result.media_type === "movie" && result.poster_path);
        const series = formData.filter(result => result.media_type === "tv" && result.poster_path);
        return (
            <main className="search-form d-flex justify-content-center flex-column w-100">
                <SearchData kind="movies" data={movies} searchQuery={query} />
                <SearchData kind="series" data={series} searchQuery={query} />
            </main>
        )
    } 
    else if(error) { // error from axios
        return <ErrorPage error={error} />
    }
    else {
        return <Loading />
    }
}