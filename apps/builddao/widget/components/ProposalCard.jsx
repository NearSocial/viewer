const {
  id,
  typeName,
  proposer,
  description,
  kind,
  status,
  totalVotesNeeded,
  totalVotes,
  submission_time,
  votes,
  expirationTime,
} = props.proposalData;
const { daoId, isAllowedToVote, handleVote, comments, proposalData } = props;
const accountId = context.accountId;

const ThemeContainer =
  props.ThemeContainer ||
  styled.div`
    --primary-bg-color: #23242b;
    --secondary-bg-color: #ffffff1a;
    --primary-border-color: #fff;
    --primary-text-color: #ffffff;
    --secondary-text-color: #b0b0b0;
    --primary-btn-bg-color: #ffaf51;
    --primary-btn-text-color: #000;
    --approve-bg-color: #82e299;
    --reject-bg-color: #c23f38;
    --spam-bg-color: #f5c518;
    --vote-button-color: #ffffff;
    --success-badge-bg-color: #38c7931a;
    --success-badge-text-color: #38c793;
    --primary-badge-bg-color: #ffaf5133;
    --primary-badge-text-color: #ffaf51;
    --info-badge-bg-color: #51b6ff33;
    --info-badge-text-color: #51b6ff;
    --danger-badge-bg-color: #fd2a5c1a;
    --danger-badge-text-color: #fd2a5c;
    --black-badge-bg-color: #ffffff1a;
    --black-badge-text-color: #fff;
  `;

function checkVotes(value) {
  return votes[accountId] === value;
}

const Wrapper = styled.div`
  margin: 16px auto;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 500px;
  width: 100%;
  border: 1px solid var(--primary-border-color);

  b {
    font-weight: 600;
  }

  .font-monospace {
    color: var(--secondary-text-color) !important;
  }

  .secondary-bg {
    background: var(--secondary-bg-color) !important;
  }

  .secondary-text {
    color: var(--secondary-text-color) !important;
  }

  a {
    background: var(--secondary-bg-color) !important;
    color: var(--primary-text-color) !important;
  }

  .social_url {
    background: var(--secondary-bg-color) !important;
  }

  .btn-primary {
    background-color: var(--primary-btn-bg-color) !important;
    color: var(--primary-btn-text-color) !important;
    border: none;
  }

  ul {
    background-color: var(--primary-bg-color);
  }

  .Approve {
    background: none !important;
    .vote {
      color: #38c793 !important;
    }
  }

  .Reject {
    background: none !important;
    .vote {
      color: #bf2c37 !important;
    }
  }

  .Remove {
    background: none !important;
    .vote {
      color: #73692d !important;
    }
  }

  .success {
    border: 1px solid var(--success-badge-bg-color) !important;
    background: var(--success-badge-bg-color) !important;
    color: var(--success-badge-text-color) !important;
  }

  .primary {
    border: 1px solid var(--primary-badge-bg-color) !important;
    background: var(--primary-badge-bg-color) !important;
    color: var(--primary-badge-text-color) !important;
  }

  .info {
    border: 1px solid var(--info-badge-bg-color) !important;
    background: var(--info-badge-bg-color) !important;
    color: var(--info-badge-text-color) !important;
  }

  .danger {
    border: 1px solid var(--danger-badge-bg-color) !important;
    background: var(--danger-badge-bg-color) !important;
    color: var(--danger-badge-text-color) !important;
  }

  .black {
    border: 1px solid var(--black-badge-bg-color) !important;
    background: var(--black-badge-bg-color) !important;
    color: var(--black-badge-text-color) !important;
  }

  .word-wrap {
    word-wrap: break-word;
  }

  ${({ status }) =>
    status === "Approved" &&
    `
    border-color: var(--approve-bg-color);
  `}

  ${({ status }) =>
    status === "In Progress" &&
    `
    border-color: #fff;
  `}

  ${({ status }) =>
    (status === "Failed" || status === "Rejected") &&
    `
    border-color: var(--reject-bg-color);
  `}

  .text-sm {
    font-size: 14px;
  }

  .counter-text {
    font-size: 14px;
    margin-right: 5px;
    border-width: 2px;
    animation-duration: 8s;
  }

  .text-center {
    text-align: center;
  }

  .info_section {
    border-right: 1px solid #dee2e6;
    padding-right: 15px;
    margin: 10px 15px 10px 0;

    &.no-border {
      border: 0;
    }

    @media (max-width: 768px) {
      border: 0;
    }
  }
`;

