import React, { useState } from "react";
import styles from "./Sidebar.module.sass";
import { Link, NavLink } from "react-router-dom";
import cn from "classnames";
import Icon from "../Icon";
import Dropdown from "./Dropdown";
import Help from "./Help";
import { Logo } from "./logo";

const navigation = [
  {
    title: "RnD - Tạo Brief",
    slug: "rnd",
    icon: "diamond",
    arrowDown: true,
    pathname: "/rnd/brief",
    dropdown: [
      {
        title: "List - Product Line",
        url: "/rnd/product-line",
      },
    ],
  },
  {
    title: "Design - Task",
    icon: "diamond",
    arrowDown: true,
    slug: "/designer",
    pathname: "/designer",
    dropdown: [
      {
        title: "Design - Feedback",
        url: "/designer/feedback",
      },
    ],
  },
  {
    title: "Listing - Task",
    arrowDown: true,
    icon: "diamond",
    url: "/epm",
  },
  {
    title: "MKT - Task",
    icon: "diamond",
    arrowDown: true,
    slug: "/mkt",
    pathname: "/mkt",
    dropdown: [
      {
        title: "1. Post",
        arrowDown: true,
        dropdown: [
          {
            title: "1.1 Dashboard",
            pathname: "/mkt/post/dashboard",
          },
          {
            title: "1.2 Lên Post",
            pathname: "/mkt/post/create",
          },
        ],
      },
      {
        title: "2. Camps",
        arrowDown: true,
        dropdown: [
          {
            title: "2.1 Tạo",
            pathname: "/mkt/camp/dashboard",
          },
          {
            title: "2.2 Đã tạo",
            pathname: "/mkt/camp/created",
          },
        ],
      },
      {
        title: "3. Materials",
        arrowDown: true,
        dropdown: [
          {
            title: "3.1 Accounts",
            pathname: "/mkt/account",
          },
          {
            title: "3.2 Camp Phôi",
            pathname: "/mkt/root-campaign",
          },
          {
            title: "3.3 Caption",
            pathname: "/mkt/caption",
          },
        ],
      },
    ],
  },
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
              <>
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
              </>
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
