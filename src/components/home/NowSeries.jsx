import { useEffect, useState } from "react"
import Section from "../general UI/Section";
import axios from "axios";
import Loading from "../general UI/Loading";

export default function NowSeries() {
    const [nowData, setNowData]= useState([]);
    
    useEffect(()=> {
        const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=1',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
        }
        };

        axios
        .request(options)
        .then(res => setNowData(res.data.results))
        .catch(err => console.error(err));
    },[])

    if (nowData[0]) {
        return (
            <Section data={nowData} title={"Now Playing🔥: Series"} kind={"series"} route="airing_today" />
        )
    } else {
        return <Loading />
    }
}