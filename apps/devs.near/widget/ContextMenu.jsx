const Wrapper = styled.div`
  padding: 6px;
  min-width: 200px;
  width: 200px;
  border-radius: 6px;
  box-shadow: 0 3px 15px -3px rgba(13, 20, 33, 0.13);
  display: flex;
  flex-direction: column;
  border: 1px solid #e8e8eb;
  background-color: #fff;
  gap: 1px;

  .menu__item {
    padding: 3px;
    display: flex;
    color: #000;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background-color: #eff2f5;
    }
  }
  .menu__item__icon {
    font-size: 14px;
    border-radius: 5px;
    box-shadow: 0 0 0 1px rgba(201, 201, 204, 0.48);
    background: #fff;
    color: #000;
    height: 26px;
    width: 26px;
    display: flex;
    margin-right: 10px;
    justify-content: center;
    align-items: center;
  }
`;

function ContextMenu({ Item, passProps, handlers, items }) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div style={{ width: "100%" }}>
          <Item />
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content sideOffset={5} align="end" asChild>
        <Wrapper>
          {handlers &&
            Object.keys(handlers).map((key) => {
              return (
                <ContextMenu.Item
                  className="menu__item"
                  onSelect={() => handlers[key](passProps[key])}
                >
                  {items[key]()}
                </ContextMenu.Item>
              );
            })}
        </Wrapper>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

return { ContextMenu };