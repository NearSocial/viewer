import React, { useEffect, useState } from "react";
import { visibleText } from "../helpers/visibleText";
import { Trash } from "../assets/icons/Trash";
import styles from "./MutationDropdownItem.module.scss";
import { Edit } from "../assets/icons/Edit";
import cn from "classnames";
import { StarFilled } from "../assets/icons/StarFilled";
import { Star } from "../assets/icons/Star";
import { Widget } from "near-social-vm";

import LNC_LOGO from "../assets/logos/learn-near-club.jpg";
import NDC_LOGO from "../assets/logos/ndc.jpg";
import NDH_LOGO from "../assets/logos/near-dev-hub.png";
// import NF_LOGO from "../assets/logos/near-foundation.jpg";
import NEAR_LOGO from "../assets/logos/near.png";
import DAPPLETS_LOGO from "../assets/logos/dapplets.png";

export function MutationDropdownItem({
  mutation,
  isSelected,
  isStarred,
  onRemoveClick,
  onMutationClick,
  onMutationEditClick,
  onStarClick,
}) {
  return (
    <div
      className={cn(styles.itemMutation, {
        [styles.itemMutationBg]: isSelected,
      })}
    >
      {/* <div onClick={onStarClick} className={styles.starIcon}>
        {isStarred ? <StarFilled /> : <Star />}
      </div> */}

      <div>
        <MutationIcon authorId={mutation.authorId} />
      </div>

      <div onClick={onMutationClick} className={cn(styles.blockLeft)}>
        <div className={cn(styles.blockTitle)}>
          {mutation.isLocal ? (
            <div className={cn(styles.label)}>Local</div>
          ) : null}
          {/* {mutation.isEdited ? (
            <div className={cn(styles.label)}>Edited</div>
          ) : null} */}
          <span className={cn(styles.titleMutation)}>
            {visibleText(mutation.mutationId)}
          </span>
        </div>
        <span className={cn(styles.mutationSublitle, {})}>
          {mutation.authorId && mutation.authorId !== "local"
            ? `by ` + visibleText(mutation.authorId)
            : null}
        </span>
      </div>

      {/* {isSelected ? (
        <span onClick={onMutationEditClick} className={styles.editIcon}>
          <Edit />
        </span>
      ) : null} */}

      {!isSelected && mutation.isLocal ? (
        <span className={styles.deleteUsersContainer} onClick={onRemoveClick}>
          <Trash />
        </span>
      ) : null}
    </div>
  );
}

const MutationIcon = ({ authorId, mutationId }) => {
  if (authorId === "dapplets.near") {
    return (
      <img
        style={{
          width: "30px",
          height: "30px",
          marginRight: 8,
          borderRadius: 15,
        }}
        src={NDC_LOGO}
      />
    );
  } else if (authorId === "alsakhaev.near") {
    return (
      <img
        style={{
          width: "30px",
          height: "30px",
          marginRight: 8,
          borderRadius: 15,
        }}
        src={LNC_LOGO}
      />
    );
  } else if (authorId === "dapplets.sputnik-dao.near") {
    return (
      <img
        style={{
          width: "30px",
          height: "30px",
          marginRight: 8,
          borderRadius: 15,
        }}
        src={NDH_LOGO}
      />
    );
  } else if (authorId === "mybadge.near") {
    return (
      <img
        style={{
          width: "30px",
          height: "30px",
          marginRight: 8,
          borderRadius: 15,
        }}
        src={NEAR_LOGO}
      />
    );
  } else if (authorId === "paywall.near") {
    return (
      <img
        style={{
          width: "30px",
          height: "30px",
          marginRight: 8,
          borderRadius: 15,
        }}
        src={DAPPLETS_LOGO}
      />
    );
  } else {
    return (
      <Widget
        src="mob.near/widget/ProfileImage"
        props={{
          accountId: authorId,
          className: "d-inline-block",
          style: { width: "30px", height: "30px", marginRight: 8 },
        }}
      />
    );
  }
};
