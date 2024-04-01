const { Modal } = VM.require("${config_account}/widget/components") || {
  Modal: () => <></>,
};

const showModal = props.showModal;
const toggleModal = props.toggleModal;
const toggle = props.toggle;
const bootstrapTheme = props.bootstrapTheme || "dark";
const filters = props.filters;
const setFilters = props.setFilters;

return (
  <Modal
    open={showModal}
    title={"Filter Events"}
    onOpenChange={toggleModal}
    toggle={toggle}
  >
    <Widget
      src="${config_account}/widget/components.modals.event.Filters"
      loading=""
      props={{
        bootstrapTheme,
        toggleModal,
        filters,
        setFilters,
      }}
    />
  </Modal>
);
