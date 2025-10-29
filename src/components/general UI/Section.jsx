import { Link } from "react-router-dom";
import Poster from "./Poster";
import { useEffect } from "react";

export default function Section(props) {
    
    useEffect(()=> { // animate titles
        const titles = document.querySelectorAll('.posters-title');
        
        const observer = new IntersectionObserver((entries)=> {
            entries.forEach(entry=> {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-posters-title");
                }
                else {
                    entry.target.classList.remove("animate-posters-title");
                }
            })
        }, {threshold: .2});

        titles.forEach(title=> observer.observe(title));
        
        return(()=> {
            observer.disconnect();
        })
    }, [props])

    if (!props.data[0]) {
        return <></>;
    }else {
        if (props.discover) {
            var routeforMore = `/discover?kind=${props.kind}&country=${props.country}&language=${props.lang}&title=${props.title}`;
        } else if (props.route) {
            routeforMore = `/more${props.recommendationsId ? `/${props.recommendationsId}`: ''}?kind=${props.kind}&title=${props.route}`;
        } else {
            routeforMore = null;
        }
        
        return (
            <section className="posters-container">
                <div className="posters-header mb-2">
                    <Link to={routeforMore || "#"}>
                        <h3 className="posters-title">
                            {props.title}
                            {routeforMore &&
                                <span className="poster-show-more">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-chevron-right ms-1" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                                    </svg>
                                </span>
                            }
                        </h3>
                    </Link>
                </div>
                <div className="posters-div">
                    {props.data.filter(poster=> poster.poster_path || poster.show_poster).map((work) => (
                        <Poster 
                            key={work.id || work.show_id} 
                            src={"w780" + (work.poster_path || work.show_poster)}
                            path={work.poster_path || work.show_poster}
                            alt={work.title|| work.name || work.show_name}
                            name={work.title|| work.name || work.show_name}
                            posterId={work.id || work.show_id} 
                            kind={props.kind}
                        />
                    ))}
                </div>
            </section>
        )
    }
} 