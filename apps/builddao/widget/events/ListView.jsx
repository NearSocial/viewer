const { Button, Hashtag } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
  Hashtag: () => <></>,
};

const events = props.events ?? [];
const currentDate = props.currentDate;

if (!events || !currentDate) {
  return "";
}

const currentMonthEvents = events.filter((event) => {
  const eventStartDate = new Date(event.start);
  const eventEndDate = new Date(event.end);
  if (event.recurrence) {
    const frequency = event.recurrence.frequency;
    switch (frequency) {
      case "daily":
      case "weekly":
      case "yearly":
      case "monthly":
        return eventStartDate.getMonth() <= currentDate.getMonth() && eventEndDate.getMonth() >= currentDate.getMonth();
      default:
        return eventStartDate.getMonth() === currentDate.getMonth();
    }
  } else {
    return eventStartDate.getMonth() === currentDate.getMonth();
  }
});

function getTimeStamp(date) {
  return new Date(date).getTime();
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDate(date) {
  return new Date(parseInt(date))
    .toLocaleDateString("en-us", {
      day: "numeric",
      month: "short",
    })
    .split(" ")
    .reverse()
    .join(" ");
}

function scheduleEventsWeekly(result, year, month, event, interval, daysOfWeek) {
  const daysInMonth = getDaysInMonth(year, month);
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    // Check if the current day falls on one of the specified days of the week
    if (!daysOfWeek || daysOfWeek.includes(currentDate.getDay())) {
      const formattedDate = getTimeStamp(currentDate);
      result[formattedDate] = result[formattedDate] || [];
      result[formattedDate].push(event);
    }

    if (day % 7 === 0 && interval > 1) {
      day += interval * 7 - 1;
    }
  }
  return result;
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

const categorizedEvents = currentMonthEvents.reduce((result, event) => {
  const eventTimestamp = getTimeStamp(event.start); // Format date as a string
  if (event.recurrence) {
    const frequency = event.recurrence.frequency;
    const interval = event.recurrence.interval;
    const daysOfWeek = event.recurrence.daysOfWeek;
    const daysOfYear = event.recurrence.daysOfYear;
    const currentYear = new Date(currentDate).getFullYear();
    const currentMonth = new Date(currentDate).getMonth();
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    switch (frequency) {
      case "daily": {
        for (let day = 1; day <= daysInMonth; day++) {
          const formattedDate = getTimeStamp(new Date(currentYear, currentMonth, day));
          result[formattedDate] = result[formattedDate] || [];
          result[formattedDate].push(event);
        }
        break;
      }
      case "weekly": {
        result = scheduleEventsWeekly(result, currentYear, currentMonth, event, interval, daysOfWeek);
        break;
      }
      case "yearly":
      case "monthly": {
        const eventMonth = new Date(event.start).getMonth();
        if (eventMonth === currentMonth) {
          const dateTimeStamp = getTimeStamp(
            new Date(currentDate.getFullYear(), eventMonth + 1, new Date(event.start).getDate()),
          );
          if (
            (daysOfWeek && daysOfWeek.includes(currentDate.getDay())) ||
            (daysOfYear && daysOfYear.includes(getDayOfYear(currentDate))) ||
            (!daysOfWeek && !daysOfYear)
          ) {
            result[dateTimeStamp] = result[dateTimeStamp] || [];
            result[dateTimeStamp].push(event);
          }
        }
        break;
      }
    }
  } else {
    result[eventTimestamp] = result[eventTimestamp] || [];
    result[eventTimestamp].push(event);
  }
  return result;
}, {});

const EventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StyledEvent = styled.div`
  border-radius: 16px;
  background: #23242b;
  display: flex;
  padding: 24px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 24px;

  color: var(--font-color, #fff);

  h4,
  p {
    margin: 0;
  }

  h4 {
    /* H4/Large */
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 160%; /* 28.8px */
  }

  p {
    /* Body/16px */
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 170%; /* 27.2px */
  }

  .cover-image {
    img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 8px;
    }
  }
`;

const formatStartTime = (time) => {
  const date = new Date(time);
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  };

  return date.toLocaleString("en-US", options);
};

const dateKeys = Object.keys(categorizedEvents);

const today = new Date().getTime();

const futureEvents =
  dateKeys.filter((date) => {
    return categorizedEvents[date].some((event) => {
      return date >= today;
    });
  }) || [];

const pastEvents = dateKeys.filter((date) => !futureEvents.includes(date)) || [];

const sortEvents = (events) => {
  return events.sort((a, b) => parseInt(a) - parseInt(b));
};

futureEvents.sort();
pastEvents.sort();

