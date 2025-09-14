import axios from "axios";
import { useEffect, useState } from "react";
import Section from "../general UI/Section";
import Loading from "../general UI/Loading";

export default function EgyptianMovies() {
    const [movies, setMovies] = useState([]);
    
    useEffect(()=> {
        const options = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/discover/movie?include_adult=false&page=1&sort_by=revenue.desc&with_origin_country=EG&with_original_language=ar`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
            }
        };

        axios
        .request(options)
        .then(res => setMovies(res.data.results))
        .catch(err => console.error(err));
    }, []);

    if (movies[0]) {
        return (
            <Section data={movies} title={"Egyprtian: Movies"} kind={"movies"} country="EG" lang='ar' discover={true} />
        )
    } else {
        return <Loading />
    }
}