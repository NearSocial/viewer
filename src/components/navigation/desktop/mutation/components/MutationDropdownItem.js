import { Widget } from "near-social-vm";
import styled from "styled-components";
// eslint-disable-next-line
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

const MutationTitle = styled.div`
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
export function MutationDropdownItem({
  mutation,
  isSelected,
  onMutationClick,
}) {
  const [authorId, , localId] = mutation.id.split("/");
  return (
    <MutationItem
      style={{ background: isSelected && "rgba(24, 121, 206, 0.08)" }}
    >
      <MutationIcon image={mutation.metadata.image} />
      <MutationInfo onClick={onMutationClick}>
        <MutationTitle>
          <span className="titleMutation">{localId}</span>
        </MutationTitle>
        <MutationSublitle>
          {authorId ? `by ` + authorId : null}
        </MutationSublitle>
      </MutationInfo>
    </MutationItem>
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
