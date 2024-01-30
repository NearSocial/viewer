const { Hero } = VM.require("buildhub.near/widget/home.hero");
const { Goals } = VM.require("buildhub.near/widget/home.goals");
const { Join } = VM.require("buildhub.near/widget/home.join");
const { Governance } = VM.require("buildhub.near/widget/home.governance");
const { CTA } = VM.require("buildhub.near/widget/home.cta");
const { Footer } = VM.require("buildhub.near/widget/home.footer");

const ownerId = "/*__@appAccount__*/";

const Root = styled.div`
  background-color: #0b0c14;
  color: #ffffff;
  font-family: Satoshi, sans-serif;

  width: 100%;
`;

const sections = ["hero", "goals", "join", "governance", "cta", "footer"];

return (
  <Root>
    <Hero />
    <Goals />
    <Join />
    <Governance />
    <CTA />
    <Footer />
  </Root>
);
