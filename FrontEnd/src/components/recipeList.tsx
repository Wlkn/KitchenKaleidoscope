import MediaCard from "./recipe";

function RecipeList() {
    const apiUrl = "http://localhost:4000/api/recipes/";
    const fetchData = async () => {
        try {
            const response = await fetch(apiUrl);
            const json = await response.json();
            console.log(json);
        } catch (error) {
            console.log("error", error);
        }
    };
    fetchData();

    return (
    <div>   
        <MediaCard
        _id = {10}
        name = "Chicken Butter"
        description= "Buttery chicken brah"
        instructions="Cook it"    
        imageUrl= "https://source.unsplash.com/user/c_v_r"
        />
         <MediaCard
        _id = {10}
        name = "Chicken Butter"
        description= "Buttery chicken brah"
        instructions="Cook it"    
        imageUrl= "https://source.unsplash.com/user/c_v_r"
        />
         <MediaCard
        _id = {10}
        name = "Chicken Butter"
        description= "Buttery chicken brah"
        instructions="Cook it"    
        imageUrl= "https://source.unsplash.com/user/c_v_r"
        />
         </div>
    );
}

export default RecipeList;
