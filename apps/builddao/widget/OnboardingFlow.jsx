const { Modal, Button, ProgressState } = VM.require(
  "buildhub.near/widget/components"
) || {
  Modal: () => <></>,
  Button: () => <></>,
  ProgressState: () => <></>,
};

const DaoSDK = VM.require("sdks.near/widget/SDKs.Sputnik.DaoSDK");

const stepsArray = [1, 2, 3];

if (!DaoSDK) {
  return <></>;
}
const daoID = "build.sputnik-dao.near";
const sdk = DaoSDK(daoID);

const groupMembers = sdk.getMembersByGroupId({ groupId: "community" }) ?? [];

const StorageKey = {
  userCompletedOnboarding: "userCompletedOnboarding",
};

function onFollow(accountId) {
  const data = {
    graph: { follow: { [accountId]: "" } },
    index: {
      graph: JSON.stringify({
        key: "follow",
        value: {
          type,
          accountId: accountId,
        },
      }),
      notify: JSON.stringify({
        key: accountId,
        value: {
          type,
        },
      }),
    },
  };

  Social.set(data, {
    force: true,
  });
}

const PostTemplate = `👋 Hey BuildDAO community! Thrilled to join this innovative space. Looking forward to connecting with like-minded individuals. What's your favorite aspect of BuildDAO?`;

function OnboardingFlow() {
  const userCompletedOnboarding = Storage.privateGet(
    StorageKey.userCompletedOnboarding
  );
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);

  const daofollowEdge = Social.keys(
    `${context.accountId}/graph/follow/${daoID}`,
    undefined,
    {
      values_only: true,
    }
  );
  const userAlreadyFollowDao =
    daofollowEdge && Object.keys(daofollowEdge).length > 0;

  useEffect(() => {
    if (context.accountId && !userCompletedOnboarding) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [userCompletedOnboarding]);

  useEffect(() => {
    if (step > 3) {
      setShowModal(false);
      Storage.privateSet(StorageKey.userCompletedOnboarding, true);
    }
  }, [step]);

  const Wrapper = styled.div`
    .pb-4 {
      padding-bottom: 0px !important;
    }
    color: white;
    font-size: 12px;
    .text-muted {
      color: #cdd0d5 !important;
    }
    .horizontal-line {
      background-color: rgba(255, 255, 255, 0.2);
      height: 1px;
      width: 40px;
    }
  `;

  const Container = styled.div`
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);

    .fw-bold {
      color: #fff !important;
    }
  `;

  const FollowBtn = ({ isFollowing, accountId }) => {
    return (
      <Button
        disabled={isFollowing}
        variant="outline"
        onClick={() => onFollow(accountId)}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    );
  };

  const accountsNotFollowed =
    Array.isArray(groupMembers) &&
    groupMembers.filter((account) => {
      const accountfollowEdge = Social.keys(
        `${context.accountId}/graph/follow/${account}`,
        undefined,
        {
          values_only: true,
        }
      );
      if (accountfollowEdge && Object.keys(accountfollowEdge).length > 0) {
        return false;
      }
      return true;
    });

  function getRandomAccounts() {
    const shuffled = [...accountsNotFollowed].sort(() => 0.5 - Math.random());
    return shuffled;
  }

  const StepsComponent = () => {
    switch (step) {
      case 1:
        return (
          <div className="d-flex flex-column gap-2">
            <h3>Welcome!</h3>
            <div>
              <p className="text-muted">First off, follow our DAO</p>
              <Container className="d-flex justify-content-between align-items-center py-3 px-4">
                <Widget
                  src="mob.near/widget/Profile.ShortInlineBlock"
                  props={{ accountId: daoID }}
                />
                <FollowBtn
                  accountId={daoID}
                  isFollowing={userAlreadyFollowDao}
                />
              </Container>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="d-flex flex-column gap-2">
            <h3>Connect with others!</h3>
            <div className="text-muted">
              <p>
                Follow interesting profiles and stay updated with the latest
                discussions. <br />
                So far, we have {groupMembers?.length} members in the Build DAO
                community.
              </p>
              <p>People you might want to follow</p>

              {getRandomAccounts()
                .slice(0, 4)
                ?.map((account) => (
                  <Container className="d-flex justify-content-between align-items-center my-3 py-3 px-4">
                    <div style={{ maxWidth: "70%" }}>
                      <Widget
                        src="mob.near/widget/Profile.ShortInlineBlock"
                        props={{ accountId: account }}
                      />
                    </div>
                    <FollowBtn accountId={account} isFollowing={false} />
                  </Container>
                ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="d-flex flex-column gap-2">
            <h3>Make Your Mark in BuildDAO</h3>
            <div>
              <p className="text-muted">
                Exciting times! <br />
                Your application is under review.
                <br /> Show your presence in the community with your first post.
                <br />
                Need inspiration?
              </p>
              <h6>Suggested First Post</h6>
              <Widget
                loading={
                  <div
                    className="placeholder-glow h-100 w-100"
                    style={{ height: 300 }}
                  ></div>
                }
                src="buildhub.near/widget/Compose"
                props={{
                  template: PostTemplate,
                  requiredHashtags: requiredHashtags,
                  postBtnText: "Create Your First Post",
                }}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Wrapper>
      <Modal
        open={showModal}
        title={""}
        onOpenChange={() => {}}
        hideCloseBtn={true}
      >
        <div className="d-flex flex-column gap-4 justify-content-center">
          <div className="d-flex align-items-center justify-content-center">
            {stepsArray.map((item, index) => (
              <div className="d-flex align-items-center">
                <ProgressState status={item === step ? "focused" : "default"}>
                  {item}
                </ProgressState>
                {index !== stepsArray.length - 1 && (
                  <div className="horizontal-line"></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mb-4">
            <img
              src="https://ipfs.near.social/ipfs/bafkreihbwho3qfvnu4yss3eh5jrx6uxhrlzdgtdjyzyjrpa6odro6wdxya"
              width={120}
            />
          </div>
          <div style={{ width: "500px" }}>
            <StepsComponent />
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setStep(step + 1);
            }}
          >
            {step === 3 ? "Finish" : "Next"}
          </Button>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
        </div>
      </Modal>
    </Wrapper>
  );
}

return OnboardingFlow(props);
