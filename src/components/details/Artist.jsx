import { useContext, useEffect, useRef, useState } from "react";
import { ImgsRoute } from "../../contexts/generalContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loading from "../general UI/Loading";
import Section from "../general UI/Section";

export default function Artist() {
    const imgsRoute = useContext(ImgsRoute);
    const { artistId } = useParams();
    const [artistInfo, setArtistInfo] = useState("loading");
    const profileRef = useRef();
    const [artistMovies, setArtistMovies] = useState("loading");
    const [artistSeries, setArtistSeries] = useState("loading");
    const [artistImages, setArtistImages] = useState("loading");

    useEffect(()=> { // artist info
        const options = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/person/${artistId}?language=en-US`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
            }
        };

        axios
        .request(options)
        .then(res => setArtistInfo(res.data))
        .catch(err => console.error("Error fetching artist info:", err));
    }, [artistId]);

    useEffect(()=> { // artist movies and series
        const options = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/person/${artistId}/movie_credits?language=en-US`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
            }
        };

        axios
        .request(options)
        .then(res => setArtistMovies(res.data.cast))
        .catch(err => console.error(err));

        const options2 = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/person/${artistId}/tv_credits?language=en-US`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
            }
        };

        axios
        .request(options2)
        .then(res => setArtistSeries(res.data.cast))
        .catch(err => console.error(err));
    }, [artistId]);

    useEffect(()=> { // artist images
        const options = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/person/${artistId}/images`,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`
            }
        };

        axios
        .request(options)
        .then(res => setArtistImages(res.data.profiles))
        .catch(err => console.error(err));
    }, [artistId]);

    useEffect(()=> { // artist animation
        const poster= profileRef.current;
        if (!poster) {
            return;
        }
        
        const observer = new IntersectionObserver((entries)=> {
            entries.forEach(entry=> {                
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate");
                } else {
                    entry.target.classList.remove("animate");
                }
            })
        }, {threshold: .1});

        observer.observe(poster);
        return(()=> { 
            observer.disconnect();
        })
    }, [artistInfo?.profile_path]);

    if (artistInfo === "loading") {
        return <Loading />;
    }

    return (
        <main id="artist-page" style={{background: `url(${imgsRoute + "original" + artistInfo.profile_path}) center/cover no-repeat`}}>
            <div>
                <section className="artist-details">
                    <div className="artist-profile ms-2" ref={profileRef}>
                        <img loading="lazy" src={(imgsRoute + "original" + artistInfo.profile_path) || "https://png.pngtree.com/png-clipart/20230917/original/pngtree-icon-of-unavailable-image-illustration-in-vector-with-flat-design-vector-png-image_12324700.png"} alt={artistInfo.name} />
                    </div>
                    <div className="artist-info">
                        <h1>{artistInfo.name}</h1>
                        <p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-justify-left me-1" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
                            </svg>
                            Biography: <span>{artistInfo.biography ? artistInfo.biography : "N/A"}</span>
                        </p>
                        <hr />
                        <p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-rolodex me-1" viewBox="0 0 16 16">
                                <path d="M8 9.05a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                                <path d="M1 1a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h.5a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h.5a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6.707L6 1.293A1 1 0 0 0 5.293 1zm0 1h4.293L6 2.707A1 1 0 0 0 6.707 3H15v10h-.085a1.5 1.5 0 0 0-2.4-.63C11.885 11.223 10.554 10 8 10c-2.555 0-3.886 1.224-4.514 2.37a1.5 1.5 0 0 0-2.4.63H1z"/>
                            </svg>
                            Known for: <span>{artistInfo.known_for_department}</span>
                        </p>
                        <hr />
                        <p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cake2-fill me-1" viewBox="0 0 16 16">
                                <path d="m2.899.804.595-.792.598.79A.747.747 0 0 1 4 1.806v4.886q-.532-.09-1-.201V1.813a.747.747 0 0 1-.1-1.01ZM13 1.806v4.685a15 15 0 0 1-1 .201v-4.88a.747.747 0 0 1-.1-1.007l.595-.792.598.79A.746.746 0 0 1 13 1.806m-3 0a.746.746 0 0 0 .092-1.004l-.598-.79-.595.792A.747.747 0 0 0 9 1.813v5.17q.512-.02 1-.055zm-3 0v5.176q-.512-.018-1-.054V1.813a.747.747 0 0 1-.1-1.01l.595-.79.598.789A.747.747 0 0 1 7 1.806"/>
                                <path d="M4.5 6.988V4.226a23 23 0 0 1 1-.114V7.16c0 .131.101.24.232.25l.231.017q.498.037 1.02.055l.258.01a.25.25 0 0 0 .26-.25V4.003a29 29 0 0 1 1 0V7.24a.25.25 0 0 0 .258.25l.259-.009q.52-.018 1.019-.055l.231-.017a.25.25 0 0 0 .232-.25V4.112q.518.047 1 .114v2.762a.25.25 0 0 0 .292.246l.291-.049q.547-.091 1.033-.208l.192-.046a.25.25 0 0 0 .192-.243V4.621c.672.184 1.251.409 1.677.678.415.261.823.655.823 1.2V13.5c0 .546-.408.94-.823 1.201-.44.278-1.043.51-1.745.696-1.41.376-3.33.603-5.432.603s-4.022-.227-5.432-.603c-.702-.187-1.305-.418-1.745-.696C.408 14.44 0 14.046 0 13.5v-7c0-.546.408-.94.823-1.201.426-.269 1.005-.494 1.677-.678v2.067c0 .116.08.216.192.243l.192.046q.486.116 1.033.208l.292.05a.25.25 0 0 0 .291-.247M1 8.82v1.659a1.935 1.935 0 0 0 2.298.43.935.935 0 0 1 1.08.175l.348.349a2 2 0 0 0 2.615.185l.059-.044a1 1 0 0 1 1.2 0l.06.044a2 2 0 0 0 2.613-.185l.348-.348a.94.94 0 0 1 1.082-.175c.781.39 1.718.208 2.297-.426V8.833l-.68.907a.94.94 0 0 1-1.17.276 1.94 1.94 0 0 0-2.236.363l-.348.348a1 1 0 0 1-1.307.092l-.06-.044a2 2 0 0 0-2.399 0l-.06.044a1 1 0 0 1-1.306-.092l-.35-.35a1.935 1.935 0 0 0-2.233-.362.935.935 0 0 1-1.168-.277z"/>
                            </svg>
                            Birthday: <span>{artistInfo.birthday || "N/A"}</span>
                        </p>
                        <hr />
                        <p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill me-1" viewBox="0 0 16 16">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                            </svg>
                            Place of Birth: <span>{artistInfo.place_of_birth || "N/A"}</span>
                        </p>
                        {artistInfo.deathday && <p>Deathday: <span>{artistInfo.deathday}</span></p>}
                    </div>
                </section>
                {artistMovies !== "loading" ? <Section data={artistMovies} title="Artist Movies" kind="movies" /> : <Loading />}
                {artistSeries !== "loading" ? <Section data={artistSeries} title="Artist Series" kind="series" /> : <Loading />}
                {artistImages !== "loading" ? 
                <section className="artist-imgs-container">
                    <h2>Artist images</h2>
                    <div className="artist-imgs">
                        {artistImages[0]? artistImages.map((img, index)=> {
                            return(
                                <div key={index} className="artist-img">
                                    <img src={imgsRoute + "original" + img.file_path} alt="artist image" loading="lazy" className="rounded-3" />
                                </div>
                            )
                        }): <h3>No images available</h3>}
                    </div>
                </section>
                : <Loading />}
            </div>
        </main>
    )
}