const { Modal } = VM.require("${config_account}/widget/components") || {
  Modal: () => <></>,
};

const showModal = props.showModal;
const toggleModal = props.toggleModal;
const toggle = props.toggle;
const bootstrapTheme = props.bootstrapTheme || "dark";
const app = props.app;
const thing = props.thing;

return (
  <Modal
    open={showModal}
    title={"Create Event"}
    onOpenChange={toggleModal}
    toggle={toggle}
  >
    <Widget
      src="${config_account}/widget/components.modals.event.Form"
      loading=""
      props={{
        bootstrapTheme,
        toggleModal,
        app,
        thing,
      }}
    />
  </Modal>
);
