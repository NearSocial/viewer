const { Hero } = VM.require("buildhub.near/widget/home.hero") || {
  Hero: () => <></>,
};
const { Goals } = VM.require("buildhub.near/widget/home.goals") || {
  Goals: () => <></>,
};
const { Join } = VM.require("buildhub.near/widget/home.join") || {
  Join: () => <></>,
};
const { Governance } = VM.require("buildhub.near/widget/home.governance") || {
  Governance: () => <></>,
};
const { CTA } = VM.require("buildhub.near/widget/home.cta") || {
  CTA: () => <></>,
};
const { Footer } = VM.require("buildhub.near/widget/home.footer") || {
  Footer: () => <></>,
};

const Root = styled.div`
  background-color: #0b0c14;
  color: #ffffff;
  font-family: Satoshi, sans-serif;

  width: 100%;
`;

const sections = ["hero", "goals", "join", "governance", "cta", "footer"];
return (
  <Root>
    <Hero {...props}/>
    <Goals />
    <Join />
    <Governance />
    <CTA />
    <Footer />
  </Root>
);
