import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../general UI/Loading";
import Section from "../general UI/Section";

export default function NowMovies() {
    const [nowData, setNowData] = useState([]);
    
    useEffect(()=> {
        const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
        }}

        axios 
        .request(options)
        .then(res => setNowData(res.data.results)) 
        .catch(err => console.error(err));
    }, []);

    if (nowData[0]) {
        return (
            <Section data={nowData} title="Now Playing🔥: Movies" kind={"movies"} route="now_playing" />
        )
    } else {
        return <Loading />
    }
}