const { Footer } = VM.require("${config_account}/widget/home.Home") || {
  Footer: () => <></>,
};

return (
  <div className="container-xl mt-md-3">
    <Widget src="${config_account}/widget/components.Library" />
    <Footer noBanner />
  </div>
);
