function Pagination({
  totalPages,
  maxVisiblePages,
  onPageClick,
  selectedPage,
}) {
  return (
    <Widget
      src="buildhub.near/widget/components.pagination-widget"
      props={{
        totalPages,
        maxVisiblePages,
        onPageClick,
        selectedPage,
      }}
    />
  );
}

return { Pagination };
