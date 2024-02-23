/**
 * This is the default widget rendered on everything.dev
 */

const accountId = context.accountId || "every.near";

// const data = JSON.parse(
//   Social.get("efiz.near/thing/routes", "final") || "null"
// );

// if (!data) {
//   return <p>Loading...</p>
// }



return (
  <Widget
    src={"every.near/widget/app"}
    props={{ data, path: "", ...props }}
  />
);


