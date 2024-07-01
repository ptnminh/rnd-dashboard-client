import React, { useState } from "react";
import styles from "./Sidebar.module.sass";
import { Link, NavLink } from "react-router-dom";
import cn from "classnames";
import Icon from "../Icon";
import Theme from "../Theme";
import Dropdown from "./Dropdown";
import Help from "./Help";
import { Logo } from "./logo";

const navigation = [
  // {
  //   title: "Home",
  //   icon: "home",
  //   url: "/",
  // },
  {
    title: "Campaigns",
    slug: "campaigns",
    icon: "diamond",
    add: true,
    dropdown: [
      {
        title: "History",
        url: "/campaigns/history",
      },
      {
        title: "Template",
        url: "/campaigns/template",
      },
    ],
  },
  // {
  //   title: "Shop",
  //   icon: "store",
  //   url: "/shop",
  // },
  // {
  //   title: "Income",
  //   slug: "income",
  //   icon: "pie-chart",
  //   dropdown: [
  //     {
  //       title: "Earning",
  //       url: "/income/earning",
  //     },
  //     {
  //       title: "Refunds",
  //       url: "/income/refunds",
  //     },
  //     {
  //       title: "Payouts",
  //       url: "/income/payouts",
  //     },
  //     {
  //       title: "Statements",
  //       url: "/income/statements",
  //     },
  //   ],
  // },
];

const Sidebar = ({ className, onClose }) => {
  const [visibleHelp, setVisibleHelp] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div
        className={cn(styles.sidebar, className, { [styles.active]: visible })}
      >
        <button className={styles.close} onClick={onClose}>
          <Icon name="close" size="24" />
        </button>
        <Link className={styles.logo} to="/" onClick={onClose}>
          <Logo />
        </Link>
        <div className={styles.menu}>
          {navigation.map((x, index) =>
            x.url ? (
              <NavLink
                className={styles.item}
                activeClassName={styles.active}
                to={x.url}
                key={index}
                exact
                onClick={onClose}
              >
                <Icon name={x.icon} size="24" />
                {x.title}
              </NavLink>
            ) : (
              <Dropdown
                className={styles.dropdown}
                visibleSidebar={visible}
                setValue={setVisible}
                key={index}
                item={x}
                onClose={onClose}
              />
            )
          )}
        </div>
        <button className={styles.toggle} onClick={() => setVisible(!visible)}>
          <Icon name="arrow-right" size="24" />
          <Icon name="close" size="24" />
        </button>
        <div className={styles.foot}>
          <Theme className={styles.theme} visibleSidebar={visible} />
        </div>
      </div>
      <Help
        visible={visibleHelp}
        setVisible={setVisibleHelp}
        onClose={onClose}
      />
      <div
        className={cn(styles.overlay, { [styles.active]: visible })}
        onClick={() => setVisible(false)}
      ></div>
    </>
  );
};

export default Sidebar;
