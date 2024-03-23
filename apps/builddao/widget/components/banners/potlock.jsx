const InfoBanner = styled.div`
  background: var(--4-a-21-a-5, #4a21a5);
  display: flex;
  width: 100%;
  padding: 8px 20px;
  justify-content: center;
  align-items: center;
  gap: 16px;

  h3 {
    color: var(--ffffff, #fff);
    font-family: "Mona Sans", "Poppins", "InterVariable", sans-serif;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 120% */
    text-transform: uppercase;
    margin: 0;
  }

  p {
    color: var(--ffffff, #fff);
    font-family: "Mona Sans", "Poppins", "InterVariable", sans-serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 171.429% */
    margin: 0;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 0;
    justify-content: center;
    align-items: center;

    h3 {
      font-size: 12px;
      margin-bottom: -6px;
    }

    p {
      font-size: 10px;
    }
  }
`;

const CounterBanner = styled.div`
  background: var(--eca-227, #eca227);
  display: flex;
  width: 100%;
  height: 56px;
  justify-content: center;
  align-items: center;
  gap: 32px;

  h3 {
    color: var(--23242-b, #23242b);
    font-family: "Mona Sans", "Poppins", "InterVariable", sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 19.2px */
    letter-spacing: 2.56px;
    text-transform: uppercase;
    margin: 0;
  }

  p {
    color: var(--4-a-21-a-5, #4a21a5);
    text-align: center;
    font-family: "Mona Sans", "Poppins", "InterVariable", sans-serif;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: 100%; /* 32px */
    margin: 0;

    span {
      color: var(--23242-b, #23242b);
      font-size: 24px;
      font-weight: 500;
      line-height: 120%; /* 28.8px */
    }
  }

  @media screen and (max-width: 768px) {
    h3 {
      font-size: 12px;
    }

    p {
      font-size: 20px;
      span {
        font-size: 12px;
      }
    }
  }
`;

function getRemainingTimeAsString(targetDate) {
  // Get the current date and time
  let now = new Date();

  // Calculate the difference in milliseconds between now and the target date
  let difference = targetDate - now;

  // Calculate days, hours, minutes, and seconds
  let days = Math.floor(difference / (1000 * 60 * 60 * 24));
  let hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((difference % (1000 * 60)) / 1000);

  // Construct the string
  let remainingTime = "";

  if (seconds < 0) {
    return "0 0 0 0";
  }

  if (days >= 0) {
    remainingTime += days + " ";
  }
  if (hours >= 0) {
    remainingTime += hours + " ";
  }
  if (minutes >= 0) {
    remainingTime += minutes + " ";
  }
  remainingTime += seconds;

  return remainingTime;
}

// Apr 8 2024 8:59am
const lastDay = new Date("2024-04-08:8:59:59");
const [remainingTime, setRemainingTime] = useState(
  getRemainingTimeAsString(lastDay),
);

useEffect(() => {
  if (remainingTime != "0 0 0 0") {
    setTimeout(() => {
      setRemainingTime(getRemainingTimeAsString(lastDay));
    }, 1000);
  }
}, [remainingTime]);

return (
  <div>
    <InfoBanner>
      <h3>Join NEAR Retroactive Builders</h3>
      <p>Donate to matching rounds to get your contributions amplified</p>
    </InfoBanner>
    <CounterBanner>
      <h3>donate ends</h3>
      <div className="d-flex gap-3">
        {remainingTime === "0 0 0 0" ? (
          <p>Completed</p>
        ) : (
          remainingTime.split(" ").map((it, i) => (
            <p>
              {it}{" "}
              <span>{i === 0 ? "D" : i === 1 ? "H" : i === 2 ? "M" : "S"}</span>
            </p>
          ))
        )}
      </div>
    </CounterBanner>
  </div>
);
