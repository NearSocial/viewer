const { Button, Avatar } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
  Avatar: () => <></>,
};
const [loading, setLoading] = useState(false);
const [btnText, setBtnText] = useState("Create Trial Account");

// const TaglineSmall = styled.h2`
//     max-width: 700px;

//     text-align: center;
//     font-size: 1.1rem;
//     font-style: normal;
//     font-weight: 400;
//     line-height: 130%; /* 57.6px */
//     margin: 0;

//     text-wrap: balance;

//     span.muted {
//         color: rgba(255, 255, 255, 0.7);
//     }

//     @media screen and (max-width: 768px) {
//         font-size: 1rem;
//     }
// `;

const Container = styled.div`
  background-color: #0b0c14;
  color: #fff;
  height: 100%;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    max-height: 100vh;
    object-fit: cover;
    object-position: center top;
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translateX(-50%);
  }

  .card {
    z-index: 5;
    background: transparent;
    display: flex;
    max-width: 500px;
    width: 100%;
    max-height: 550px;
    padding: 80px 24px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;

    img {
      width: auto;
      height: 54px;
      object-fit: cover;
    }

    h1 {
      color: var(--white-100, #fff);
      text-align: center;

      /* H1/small */
      font-size: 2rem;
      font-style: normal;
      font-weight: 500;
      line-height: 100%; /* 32px */
    }

    button {
      all: unset;
      cursor: pointer;
      display: flex;
      padding: 16px 20px;
      justify-content: center;
      align-items: center;
      gap: 4px;
      align-self: stretch;

      border-radius: 8px;
      background: #ffaf51;

      &:hover:not(:disabled) {
        background: #e49b48;
        text-decoration: none;
      }

      color: var(--black-100, #000);

      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }
`;

const { networkId, accountId } = context;
// Check if the network is testnet
const isTestnet = networkId === "testnet";

const { currentGateway } = props;
return (
  <Container>
    <>
      {currentGateway && !isTestnet && accountId === null ? (
        <>
          <div className="card">
            <img src="https://ipfs.near.social/ipfs/bafkreihbwho3qfvnu4yss3eh5jrx6uxhrlzdgtdjyzyjrpa6odro6wdxya" />
            <h1>
              Try out the builders gateway with a trial account. <br />
              No crypto, no passphrase required.
            </h1>
            <TrialAccountGenerator
              trigger={({ getTrialAccount }) => (
                <Button
                  variant="primary"
                  disabled={loading}
                  loading={loading}
                  onClick={() => {
                    setLoading(true);
                    setBtnText("Creating your account...");
                    getTrialAccount()
                      .then((res) => {
                        console.log(res);
                        setLoading(false);
                      })
                      .catch((error) => {
                        setLoading(false);
                        setBtnText(
                          "Trial account claim empty now. They will be available again soon. Please try later...",
                        );
                      });
                  }}
                >
                  {btnText}
                </Button>
              )}
            />
          </div>
          <img src="https://ipfs.near.social/ipfs/bafybeibqnkvafyflci4iap73prugmjw4wlwmrazbiudvnsyr34yzmk75i4" />
        </>
      ) : null}
    </>
  </Container>
);
