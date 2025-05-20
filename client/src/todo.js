import { useState, useEffect } from "react";
import axios from "axios";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Use correct backend port
  const apiUrl = "http://localhost:5000/api";

  const handleSubmit = async () => {
    if (title.trim() !== "" && description.trim() !== "") {
      try {
        const response = await axios.post(
          `${apiUrl}/create-todo`,
          { title, description },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 201) {
          setTodos([...todos, response.data]); // Use returned item, not manual
          setTitle("");
          setDescription("");
          setMessage("Item added successfully");
          setError("");
        }
      } catch (err) {
        setError("Unable to create Todo item: " + (err.response?.data?.message || err.message));
        console.error("Error creating Todo:", err);
      }
    } else {
      setError("Title and description cannot be empty");
    }
  };

  const getItems = async () => {
    try {
      const res = await fetch(`${apiUrl}/view-todo`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError("Error fetching todos");
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = async () => {
    if (editTitle.trim() === "" || editDescription.trim() === "") {
      setError("Title and description cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/update-todo/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        const updatedTodos = todos.map((item) =>
          item._id === editId ? updatedTodo : item
        );

        setTodos(updatedTodos);
        setEditTitle("");
        setEditDescription("");
        setMessage("Item updated successfully");
        setError("");
      } else {
        const errorData = await response.json();
        setError(`Error updating todo: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error updating todo:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setEditId(-1);
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete?")) {
      fetch(`${apiUrl}/delete-todo/${id}`, {
        method: "DELETE",
      }).then(() => {
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
      });
    }
  };

  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>ToDo Project with Mern Stack</h1>
      </div>
      <div className="raw">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="form-control"
            type="text"
          />
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="form-control"
            type="text"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>

      <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-md-6">
          <ul className="list-group">
            {todos.map((item) => (
              <li
                key={item._id}
                className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
              >
                <div className="d-flex flex-column">
                  {editId === -1 || editId !== item._id ? (
                    <>
                      <span className="fw-bold">{item.title}</span>
                      <span>{item.description}</span>
                    </>
                  ) : (
                    <div className="form-group d-flex gap-2 me-2">
                      <input
                        placeholder="Title"
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitle}
                        className="form-control"
                        type="text"
                      />
                      <input
                        placeholder="Description"
                        onChange={(e) => setEditDescription(e.target.value)}
                        value={editDescription}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2">
                  {editId === -1 ? (
                    <>
                      <button className="btn btn-warning" onClick={() => handleEdit(item)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    </>
                  ) : item._id === editId ? (
                    <>
                      <button className="btn btn-warning" onClick={handleUpdate}>
                        Update
                      </button>
                      <button className="btn btn-secondary" onClick={handleEditCancel}>
                        Cancel
                      </button>
                    </>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
