import React, { useState } from "react";
import cn from "classnames";
import styles from "./Dropdown.module.sass";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Icon from "../../Icon";
import { isEmpty, isEqual, map } from "lodash";

const Dropdown = ({ className, item, visibleSidebar, setValue, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [chooseDropdown, setChooseDropdown] = useState([]);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    setVisible(!visible);
    setValue(true);
    navigate(item.pathname);
  };

  const Head = () => {
    return (
      <button
        className={cn(
          styles.head,
          {
            [styles.active]: pathname === item.pathname,
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
          <>
            <div key={index}>
              <NavLink
                className={({ isActive }) =>
                  isActive && isEmpty(x.dropdown) && !x.turnOffActive
                    ? `${styles.link} ${styles.active}`
                    : styles.link
                }
                to={x.url}
                key={index}
                onClick={() => {
                  onClose();
                  setChooseDropdown(x.dropdown);
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
                      styles.nestedDropdownLink
                    )}
                    setValue={setVisible}
                    key={index}
                    item={y}
                  />
                ))}
            </div>
          </>
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        styles.dropdown,
        className,
        { [styles.active]: visible },
        {
          [styles.active]: pathname.includes(item.slug || item.pathname),
        },
        { [styles.wide]: visibleSidebar }
      )}
    >
      {item.add ? (
        <div
          className={cn(styles.top, {
            [styles.active]: pathname.startsWith(item.pathname),
          })}
        >
          <Head />
          <Link
            className={cn(styles.add, {
              [styles.active]: pathname.startsWith(item.pathname),
            })}
            to={item.pathname}
            onClick={onClose}
          >
            <Icon name="plus" size="10" />
          </Link>
        </div>
      ) : (
        <Head />
      )}
      <Body {...item} />
    </div>
  );
};

export default Dropdown;
