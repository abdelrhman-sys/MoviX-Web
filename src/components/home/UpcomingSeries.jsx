import axios from "axios";
import { useEffect, useState } from "react";
import Section from "../general UI/Section";
import Loading from "../general UI/Loading";

export default function UpcomingSeries() {
    const [upcoming, setUpcoming] = useState([]);
    
    useEffect(()=> {
        const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
        }}

        axios 
        .request(options)
        .then(res => setUpcoming(res.data.results)) 
        .catch(err => console.error(err));
    }, []);

    if (upcoming[0]) {
        return (
            <Section data={upcoming} title={"On the air: Series"} kind={"series"} route="on_the_air" />
        )
    } else {
        return <Loading />
    }
}