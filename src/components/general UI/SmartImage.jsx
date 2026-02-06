import { useState } from "react";

export default function SmartImage(props) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <img
        src={props.src || "https://tse2.mm.bing.net/th/id/OIP.OPC0yG5gmciVcOl_Uruz-AHaFj?rs=1&pid=ImgDetMain&o=7&rm=3"} 
        alt={props.alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`${props.className} ${!isLoaded ? 'loading-blur' : ''}`}
        />
    );
}