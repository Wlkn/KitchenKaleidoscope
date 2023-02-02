import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../redux/reducers/auth";

const MySwal = withReactContent(Swal);
type Props = {
    deleteFunc: () => void;
    editFunc: (data: any) => void;
    data: any;
};

const DeleteEdit = ({ deleteFunc, editFunc, data }: Props) => {
    const [deleteMode, setDeleteMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(data || {});
    const navigate = useNavigate();
    const currentUserId =
        localStorage.getItem("userId") || useSelector(selectCurrentUserId);

    const handleSubmit = (event: any) => {
        MySwal.fire({
            title: <p>The Recipe has been successfully edited!</p>,
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
        });
        event.preventDefault();
        //console.log(formData);
        editFunc(formData);
        setEditMode(false);
    };

    const handleChange = (event: any) => {
        setFormData({
            ...(formData || {}),
            [event.target.name]: event.target.value,
        });
        //console.log(formData);
    };

    function handleDeleteClick() {
        MySwal.fire({
            title: <p>The Recipe has been successfully deleted!</p>,
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
        });
        setDeleteMode(true);
        deleteFunc();
        navigate(`/myrecipes/${currentUserId}`);
    }
    return (
        <div>
            {deleteMode ? (
                <div>
                    <button onClick={handleDeleteClick}>
                        Are you sure you want to delete your recipe?
                    </button>
                    <button onClick={() => setDeleteMode(false)}>Cancel</button>
                </div>
            ) : editMode ? (
                <form onSubmit={handleSubmit}>
                    Name: <br />
                    <input
                        type="text"
                        name="name"
                        onChange={handleChange}
                        value={formData.name || ""}
                        placeholder="Name"
                    />
                    <br />
                    Description: <br />
                    <input
                        type="text"
                        name="description"
                        onChange={handleChange}
                        value={formData.description || ""}
                    />
                    <br />
                    Instructions:
                    <br />
                    <input
                        type="text"
                        name="instructions"
                        onChange={handleChange}
                        value={formData.instructions || ""}
                    />
                    <br />
                    Image URL: <br />
                    <input
                        type="text"
                        name="imageUrl"
                        onChange={handleChange}
                        value={formData.imageUrl || ""}
                    />
                    <button type="submit">Confirm Edit</button>
                    <button onClick={() => setEditMode(false)}>Cancel</button>
                </form>
            ) : (
                <React.Fragment>
                    <button onClick={() => setDeleteMode(true)}>Delete</button>
                    <button onClick={() => setEditMode(true)}>Edit</button>
                </React.Fragment>
            )}
        </div>
    );
};

export default DeleteEdit;