const cls = (c) => c.join(" ");

const YouVotedBadge = () => {
  return (
    <Widget
      src="nearui.near/widget/Element.Badge"
      props={{
        size: "sm",
        variant: "info outline mb-1",
        children: "You voted",
      }}
    />
  );
};

function renderPermission({ isAllowedToVote }) {
  return (
    <div className={"text-center p-2 rounded-pill secondary-text secondary-bg"}>
      {isAllowedToVote
        ? "You are allowed to vote on this proposal"
        : "You are not allowed to vote on this proposal"}
    </div>
  );
}

const execProposal = ({ daoId, id }) =>
  Near.call(daoId, "execute", { id }, 50000000000000);

function renderHeader({ typeName, id, status }) {
  let statusicon;
  let statustext;
  let statusvariant;

  switch (status) {
    case "Approved":
    case "Accepted":
      statusicon = "bi bi-check-circle";
      statustext = status;
      statusvariant = "success";
      break;
    case "Executed":
      statusicon = "bi bi-play-fill";
      statustext = status;
      statusvariant = "success";
      break;
    case "InProgress":
      statusicon = "spinner-border spinner-border-sm";
      statustext = "In Progress";
      statusvariant = "primary";
      break;
    case "Expired":
      statusicon = "bi bi-clock";
      statustext = status;
      statusvariant = "black";
      break;
    case "Failed":
      statusicon = "bi bi-x-circle";
      statustext = status;
      statusvariant = "black";
      break;
    case "Rejected":
      statusicon = "bi bi-ban";
      statustext = status;
      statusvariant = "danger";
      break;
  }

  return (
    <div className="card__header">
      <div className="d-flex flex-column gap-2">
        <div className="d-flex align-items-center justify-content-between">
          <h4>{typeName}</h4>
        </div>
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <Widget
            src="nearui.near/widget/Element.Badge"
            props={{
              children: `Proposal ID #${id}`,
              variant: "",
              className: "secondary-bg",
              size: "lg",
            }}
          />

          <Widget
            src="nearui.near/widget/Element.Badge"
            props={{
              children: (
                <>
                  <i
                    className={statusicon}
                    style={{
                      fontSize: "16px",
                      marginRight: "5px",
                      borderWidth: "2px",
                      animationDuration: "3s",
                    }}
                  ></i>
                  {statustext}
                </>
              ),
              variant: `${statusvariant} round`,
              size: "lg",
            }}
          />

          {status === "InProgress" &&
            parseInt(Big(expirationTime).div(1000000)) > Date.now() && (
              <Widget
                src="nearui.near/widget/Element.Badge"
                props={{
                  children: (
                    <div className="counter-text">
                      <Widget
                        src="astraplusplus.ndctools.near/widget/Common.Layout.Countdown"
                        props={{
                          timeToCheck: parseInt(
                            Big(expirationTime).div(1000000)
                          ),
                        }}
                      />
                    </div>
                  ),
                  variant: `info round`,
                  size: "lg",
                }}
              />
            )}
        </div>
      </div>
    </div>
  );
}

