import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./MutationDropdown.module.scss";
import { Arrow } from "./assets/icons/Arrow";
import { Back } from "./assets/icons/Back";
import { visibleText } from "./helpers/visibleText";
import { MutationDropdownItem } from "./components/MutationDropdownItem";

export function MutationDropdown({ engine }) {
  const [mutations, setMutations] = useState([]);
  const [selectedMutation, setSelectedMutation] = useState(null);

  useEffect(() => {
    const init = async () => {
      const mutations = await engine.getMutations();
      setMutations(mutations);

      const mutation = await engine.getCurrentMutation();
      setSelectedMutation(mutation);
    };
    init();
  }, [engine]);

  const [isOpen, setOpen] = useState(false);

  const handleDropdownToggle = () => {
    setOpen(!isOpen);
  };
  
  const handleMutationClick = async (mutation) => {
    setSelectedMutation(mutation);
    await engine.switchMutation(mutation.id);
  };

  const handleResetMutation = () => {
    setSelectedMutation(null);
    engine.stop();
  };

  return (
    <>
      <div className={cn(styles.wrapper)}>
        {selectedMutation ? (
          <div className={styles.activeMutation}>
            <span className={cn(styles.titleMutation)}>
              {visibleText(selectedMutation.id.split('/')[2])}
            </span>
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
