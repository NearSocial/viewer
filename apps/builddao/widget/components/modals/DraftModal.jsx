const { Button } = VM.require("buildhub.near/widget/components.Button");

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
  background: rgba(11, 12, 20, 0.5);
`;

const Content = styled.div`
  min-width: 500px;
  max-width: 1000px;
  padding: 24px;
  outline: none !important;
  background: #23242b;
  border-radius: 16px;
  color: white;

  @media screen and (max-width: 768px) {
    max-width: 90%;
    min-width: 50%;
    width: 100%;
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
  padding-bottom: 24px;
`;

const Icon = styled.i`
  font-size: 24px;
`;

function DraftModal({
  children,
  open,
  onOpenChange,
  toggle,
  toggleContainerProps,
  editButton,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <NoButton {...toggleContainerProps}>{toggle}</NoButton>
      </Dialog.Trigger>
      <Dialog.Overlay asChild>
        <Overlay>
          <Dialog.Content asChild>
            <Content>
              <div className="d-flex align-items-center justify-content-between">
                <Dialog.Trigger asChild>
                  <p className="mb-0">
                    <i className="bi bi-chevron-left"></i> Drafts
                  </p>
                </Dialog.Trigger>
                {editButton}
              </div>
              {children}
            </Content>
          </Dialog.Content>
        </Overlay>
      </Dialog.Overlay>
    </Dialog.Root>
  );
}

return { DraftModal };
