import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./SearchComponentInput.module.scss";
import { useMutation } from "../../../../../contexts/MutationContext";
import { Close } from "../assets/icons/Close";
import { visibleText } from "../helpers/visibleText";
// import { InputButton } from "../../../../icons/InputButton";
import { SearchResult } from "./SearchResult";

export const SearchComponentInput = ({
  value,
  placeholder,
  onChange,
  isInputButton,
  isAdditional,
}) => {
  // ToDo: extract InputButton to children and rename

  const { searchComponents, enablePickingMode, pickedComponent } =
    useMutation();

  const [inputValue, setInputValue] = useState(value ?? "");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isPicking, setIsPicking] = useState(false);

  const handleSearchChangeSecondPair = (e) => {
    setInputValue(e.target.value);
    setIsSearchDropdownOpen(true);
  };

  const clearInputValue = () => {
    setInputValue("");
    setIsSearchDropdownOpen(false);
  };

  useEffect(() => {
    const _searchResults = searchComponents({ term: inputValue });
    setSearchResults(_searchResults);
  }, [inputValue, isSearchDropdownOpen]);

  const handleSearchResultClick = (widgetSrc) => {
    onChange(widgetSrc);
    setInputValue(widgetSrc);
    setIsSearchDropdownOpen(false);
    setSearchResults([]);
  };

  const handlePickerClick = () => {
    setIsPicking(true);
    enablePickingMode();
  };

  useEffect(() => {
    // Check local isPicking state here because all components listen pickedComponent changes
    if (isPicking && pickedComponent) {
      onChange(pickedComponent);
      setIsPicking(false);
    }
  }, [pickedComponent]);

  if (value) {
    // ToDo: searchComponents is expensive function
    const searchResult = searchComponents({ term: value });

    return (
      <div
        className={cn(styles.pairItem, styles.pairSecond, {
          [styles.pairAdditional]: isAdditional,
        })}
      >
        <div className={cn(styles.blockLeft)}>
          {searchResult[0].image ? (
            <img
              src={`https://ipfs.near.social/ipfs/${searchResult[0].image}`}
            />
          ) : (
            <img
              src={`https://ipfs.near.social/ipfs/bafkreifc4burlk35hxom3klq4mysmslfirj7slueenbj7ddwg7pc6ixomu `}
            />
          )}
        </div>
        <div className={cn(styles.blockRight)}>
          <div className={cn(styles.itemTitle)}>
            {visibleText(searchResult[0].widgetName)}
          </div>
          {searchResult[0].accountId ? (
            <div className={cn(styles.itemSubtitle)}>
              {visibleText(searchResult[0].accountId)}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(styles.pair, {
        [styles.pairAdditional]: isAdditional,
      })}
      tabIndex={-1}
      onBlur={() => setTimeout(() => setIsSearchDropdownOpen(false), 200)}
    >
      <input
        value={inputValue}
        onChange={(e) => handleSearchChangeSecondPair(e)}
        spellCheck={false}
        className={cn(styles.pairInput)}
        placeholder={placeholder}
      />
      {(isInputButton && !inputValue) ||
        (!inputValue.length ? (
          <div className={cn(styles.close)} onClick={handlePickerClick}>
            {/* <InputButton /> */}
            inpBut
          </div>
        ) : null)}
      {inputValue && inputValue.length ? (
        <div onClick={() => clearInputValue()} className={cn(styles.close)}>
          <Close />
        </div>
      ) : null}

      {isSearchDropdownOpen ? (
        <div className={cn(styles.openSecondPair)}>
          {searchResults.length > 0 ? (
            searchResults.map((componentMetadata, i) => (
              <SearchResult
                key={componentMetadata.widgetSrc}
                metadata={componentMetadata}
                onClick={() =>
                  handleSearchResultClick(componentMetadata.widgetSrc)
                }
              />
            ))
          ) : (
            <div className={cn(styles.pairItem, styles.pairItemBg)}>
              nothing interesting
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
