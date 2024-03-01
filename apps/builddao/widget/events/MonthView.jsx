const { Modal, Hashtag, Button } = VM.require(
  "buildhub.near/widget/components",
) || {
  Modal: () => <></>,
  Hashtag: () => <></>,
  Button: () => <></>,
};

const currentDate = props.currentDate || new Date();
const events = props.events || [];

const customCSS = `
  :root {
    --fc-page-bg-color: var(--bg-color, #000000);
    --fc-border-color: var(--stroke-color, rgba(255, 255, 255, 0.20));
    --fc-today-bg-color: #424451;
  }

  body {
    margin: 0;
  }

  html {
    background-color: var(--fc-page-bg-color);
    color: var(--text-color, #fff);
    font-family: sans-serif;
  }

  /* FC Header */
  .fc-col-header-cell {
    background: var(--bg-2, #23242B);
    .fc-col-header-cell-cushion {
      display: block;
      text-align: left;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 170%; /* 27.2px */
      padding: 10px;
    }
  }

  /* FC Day */
  .fc-day-today {
    .fc-daygrid-day-frame {
      background: var(--fc-today-bg-color, #424451);
    }
  }

  .fc .fc-daygrid-event-harness {
    a {
      color: var(--text-color, #fff);
    }
  }

  .fc-day-other {
    .fc-daygrid-day-frame {
      background: var(--bg-1, #000000);
    }
  }

  .fc-daygrid-day-frame {
    padding: 10px;
    background: var(--bg-2, #23242B);
  }
  .fc .fc-daygrid-day-top {
    flex-direction: row;
    .fc-daygrid-day-number {
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 170%; /* 27.2px */
    }
  }
`;

const embedCss = props.embedCss || customCSS;

const code = `
<script src='https://cdn.jsdelivr.net/npm/fullcalendar/index.global.js'></script>
<!-- iframe-resizer -->
<!-- <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.6/iframeResizer.contentWindow.js"></script> -->

<style>
  ${embedCss}
</style>

<div id="calendar"></div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: false,
      events: ${JSON.stringify(events)},
      eventClick: function(info) {
        info.jsEvent.preventDefault(); // don't let the browser navigate
        // Post the event details to the parent window
        window.parent.postMessage(JSON.stringify({ event: info.event}), '*');
      },
    });
    calendar.render();
    calendar.gotoDate(new Date(${currentDate.getTime()}));
  });
</script>
`;

const [data, setData] = useState(null);
const [showModal, setShowModal] = useState(false);

const toggleModal = () => {
  setShowModal((prev) => !prev);
};

const organizers =
  (data?.extendedProps?.organizers || []).map((it) => {
    if (it.customOption) {
      return it.organizer;
    }
    return it;
  }) ?? [];

const hashtags =
  (data?.extendedProps?.hashtags || []).map((it) => {
    if (it.customOption) {
      return it.hashtags;
    }
    return it;
  }) ?? [];

return (
  <>
    <iframe
      srcDoc={code}
      onMessage={(data) => {
        const dataObj = JSON.parse(data);
        setData(dataObj.event);
        toggleModal();
      }}
      style={{
        width: "100%",
        height: "100vh",
      }}
    />
    {data && (
      <Modal open={showModal} onOpenChange={toggleModal} title={data.title}>
        <div style={{ maxWidth: 600 }}>
          <div className="mb-3 d-flex align-items-center justify-content-between flex-wrap">
            <span>
              <i className="bi bi-calendar"></i> Start Date Time:{" "}
              {new Date(data.start).toLocaleDateString("en-us", {
                hour: "2-digit",
                minute: "numeric",
              })}
            </span>
            <span>
              <i className="bi bi-calendar"></i> End Date Time:{" "}
              {new Date(data.end).toLocaleDateString("en-us", {
                hour: "2-digit",
                minute: "numeric",
              })}
            </span>
          </div>
          {data.extendedProps.description && (
            <div className="mb-3">
              <h5>DESCRIPTION</h5>
              <p>{data.extendedProps.description}</p>
            </div>
          )}
          {organizers.length > 0 && (
            <div className="mb-3">
              <h5>ORGANIZERS</h5>
              {organizers.map((organizer) => {
                const organizerProfile = Social.getr(`${organizer}/profile`);
                return (
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
                    {organizerProfile.name ??
                      organizers[0] ??
                      "No name profile"}
                  </span>
                );
              })}
            </div>
          )}
          {hashtags.length > 0 && (
            <div className="mb-3">
              <h5>HASHTAGS</h5>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                {hashtags.map((tag) => (
                  <Hashtag key={tag}>{tag}</Hashtag>
                ))}
              </div>
            </div>
          )}
          {data.extendedProps.location && (
            <span className="d-flex align-items-center gap-1 mb-3">
              <i className="bi bi-geo-alt"></i>
              {data?.extendedProps?.location}
            </span>
          )}
        </div>
        <div>
          <Button
            noLink={true}
            href={`${data?.url}`}
            target="_blank"
            variant="primary"
          >
            Join Now
          </Button>
        </div>
      </Modal>
    )}
  </>
);
