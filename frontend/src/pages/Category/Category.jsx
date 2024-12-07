import DataTable from "react-data-table-component";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/Category";
import { useForm } from "react-hook-form";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";


const CategoryCRUD = () => {
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const { token } = useUser();

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories(token);
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      setErrorMessages({});
      setSuccessMessage("");

      if (editMode) {
        await updateCategory(editCategoryId, data, token);
        setSuccessMessage("Category updated successfully.");
        setEditMode(false);
        setEditCategoryId(null);
      } else {
        await createCategory(data, token);
        setSuccessMessage("Category created successfully.");
      }
      reset();
      fetchCategories();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrorMessages(error.response.data.errors);
      } else {
        alert("An unexpected error occurred.");
        console.error("Error submitting form:", error);
      }
    }
  };

  const handleEdit = (category) => {
    setEditMode(true);
    setEditCategoryId(category.id);
    setValue("slug", category.slug);
    setValue("name", category.name);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id, token);
        setSuccessMessage("Category deleted successfully.");
        fetchCategories();
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert(error.response?.data?.error || "Failed to delete the category.");
      }
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Slug",
      selector: (row) => row.slug,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            onClick={() => handleEdit(row)}
            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <section className="container px-20 py-5">
      <div>
        <h1 className="text-2xl font-bold mb-4">Category Management</h1>
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <div className="flex gap-4 flex-col md:flex-row">
            <div>
              <input
                {...register("slug", { required: true })}
                placeholder="Slug"
                className="p-2 border rounded w-full"
              />
              {errorMessages.slug && (
                <p className="text-red-500 text-sm mt-1">
                  {errorMessages.slug}
                </p>
              )}
            </div>
            <div>
              <input
                {...register("name", { required: true })}
                placeholder="Name"
                className="p-2 border rounded w-full"
              />
              {errorMessages.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errorMessages.name}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {editMode ? "Update" : "Add"}
            </button>
          </div>
        </form>
        <DataTable
          title="Categories"
          columns={columns}
          data={categories}
          pagination
        />
      </div>
    </section>
  );
};

export default CategoryCRUD;
