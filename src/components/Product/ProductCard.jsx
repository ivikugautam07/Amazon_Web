import React, { useContext } from "react";
import Rating from "@mui/material/Rating";
import CurrencyFormat from "../CurrencyFormat/CurrencyFormat";
import classes from "./Product.module.css";
import { Link } from "react-router-dom";
// import Loader from "../../components/Loader/Loader";
import { DataContext } from "../DataProvider/DataProvider";
import { Type } from "../../Utility/action.type";

function ProductCard({
  product,
  flex,
  add_description,
  renderAdd,
  sliceDesc,
  titleUp,
}) {
  // const { image, title, id, rating = {}, price } = product;
  // const { rate = 0, count = 0 } = rating;
  const { image, title, id, rating, price, description } = product;

  const [state, dispatch] = useContext(DataContext);

  console.log(description);

  // console.log(renderAdd);
  const addToCart = () => {
    dispatch({
      type: Type.ADD_TO_BASKET,
      item: {
        image,
        title,
        id,
        rating,
        price,
        description,
      },
    });
  };
  //optional rending for the rating
  return (
    <div
      className={`${classes.productCard__container} ${
        flex ? classes.product_detail : ""
      }`}
    >
      <Link to={`/products/${id}`}>
        <img
          src={image}
          alt={title}
          className={classes.productCard__img__container}
        />
      </Link>
      <div>
        {titleUp && <h3>{title}</h3>}
        {sliceDesc && <h3>{`${title.slice(0, 30)} ...`}</h3>}

        {add_description && (
          <div style={{ maxWidth: "750" }}>{description}</div>
        )}
        {sliceDesc && (
          <div style={{ maxWidth: "350" }}>{`${description.slice(
            0,
            90
          )}...`}</div>
        )}
        <div className={classes.productCard__rating}>
          <Rating value={rating?.rate} precision={0.1} />
          <small>{rating?.count}</small>
        </div>
        <div>
          <CurrencyFormat amount={price} />
        </div>
        {renderAdd && (
          <button className={classes.productCard__button} onClick={addToCart}>
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
