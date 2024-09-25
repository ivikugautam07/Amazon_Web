import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { productUrl } from "../../Api/endPoints";
import ProductCard from "../../components/Product/ProductCard";
import Loader from "../../components/Loader/Loader";
import LayOut from "../../components/LayOut/LayOut";
import classes from "./Results.module.css";

function Results() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category") || "all";
  const searchTerm = queryParams.get("search") || "";

  useEffect(() => {
    setIsLoading(true);

    const fetchProducts = async () => {
      try {
        let url = `${productUrl}/products`;

        if (category && category !== "all") {
          url += `/category/${encodeURIComponent(category)}`;
        }

        const response = await axios.get(url);
        let products = response.data;

        if (searchTerm) {
          products = products.filter((product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setResults(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchTerm]);

  return (
    <LayOut>
      <section>
        <h1 style={{ padding: "30px" }}>Results</h1>
        <p style={{ padding: "30px" }}>
          {category !== "all" && `Category: ${category}`}
          {searchTerm && ` | Search: ${searchTerm}`}
        </p>
        <hr />

        {isLoading ? (
          <Loader />
        ) : (
          <div className={classes.results__container}>
            {results.length > 0 ? (
              results.map((data) => (
                <ProductCard
                  key={data.id}
                  product={data}
                  renderAdd={true}
                  add_button={true}
                  titleUp={true}
                />
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        )}
      </section>
    </LayOut>
  );
}

export default Results;
