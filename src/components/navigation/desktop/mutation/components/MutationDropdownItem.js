import React from "react";
import cn from "classnames";
import { Widget } from "near-social-vm";
import { visibleText } from "../helpers/visibleText";
import styles from "./MutationDropdownItem.module.scss";

export function MutationDropdownItem({
  mutation,
  isSelected,
  onMutationClick,
}) {
  const [authorId, , localId] = mutation.id.split("/");

  return (
    <div
      className={cn(styles.itemMutation, {
        [styles.itemMutationBg]: isSelected,
      })}
    >
      <MutationIcon image={mutation.metadata.image} />

      <div onClick={onMutationClick} className={cn(styles.blockLeft)}>
        <div className={cn(styles.blockTitle)}>
          <span className={cn(styles.titleMutation)}>
            {visibleText(localId)}
          </span>
        </div>
        <span className={cn(styles.mutationSublitle, {})}>
          {authorId ? `by ` + visibleText(authorId) : null}
        </span>
      </div>
    </div>
  );
}

const MutationIcon = ({ image }) => {
  return (
    <Widget
      src="mob.near/widget/Image"
      props={{
        image,
        style: {
          objectFit: "cover",
        },
        className: "h-100",
      }}
    />
  );
};
