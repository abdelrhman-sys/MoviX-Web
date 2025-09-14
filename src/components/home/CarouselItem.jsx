import ItemDetails from "./ItemDetails";

export default function CarouselItem(props) {
    return (
        <div className={props.order == "0" && props.kind=== "movies" ? "carousel-item active" : "carousel-item"}>
            <img className="carousel-img" src={props.src} alt={props.alt} loading="lazy" />
            <ItemDetails kind={props.kind} name={props.name} overview={props.overview} showId={props.showId} />
        </div>
    )
}