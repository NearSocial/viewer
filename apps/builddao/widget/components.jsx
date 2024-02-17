const { Button } = VM.require("buildhub.near/widget/components.Button");
const { ProgressState } = VM.require(
  "buildhub.near/widget/components.ProgressState",
);
const { Bullet } = VM.require("buildhub.near/widget/components.Bullet");
const { Step } = VM.require("buildhub.near/widget/components.Step");
const { InputField } = VM.require("buildhub.near/widget/components.InputField");
const { UploadField } = VM.require(
  "buildhub.near/widget/components.UploadField",
);
const { TextBox } = VM.require("buildhub.near/widget/components.TextBox");
const { TextEditor } = VM.require("buildhub.near/widget/components.TextEditor");
const { Checkbox } = VM.require("buildhub.near/widget/components.Checkbox");
const { Avatar } = VM.require("buildhub.near/widget/components.Avatar");
const { Modal } = VM.require("buildhub.near/widget/components.Modal");
const { Hashtag } = VM.require("buildhub.near/widget/components.Hashtag");

function Pagination({
  totalPages,
  maxVisiblePages,
  onPageClick,
  selectedPage,
  ThemeContainer,
}) {
  return (
    <Widget
      src="buildhub.near/widget/components.Pagination"
      props={{
        totalPages,
        maxVisiblePages,
        onPageClick,
        selectedPage,
        ThemeContainer,
      }}
    />
  );
}

function Post(props) {
  return (
    <Widget
      loading={<div className="w-100" style={{ height: "200px" }} />}
      src={"buildhub.near/widget/components.Post"}
      props={{ ...props }}
    />
  );
}

function User(props) {
  return (
    <Widget
      loading={<div style={{ widget: "3rem", height: "3rem" }} />}
      src="buildhub.near/widget/components.User"
      props={{ ...props }}
    />
  );
}

return {
  Button,
  Pagination,
  Post,
  ProgressState,
  Modal,
  Bullet,
  Step,
  Hashtag,
  InputField,
  UploadField,
  TextBox,
  TextEditor,
  Checkbox,
  Avatar,
  User,
};
