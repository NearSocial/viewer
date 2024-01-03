const LoginContainer = styled.div`
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
      border: 1px solid var(--white-100, #fff);
      background: #fff;

      &:hover {
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

const LoginView = () => {
  return (
    <LoginContainer>
      <div className="card">
        <img src="https://ipfs.near.social/ipfs/bafkreihbwho3qfvnu4yss3eh5jrx6uxhrlzdgtdjyzyjrpa6odro6wdxya" />
        <h1>
          Designed to connect and empower builders in a multi-chain ecosystem
        </h1>
        <button onClick={props.requestSignIn}>Login</button>
      </div>
      <img src="https://ipfs.near.social/ipfs/bafybeibqnkvafyflci4iap73prugmjw4wlwmrazbiudvnsyr34yzmk75i4" />
    </LoginContainer>
  );
};

return <LoginView />;
