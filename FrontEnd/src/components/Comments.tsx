import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAddCommentMutation } from "../redux/slices/recipes";
import { useGetCommentByRecipeIdQuery } from "../redux/slices/recipes";
import "../styles/comments.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUserId } from "../redux/reducers/auth";
import { addComment } from "../redux/reducers/recipes";
import { TakemeBackButton, SubmitButton } from "./Buttons";
import Loader from "./Loader";
interface Comment {
    id: string;
    comment: string;
    user_id: string;
    recipe_id: string;
    created_at: string;
}

export default function Comments() {
    const { id } = useParams();
    const recipe_id = id;
    const dispatch = useDispatch();
    const user_id =
        useSelector(selectCurrentUserId) || localStorage.getItem("userId");
    const [comments, setComments] = useState<Comment[]>([]);

    const [createNewComment] = useAddCommentMutation();
    const [formData, setFormData] = useState({
        comment: "",
    });

    const { data, isLoading, isSuccess, isError } =
        useGetCommentByRecipeIdQuery(recipe_id, {
            skip: false,
        });

    const handleSubmit = async (e: any) => {
        const { comment } = formData;
        try {
            const commentData = await createNewComment({
                comment,
                recipe_id,
                user_id,
            }).unwrap();
            //console.log(commentData);
            dispatch(
                addComment({ ...commentData, comment, recipe_id, user_id })
            );
        } catch (err) {
            //console.log(err);
        }
    };

    const handleChange = (e: any) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(() => {
        if (isSuccess && data) {
            setComments(data);
        }
    }, [data, isSuccess]);

    const timeSinceComment = (createdAt: string) => {
        const createdTimestamp = new Date(createdAt).getTime();
        const currentTimestamp = new Date().getTime();
        const difference = currentTimestamp - createdTimestamp;

        const minutes = Math.floor(difference / 1000 / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days >= 1) {
            return `${days} days ago`;
        } else if (hours >= 1) {
            return `${hours} hours ago`;
        } else if (minutes >= 1) {
            return `${minutes} minutes ago`;
        }
        return `Just now`;
    };

    return (
        <div>
            <TakemeBackButton />
            <div className="comments-container-container">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        placeholder="Add a comment"
                    />
                    <SubmitButton />
                    <br></br>
                </form>
                {isLoading ? (
                    <Loader />
                ) : isError ? (
                    <div>error</div>
                ) : (
                    <div className="comments-container">
                        {comments?.map((comments: any) => (
                            <div key={comments.id} className="comment">
                                <p>Comment: {comments.comment}</p>
                                <p>
                                    UserID of the creator of the comment:{" "}
                                    {comments.user_id || "No user id"}
                                </p>
                                <p>
                                    RecipeID of the comment:{" "}
                                    {comments.recipe_id}
                                </p>
                                <p>
                                    Created:{" "}
                                    {timeSinceComment(comments.created_at)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
