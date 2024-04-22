import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Widget } from "near-social-vm";
import { Arrow } from "../../icons/Arrow";
import { Back } from "../../icons/Back";
import fallbackImage from "../../../images/fallback_image.svg";

// #region MutationDropdown

const MutationWrapper = styled.div`
  position: relative;
  display: flex;
  height: 44px;

  align-items: center;
`;

const ActiveMutation = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  width: 100%;
  color: #fff;
  padding: 10px;
  height: 100%;
  border-radius: 10px;
  border: 1px solid #4c5155;
  background: #313538;
  cursor: pointer;
`;

const MutationTitle = styled.p`
  position: absolute;
  left: 11px;
  margin: 0;
  width: calc(100% - 50px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background: inherit;
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 149%;
`;

const CounterMutation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  padding: 0 4px;
  height: 24px;
  border-radius: 40px;
  background: #19ceae;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  width: 134px;
  justify-content: space-between;

  margin: 0 auto;
  cursor: pointer;
  padding: 5px 10px;
  &:hover {
    opacity: 0.7;
  }
`;

const BackLabel = styled.div`
  color: #3d7fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 149%;
`;

const MutationList = styled.div`
  position: absolute;
  z-index: 3;
  top: 50px;
  right: 0;
  display: flex;
  flex-direction: column;

  background: #fff;
  max-height: 400px;
  min-height: 40px;
  height: auto;
  border-radius: 6px;

  @keyframes list-visibleText {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }

  animation-name: list-visibleText;
  animation-duration: 0.2s;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
  box-shadow: 0px 13px 28px 0px rgba(0, 0, 0, 0.1),
    0px 51px 51px 0px rgba(0, 0, 0, 0.09),
    0px 115px 69px 0px rgba(0, 0, 0, 0.05),
    0px 204px 81px 0px rgba(0, 0, 0, 0.01), 0px 318px 89px 0px rgba(0, 0, 0, 0);

  padding: 10px 4px 0px 10px;
`;

const OpenListDefault = styled.div`
  cursor: pointer;

  display: flex;

  width: 24px;
  height: 24px;
  padding: 9px 6px;
  @keyframes rotate-is-open {
    0% {
      transform: rotate(0deg);
    }

    50% {
      transform: rotate(90deg);
    }

    100% {
      transform: rotate(180deg);
    }
  }
  @keyframes rotate-is-close {
    0% {
      transform: rotate(180deg);
    }

    50% {
      transform: rotate(90deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }
  animation-name: ${(props) => props.$isOpen || "rotate-is-close"};
  animation-duration: 0.2s;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
  svg {
    transition: all 0.3s;
  }
  &:hover {
    svg {
      transform: scale(1.5);
      transition: all 0.3s;
    }
  }
`;

const Scroll = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    cursor: pointer;
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    margin-top: 15px;
    background: rgb(244 244 244);
    background: linear-gradient(
      90deg,
      rgb(244 244 244 / 0%) 10%,
      rgb(227 227 227 / 100%) 50%,
      rgb(244 244 244 / 0%) 90%
    );
  }

  &::-webkit-scrollbar-thumb {
    width: 4px;
    height: 2px;

    background: #3d7fff;
    border-radius: 2px;
    box-shadow: 0 2px 6px rgb(0 0 0 / 9%), 0 2px 2px rgb(38 117 209 / 4%);
  }
`;

// #endregion

// #region MutationItem

const MutationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 3px 5px 5px;
  width: 272px;
  height: 46px;
  border-radius: 4px;
  margin-top: 10px;
  cursor: pointer;
  gap: 10px;
  &:hover {
    background: #d9dee1;

    .titleMutation {
      opacity: 1;
    }
  }
  &:last-child {
    margin-bottom: 10px;
  }
`;

const MutationInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 194px;

  .titleMutation {
    color: #222;
    opacity: 0.6;
    font-size: 14px;

    font-weight: 400;
    line-height: 149%;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 194px;
    display: inline-block;
  }
