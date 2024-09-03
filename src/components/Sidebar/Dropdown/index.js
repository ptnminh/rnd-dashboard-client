import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Dropdown.module.sass";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Icon from "../../Icon";
import { isEmpty, isEqual, map } from "lodash";

const Dropdown = ({ className, item, visibleSidebar, setValue, onClose }) => {
  const [chooseDropdown, setChooseDropdown] = useState([]);

  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(item.pathname);
    setVisible(!visible);
  };

  useEffect(() => {
    setVisible(item.pathname === pathname);
  }, []);

  const Head = () => {
    return (
      <button
        className={cn(
          styles.head,
          {
            [styles.active]: pathname === item.pathname,
          },
          {
            [styles.turnOff]: item.isParent,
          },
          { [styles.wide]: visibleSidebar }
        )}
        onClick={() => handleClick()}
      >
        {item.icon && <Icon name={item.icon} size="24" />}
        {item.title}
        {item.arrowDown && <Icon name="arrow-down" size="24" />}
      </button>
    );
  };

  const Body = ({ dropdown }) => {
    return (
      <div className={styles.body}>
        {map(dropdown, (x, index) => (
          <div key={index}>
            <NavLink
              className={({ isActive }) => {
                return isActive && isEmpty(x.dropdown) && (pathname === x.url || pathname === item.pathname)
                  ? `${styles.link} ${styles.active}`
                  : styles.link;
              }}
              to={x.url}
              key={index}
              onClick={() => {
                onClose();
                if (isEqual(x.dropdown, chooseDropdown)) {
                  setChooseDropdown([]);
                } else {
                  setChooseDropdown(x.dropdown);
                }
              }}
              exact
            >
              {x.title}
              <Icon name="arrow-next" size="24" />
            </NavLink>
            {isEqual(x.dropdown, chooseDropdown) &&
              map(chooseDropdown, (y, index) => (
                <Dropdown
                  className={cn(
                    styles.nestedDropdown,
                    styles.nestedDropdownLink,
                  )}
                  setValue={setVisible}
                  key={index}
                  item={y}
                />
              ))}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div
      className={cn(
        styles.dropdown,
        className,
        {
          [styles.active]:
            visible &&
            (item.pathname === pathname ||
              pathname.includes(item.slug || item.pathname)),
        },
        {
          [styles.turnOff]: !item.isParent,
        },
        { [styles.wide]: visibleSidebar }
      )}
    >
      <Head />
      <Body {...item} />
    </div >
  );
};

export default Dropdown;
