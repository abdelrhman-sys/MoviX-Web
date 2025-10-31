import Poster from "../general UI/Poster";

export default function SearchData(props) {
    return (
        <section className={props.kind === "movies" ? "search-movies" : "search-tv"}>
            <div className="search-head mb-4">
                <h2>
                    {props.kind === "movies"? "Movies" : "Series"}
                    {props.genreName && <span> - {props.genreName}</span>}
                    {props.searchQuery && <span> - Results for "{props.searchQuery}"</span>}
                </h2>
            </div>
            <div className="search-posters">
                {props.data[0] ? props.data.map(work=> {
                    return (
                        <Poster 
                        key={work.id} 
                        kind={props.kind} 
                        posterId={work.id} 
                        src={"w780" + work.poster_path} 
                        alt={work.title || work.name} 
                        name={work.title || work.name} 
                        />
                    )
                }): <h3>No {props.kind === "movies" ? "movies" : "series"} there!</h3>}
            </div>
        </section>
    )
}