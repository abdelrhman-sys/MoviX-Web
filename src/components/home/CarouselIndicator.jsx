export default function CarouselIndicator(props) {
    return (
        <button 
            type="button" 
            data-bs-target="#myCarousel" 
            data-bs-slide-to={props.order} 
            className={props.order ==0 ? "active": ""} 
            aria-label={"Slide " + props.order} 
            aria-current={props.order==0 && "true"}
        >
        </button>
    )
}