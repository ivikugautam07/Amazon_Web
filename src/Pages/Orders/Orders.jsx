import React, { useContext, useEffect } from "react";
import LayOut from "../../components/LayOut/LayOut";
import { db } from "../../Utility/firebase";
import { DataContext } from "../../components/DataProvider/DataProvider";
import classes from "./Orders.module.css";

function Orders() {
  const [{ user }] = useContext(DataContext);

  useEffect(() => {}, []);
  return (
    <LayOut>
      <section className={classes.orders}>
        <div className={classes.orders__container}>
          <h2>Your Orders</h2>
          {/* Order Items */}
          <div></div>
        </div>
      </section>
    </LayOut>
  );
}

export default Orders;
