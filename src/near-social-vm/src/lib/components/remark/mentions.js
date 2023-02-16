import { findAndReplace } from "mdast-util-find-and-replace";

const mentionRegex =
  /@((?:(?:[a-z\d]+[-_])*[a-z\d]+\.)*(?:[a-z\d]+[-_])*[a-z\d]+)/gi;

export default function mentions() {
  function replace(value, username, match) {
    if (
      /[\w`]/.test(match.input.charAt(match.index - 1)) ||
      /[/\w`]/.test(match.input.charAt(match.index + value.length)) ||
      username.length < 2 ||
      username.length > 64
    ) {
      return false;
    }

    let node = { type: "text", value };
    node = {
      type: "strong",
      children: [node],
      data: {
        hProperties: { accountId: username },
      },
    };

    return node;
  }

  function transform(markdownAST) {
    findAndReplace(markdownAST, mentionRegex, replace);
    return markdownAST;
  }

  return transform;
}
