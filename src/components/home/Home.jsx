import Carousel from './Carousel.jsx';
import NowMovies from './NowMovies.jsx';
import NowSeries from './NowSeries.jsx';
import TopMovies from "./TopMovies.jsx";
import TopSeries from "./TopSeries.jsx";
import UpcomingSeries from './UpcomingSeries.jsx';
import EgyptianMovies from './EgyptianMovies.jsx';

export default function Home() {
    return (
        <>
            <Carousel />
            <NowMovies />
            <NowSeries />
            <UpcomingSeries />
            <TopMovies />
            <TopSeries />
            <EgyptianMovies />
        </>
    )
}