const { Button } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
};

const bootstrapTheme = props.bootstrapTheme || "dark";

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

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [link, setLink] = useState("");
const [organizers, setOrganizers] = useState([]);
const [startDate, setStartDate] = useState(getCurrentDate());
const [endDate, setEndDate] = useState(getCurrentDate());
const [startTime, setStartTime] = useState(getCurrentTime());
const [endTime, setEndTime] = useState(getCurrentTime());
const [location, setLocation] = useState("");
const [hashtags, setHashtags] = useState([]);

State.init({
  image: null,
});

const onCoverChange = (target) => {
  State.update({ image: target });
};

return (
  <div data-bs-theme={bootstrapTheme}>
    <div className="form-group mb-3">
      <label>Title</label>
      <input
        type="text"
        placeholder="Enter event name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
    <div className="form-group mb-3">
      <label>Event Description</label>
      <TextareaWrapper
        className="markdown-editor mb-3"
        data-value={description || ""}
        key={memoizedKey}
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
        <label>Event Link</label>
        <input
          type="text"
          placeholder="Enter link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>
      <div className="form-group mb-3 d-flex" style={{ gap: 24 }}>
        <div className="form-group flex-grow-1">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group flex-grow-1">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="form-group mb-3 d-flex" style={{ gap: 24 }}>
        <div className="form-group flex-grow-1">
          <label>Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="form-group flex-grow-1">
          <label>End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>
      <div className="form-group mb-3">
        <label>Organizers</label>
        <Typeahead
          id="organizers"
          onChange={(e) => setOrganizers(e)}
          selected={organizers}
          multiple
          placeholder="Enter organizers"
          options={[]}
          allowNew
        />
      </div>
      <div className="form-group mb-3">
        <label>Location</label>
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="form-group mb-3">
        <label>Hashtags</label>
        <Typeahead
          id="hashtags"
          onChange={(e) => setHashtags(e)}
          selected={hashtags}
          multiple
          placeholder="Enter hashtags"
          options={["build", "dao", "nft", "metaverse", "web3"]}
          allowNew
        />
      </div>
      <div className="form-group mb-3">
        <label>Cover Image</label>
        <Widget
          src="buildhub.near/widget/components.ImageEditorTabs"
          loading=""
          props={{ image: state.image, onChange: onCoverChange }}
        />
      </div>
    </div>
    <div className="d-flex justify-content-end">
      <Button
        variant="primary"
        onClick={() => {
          Social.set(
            {
              event: {
                title,
                description,
                url: link,
                start: `${isoDate(startDate, startTime)}T${isoTime(
                  startDate,
                  startTime
                )}`,
                end: `${isoDate(endDate, endTime)}T${isoTime(
                  endDate,
                  endTime
                )}`,
                extendedProps: {
                  organizers,
                  location,
                  hashtags,
                  cover: state.image,
                },
              },
            },
            {
              onCommit: () => props.toggleModal(),
            }
          );
        }}
      >
        Submit
      </Button>
    </div>
  </div>
);
