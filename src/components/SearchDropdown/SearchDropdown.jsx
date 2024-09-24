import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../Api/axios"; // Your custom Axios instance for API calls

function SearchDropdown() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();

  // Fetch categories from the FakeStore API
  useEffect(() => {
    axiosInstance
      .get("/products/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Handle category selection and search for products
  const handleSearch = () => {
    if (selectedCategory) {
      // Redirect to the result page, passing the selected category
      navigate(`/results?category=${selectedCategory}`);
    }
  };

  return (
    <div>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select a Category</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchDropdown;
