import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/icons/amazon-logo-white.png";
import { BsSearch } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { BiCart } from "react-icons/bi";
import classes from "./Header.module.css";
import LowerHeader from "./LowerHeader";
import { DataContext } from "../DataProvider/DataProvider";
import { auth } from "../../Utility/firebase";
import axios from "axios";
import { productUrl } from "../../Api/endPoints";

function Header() {
  const [{ basket, user }] = useContext(DataContext);
  const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0);
  // console.log(basket.length);

  const [categories, setCategories] = useState([]); // State for categories
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [suggestions, setSuggestions] = useState([]); // State for search suggestions

  const navigate = useNavigate();

  // Fetch categories from FakeStore API
  useEffect(() => {
    axios
      .get(`${productUrl}/products/categories`)
      .then((response) => {
        setCategories(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      // Fetch products matching the search term
      axios
        .get(`${productUrl}/products`)
        .then((response) => {
          const filteredProducts = response.data.filter((product) =>
            product.title.toLowerCase().includes(value.toLowerCase())
          );
          setSuggestions(filteredProducts);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    } else {
      setSuggestions([]);
    }
  };

  // Handle selection of a suggestion
  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`); // Redirect to product details page
    setSearchTerm("");
    setSuggestions([]);
  };

  // Handle search action
  const handleSearch = () => {
    navigate(
      `/results?category=${selectedCategory}&search=${encodeURIComponent(
        searchTerm
      )}`
    );
  };

  return (
    <section className={classes.header__outerContainer}>
      <header>
        <section className={classes.header__container}>
          <div className={classes.logo__container}>
            {/* logo */}
            <Link to="/">
              <img src={logo} alt="amazon logo" />
            </Link>

            {/* delivery */}
            <div className={classes.delivery}>
              <span>
                <SlLocationPin />
              </span>
              <div>
                <p>Deliver to</p>
                <span>Ethiopia</span>
              </div>
            </div>
          </div>

          {/* search */}
          <div className={classes.header__search}>
            {/* Category Dropdown */}
            <select
              className={classes.header__search_category}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              name=""
              id=""
            >
              <option className={classes.header__search_category_list} value="">
                All
              </option>
              {categories.map((category, index) => (
                <option
                  className={classes.header__search_category_list}
                  key={index}
                  value={category}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className={classes.header__search_InputContainer}>
              <input
                type="text"
                placeholder="Search Amazon"
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <ul className={classes.header__search_suggestionsList}>
                  {suggestions.map((product) => (
                    <li
                      key={product.id}
                      onClick={() => handleSuggestionClick(product.id)}
                    >
                      {product.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Search Icon */}
            <BsSearch
              className={classes.header__search_icon}
              size={40}
              onClick={handleSearch}
            />
          </div>

          {/* Right-side Links */}
          <div className={classes.order__container}>
            <a href="" className={classes.language}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg"
                alt="USA Flag"
              />
              <select name="" id="">
                <option value="">EN</option>
              </select>
            </a>

            {/* Sign In / Sign Out */}
            <Link to={!user && "/auth"}>
              <div>
                {user ? (
                  <>
                    <p>Hello, {user?.email?.split("@")[0]}</p>
                    <span onClick={() => auth.signOut()}>Sign out</span>
                  </>
                ) : (
                  <>
                    <p>Hello, Sign In</p>
                    <span>Account & Lists</span>
                  </>
                )}
              </div>
            </Link>

            {/* orders */}
            <Link to="/orders">
              <p>returns</p>
              <span>& Orders</span>
            </Link>

            {/* cart */}
            <Link to="/cart" className={classes.cart}>
              <BiCart size={35} />
              <span>{totalItem}</span>
            </Link>
          </div>
        </section>
      </header>
      <LowerHeader />
    </section>
  );
}

export default Header;