const EventGroup = ({ date }) => {
  const Container = styled.div`
    display: flex;
    flex-direction: row;
    gap: 32px;

    @media screen and (max-width: 768px) {
      flex-direction: column;
      gap: 24px;
    }
  `;

  return (
    <Container>
      <h3 className="flex-shrink-0 text-white" style={{ minWidth: 65 }}>
        <div className="d-flex gap-2 align-items-center">
          {formatDate(date)
            .split(" ")
            .map((it, i) => (
              <span
                style={{
                  fontSize: i === 0 ? "24px" : "16px",
                  color: i === 0 ? "var(--text-color, #fff)" : "var(--white-50, #CDD0D5)",
                }}
              >
                {it}
              </span>
            ))}
        </div>
      </h3>
      <div className="w-100 d-flex flex-column gap-3">
        {Array.isArray(categorizedEvents?.[date]) &&
          categorizedEvents[date].map((event, i) => {
            const hashtags = Array.isArray(event?.extendedProps?.hashtags)
              ? event?.extendedProps?.hashtags.map((it) => {
                  if (it.customOption) {
                    return it.hashtags;
                  }
                  return it;
                })
              : [];
            const organizers = Array.isArray(event?.extendedProps?.organizers)
              ? event?.extendedProps?.organizers.map((it) => {
                  if (it.customOption) {
                    return it.organizer;
                  }
                  return it;
                })
              : [];

            const organizer = organizers[0];
            const organizerProfile = Social.getr(`${organizer}/profile`);

            const startTime = formatStartTime(event.start);

            const eventAuthor = (event?.key ?? "")?.split("/")[0] ?? "";
            const eventApp = (event?.key ?? "")?.split("/")[1] ?? "";
            const eventType = (event?.key ?? "")?.split("/")[2] ?? "";
            const eventKey = (event?.key ?? "")?.split("/")[3] ?? "";

            const handleDelete = () => {
              Social.set({
                [eventApp]: {
                  [eventType]: {
                    [eventKey]: {
                      "": null,
                    },
                  },
                },
              });
            };

            return (
              <StyledEvent key={`event-${i}`}>
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {hashtags.map((tag) => (
                      <Hashtag key={tag}>{tag}</Hashtag>
                    ))}
                  </div>
                  <span>{startTime}</span>
                </div>
                <div className="d-flex gap-3">
                  <div className="cover-image">
                    <Widget
                      src="mob.near/widget/Image"
                      props={{
                        image: event.extendedProps.cover,
                        fallbackUrl:
                          "https://ipfs.near.social/ipfs/bafkreibas66y6ewop5ix2n6mgybpjz6epg7opqvcplmm5jw4jlhdik5nhe",
                      }}
                    />
                  </div>
                  <div>
                    <h4>{event.title}</h4>
                    <Markdown text={event.description} />
                  </div>
                </div>
                <div className="d-flex align-items-center flex-wrap gap-3">
                  <span className="d-flex align-items-center gap-1">
                    <Widget
                      src="mob.near/widget/Image"
                      loading=""
                      props={{
                        image: organizerProfile.image,
                        fallbackUrl:
                          "https://ipfs.near.social/ipfs/bafkreibas66y6ewop5ix2n6mgybpjz6epg7opqvcplmm5jw4jlhdik5nhe",
                        style: {
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          objectFit: "cover",
                        },
                      }}
                    />
                    {organizerProfile.name ?? organizers[0] ?? "No name profile"}
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <i className="bi bi-geo-alt"></i>
                    {event?.extendedProps?.location}
                  </span>

                  <span className="d-flex align-items-center gap-1">
                    <i className="bi bi-calendar"></i>
                    Last Date:{" "}
                    {new Date(event.end).toLocaleString("en-us", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <Button noLink={true} href={`${event?.url}`} target="_blank" variant="primary">
                    Join Now
                  </Button>
                  {eventAuthor === context.accountId && (
                    <Button onClick={handleDelete} style={{ background: "#ff2b2b" }} variant="primary">
                      Delete Event
                    </Button>
                  )}
                </div>
              </StyledEvent>
            );
          })}
      </div>
    </Container>
  );
};

const PastEvents = () => {
  return (
    <>
      {!pastEvents.length && <p className="text-white">No past events this month.</p>}
      {pastEvents.map((date, i) => (
        <EventGroup date={date} />
      ))}
    </>
  );
};

const [showPastEvents, setShowPastEvents] = useState(false);

return (
  <EventsContainer>
    <Button onClick={() => setShowPastEvents((prev) => !prev)}>{showPastEvents ? "Hide" : "Show"} Past Events</Button>
    {showPastEvents && <PastEvents />}
    {!futureEvents.length && <p className="text-white">No upcoming events this month</p>}
    {futureEvents.map((date, i) => (
      <EventGroup date={date} />
    ))}
  </EventsContainer>
);
