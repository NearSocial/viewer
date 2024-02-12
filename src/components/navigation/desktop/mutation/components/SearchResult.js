import React from "react";
import cn from "classnames";
import styles from "./SearchComponentInput.module.scss";
import { visibleText } from "../helpers/visibleText";
export const SearchResult = ({ metadata, onClick }) => {
  return (
    <div onClick={onClick} className={cn(styles.pairItem, styles.pairItemBg)}>
      <div className={cn(styles.blockLeft)}>
        {metadata.image ? (
          <img src={`https://ipfs.near.social/ipfs/${metadata.image}`} />
        ) : (
          <img
            src={`https://ipfs.near.social/ipfs/bafkreifc4burlk35hxom3klq4mysmslfirj7slueenbj7ddwg7pc6ixomu `}
          />
        )}
      </div>
      <div className={cn(styles.blockRight)}>
        <div className={cn(styles.itemTitle)}>
          {metadata.widgetName ? visibleText(metadata.widgetName) : ""}
        </div>
        {metadata.accountId ? (
          <div className={cn(styles.itemSubtitle)}>
            {metadata.accountId ? visibleText(metadata.accountId) : ""}
          </div>
        ) : null}
      </div>
    </div>
  );
};
