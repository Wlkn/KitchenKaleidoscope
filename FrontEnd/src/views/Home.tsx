import Navbar from "../components/navbar";
import RecipeList from "../components/recipeList";
export default function Home() {
    return (
        <div className="App">
            <Navbar />
            <h1>Home</h1>
            <RecipeList />
        </div>
    );
}
