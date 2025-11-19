export default function MiniLoading({width = 20, height = 20}) {
    return (
        <span id="mini-loading-container">
            <div className="mini-circle circle1" style={{width, height}}></div>
            <div className="mini-circle circle2" style={{width, height}}></div>
            <div className="mini-circle circle3" style={{width, height}}></div>
        </span>
    )
}