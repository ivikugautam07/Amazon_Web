import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/icons/amazon-logo-white.png";
import { BsSearch } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { BiCart } from "react-icons/bi";
import classes from "./Header.module.css";
import LowerHeader from "./LowerHeader";
import { DataContext } from "../DataProvider/DataProvider";
import { auth } from "../../Utility/firebase";

function Header() {
  const [{ basket, user }, dispatch] = useContext(DataContext);
  const totalItem = basket?.reduce((amount, item) => {
    return item.amount + amount;
  }, 0);

  // console.log(basket.length);
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

          <div className={classes.search}>
            {/* search */}
            <select name="" id="">
              <option value="">All</option>
            </select>
            <input type="text" name="" id="" placeholder="Search Amazon" />
            {/* icon */}
            <BsSearch size={40} />
          </div>

          <div className={classes.order__container}>
            {/* right side link */}
            <a href="" className={classes.language}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg"
                alt="USA Flag"
              />
              <select name="" id="">
                <option value="">EN</option>
              </select>
            </a>

            {/* three components */}
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
