export default function ErrorPage(props) {
    return (
        <div className="error">
            <h1>{props.error || "404 Page is not found"}</h1>
        </div>
    )
}