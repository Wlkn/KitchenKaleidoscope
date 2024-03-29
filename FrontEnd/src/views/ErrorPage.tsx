import { Helmet } from "react-helmet";
import Header from "../components/header";
import "../styles/_ErrorPage.scss";
import "../styles/_base.scss";
//todo weird thing happens when adding background color, the whole site takes the color
export default function ErrorPage() {
    return (
        <div className="ErrorPage-container">
            <Helmet>
                <title>KKaleido | Error</title>
            </Helmet>
            <div className="home-header-container">
                <Header />h
            </div>
            <h1>Page not found</h1>
            <section className="error-container">
                <span className="four">
                    <span className="screen-reader-text">4</span>
                </span>
                <span className="zero">
                    <span className="screen-reader-text">0</span>
                </span>
                <span className="four">
                    <span className="screen-reader-text">4</span>
                </span>
            </section>
        </div>
    );
}
