const { Button } = VM.require("buildhub.near/widget/components.Button") || {
  Button: () => <></>,
};

const toggle = props.toggle ?? <Button variant="primary">Open Modal</Button>;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  overflow-y: auto;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background: var(--modal-overlay-color, rgba(11, 12, 20, 0.5));
`;

const Content = styled.div`
  min-width: 500px;
  max-width: 1000px;
  padding: 24px;
  outline: none !important;
  background: var(--modal-background-color, #23242b);
  border-radius: 16px;
  color: var(--modal-text-color, #fff);

  @media screen and (max-width: 768px) {
    width: 80%;
    max-width: 100%;
    min-width: 0;
  }
`;

const NoButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  box-shadow: none;
`;

const CloseContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const Icon = styled.i`
  font-size: 24px;
`;

function Modal({
  children,
  title,
  open,
  onOpenChange,
  toggle,
  toggleContainerProps,
  key,
  hideCloseBtn
}) {
  return (
    <Dialog.Root key={key} open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <NoButton {...toggleContainerProps}>{toggle}</NoButton>
      </Dialog.Trigger>
      <Dialog.Overlay asChild>
        <Overlay key={`Overlay-${key}`}>
          <Dialog.Content asChild>
            <Content>
              <div className="d-flex align-items-center justify-content-between pb-4">
                <h5 className="w-100">{title}</h5>
                {!hideCloseBtn && (
                  <Dialog.Trigger asChild>
                    <CloseContainer>
                      <Button variant="outline" type="icon">
                        <Icon className="bi bi-x" />
                      </Button>
                    </CloseContainer>
                  </Dialog.Trigger>
                )}
              </div>
              {children}
            </Content>
          </Dialog.Content>
        </Overlay>
      </Dialog.Overlay>
    </Dialog.Root>
  );
}

return { Modal };
