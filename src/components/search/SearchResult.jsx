import { useSearchParams } from "react-router-dom";
import { UseSearchData } from "../../contexts/searchContext";
import { useEffect } from "react";
import axios from "axios";
import Loading from "../general UI/Loading";
import SearchData from "./SearchData";

export default function SearchResult() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const {formData, setFormData} = UseSearchData();
    
    useEffect(()=> {            
            if (formData || (formData && formData.message)) { // success OR error from api                
                return;
            } else { // requesting from URL not the form
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
                .catch(err => setFormData(err));
            }
        }, [query, formData])
    
    if (formData && !formData.message) {
        const movies = formData.filter(result => result.media_type === "movie" && result.poster_path);
        const series = formData.filter(result => result.media_type === "tv" && result.poster_path);
        return (
            <main className="search-form d-flex justify-content-center flex-column w-100">
                <SearchData kind="movies" data={movies} searchQuery={query} />
                <SearchData kind="series" data={series} searchQuery={query} />
            </main>
        )
    } 
    else if(formData && formData.message) { // error from axios
        return <div className="error"><h1 className="p-3">{formData.message + ", the error will be fixed soon"}</h1></div>
    }
    else {
        return <Loading />
    }
}