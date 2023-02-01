import React, { useState } from "react";

type Props = {
    deleteFunc: () => void;
    editFunc: (data: any) => void;
    data: any;
};

const DeleteEdit = ({ deleteFunc, editFunc, data }: Props) => {
    const [deleteMode, setDeleteMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(data || {});

    console.log(data);
    const handleSubmit = (event: any) => {
        event.preventDefault();
        editFunc(formData);
        setEditMode(false);
        console.log(formData);
    };

    const handleChange = (event: any) => {
        setFormData({
            ...(formData || {}),
            [event.target.name]: event.target.value,
        });
    };

    return (
        <div>
            {deleteMode ? (
                <div>
                    <button onClick={deleteFunc}>Are you sure you want to delete your recipe?</button>
                    <button onClick={() => setDeleteMode(false)}>Cancel</button>
                </div>
            ) : editMode ? (
                <form onSubmit={handleSubmit}>
                    Name: <br />
                    <input
                        type="text"
                        name="name"
                        onChange={handleChange}
                        value={data.name || ""}
                    />
                    <br />
                    Description: <br />
                    <input
                        type="text"
                        name="description"
                        onChange={handleChange}
                        value={data.description || ""}
                    />
                    <br />
                    Instructions:
                    <br />
                    <input
                        type="text"
                        name="instructions"
                        onChange={handleChange}
                        value={data.instructions || ""}
                    />
                    <br />
                    Image URL: <br />
                    <input
                        type="text"
                        name="imageUrl"
                        onChange={handleChange}
                        value={data.imageUrl || ""}
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