function renderData({
  proposer,
  description,
  submission_time,
  totalVotesNeeded,
}) {
  return (
    <div className="d-flex gap-2 flex-column">
      <div className="d-flex gap-2">
        <div className="w-50">
          <div className="mb-2">
            <b>Proposer</b>
          </div>
          <div className="secondary-text">
            <Widget
              src="mob.near/widget/Profile.ShortInlineBlock"
              props={{ accountId: proposer, tooltip: true }}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 word-wrap ">
        <b>Description</b>
        <div className="secondary-text">
          <Markdown text={description} />
        </div>
      </div>

      <Widget
        src="astraplusplus.ndctools.near/widget/Common.Modals.ProposalArguments"
        props={{ daoId, proposal: proposalData }}
      />

      <div className="d-flex flex-wrap">
        {submission_time && (
          <div className="info_section">
            <b>Submitted at</b>
            <div>
              <small className="secondary-text">
                {new Date(
                  parseInt(Big(submission_time).div(1000000))
                ).toLocaleString()}
              </small>
            </div>
          </div>
        )}

        <div className="info_section">
          <b>Expired at</b>
          <div>
            <small className="secondary-text">
              {new Date(
                parseInt(Big(expirationTime).div(1000000))
              ).toLocaleString()}
            </small>
          </div>
        </div>

        <div className="info_section no-border">
          <b>Required Votes</b>
          <div>
            <small className="secondary-text">{totalVotesNeeded}</small>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderVoteButtons({
  totalVotes,
  status,
  isAllowedToVote,
  handleVote,
}) {
  const finished = status !== "InProgress";
  const VoteButton = styled.button`
    width: 100%;
    border-radius: 15px;
    border: 1px solid transparent;
    padding: 0 20px;
    line-height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
    color: var(--vote-button-color);
    background-color: var(--secondary-bg-color);
    --vote-button-bg: var(--approve-bg-color);
    &.no {
      --vote-button-bg: var(--reject-bg-color);
    }

    &.no > div:last-child {
      transition: all 0.4s ease-in-out;
    }
    ${({ finished, percentage, disabled }) => {
      if (finished) {
        if (percentage > 80) {
          return `
        &.no > div:last-child {
          color: var(--vote-button-color) !important;
        }
      `;
        }
      } else if (!disabled) {
        return `
        &:hover.no > div:last-child {
          color: var(--vote-button-color) !important;
        } 
        `;
      }
    }}}

    &.spam {
      --vote-button-bg: var(--spam-bg-color);
    }

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-radius: 12px;
      transition: all 0.4s ease-in-out;
      z-index: 0;
      background-color: var(--vote-button-bg);
      ${({ percentage }) => `
        min-width: ${percentage && percentage > 5 ? `${percentage}%` : "5px"};
      `}
    }

    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-radius: 12px;
      transition: all 0.4s ease-in-out;
      z-index: 1;
      background-color: var(--vote-button-bg);

      min-width: ${({ percentage }) =>
        percentage && percentage > 5 ? `${percentage}%` : "5px"};

      ${({ finished, wins }) =>
        finished &&
        wins &&
        `
        display: none;
      `}
    }

    ${({ disabled }) =>
      !disabled &&
      `
    &:hover {
      &:before {
        min-width: 100%;
      }
    }
  `}

    & > div {
      z-index: 2;
    }

    & > div:last-child span {
      display: block;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.4;

      &:last-child {
        font-size: 12px;
        font-weight: 400;
      }
    }
  `;

  const getPercentage = (vote) => {
    const percentage = Math.round((vote / totalVotesNeeded) * 100);
    return percentage || 0;
  };

  const percentages = {
    yes: getPercentage(totalVotes.yes),
    no: getPercentage(totalVotes.no),
    spam: getPercentage(totalVotes.spam),
    abstain: getPercentage(totalVotes.abstain),
  };

  const wins = {
    yes: status === "Approved",
    no: status === "Rejected",
    spam: status === "Failed" || status === "Spam",
  };

  const voted = {
    yes: checkVotes("Approve"),
    no: checkVotes("Reject"),
    spam: checkVotes("Remove"),
  };

  const alreadyVoted = voted.yes || voted.no || voted.spam || voted.abstain;

  const VotePercentage = ({ vote }) => (
    <div>
      <span>
        {percentages[vote]}
        <i className="bi bi-percent"></i>
      </span>
      <span>
        {totalVotes[vote]} {totalVotes[vote] === 1 ? "Vote" : "Votes"}
      </span>
    </div>
  );

  return (
    <div
      className="d-lg-grid d-flex flex-wrap gap-2 align-items-end"
      style={{
        gridTemplateColumns: "repeat(3,1fr)",
      }}
    >
      <div className="w-100">
        {voted.yes && <YouVotedBadge />}
        <VoteButton
          className="yes"
          percentage={percentages.yes}
          finished={finished}
          wins={wins.yes}
          myVote={voted.yes}
          onClick={() => handleVote("VoteApprove")}
          disabled={alreadyVoted || finished || !isAllowedToVote[0]}
        >
          <div>
            {wins.yes && (
              <span title="Yes won">
                <i className="bi bi-check-circle"></i>
              </span>
            )}
            <span className="text-sm">Approve</span>
          </div>
          <VotePercentage vote="yes" />
        </VoteButton>
      </div>
      <div className="w-100">
        {voted.no && <YouVotedBadge />}
        <VoteButton
          className="no"
          percentage={percentages.no}
          finished={finished}
          wins={wins.no}
          myVote={voted.no}
          onClick={() => handleVote("VoteReject")}
          disabled={alreadyVoted || finished || !isAllowedToVote[1]}
        >
          <div className="d-flex gap-2 align-items-center">
            {wins.no && (
              <span title="No won">
                <i className="bi bi-check-circle"></i>
              </span>
            )}
            <span className="text-sm">Reject</span>
          </div>
          <VotePercentage vote="no" />
        </VoteButton>
      </div>

      <div className="w-100">
        {voted.spam && <YouVotedBadge />}
        <VoteButton
          className="spam"
          percentage={percentages.spam}
          finished={finished}
          wins={wins.spam}
          myVote={voted.spam}
          onClick={() => handleVote("VoteRemove")}
          disabled={alreadyVoted || finished || !isAllowedToVote[2]}
        >
          <div className="d-flex gap-2 align-items-center">
            <span>Spam</span>
          </div>
          <VotePercentage vote="spam" />
        </VoteButton>
      </div>
    </div>
  );
}

function renderFooter({ totalVotes, votes, comments, daoId, proposal }) {
  const items = [
    {
      title: "Comments",
      icon: "bi bi-chat-left-text",
      count: comments.length || 0,
      widget: "Common.Modals.Comments",
      props: {
        daoId,
        proposal,
        commentsCount: comments.length,
        item: {
          type: "dao_proposal_comment",
          path: `${daoId}/proposal/main`,
          proposal_id: proposal.id + "-beta",
        },
      },
    },
    {
      title: "Voters",
      icon: "bi bi-people",
      count: totalVotes.total,
      widget: "Common.Modals.Voters",
      props: {
        daoId,
        votes,
        totalVotes,
        proposalId: proposal.id,
        votersCount: totalVotes.total,
      },
    },
    {
      title: "Share",
      icon: "bi bi-share",
      widget: "Common.Modals.Share",
      props: {
        url: `https://near.org/buildhub.near/widget/Proposals?daoId=${daoId}&proposalId=${
          proposalData.id
        }${props.dev ? "&dev=true" : ""}`,
        text: "Explore this new proposal from our DAO! Your support and feedback are essential as we work towards a decentralized future. Review the details and join the discussion here:",
      },
    },
  ];

  if (proposal.typeName !== "Text") {
    items.push({
      title: "More details",
      icon: "bi bi-three-dots",
      widget: "Common.Modals.ProposalArguments",
      props: {
        daoId,
        proposal,
        showCard: true,
      },
    });
  }

  const renderModal = (item, index) => {
    return (
      <Widget
        src="astraplusplus.ndctools.near/widget/Layout.Modal"
        props={{
          content: (
            <Widget
              src={`astraplusplus.ndctools.near/widget/${item.widget}`}
              props={item.props}
            />
          ),
          toggle: (
            <div
              key={index}
              className={
                "d-flex gap-2 align-items-center justify-content-center user-select-none secondary-text" +
                (index !== items.length - 1 ? " border-end" : "")
              }
            >
              <i className={item.icon} style={{ color: "white" }}></i>
              {item.count && <span>{item.count}</span>}
              <span>{item.title}</span>
            </div>
          ),
          toggleContainerProps: {
            className: "flex-fill",
          },
        }}
      />
    );
  };

  return (
    <div className="d-flex gap-3 justify-content-between mt-2 border-top pt-4 flex-wrap">
      {items.map(renderModal)}
    </div>
  );
}

const voted = {
  yes: checkVotes("Approve"),
  no: checkVotes("Reject"),
  spam: checkVotes("Remove"),
  abstain: checkVotes("Abstain"),
};

const alreadyVoted = voted.yes || voted.no || voted.spam;

const canVote =
  isAllowedToVote.every((v) => v) && status === "In Progress" && !alreadyVoted;

return (
  <ThemeContainer>
    <Wrapper className="ndc-card" status={status}>
      {renderPermission({ isAllowedToVote: isAllowedToVote.every((v) => v) })}
      {renderHeader({ typeName, id, daoId, status })}
      {renderData({
        proposer,
        description,
        submission_time,
        totalVotesNeeded,
      })}
      {renderVoteButtons({
        totalVotes,
        status,
        votes,
        accountId,
        isAllowedToVote,
        handleVote: (action) => {
          return handleVote({
            action,
            proposalId: id,
            proposer,
          });
        },
      })}
      {renderFooter({
        totalVotes,
        votes,
        comments,
        daoId,
        proposal: proposalData,
      })}
    </Wrapper>
  </ThemeContainer>
);
