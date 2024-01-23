return {
  "type": "app",
  "routes": {
    "home": {
      "path": "buildhub.near/widget/page.home",
      "blockHeight": "final",
      "init": {
        "name": "Home",
        "icon": "bi bi-house"
      }
    },
    "feed": {
      "path": "buildhub.near/widget/page.feed",
      "blockHeight": "final",
      "init": {
        "icon": "bi bi-globe"
      }
    },
    "inspect": {
      "path": "mob.near/widget/WidgetSource",
      "blockHeight": "final",
      "hide": true
    },
    "notifications": {
      "path": "mob.near/widget/NotificationFeed",
      "blockHeight": "final",
      "hide": true
    }
  },
  "theme": "background-color: white;"
}
;