import { useEffect } from "react";
import {Link} from "react-router-dom";

export default function ItemDetails(props) {
    const overview = props.overview.slice(0, 150);

    useEffect(()=> {
        const detailH1 = document.querySelectorAll('.carousel-name');
        const detailP = document.querySelectorAll('.carousel-overview');
        const detailButton = document.querySelectorAll('.carousel-more');
        
        const observer = new IntersectionObserver((entries)=> {
            entries.forEach(entry=> {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate");
                }
                else {
                    entry.target.classList.remove("animate");
                }
            })
        }, {threshold: .2});
        [...detailH1, ...detailButton, ...detailP].forEach(detail=> observer.observe(detail));
        
        return(()=> {
            observer.disconnect();
        })
    }, [])

    return (
        <div className="carousel-details">
            <h1 className="carousel-name">{props.name}</h1>
            <p className="carousel-overview">{props.overview.length >= 100 ? <span>{overview}...</span>: props.overview}</p>
            
            <Link to={(props.kind === "movies"? "movies" : "series") + `/${props.showId}`}>
                <button className="btn carousel-more" type="button">More details</button>            
            </Link>
        </div>
    )
}