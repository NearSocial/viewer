const { Modal, Button, ProgressState } = VM.require("buildhub.near/widget/components") || {
  Modal: () => <></>,
  Button: () => <></>,
  ProgressState: () => <></>,
};

const bootstrapTheme = props.bootstrapTheme || "dark";

const Wrapper = styled.div`
  .btn-close {
    filter: invert(39%) sepia(45%) saturate(6660%) hue-rotate(199deg) brightness(101%) contrast(104%) !important;
  }
  .rbt-token-label {
    color: white !important;
  }
`;
const MarkdownEditor = `
  html {
    background: #23242b;
  }

  * {
    border: none !important;
  }

  .rc-md-editor {
    background: #4f5055;
    border-top: 1px solid #4f5055 !important;
    border-radius: 8px;
  }

  .editor-container {
    background: #4f5055;
  }
  
  .drop-wrap {
    
    border-radius: 0.5rem !important;
  }

  .header-list {
    display: flex;
    align-items: center;
  }

  textarea {
    background: #23242b !important;
    color: #fff !important;

    font-family: sans-serif !important;
    font-size: 1rem;

    border: 1px solid #4f5055 !important;
    border-top: 0 !important;
    border-radius: 0 0 8px 8px;
  }

  .rc-md-navigation {
    background: #23242b !important;
    border: 1px solid #4f5055 !important;
    border-top: 0 !important;
    border-bottom: 0 !important;
    border-radius: 8px 8px 0 0;
  
    i {
      color: #cdd0d5;
    }
  }

  .editor-container {
    border-radius: 0 0 8px 8px;
  }

  .rc-md-editor .editor-container .sec-md .input {
    overflow-y: auto;
    padding: 8px !important;
    line-height: normal;
    border-radius: 0 0 8px 8px;
  }
`;

const TextareaWrapper = styled.div`
  display: grid;
  vertical-align: top;
  align-items: center;
  position: relative;
  align-items: stretch;
  width: 100%;

  textarea {
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
  }

  textarea::placeholder {
    padding-top: 4px;
    font-size: 20px;
  }

  textarea:focus::placeholder {
    font-size: inherit;
    padding-top: 0px;
  }

  &::after,
  textarea,
  iframe {
    width: 100%;
    min-width: 1em;
    height: unset;
    min-height: 3em;
    font: inherit;
    margin: 0;
    resize: none;
    background: none;
    appearance: none;
    border: 0px solid #eee;
    grid-area: 1 / 1;
    overflow: hidden;
    outline: none;
  }

  iframe {
    padding: 0;
  }

  textarea:focus,
  textarea:not(:empty) {
    border-bottom: 1px solid #eee;
    min-height: 5em;
  }

  &::after {
    content: attr(data-value) " ";
    visibility: hidden;
    white-space: pre-wrap;
  }
  &.markdown-editor::after {
    padding-top: 66px;
    font-family: monospace;
    font-size: 14px;
  }
`;

