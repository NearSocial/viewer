import React from "react";
import styles from "./ButtonDropdownItem.module.scss";
import cn from "classnames";

export const ButtonDropdownItem = ({ onClick, label, disabled }) => {
  return (
    <div
      onClick={() => !disabled && onClick()}
      className={cn(styles.itemTitle, {
        [styles.disabled]: disabled,
      })}
    >
      {label}
    </div>
  );
};
