const currentDate = props.currentDate || new Date();
const events = props.events || [];

const customCSS = `
  :root {
    --fc-page-bg-color: var(--bg-color, #0b0c14);
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

  .fc-day-other {
    .fc-daygrid-day-frame {
      background: var(--bg-1, #0b0c14);
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
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.6/iframeResizer.contentWindow.js"></script>

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
    });
    calendar.render();
    calendar.gotoDate(new Date(${currentDate.getTime()}));
  });
</script>
`;

return <iframe iframeResizer srcDoc={code} />;