const getCurrentDate = (date, time) => {
  const currentDate = date && time ? new Date(`${date}T${time}`) : new Date();

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const day = currentDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getCurrentTime = (date, time) => {
  const currentDate = date && time ? new Date(`${date}T${time}`) : new Date();

  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

const isoTime = (date, time) => {
  const temp = new Date(`${date} ${time}`);
  const now = temp.toISOString();

  return now.split("T")[1];
};

const isoDate = (date, time) => {
  const temp = new Date(`${date} ${time}`);
  const now = temp.toISOString();

  return now.split("T")[0];
};

const getWeekDay = () => {
  const currentDate = new Date();
  const options = { weekday: "long" };
  return currentDate.toLocaleDateString("en-US", options);
};

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

const UUID = {
  generate: (template) => {
    if (typeof template !== "string") {
      template = "xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx";
    }
    return template.replace(/[xy]/g, (c) => {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
};

const repeatOptions = [
  { label: "Daily", value: "daily" },
  { label: `Weekly on ${getWeekDay()}`, value: "weekly today" },
  { label: `Annually on ${getCurrentDate()}`, value: "annually today" },
  { label: "Every Weekday (Monday to Friday)", value: "weekday" },
  { label: "Custom", value: "custom" },
];

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [link, setLink] = useState("");
const [organizers, setOrganizers] = useState([context.accountId]);
const [startDate, setStartDate] = useState(getCurrentDate());
const [endDate, setEndDate] = useState(getCurrentDate());
const [startTime, setStartTime] = useState(getCurrentTime());
const [endTime, setEndTime] = useState(getCurrentTime());
const [location, setLocation] = useState("");
const [hashtags, setHashtags] = useState([]);
const [repeat, setRepeat] = useState(false);
const [customModal, setCustomModal] = useState(false);
const [customFrequency, setCustomFrequency] = useState("weekly");
const [customInterval, setCustomInterval] = useState(1);
const [customDaysOfWeek, setCustomDaysOfWeek] = useState([]);

State.init({
  image: null,
});

const app = props.app;
const thing = props.thing;
const CustomFormWrapper = styled.div`
  .cursor-pointer {
    cursor: pointer;
  }
`;

const RepeatDropDown = () => {
  return (
    <div className="d-flex gap-2">
      <select
        name="event-repeat"
        id="event-repeat"
        data-bs-theme={bootstrapTheme}
        class="form-select"
        onChange={(e) => setRepeat(e.target.value)}
        value={repeat}
      >
        <option selected value="">
          Does not repeat
        </option>
        {repeatOptions.map(({ value, label }) => (
          <option value={value}>{label}</option>
        ))}
      </select>
      {repeat === "custom" && (
        <Button onClick={() => setCustomModal(true)} variant="outline">
          Edit
        </Button>
      )}
    </div>
  );
};

const onSubmit = () => {
  const daysOfWeekMap = {
    S: 0,
    M: 1,
    T: 2,
    W: 3,
    Th: 4,
    F: 5,
    Sat: 6,
  };
  const thingId = UUID.generate(); // we could replace this with a normalized title
  // you mean just UUID();?
  // recurrence: {
  //   frequency: "weekly", // "daily", "weekly", "monthly", "yearly"
  //   interval: 1, // Repeat every interval (e.g., every 1 week)
  //   daysOfWeek: [1, 3] (1 for Monday, 2 for Tuesday, etc.)
  //   daysOfYear:[]
  // }

  let recurrence = null;
  switch (repeat) {
    case "daily":
      recurrence = {
        frequency: "daily",
      };
      break;
    case "weekly today":
      recurrence = {
        frequency: "weekly",
        interval: 1,
        daysOfWeek: [new Date().getDay()],
      };
      break;
    case "annually today":
      recurrence = {
        frequency: "yearly",
        interval: 1,
        daysOfYear: [getDayOfYear(new Date())],
      };
      break;
    case "weekday":
      recurrence = {
        frequency: "weekly",
        interval: 1,
        daysOfWeek: [1, 2, 3, 4, 5],
      };
      break;
    case "custom": {
      recurrence = {
        frequency: customFrequency,
        interval: customInterval,
        daysOfWeek: customDaysOfWeek.map((day) => daysOfWeekMap[day]),
      };
      break;
    }
  }

  Social.set(
    {
      [app]: {
        // we'll replace this with "every" or the specific app that the event should be visible in
        [thing]: {
          [thingId]: {
            "": JSON.stringify({
              title,
              description,
              url: link,
              recurrence: recurrence,
              start: `${isoDate(startDate, startTime)}T${isoTime(startDate, startTime)}`, // we'll want this be available for filtering... we may want to store it outside the JSON
              // or we need an indexing solution
              // we fetch events and then apply filters after parsing them
              end: `${isoDate(endDate, endTime)}T${isoTime(endDate, endTime)}`,
              extendedProps: {
                organizers,
                location,
                hashtags, // this can be moved to metadata.tags, but must be object with keys, e.g { [hashtag]: "" }
                // this i'll leave up to you but we need them for filtering
                cover: state.image,
              },
            }),
            metadata: {
              name: title,
              description,
              image: state.image,
              backgroundImage: state.image,
              type: "buildhub.near/type/event",
            },
          },
        },
      },
    },
    {
      onCommit: () => props.toggleModal(),
    },
  );
};

const onCoverChange = (target) => {
  State.update({ image: target });
};

useEffect(() => {
  if (repeat === "custom" && !customModal) {
    setCustomModal(true);
  }
}, [repeat]);

const CustomRepeatInputModal = () => {
  const days = ["S", "M", "T", "W", "Th", "F", "Sat"];
  const frequency = [
    { label: "days", value: "daily" },
    { label: "weeks", value: "weekly" },
    { label: "months", value: "monthly" },
    { label: "years", value: "yearly" },
  ];
  return (
    <Modal
      open={customModal}
      title={"Custom recurrence"}
      onOpenChange={(v) => {
        setCustomModal(v);
      }}
      hideCloseBtn={true}
    >
      <CustomFormWrapper>
        <div className="form-group mb-3">
          <label htmlFor="repeat-every">Repeat every</label>
          <input
            name="repeat-every"
            id="repeat-every"
            type="number"
            placeholder=""
            value={customInterval}
            onChange={(e) => setCustomInterval(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="repeat-every">Repeat every</label>
          <select
            name="custom-frequency"
            id="custom-frequency"
            data-bs-theme={bootstrapTheme}
            class="form-select"
            onChange={(e) => setCustomFrequency(e.target.value)}
            value={customFrequency}
          >
            {frequency.map(({ value, label }) => (
              <option value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="form-group mb-3">
          <label className="mb-1" htmlFor="repeat-on">
            Repeat on
          </label>
          <div className="d-flex gap-2 align-items-center">
            {days.map((item) => (
              <div
                className="cursor-pointer"
                onClick={() => {
                  if (customDaysOfWeek.includes(item)) {
                    setCustomDaysOfWeek(customDaysOfWeek.filter((i) => i !== item));
                  } else {
                    setCustomDaysOfWeek([...customDaysOfWeek, item]);
                  }
                }}
              >
                <ProgressState status={customDaysOfWeek.includes(item) ? "focused" : "default"}>{item}</ProgressState>
              </div>
            ))}
          </div>
        </div>
      </CustomFormWrapper>
    </Modal>
  );
};

return (
  <Wrapper>
    <div data-bs-theme={bootstrapTheme}>
      <CustomRepeatInputModal />
      <div className="form-group mb-3">
        <label htmlFor="title">
          Title<span className="text-danger">*</span>
        </label>
        <input
          name="title"
          id="title"
          type="text"
          placeholder="Enter event name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group mb-3">
        <label>
          Event Description<span className="text-danger">*</span>
        </label>
        <TextareaWrapper
          className="markdown-editor mb-3"
          data-value={description || ""}
          key={memoizedKey || "markdown-editor"}
        >
          <Widget
            src="mob.near/widget/MarkdownEditorIframe"
            props={{
              initialText: description,
              embedCss: props.customCSS || MarkdownEditor,
              onChange: (v) => {
                setDescription(v);
              },
            }}
          />
        </TextareaWrapper>
        <div className="form-group mb-3">
          <label htmlFor="link">
            Event Link<span className="text-danger">*</span>
          </label>
          <input
            name="link"
            id="link"
            type="text"
            placeholder="Enter link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="occurence">Occurence</label>
          <RepeatDropDown />
        </div>
        <div className="form-group mb-3 d-flex" style={{ gap: 24 }}>
          <div className="form-group flex-grow-1">
            <label htmlFor="start-date">
              Start Date<span className="text-danger">*</span>
            </label>
            <input
              id="start-date"
              name="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group flex-grow-1">
            <label htmlFor="end-date">
              End Date<span className="text-danger">*</span>
            </label>
            <input
              name="end-date"
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group mb-3 d-flex" style={{ gap: 24 }}>
          <div className="form-group flex-grow-1">
            <label htmlFor="start-time">
              Start Time<span className="text-danger">*</span>
            </label>
            <input
              name="start-time"
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="form-group flex-grow-1">
            <label htmlFor="end-time">
              End Time<span className="text-danger">*</span>
            </label>
            <input
              id="end-time"
              name="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="organizer">
            Organizers<span className="text-danger">*</span>
          </label>
          <Typeahead
            id="organizers"
            onChange={(e) => setOrganizers(e)}
            selected={organizers}
            labelKey="organizer"
            multiple
            emptyLabel="Start writing a new organizer"
            placeholder="Enter organizers"
            options={[]}
            allowNew
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="location">
            Location<span className="text-danger">*</span>
          </label>
          <input
            name="location"
            id="location"
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="form-group mb-3" data-bs-theme={bootstrapTheme}>
          <label htmlFor="hashtags">Hashtags</label>
          <Typeahead
            id="hashtags"
            onChange={(e) => setHashtags(e)}
            selected={hashtags}
            multiple
            labelKey="hashtags"
            emptyLabel="Start writing a new hashtag"
            placeholder="Enter hashtags"
            options={["build", "dao", "nft", "metaverse", "web3"]}
            allowNew
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="cover-image">Cover Image</label>
          <Widget
            src="buildhub.near/widget/components.ImageUploader"
            loading=""
            props={{ image: state.image, onChange: onCoverChange }}
          />
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <Button
          disabled={!title || !description || !link || !location || !organizers}
          variant="primary"
          onClick={onSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  </Wrapper>
);
