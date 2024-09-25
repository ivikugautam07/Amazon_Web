import React, { useEffect, useState } from "react";
import { productUrl } from "../../Api/EndPoints";
import LayOut from "../../components/LayOut/LayOut";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/Product/ProductCard";
import Loader from "../../components/Loader/Loader";
import axios from "axios";

function ProductDetail() {
  const [product, setProduct] = useState({});
  const { productId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${productUrl}/products/${productId}`)
      .then((res) => {
        // console.log(res.data);
        setProduct(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [productId]);

  return (
    <LayOut>
      {isLoading ? (
        <Loader />
      ) : (
        <ProductCard
          key={product.id}
          titleUp={true}
          product={product}
          flex={true}
          add_description={true}
          add_button={true}
          renderAdd={true}
        />
      )}
    </LayOut>
  );
}

export default ProductDetail;
