import axios from "axios";
import { useEffect, useState } from "react";
import Section from "../general UI/Section";
import Loading from "../general UI/Loading";

export default function NowMovies() {
    const [topMovies, setTopMovies] = useState([]);
    
    useEffect(()=> {
        const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
        }}

        axios 
        .request(options)
        .then(res => setTopMovies(res.data.results)) 
        .catch(err => console.error(err));
    }, []);

    if (topMovies[0]) {
        return (
            <Section data={topMovies} title={"Top Rated🌟: Movies"} kind={"movies"} route="top_rated" />
        )
    } else {
        return <Loading />
    }
}