`;

const MutationItemTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const MutationSublitle = styled.span`
  color: #222;
  font-size: 10px;
  font-weight: 400;
  line-height: normal;
  opacity: 0.6;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 194px;
  display: inline-block;
`;

// #endregion

function parseMutationId(mutationId) {
  const [authorId, , localId] = mutationId.split("/");
  return { authorId, localId };
}

export function MutationDropdown({ engine, imageSrc, listPosition = "right" }) {
  const [mutations, setMutations] = useState([]);
  const [selectedMutation, setSelectedMutation] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!engine) return;

    const init = async () => {
      try {
        setIsLoading(true);

        const mutations = await engine.getMutations();
        setMutations(mutations);

        const mutation = await engine.getCurrentMutation();
        setSelectedMutation(mutation);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [engine]);

  const handleDropdownToggle = () => {
    setOpen(!isOpen);
  };

  const handleMutationClick = async (mutation) => {
    setSelectedMutation(mutation);
    setOpen(false);

    try {
      setIsLoading(true);

      if (engine.started) {
        await engine.switchMutation(mutation.id);
      } else {
        await engine.start(mutation.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }

    window.sessionStorage.setItem("mutableweb:mutationId", mutation.id);
  };

  const handleResetMutation = () => {
    setSelectedMutation(null);
    setOpen(false);
    engine.stop();
    window.sessionStorage.setItem("mutableweb:mutationId", "null");
  };

  if (isLoading) {
    return (
      <MutationWrapper>
        <ActiveMutation>
          <MutationTitle>Loading...</MutationTitle>
        </ActiveMutation>
      </MutationWrapper>
    );
  }

  return (
    <MutationWrapper>
      {selectedMutation ? (
        <ActiveMutation onClick={handleDropdownToggle}>
          <MutationTitle title={parseMutationId(selectedMutation.id).localId}>
            {parseMutationId(selectedMutation.id).localId}
          </MutationTitle>
          <OpenListDefault $isOpen={isOpen && "rotate-is-open"}>
            <Arrow />
          </OpenListDefault>
        </ActiveMutation>
      ) : (
        <ActiveMutation onClick={handleDropdownToggle}>
          <MutationTitle>No mutations applied</MutationTitle>

          {mutations.length ? (
            <CounterMutation>+{mutations.length}</CounterMutation>
          ) : null}

          <OpenListDefault $isOpen={isOpen && "rotate-is-open"}>
            <Arrow />
          </OpenListDefault>
        </ActiveMutation>
      )}

      {isOpen && (
        <MutationList
          style={{
            right: listPosition === "right" ? "0" : "",
            left: listPosition === "left" ? "0" : "",
            width: listPosition === "right" ? 292 : 222,
          }}
        >
          {selectedMutation ? (
            <BackButton onClick={handleResetMutation}>
              <Back />
              <BackLabel>Back to origin</BackLabel>
            </BackButton>
          ) : null}

          <Scroll>
            {mutations.map((mutation) => {
              const { authorId, localId } = parseMutationId(mutation.id);
              return (
                <MutationItem
                  key={mutation.id}
                  style={{
                    background:
                      selectedMutation?.id === mutation.id &&
                      "rgba(24, 121, 206, 0.08)",
                  }}
                >
                  <Widget
                    src={imageSrc}
                    props={{
                      image: mutation.metadata.image,
                      style: { objectFit: "cover" },
                      className: "h-100",
                      fallbackUrl: fallbackImage,
                    }}
                  />
                  <MutationInfo onClick={() => handleMutationClick(mutation)}>
                    <MutationItemTitle>
                      <span className="titleMutation">{localId}</span>
                    </MutationItemTitle>
                    <MutationSublitle>
                      {authorId ? `by ` + authorId : null}
                    </MutationSublitle>
                  </MutationInfo>
                </MutationItem>
              );
            })}
            {!mutations.length ? <div>No mutations yet</div> : null}
          </Scroll>
        </MutationList>
      )}
    </MutationWrapper>
  );
}
