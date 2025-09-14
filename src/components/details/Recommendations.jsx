import axios from "axios";
import { useEffect, useState } from "react";
import Section from "../general UI/Section";
import { useParams } from "react-router-dom";

export default function Recommendations(props) {
    const {posterId}= useParams();
    const [recommendations, setRecommendations] = useState([]);

    useEffect(()=> {
        const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/${props.kind=="movies" ? "movie" : "tv"}/${posterId}/recommendations?language=en-US&page=1`,
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
        }}

        axios 
        .request(options)
        .then(res => setRecommendations(res.data.results)) 
        .catch(err => console.error(err));
    }, [posterId, props.kind]);

    if (recommendations[0]) {
        return (
            <Section data={recommendations} title={"More like this"} kind={props.kind} recommendationsId={posterId} route="recommendations" />
        )
    }
}