import { useState } from "react";

export default function SmartImage(props) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <img
        src={props.src} 
        alt={props.alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`${props.className} ${!isLoaded ? 'loading-blur' : ''}`}
        />
    );
}