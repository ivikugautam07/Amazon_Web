import React, { useContext, useState } from "react";
import LayOut from "../../components/LayOut/LayOut";
import classes from "./Payment.module.css";
import { DataContext } from "../../components/DataProvider/DataProvider";
import ProductCard from "../../components/Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios";
import { ClipLoader } from "react-spinners";
import { db } from "../../Utility/firebase";
import { useNavigate } from "react-router-dom";
import { Type } from "../../Utility/action.type";

function Payment() {
  const [{ basket, user }, dispatch] = useContext(DataContext);
  const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0);
  const total = basket?.reduce(
    (amount, item) => item.price * item.amount + amount,
    0
  );

  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  // Card Error handler function
  const handleChange = (e) => {
    setCardError(e?.error?.message || "");
  };

  // Payment handler function
  const handlePayment = async (e) => {
    e.preventDefault();
    if (basket.length === 0) {
      setCardError("Your basket is empty.");
      return;
    }

    try {
      setProcessing(true);
      const response = await axiosInstance({
        method: "POST",
        url: `/payment/create?total=${total * 100}`,
      });

      const clientSecret = response.data?.clientSecret;

      const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      await db
        .collection("users")
        .doc(user.uid)
        .collection("orders")
        .doc(paymentIntent.id)
        .set({
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        });

      // Empty basket
      dispatch({ type: Type.EMPTY_BASKET });

      setProcessing(false);
      navigate("/orders", { state: { msg: "you have placed new order" } });
    } catch (error) {
      setCardError(error.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <LayOut>
      <div className={classes.payment__header}>
        Checkout ({totalItem}) items
      </div>

      <section className={classes.payment__method__wrapper}>
        <div
          className={`${classes.payment__deliveryInfo} ${classes.payment__flex}`}
        >
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div>
            <div>123 React Lane</div>
            <div>Ethiopia, IL</div>
          </div>
        </div>
        <hr />

        <div
          className={`${classes.payment__deliveryItem} ${classes.payment__flex}`}
        >
          <h3>Review items and Delivery</h3>
          <div>
            {basket?.map((item, i) => (
              <ProductCard key={i} product={item} flex={true} />
            ))}
          </div>
        </div>
        <hr />

        <div className={`${classes.payment__card} ${classes.payment__flex}`}>
          <h3>Payment methods</h3>
          <div className={classes.payment__card_methods}>
            <div className={classes.payment__card_details}>
              <form onSubmit={handlePayment}>
                {cardError && (
                  <small className={classes.payment__card_error}>
                    {cardError}
                  </small>
                )}

                <CardElement onChange={handleChange} />
                <div className={classes.payment__price}>
                  <div>
                    <span>
                      Total Order | <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button type="submit" disabled={processing}>
                    {processing ? (
                      <div className={classes.payment__card_details_loader}>
                        <ClipLoader color="#000" size={12} />
                        <p>Please wait .... </p>
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Payment;
