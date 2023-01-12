import Navbar from "../components/navbar";
import "../styles/_base.scss"
export default function Home() {
    return (
        <div className="App">
            <h1>Home</h1>
            <a href="/auth/login">Login </a>
            <a href="/auth/signup"> Signup</a>
            <a href="/profile"> Profile</a>
            <a href="/recipelist"> Recipe List</a>
        </div>
    );
}
