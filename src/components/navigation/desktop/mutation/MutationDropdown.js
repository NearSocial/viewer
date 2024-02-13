import React, { useState } from "react";
import cn from "classnames";
import styles from "./MutationDropdown.module.scss";
import { Arrow } from "./assets/icons/Arrow";
import { Back } from "./assets/icons/Back";
import { Edit } from "./assets/icons/Edit";
import { visibleText } from "./helpers/visibleText";
import { MutationDropdownItem } from "./components/MutationDropdownItem";
import { useMutation } from "../../../../contexts/MutationContext";

export function MutationDropdown() {
  const { mutations, selectMutation, selectedMutation, deleteLocalMutation } =
    useMutation();

  const [isOpen, setOpen] = useState(false);
  const [, setEdit] = useState(false);

  const handleDropdownToggle = () => {
    setOpen(!isOpen);
    setEdit(false);
  };

  const handleEditMutation = () => {
    setOpen(false);
    setEdit(true);
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
      <div className={cn(styles.wrapper)}>
        {selectedMutation ? (
          <div className={styles.activeMutation}>
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
                  onRemoveClick={() => handleRemoveMutation(mutation)}
                  onMutationClick={() => handleMutationClick(mutation)}
                />
              ))}
              {!mutations.length ? (
                <div className={styles.noMutations}>No mutations yet</div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
