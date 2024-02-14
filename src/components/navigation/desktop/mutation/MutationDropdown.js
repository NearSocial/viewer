import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Arrow } from "../../../icons/Arrow";
import { Back } from "../../../icons/Back";
import { MutationDropdownItem } from "./components/MutationDropdownItem";

const MutationWrapper = styled.div`
  position: relative;
  display: flex;
  width: 300px;
  height: 44px;

  align-items: center;
`;

const ActiveMutation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: #fff;
  padding: 10px;
  height: 100%;
  border-radius: 10px;
  border: 1px solid #4c5155;
  background: #313538;
`;

const MutationTitle = styled.div`
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 149%;

  background: inherit;

  overflow: hidden;
  text-overflow: ellipsis;
  width: 194px;
  display: inline-block;
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
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;

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
export function MutationDropdown({ engine }) {
  const [mutations, setMutations] = React.useState([]);
  const [selectedMutation, setSelectedMutation] = React.useState(null);

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
      <MutationWrapper>
        {selectedMutation ? (
          <ActiveMutation>
            <MutationTitle>{selectedMutation.id.split("/")[2]}</MutationTitle>
            <OpenListDefault
              $isOpen={isOpen && "rotate-is-open"}
              onClick={handleDropdownToggle}
            >
              <Arrow />
            </OpenListDefault>
          </ActiveMutation>
        ) : (
          <ActiveMutation key={"no_enable"}>
            <MutationTitle>No mutations applied</MutationTitle>
            <CounterMutation>+{mutations.length}</CounterMutation>

            <OpenListDefault
              $isOpen={isOpen && "rotate-is-open"}
              onClick={handleDropdownToggle}
            >
              <Arrow />
            </OpenListDefault>
          </ActiveMutation>
        )}

        {isOpen && (
          <MutationList>
            {selectedMutation ? (
              <BackButton onClick={handleResetMutation}>
                <Back />
                <BackLabel>Back to origin</BackLabel>
              </BackButton>
            ) : null}

            <Scroll>
              {mutations.map((mutation) => (
                <MutationDropdownItem
                  key={mutation.id}
                  mutation={mutation}
                  isSelected={selectedMutation?.id === mutation.id}
                  onMutationClick={() => handleMutationClick(mutation)}
                />
              ))}
              {!mutations.length ? <div>No mutations yet</div> : null}
            </Scroll>
          </MutationList>
        )}
      </MutationWrapper>
    </>
  );
}
