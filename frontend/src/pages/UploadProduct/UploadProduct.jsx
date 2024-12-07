import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Define the validation schema
const validationSchema = Yup.object().shape({
  slug: Yup.string().required("Slug is required."),
  name: Yup.string().required("Name is required."),
  category_id: Yup.string().required("Category ID is required."),
  price: Yup.number()
    .positive("Price must be a positive number.")
    .required("Price is required."),
  stock: Yup.number()
    .integer("Stock must be a non-negative integer.")
    .min(0, "Stock must be a non-negative integer.")
    .required("Stock is required."),
  description: Yup.string(),
  image: Yup.mixed()
    .required("Image file is required.")
    .test("fileType", "Only PNG, JPG, and JPEG are allowed", (value) => {
      return (
        value &&
        (value.type === "image/png" ||
          value.type === "image/jpeg" ||
          value.type === "image/jpg")
      );
    }),
});

const UploadProduct = () => {
  const [categories, setCategories] = useState([]);
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response =
          (await axios.get("http://localhost:5000/api/v2/categories")) || [];
        setCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    try {
      await axios.post("http://localhost:5000/api/v1/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Product created successfully!");
    } catch (error) {
      if (error.response?.status === 400 && error.response.data?.errors) {
        const apiErrors = error.response.data.errors;
        apiErrors.forEach(({ field, message }) => {
          setError(field, { type: "server", message });
        });
      } else if (error.response?.status === 409) {
        // Handle duplicate slug error
        setError("slug", {
          type: "server",
          message: error.response.data.message,
        });
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-6">Upload New Product</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              {...register("slug")}
              className="mt-1 block w-full border rounded p-2"
            />
            <p className="text-red-500 text-sm">{errors.slug?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...register("name")}
              className="mt-1 block w-full border rounded p-2"
            />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              {...register("category_id")}
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.slug})
                </option>
              ))}
            </select>
            <p className="text-red-500 text-sm">
              {errors.category_id?.message}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              {...register("price")}
              className="mt-1 block w-full border rounded p-2"
            />
            <p className="text-red-500 text-sm">{errors.price?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              {...register("stock")}
              className="mt-1 block w-full border rounded p-2"
            />
            <p className="text-red-500 text-sm">{errors.stock?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              className="mt-1 block w-full border rounded p-2"
            />
            <p className="text-red-500 text-sm">
              {errors.description?.message}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => {
                    field.onChange(e.target.files[0]); // Set the file
                  }}
                  className="mt-1 block w-full border rounded p-2"
                />
              )}
            />
            <p className="text-red-500 text-sm">{errors.image?.message}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadProduct;
