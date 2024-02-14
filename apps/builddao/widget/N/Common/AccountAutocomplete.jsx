if (!context.accountId || !props.term) return <></>;

let results = [];
const profilesData = Social.get("*/profile/name", "final") || {};
const followingData = Social.get(
  `${context.accountId}/graph/follow/**`,
  "final"
);

if (!profilesData || !followingData) return <></>;

const profiles = Object.entries(profilesData);
const term = (props.term || "").replace(/\W/g, "").toLowerCase();
const limit = 5;

for (let i = 0; i < profiles.length; i++) {
  let score = 0;
  const accountId = profiles[i][0];
  const accountIdSearch = profiles[i][0].replace(/\W/g, "").toLowerCase();
  const nameSearch = (profiles[i][1]?.profile?.name || "")
    .replace(/\W/g, "")
    .toLowerCase();
  const accountIdSearchIndex = accountIdSearch.indexOf(term);
  const nameSearchIndex = nameSearch.indexOf(term);

  if (accountIdSearchIndex > -1 || nameSearchIndex > -1) {
    score += 10;

    if (accountIdSearchIndex === 0) {
      score += 10;
    }
    if (nameSearchIndex === 0) {
      score += 10;
    }
    if (followingData[accountId] === "") {
      score += 30;
    }

    results.push({
      accountId,
      score,
    });
  }
}

results.sort((a, b) => b.score - a.score);
results = results.slice(0, limit);

function onResultClick(id) {
  props.onSelect && props.onSelect(id);
}

const Wrapper = styled.div`
  position: relative;

  &::before {
    content: "";
    display: block;
    position: absolute;
    right: 0;
    width: 6px;
    height: 100%;
    background: linear-gradient(to left, rgb(55, 55, 55), rgba(55, 55, 55, 0));
    z-index: 10;
  }
`;

const Scroller = styled.div`
  position: relative;
  display: flex;
  padding: 6px;
  gap: 6px;
  overflow: auto;
  scroll-behavior: smooth;
  align-items: center;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    max-width: 200px;
    text-align: left;
    flex-grow: 0;
    flex-shrink: 0;

    button {
      border: 1px solid #eceef0;
      background: #fff !important;
      border-radius: 6px;
      padding: 3px 6px;
      transition: all 200ms;

      &:focus,
      &:hover {
        border-color: #687076;
      }
    }
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  display: block;
  padding: 12px;
  color: #687076;
  transition: all 200ms;

  &:hover {
    color: #000;
  }
`;

if (results.length === 0) return <></>;

return (
  <Wrapper>
    <Scroller>
      <CloseButton tabIndex={-1} type="button" onClick={props.onClose}>
        <i className="bi bi-x-circle" />
      </CloseButton>

      {results.map((result) => {
        return (
          <button
            className="border-0 btn btn-dark"
            key={result.accountId}
            onClick={() => onResultClick(result.accountId)}
          >
            <Widget
              key={result.accountId}
              src="mob.near/widget/Profile.ShortInlineBlock"
              props={{
                accountId: result.accountId,
              }}
            />
          </button>
        );
      })}
    </Scroller>
  </Wrapper>
);
