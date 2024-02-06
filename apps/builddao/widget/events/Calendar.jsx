const { Button } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
};

const StyledToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--stroke-color, rgba(255, 255, 255, 0.2));
  padding: 16px 24px;
  margin-bottom: 24px;

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
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Add Event
        </Button>
      </div>
    </StyledToolbar>
  );
};

// const events = [
//   {
//     // this object will be "parsed" into an Event Object
//     title: "The Title", // a property!
//     start: "2024-02-01", // a property!
//     end: "2024-02-06", // a property! ** see important note below about 'end' **
//   },
// ];

const CurrentView = () => {
  if (selectedView === "month") {
    return (
      <Widget
        src="buildhub.near/widget/events.MonthView"
        loading=""
        props={{
          currentDate,
          events,
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

return (
  <div className="container-xl my-3">
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
  </div>
);
