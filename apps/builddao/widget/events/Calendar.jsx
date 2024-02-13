const { Button } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
};

const { fetchThings } = VM.require(
  "buildhub.near/widget/lib.everything-sdk"
) || {
  fetchThings: () => {},
};

const StyledToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--stroke-color, rgba(255, 255, 255, 0.2));
  padding: 16px 24px;
  margin-bottom: 24px;

  background: var(--bg-1, #0b0c14);

  color: var(--text-color, #fff);
  font-size: 18px;

  .section {
    display: flex;
    align-items: center;
    flex-basis: 0;
    flex-grow: 1;
  }

  .date-changer {
    all: unset;
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

// implement event fetching and filtering

const [selectedView, setSelectedView] = useState("month");
const [currentDate, setCurrentDate] = useState(new Date());

const [showCreateModal, setShowCreateModal] = useState(false);
const toggleCreateModal = () => setShowCreateModal(!showCreateModal);

const [showFilterModal, setShowFilterModal] = useState(false);
const toggleFilterModal = () => setShowFilterModal(!showFilterModal);

const [filters, setFilters] = useState({});

const dateString = currentDate.toLocaleString("en-us", {
  month: "long",
  year: "numeric",
});

const handleMonthChange = (change) => {
  const date = currentDate;
  date.setMonth(date.getMonth() + change);
  setCurrentDate(date);
};

const Toolbar = () => {
  return (
    <StyledToolbar>
      <div className="section gap-3">
        <span>{dateString}</span>
        <button className="date-changer" onClick={() => handleMonthChange(-1)}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <button className="date-changer" onClick={() => handleMonthChange(1)}>
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
      <div className="section gap-1 justify-content-center">
        <Button
          variant={selectedView === "month" ? "secondary" : "outline"}
          onClick={() => setSelectedView("month")}
        >
          Month
        </Button>
        <Button
          variant={selectedView === "list" ? "secondary" : "outline"}
          onClick={() => setSelectedView("list")}
        >
          List
        </Button>
      </div>
      <div className="section justify-content-end" style={{ gap: 10 }}>
        <Button variant="outline" onClick={() => setShowFilterModal(true)}>
          Filter By
        </Button>
        {context.accountId && (
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            Add Event
          </Button>
        )}
      </div>
    </StyledToolbar>
  );
};

const events = fetchThings("every", "event");

const filterEvents = () => {
  let filteredEvents = events;

  // handle date from filter
  if (filters.from) {
    filteredEvents = filteredEvents.filter((event) => {
      return new Date(event.start) >= new Date(filters.from);
    });
  }

  // handle date to filter
  if (filters.to) {
    filteredEvents = filteredEvents.filter((event) => {
      return new Date(event.start) <= new Date(filters.to);
    });
  }

  // handle cleared filters
  if (filters == {}) {
    return filteredEvents;
  }

  // handle title filter
  if (filters.title) {
    filteredEvents = filteredEvents.filter((event) => {
      return event.title.toLowerCase().includes(filters.title.toLowerCase());
    });
  }

  // handle location filter
  if (filters.location) {
    filteredEvents = filteredEvents.filter((event) => {
      return event?.extendedProps?.location
        .toLowerCase()
        .includes(filters.location.toLowerCase());
    });
  }

  // handle organizer filter
  if (filters.organizers.length) {
    const organizers =
      filters.organizers.map((it) => {
        if (it.customOption) {
          return it.organizers;
        }
        return it;
      }) ?? [];

    filteredEvents = filteredEvents.filter((event) => {
      const eventOrganizers = event?.extendedProps?.organizers.map((it) => {
        if (it.customOption) {
          return it.organizer;
        }
        return it;
      });
      return eventOrganizers.some((it) => organizers.includes(it));
    });
  }

  // handle tag filter
  if (filters.tags.length) {
    const tags =
      filters.tags.map((it) => {
        if (it.customOption) {
          return it.tags;
        }
        return it;
      }) ?? [];

    filteredEvents = filteredEvents.filter((event) => {
      const eventTags = event?.extendedProps?.hashtags.map((it) => {
        if (it.customOption) {
          return it.hashtags;
        }
        return it;
      });
      return eventTags.some((it) => tags.includes(it));
    });
  }

  return filteredEvents;
};

events = filterEvents();

const CurrentView = () => {
  if (selectedView === "month") {
    return (
      <Widget
        src="buildhub.near/widget/events.MonthView"
        loading=""
        props={{
          currentDate,
          events,
          setSelectedView,
        }}
      />
    );
  }

  return (
    <Widget
      src="buildhub.near/widget/events.ListView"
      loading=""
      props={{
        currentDate,
        events,
      }}
    />
  );
};

const Container = styled.div`
  background: var(--bg-1, #0b0c14);
`;

return (
  <Container>
    <Widget
      src="buildhub.near/widget/components.modals.CreateEvent"
      loading=""
      props={{
        showModal: showCreateModal,
        toggleModal: toggleCreateModal,
      }}
    />
    <Widget
      src="buildhub.near/widget/components.modals.FilterEvents"
      loading=""
      props={{
        showModal: showFilterModal,
        toggleModal: toggleFilterModal,
        filters: filters,
        setFilters: setFilters,
      }}
    />
    <Toolbar />
    <CurrentView />
  </Container>
);
