const { Footer } = VM.require("buildhub.near/widget/home.Home") || {
  Footer: () => <></>,
};

return (
  <div className="container-xl mt-md-3">
    <Widget src="buildhub.near/widget/components.Library" />
    <Footer noBanner />
  </div>
);
