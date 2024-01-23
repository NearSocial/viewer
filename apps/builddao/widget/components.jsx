const { Button } = VM.require("buildhub.near/widget/components.Button");
const { ProgressState } = VM.require(
  "buildhub.near/widget/components.ProgressState"
);
const { Step } = VM.require("buildhub.near/widget/components.Step");
const { InputField } = VM.require("buildhub.near/widget/components.InputField");
const { UploadField } = VM.require(
  "buildhub.near/widget/components.UploadField"
);
const { TextBox } = VM.require("buildhub.near/widget/components.TextBox");
const { TextEditor } = VM.require("buildhub.near/widget/components.TextEditor");
const { Checkbox } = VM.require("buildhub.near/widget/components.Checkbox");
const { Avatar } = VM.require("buildhub.near/widget/components.Avatar");

function Pagination({
  totalPages,
  maxVisiblePages,
  onPageClick,
  selectedPage,
}) {
  return (
    <Widget
      src="buildhub.near/widget/components.Pagination"
      props={{
        totalPages,
        maxVisiblePages,
        onPageClick,
        selectedPage,
      }}
    />
  );
}

function Post(props) {
  return (
    <Widget
      src={"buildhub.near/widget/components.Post"}
      loading={<div className="w-100" style={{ height: "200px" }} />}
      props={{ ...props }}
    />
  );
}

function User(props) {
  return (
    <Widget src="buildhub.near/widget/components.User" props={{ ...props }} />
  );
}

return {
  Button,
  Pagination,
  Post,
  ProgressState,
  Step,
  InputField,
  UploadField,
  TextBox,
  TextEditor,
  Checkbox,
  Avatar,
  User,
};
