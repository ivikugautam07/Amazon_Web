import React, { useContext, useEffect, useState } from "react";
import LayOut from "../../components/LayOut/LayOut";
import { db } from "../../Utility/firebase";
import { DataContext } from "../../components/DataProvider/DataProvider";
import classes from "./Orders.module.css";
import ProductCard from "../../components/Product/ProductCard";

function Orders() {
  const [{ user }] = useContext(DataContext);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .collection("orders")
        .orderBy("created", "desc")
        .onSnapshot((snapshot) => {
          console.log(snapshot);
          setOrders(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    } else {
      setOrders([]);
    }
  }, [user]);
  return (
    <LayOut>
      <section className={classes.orders}>
        <div className={classes.orders__container}>
          <h2>Your Orders</h2>
          {orders?.length == 0 && (
            <div className={classes.orders__empty}>
              <p>you don't have orders yest.</p>
            </div>
          )}
          {/* Order Items */}
          <div>
            {orders?.map((eachOrder, i) => {
              return (
                <div key={i}>
                  <hr />
                  <p>Order ID:{eachOrder?.id}</p>
                  {eachOrder?.data?.basket?.map((order) => {
                    return (
                      <ProductCard
                        key={order.id}
                        product={order}
                        flex={true}
                        titleUp={true}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Orders;
