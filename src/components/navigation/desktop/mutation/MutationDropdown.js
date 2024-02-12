import React, { useState, useMemo } from "react";
import cn from "classnames";
import styles from "./MutationDropdown.module.scss";
import { Arrow } from "./assets/icons/Arrow";
import { Back } from "./assets/icons/Back";
import { Edit } from "./assets/icons/Edit";
import { Star } from "./assets/icons/Star";

import { visibleText } from "./helpers/visibleText";
import { MutationDropdownItem } from "./components/MutationDropdownItem";
import { useMutation } from "../../../../contexts/MutationContext";
import { StarFilled } from "./assets/icons/StarFilled";

export function MutationDropdown() {
  const {
    mutations,
    selectMutation,
    selectedMutation,
    defaultMutationId,
    selectDefaultMutation,
    deleteLocalMutation,
  } = useMutation();

  const [isOpen, setOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);

  const handleDropdownClose = () => {
    setOpen(false);
  };

  const handleDropdownToggle = () => {
    setOpen(!isOpen);
    setEdit(false);
  };

  const handleEditMutation = () => {
    setOpen(false);
    setEdit(true);
  };

  const handleStarClick = ({ id }) => {
    selectDefaultMutation(defaultMutationId == id ? null : id);
  };

  const handleMutationClick = (mutation) => {
    selectMutation(mutation.id);
    setOpen(false);
  };

  const handleResetMutation = () => {
    selectMutation(null);
    setOpen(false);
  };

  const handleRemoveMutation = (mutation) => {
    deleteLocalMutation(mutation.id);
  };

  return (
    <>
      <div
        className={cn(styles.wrapper)}
        // onBlur={handleDropdownClose}
        // tabIndex={0}
      >
        {selectedMutation ? (
          <div className={styles.activeMutation}>
            {/* <div
              onClick={() => handleStarClick(selectedMutation)}
              className={styles.starIcon}
            >
              {defaultMutationId === selectedMutation?.id ? (
                <StarFilled />
              ) : (
                <Star />
              )}
            </div> */}
            <span className={cn(styles.titleMutation)}>
              {visibleText(selectedMutation.mutationId)}
            </span>
            <div onClick={handleEditMutation} className={cn(styles.editIcon)}>
              <Edit />
            </div>
            <div
              className={cn(styles.openList, { [styles.isOpen]: isOpen })}
              onClick={handleDropdownToggle}
            >
              <Arrow />
            </div>
          </div>
        ) : (
          <div key={"no_enable"} className={styles.activeMutation}>
            <span className={cn(styles.titleMutation)}>
              No mutations applied
            </span>
            <div className={cn(styles.counterMutations)}>
              +{mutations.length}
            </div>
            {/* <div onClick={handleEditMutation} className={cn(styles.editIcon)}>
              <Edit />
            </div> */}
            <div
              className={cn(styles.openList, { [styles.isOpen]: isOpen })}
              onClick={handleDropdownToggle}
            >
              <Arrow />
            </div>
          </div>
        )}

        {isOpen && (
          <div className={styles.mutationList}>
            {selectedMutation ? (
              <div className={styles.backBlock} onClick={handleResetMutation}>
                <Back />
                <div className={styles.backText}>Back to origin</div>
              </div>
            ) : null}

            <div className={styles.scroll}>
              {mutations.map((mutation) => (
                <MutationDropdownItem
                  key={mutation.id}
                  mutation={mutation}
                  isSelected={selectedMutation?.id === mutation.id}
                  isStarred={defaultMutationId === mutation.id}
                  onRemoveClick={() => handleRemoveMutation(mutation)}
                  onMutationClick={() => handleMutationClick(mutation)}
                  onMutationEditClick={handleEditMutation}
                  onStarClick={() => handleStarClick(mutation)}
                />
              ))}
              {!mutations.length ? (
                <div className={styles.noMutations}>No mutations yet</div>
              ) : null}
            </div>
          </div>
        )}

        {/* {isOpen ? <div className={styles.gradient}></div> : null} */}
      </div>
    </>
  );
}
