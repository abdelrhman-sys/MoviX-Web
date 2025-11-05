import CarouselItem from "./CarouselItem";
import CarouselIndicator from "./CarouselIndicator";
import { ImgsRoute } from "../../contexts/generalContext";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Loading from "../general UI/Loading";

let CarouselItemsMovies= [];
let CarouselItemsSeries= [];
export default function Carousel() {
    const imgsRoute = useContext(ImgsRoute);
    const [trendingMovies, setTrendingMovies]= useState([]);
    const [trendingSeries, setTrendingSeries]= useState([]);

    useEffect(()=> {
        const optionsMovie = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/trending/movie/week',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
        }
        };
        axios
        .request(optionsMovie)
        .then(res => setTrendingMovies(res.data.results.slice(0, 4)))
        .catch(err => setTrendingMovies({message: err}));

        const optionsTv = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/trending/tv/week',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
        }
        };
        axios
        .request(optionsTv)
        .then(res => setTrendingSeries(res.data.results.slice(0, 4)))
        .catch(err => setTrendingSeries({message: err}));
    }, [])

    
    if (!trendingMovies.message && trendingMovies[0]) {
        CarouselItemsMovies =
        trendingMovies.filter(movie => movie.backdrop_path)
        .map((movie, index)=> {
            return <CarouselItem 
            key={movie.id} 
            order={index} 
            src={imgsRoute + "original" + movie.backdrop_path} 
            alt={movie.title} 
            kind="movies" 
            overview={movie.overview} 
            name={movie.title} 
            showId={movie.id} />
        });
    }
    if (!trendingSeries.message && trendingSeries[0]) {
        CarouselItemsSeries = 
        trendingSeries.filter(series => series.backdrop_path)
        .map((series, index)=> {
            return <CarouselItem 
            key={series.id} 
            order={index} 
            src={imgsRoute + "original" + series.backdrop_path} 
            alt={series.title} 
            kind="series" 
            overview={series.overview} 
            name={series.name} 
            showId={series.id} />
        });
    }
    
    const CarouselIndicators = [...CarouselItemsMovies, ...CarouselItemsSeries].map((item, index)=> <CarouselIndicator key={index} order={index} />);

    if ((!trendingMovies.message && !trendingMovies[0]) || (!trendingSeries.message && !trendingSeries[0])) { // only if data is not sent yet without error is already sent
        return <Loading />
    } else if(trendingMovies.message && trendingSeries.message) { // only if error happened in both
        return;
    }
    else {
        return (
            <div id="myCarousel" className="carousel slide mb-6" data-bs-ride="carousel">
                <div className="carousel-indicators mb-4">
                    {CarouselIndicators}
                </div>
                
                <div className="carousel-inner">
                    {CarouselItemsMovies}
                    {CarouselItemsSeries}
                </div>
     
                <button className="carousel-control-prev arrow" type="button" 
                        data-bs-target="#myCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next arrow" type="button" 
                        data-bs-target="#myCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        )
    }
}