import React from "react";
import { Widget } from "../components/Widget/Widget";
import {
  deepFreeze,
  ipfsUpload,
  ipfsUrl,
  isArray,
  isObject,
  isString,
  Loading,
} from "../data/utils";
import Files from "react-files";
import { sanitizeUrl } from "@braintree/sanitize-url";
import { NearConfig } from "../data/near";
import { Markdown } from "../components/Markdown";
import InfiniteScroll from "react-infinite-scroller";
import { CommitButton } from "../components/Commit";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";
import { Typeahead } from "react-bootstrap-typeahead";
import styled, { isStyledComponent, keyframes } from "styled-components";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Big from "big.js";
import * as elliptic from "elliptic";
import BN from "bn.js";
import * as nacl from "tweetnacl";

const frozenNacl = Object.freeze({
  randomBytes: deepFreeze(nacl.randomBytes),
  secretbox: deepFreeze(nacl.secretbox),
  scalarMult: deepFreeze(nacl.scalarMult),
  box: deepFreeze(nacl.box),
  sign: deepFreeze(nacl.sign),
  hash: deepFreeze(nacl.hash),
  verify: deepFreeze(nacl.verify),
});

const frozenElliptic = Object.freeze({
  version: deepFreeze(elliptic.version),
  utils: deepFreeze(elliptic.utils),
  curve: deepFreeze(elliptic.curve),
  curves: deepFreeze(elliptic.curves),
  ec: Object.freeze(elliptic.ec),
  eddsa: Object.freeze(elliptic.eddsa),
});

const LoopLimit = 1000000;
const MaxDepth = 32;

const ReactKey = "$$typeof";
const isReactObject = (o) =>
  o !== null && typeof o === "object" && !!o[ReactKey];

const StakeKey = "state";

const ExpressionDebug = false;
const StatementDebug = false;

const StorageType = {
  Private: "private",
  Public: "public",
};

const ApprovedTags = {
  h1: true,
  h2: true,
  h3: true,
  h4: true,
  h5: true,
  h6: true,
  div: true,
  span: true,
  strong: true,
  sub: true,
  sup: true,
  a: true,
  pre: true,
  i: true,
  b: true,
  p: true,
  input: true,
  button: true,
  ul: true,
  ol: true,
  li: true,
  table: true,
  tr: true,
  th: true,
  td: true,
  thead: true,
  tbody: true,
  tfoot: true,
  br: false,
  hr: false,
  img: false,
  Widget: false,
  CommitButton: true,
  IpfsImageUpload: false,
  Markdown: false,
  Fragment: true,
  textarea: true,
  select: true,
  option: true,
  label: true,
  small: true,
  InfiniteScroll: true,
  Typeahead: false,
  Tooltip: true,
  OverlayTrigger: true,
  // svg begin
  svg: true,
  animate: false,
  animateMotion: false,
  animateTransform: false,
  defs: true,
  circle: true,
  clipPath: true,
  ellipse: true,
  g: true,
  image: false,
  line: true,
  linearGradient: true,
  marker: true,
  mask: true,
  mpath: false,
  path: true,
  pattern: true,
  polyline: true,
  radialGradient: true,
  rect: true,
  set: false,
  stop: false,
  symbol: true,
  text: true,
  textPath: true,
  tspan: true,
  use: false,
  // svg ends
  Files: true,
};

const Keywords = {
  JSON: true,
  Social: true,
  Storage: true,
  Near: true,
  State: true,
  console: true,
  styled: true,
  Object: true,
  Date,
  Number,
  Big,
  Math,
  Buffer,
  Audio,
  Image,
  File,
  Blob,
  FileReader,
  URL,
  Array,
  BN,
  Uint8Array,
  Map,
  Set,
  clipboard: true,
};

const ReservedKeys = {
  [ReactKey]: true,
  constructor: true,
  prototype: true,
  __proto__: true,
  __defineGetter__: true,
  __defineSetter__: true,
  __lookupGetter__: true,
  __lookupSetter__: true,
};

const assertNotReservedKey = (key) => {
  if (ReservedKeys[key] === true) {
    throw new Error(`${key} is reserved and can't be used`);
  }
};

const assertNotReservedObject = (o) => {
  if (isReactObject(o)) {
    throw new Error("React objects shouldn't dereferenced");
  }
  if (o instanceof Function) {
    throw new Error("Functions shouldn't dereferenced");
  }
};

const assertValidObject = (o) => {
  if (o !== null && typeof o === "object") {
    Object.entries(o).forEach(([key, value]) => {
      assertNotReservedKey(key);
      assertValidObject(value);
    });
  }
};

const deepCopy = (o) => {
  if (Array.isArray(o)) {
    return o.map((v) => deepCopy(v));
  } else if (o instanceof Map) {
    return new Map(
      [...o.entries()].map(([k, v]) => [deepCopy(k), deepCopy(v)])
    );
  } else if (o instanceof Set) {
    return new Set([...o].map((v) => deepCopy(v)));
  } else if (Buffer.isBuffer(o)) {
    return Buffer.from(o);
  } else if (o instanceof URL) {
    return new URL(o);
  } else if (o instanceof File) {
    return new File([o], o.name, { type: o.type });
  } else if (o instanceof Blob) {
    return new Blob([o], { type: o.type });
  } else if (o instanceof Uint8Array || o instanceof ArrayBuffer) {
    return o.slice(0);
  } else if (isObject(o)) {
    if (isReactObject(o)) {
      return o;
    }
    return Object.fromEntries(
      Object.entries(o).map(([key, value]) => [key, deepCopy(value)])
    );
  } else if (o === undefined || typeof o === "function") {
    return o;
  } else {
    return JSON.parse(JSON.stringify(o));
  }
};

const maybeSubscribe = (subscribe, blockId) =>
  subscribe &&
  (blockId === undefined ||
    blockId === null ||
    blockId === "final" ||
    blockId === "optimistic");

const requireIdentifier = (id) => {
  if (id.type !== "Identifier") {
    throw new Error("Non identifier: " + id.type);
  }
  const name = id.name;
  assertNotReservedKey(name);
  if (name in Keywords) {
    throw new Error("Cannot use keyword: " + name);
  }
  return {
    type: "Identifier",
    name,
  };
};

const requireJSXIdentifier = (id) => {
  if (id.type !== "JSXIdentifier") {
    throw new Error("Non JSXIdentifier: " + id.type);
  }
  return id.name;
};

const requirePattern = (id) => {
  if (id.type === "Identifier") {
    return requireIdentifier(id);
  } else if (id.type === "ArrayPattern") {
    return {
      type: "ArrayPattern",
      elements: id.elements.map(requirePattern),
    };
  } else if (id.type === "ObjectPattern") {
    return {
      type: "ObjectPattern",
      properties: id.properties.map((p) => {
        if (p.type === "Property") {
          return {
            key: requireIdentifier(p.key),
            value: requirePattern(p.value),
          };
        } else if (p.type === "RestElement") {
          return {
            type: "RestElement",
            argument: requireIdentifier(p.argument),
          };
        } else {
          throw new Error("Unknown property type: " + p.type);
        }
      }),
    };
  } else if (id.type === "RestElement") {
    return {
      type: "RestElement",
      argument: requireIdentifier(id.argument),
    };
  } else {
    throw new Error("Unknown pattern: " + id.type);
  }
};

class Stack {
  constructor(prevStack, state) {
    this.prevStack = prevStack;
    this.state = state;
  }

  findObj(name) {
    if (name in this.state) {
      return this.state;
    }
    return this.prevStack ? this.prevStack.findObj(name) : undefined;
  }

  get(name) {
    if (name in this.state) {
      return this.state[name];
    }
    return this.prevStack ? this.prevStack.get(name) : undefined;
  }
}

class VmStack {
  constructor(vm, prevStack, state, isTrusted) {
    this.gIndex = 0;
    this.vm = vm;
    this.isTrusted = !!isTrusted;
    this.stack = new Stack(prevStack, state);
  }

  newStack(isTrusted) {
    return new VmStack(this.vm, this.stack, {}, this.isTrusted || !!isTrusted);
  }

  executeExpression(code) {
    ExpressionDebug && console.log("Executing code:", code?.type);
    const res = this.executeExpressionInternal(code);
    ExpressionDebug && console.log(code?.type, res);
    return res;
  }

  renderElement(code) {
    let element =
      code.type === "JSXFragment"
        ? "Fragment"
        : requireJSXIdentifier(code.openingElement.name);

    let withChildren = ApprovedTags[element];
    const styledComponent =
      withChildren === undefined && this.stack.get(element);
    if (withChildren === undefined) {
      if (styledComponent === undefined) {
        throw new Error("Unknown element: " + element);
      }
      if (!isStyledComponent(styledComponent)) {
        throw new Error("Not a styled component: " + element);
      }
    }

    const attributes = {};
    const status = {};
    if (element === "input") {
      attributes.className = "form-control";
    } else if (element === "CommitButton") {
      attributes.className = "btn btn-success";
    } else if (element === "button") {
      attributes.className = "btn btn-primary";
    } else if (element === "IpfsImageUpload") {
      attributes.className = "btn btn-outline-primary";
    }

    const rawAttributes = {};

    (code.type === "JSXFragment"
      ? code.openingFragment
      : code.openingElement
    ).attributes.forEach((attribute) => {
      if (attribute.type === "JSXAttribute") {
        const name = requireJSXIdentifier(attribute.name);
        attributes[name] =
          attribute.value === null
            ? true
            : this.executeExpression(attribute.value);
        if (name === "value" || name === "image" || name === "onChange") {
          rawAttributes[name] = attribute.value;
        }
      } else if (attribute.type === "JSXSpreadAttribute") {
        const value = this.executeExpression(attribute.argument);
        Object.assign(attributes, value);
      } else {
        throw new Error("Unknown attribute type: " + attribute.type);
      }
    });

    Object.entries(rawAttributes).forEach(([name, value]) => {
      if (
        name === "value" &&
        element === "input" &&
        attributes.type === "text" &&
        value.type === "JSXExpressionContainer" &&
        !("onChange" in rawAttributes)
      ) {
        const { obj, key } = this.resolveMemberExpression(value.expression, {
          requireState: true,
          left: true,
        });
        attributes.value = obj?.[key] || "";
        attributes.onChange = (e) => {
          e.preventDefault();
          obj[key] = e.target.value;
          this.vm.setReactState(this.vm.state.state);
        };
      } else if (
        name === "image" &&
        element === "IpfsImageUpload" &&
        value.type === "JSXExpressionContainer"
      ) {
        const { obj, key } = this.resolveMemberExpression(value.expression, {
          requireState: true,
          left: true,
        });
        status.img = obj[key];
        attributes.onChange = (files) => {
          if (files?.length > 0) {
            obj[key] = {
              uploading: true,
              cid: null,
            };
            this.vm.setReactState(this.vm.state.state);
            ipfsUpload(files[0]).then((cid) => {
              if (!this.vm.alive) {
                return;
              }
              const { obj, key } = this.vm.vmStack.resolveMemberExpression(
                value.expression,
                {
                  requireState: true,
                  left: true,
                }
              );
              obj[key] = {
                cid,
              };
              this.vm.setReactState(this.vm.state.state);
            });
          } else {
            obj[key] = null;
            this.vm.setReactState(this.vm.state.state);
          }
        };
      }
    });
    attributes.key =
      attributes.key ?? `${this.vm.widgetSrc}-${element}-${this.vm.gIndex}`;
    delete attributes.dangerouslySetInnerHTML;
    delete attributes.as;
    delete attributes.forwardedAs;
    if (element === "img") {
      attributes.alt = attributes.alt ?? "not defined";
    } else if (element === "a") {
      if ("href" in attributes) {
        attributes.href = sanitizeUrl(attributes.href);
      }
    } else if (element === "Widget") {
      attributes.depth = this.vm.depth + 1;
    }

    if (withChildren === false && code.children.length) {
      throw new Error(
        "And element '" + element + "' contains children, but shouldn't"
      );
    }

    const children = code.children.map((child, i) => {
      this.vm.gIndex = i;
      return this.executeExpression(child);
    });

    if (element === "Widget") {
      return <Widget {...attributes} />;
    } else if (element === "CommitButton") {
      return (
        <CommitButton {...attributes} widgetSrc={this.vm.widgetSrc}>
          {children}
        </CommitButton>
      );
    } else if (element === "InfiniteScroll") {
      return <InfiniteScroll {...attributes}>{children}</InfiniteScroll>;
    } else if (element === "Tooltip") {
      return <Tooltip {...attributes}>{children}</Tooltip>;
    } else if (element === "OverlayTrigger") {
      return (
        <OverlayTrigger {...attributes}>
          {children.filter((c) => !isString(c) || !!c.trim())[0]}
        </OverlayTrigger>
      );
    } else if (element === "Typeahead") {
      return <Typeahead {...attributes} />;
    } else if (element === "Markdown") {
      return <Markdown {...attributes} />;
    } else if (element === "Fragment") {
      return <React.Fragment {...attributes}>{children}</React.Fragment>;
    } else if (element === "IpfsImageUpload") {
      return (
        <div className="d-inline-block" key={attributes.key}>
          {status.img?.cid && (
            <div
              className="d-inline-block me-2 overflow-hidden align-middle"
              style={{ width: "2.5em", height: "2.5em" }}
            >
              <img
                className="rounded w-100 h-100"
                style={{ objectFit: "cover" }}
                src={ipfsUrl(status.img?.cid)}
                alt="upload preview"
              />
            </div>
          )}
          <Files
            multiple={false}
            accepts={["image/*"]}
            minFileSize={1}
            clickable
            {...attributes}
          >
            {status.img?.uploading ? (
              <>{Loading} Uploading</>
            ) : status.img?.cid ? (
              "Replace"
            ) : (
              "Upload an Image"
            )}
          </Files>
        </div>
      );
    } else if (element === "Files") {
      return <Files {...attributes}>{children}</Files>;
    } else if (styledComponent) {
      return React.createElement(
        styledComponent,
        { ...attributes },
        ...children
      );
    } else if (withChildren === true) {
      return React.createElement(element, { ...attributes }, ...children);
    } else if (withChildren === false) {
      return React.createElement(element, { ...attributes });
    } else {
      throw new Error("Unsupported element: " + element);
    }
  }

  resolveKey(code, computed) {
    const key =
      !computed && code.type === "Identifier"
        ? code.name
        : this.executeExpression(code);
    assertNotReservedKey(key);
    return key;
  }

  callFunction(keyword, callee, args, optional, isNew) {
    const keywordType = Keywords[keyword];
    if (keywordType === true || keywordType === undefined) {
      if (
        (keyword === "Social" && callee === "getr") ||
        callee === "socialGetr"
      ) {
        if (args.length < 1) {
          throw new Error("Missing argument 'keys' for Social.getr");
        }
        return this.vm.cachedSocialGet(args[0], true, args[1], args[2]);
      } else if (
        (keyword === "Social" && callee === "get") ||
        callee === "socialGet"
      ) {
        if (args.length < 1) {
          throw new Error("Missing argument 'keys' for Social.get");
        }
        return this.vm.cachedSocialGet(args[0], false, args[1], args[2]);
      } else if (keyword === "Social" && callee === "keys") {
        if (args.length < 1) {
          throw new Error("Missing argument 'keys' for Social.keys");
        }
        return this.vm.cachedSocialKeys(args[0], args[1], args[2]);
      } else if (keyword === "Social" && callee === "index") {
        if (args.length < 2) {
          throw new Error(
            "Missing argument 'action' and 'key` for Social.index"
          );
        }
        return this.vm.cachedIndex(args[0], args[1], args[2]);
      } else if (keyword === "Social" && callee === "set") {
        if (args.length < 1) {
          throw new Error("Missing argument 'data' for Social.set");
        }
        return this.vm.socialSet(args[0], args[1]);
      } else if (keyword === "Near" && callee === "view") {
        if (args.length < 2) {
          throw new Error(
            "Method: Near.view. Required arguments: 'contractName', 'methodName'. Optional: 'args', 'blockId/finality', 'subscribe'"
          );
        }
        const [contractName, methodName, viewArg, blockId, subscribe] = args;

        return this.vm.cachedNearView(
          contractName,
          methodName,
          viewArg,
          blockId,
          maybeSubscribe(subscribe, blockId)
        );
      } else if (keyword === "Near" && callee === "asyncView") {
        if (args.length < 2) {
          throw new Error(
            "Method: Near.asyncView. Required arguments: 'contractName', 'methodName'. Optional: 'args', 'blockId/finality'"
          );
        }
        return this.vm.asyncNearView(...args);
      } else if (keyword === "Near" && callee === "block") {
        const [blockId, subscribe] = args;
        return this.vm.cachedNearBlock(
          blockId,
          maybeSubscribe(subscribe, blockId)
        );
      } else if (keyword === "Near" && callee === "call") {
        if (args.length === 1) {
          if (isObject(args[0])) {
            return this.vm.confirmTransactions([args[0]]);
          } else if (isArray(args[0])) {
            return this.vm.confirmTransactions(args[0]);
          } else {
            throw new Error(
              "Method: Near.call. Required argument: 'tx/txs'. A single argument call requires an TX object or an array of TX objects."
            );
          }
        } else {
          if (args.length < 2 || args.length > 5) {
            throw new Error(
              "Method: Near.call. Required argument: 'contractName'. If the first argument is a string: 'methodName'. Optional: 'args', 'gas' (defaults to 300Tg), 'deposit' (defaults to 0)"
            );
          }

          return this.vm.confirmTransactions([
            {
              contractName: args[0],
              methodName: args[1],
              args: args[2] ?? {},
              gas: args[3],
              deposit: args[4],
            },
          ]);
        }
      } else if (callee === "fetch") {
        if (args.length < 1) {
          throw new Error(
            "Method: fetch. Required arguments: 'url'. Optional: 'options'"
          );
        }
        return this.vm.cachedFetch(...args);
      } else if (callee === "asyncFetch") {
        if (args.length < 1) {
          throw new Error(
            "Method: asyncFetch. Required arguments: 'url'. Optional: 'options'"
          );
        }
        return this.vm.asyncFetch(...args);
      } else if (callee === "useCache") {
        if (args.length < 2) {
          throw new Error(
            "Method: useCache. Required arguments: 'promiseGenerator', 'dataKey'. Optional: 'options'"
          );
        }
        if (!(args[0] instanceof Function)) {
          throw new Error(
            "Method: useCache. The first argument 'promiseGenerator' must be a function"
          );
        }
        return this.vm.useCache(...args);
      } else if (callee === "parseInt") {
        return parseInt(...args);
      } else if (callee === "parseFloat") {
        return parseFloat(...args);
      } else if (callee === "isNaN") {
        return isNaN(...args);
      } else if (
        (keyword === "JSON" && callee === "stringify") ||
        callee === "stringify"
      ) {
        if (args.length < 1) {
          throw new Error("Missing argument 'obj' for JSON.stringify");
        }
        assertNotReservedObject(args[0]);
        return JSON.stringify(args[0], args[1], args[2]);
      } else if (keyword === "JSON" && callee === "parse") {
        if (args.length < 1) {
          throw new Error("Missing argument 's' for JSON.parse");
        }
        try {
          const obj = JSON.parse(args[0]);
          assertValidObject(obj);
          return obj;
        } catch (e) {
          return null;
        }
      } else if (keyword === "Object") {
        if (callee === "keys") {
          if (args.length < 1) {
            throw new Error("Missing argument 'obj' for Object.keys");
          }
          assertNotReservedObject(args[0]);
          return Object.keys(args[0]);
        } else if (callee === "values") {
          if (args.length < 1) {
            throw new Error("Missing argument 'obj' for Object.values");
          }
          assertNotReservedObject(args[0]);
          return Object.values(args[0]);
        } else if (callee === "entries") {
          if (args.length < 1) {
            throw new Error("Missing argument 'obj' for Object.entries");
          }
          assertNotReservedObject(args[0]);
          return Object.entries(args[0]);
        } else if (callee === "assign") {
          args.forEach((arg) => assertNotReservedObject(arg));
          const obj = Object.assign(...args);
          assertValidObject(obj);
          return obj;
        } else if (callee === "fromEntries") {
          const obj = Object.fromEntries(args[0]);
          assertValidObject(obj);
          return obj;
        }
      } else if (
        (keyword === "State" && callee === "init") ||
        callee === "initState"
      ) {
        if (args.length < 1) {
          throw new Error("Missing argument 'initialState' for State.init");
        }
        if (
          args[0] === null ||
          typeof args[0] !== "object" ||
          isReactObject(args[0])
        ) {
          throw new Error("'initialState' is not an object");
        }
        if (this.vm.state.state === undefined) {
          const newState = deepCopy(args[0]);
          this.vm.setReactState(newState);
          this.vm.state.state = newState;
        }
        return this.vm.state.state;
      } else if (keyword === "State" && callee === "update") {
        if (isObject(args[0])) {
          this.vm.state.state = this.vm.state.state ?? {};
          Object.assign(this.vm.state.state, deepCopy(args[0]));
        }
        if (this.vm.state.state === undefined) {
          throw new Error("The error was not initialized");
        }
        this.vm.setReactState(this.vm.state.state);
        return this.vm.state.state;
      } else if (keyword === "Storage" && callee === "privateSet") {
        if (args.length < 2) {
          throw new Error(
            "Missing argument 'key' or 'value' for Storage.privateSet"
          );
        }
        return this.vm.storageSet(
          {
            src: this.vm.widgetSrc,
            type: StorageType.Private,
          },
          args[0],
          args[1]
        );
      } else if (keyword === "Storage" && callee === "privateGet") {
        if (args.length < 1) {
          throw new Error("Missing argument 'key' for Storage.privateGet");
        }
        return this.vm.storageGet(
          {
            src: this.vm.widgetSrc,
            type: StorageType.Private,
          },
          args[0]
        );
      } else if (keyword === "Storage" && callee === "set") {
        if (args.length < 2) {
          throw new Error("Missing argument 'key' or 'value' for Storage.set");
        }
        return this.vm.storageSet(
          {
            src: this.vm.widgetSrc,
            type: StorageType.Public,
          },
          args[0],
          args[1]
        );
      } else if (keyword === "Storage" && callee === "get") {
        if (args.length < 1) {
          throw new Error("Missing argument 'key' for Storage.get");
        }
        return this.vm.storageGet(
          {
            src: args[1] ?? this.vm.widgetSrc,
            type: StorageType.Public,
          },
          args[0]
        );
      } else if (keyword === "console" && callee === "log") {
        return console.log(this.vm.widgetSrc, ...args);
      } else if (keyword === "clipboard" && callee === "writeText") {
        return this.isTrusted
          ? navigator.clipboard.writeText(...args)
          : Promise.reject(new Error("Not trusted (not a click)"));
      }
    } else {
      const f = callee === keyword ? keywordType : keywordType[callee];
      if (typeof f === "function") {
        return isNew ? new f(...args) : f(...args);
      }
    }

    if (optional) {
      return undefined;
    }

    throw new Error(
      keyword && keyword !== callee
        ? `Unsupported callee method '${keyword}.${callee}'`
        : `Unsupported callee method '${callee}'`
    );
  }

  /// Resolves the underlying object and the key to modify.
  /// Should only be used by left hand expressions for assignments.
  /// Options:
  /// - requireState requires the top object key be `state`
  resolveMemberExpression(code, options) {
    if (code.type === "Identifier") {
      const key = code.name;
      assertNotReservedKey(key);
      if (options?.requireState && key !== StakeKey) {
        throw new Error(`The top object should be ${StakeKey}`);
      }
      const obj = this.stack.findObj(key) ?? this.stack.state;
      assertNotReservedObject(obj);
      if (obj === this.stack.state) {
        if (key in Keywords) {
          if (options?.left) {
            throw new Error("Cannot assign to keyword '" + key + "'");
          }
          return { obj, key, keyword: key };
        }
      }
      if (options?.left) {
        if (!obj || !(key in obj)) {
          throw new Error(`Accessing undeclared identifier '${code.name}'`);
        }
      }
      return { obj, key };
    } else if (code.type === "MemberExpression") {
      if (code.object?.type === "Identifier") {
        const keyword = code.object.name;
        if (keyword in Keywords) {
          if (!options?.callee) {
            throw new Error(
              "Cannot dereference keyword '" +
                keyword +
                "' in non-call expression"
            );
          }
          return {
            obj: this.stack.state,
            key: this.resolveKey(code.property, code.computed),
            keyword,
          };
        }
      }
      const obj = this.executeExpression(code.object);
      assertNotReservedObject(obj);
      const key = this.resolveKey(code.property, code.computed);
      return { obj, key };
    } else {
      throw new Error("Unsupported member type: '" + code.type + "'");
    }
  }

  getArray(elements) {
    const result = [];
    elements.forEach((element) => {
      if (element.type === "SpreadElement") {
        result.push(...this.executeExpression(element.argument));
      } else {
        result.push(this.executeExpression(element));
      }
    });
    return result;
  }

  executeExpressionInternal(code) {
    if (!code) {
      return null;
    }
    const type = code?.type;
    if (type === "AssignmentExpression") {
      const { obj, key } = this.resolveMemberExpression(code.left, {
        left: true,
      });
      const right = this.executeExpression(code.right);

      if (code.operator === "=") {
        return (obj[key] = right);
      } else if (code.operator === "+=") {
        return (obj[key] += right);
      } else if (code.operator === "-=") {
        return (obj[key] -= right);
      } else if (code.operator === "*=") {
        return (obj[key] *= right);
      } else if (code.operator === "/=") {
        return (obj[key] /= right);
      } else if (code.operator === "??=") {
        return (obj[key] ??= right);
      } else {
        throw new Error(
          "Unknown AssignmentExpression operator '" + code.operator + "'"
        );
      }
    } else if (type === "ChainExpression") {
      return this.executeExpression(code.expression);
    } else if (type === "MemberExpression") {
      const { obj, key } = this.resolveMemberExpression(code);
      return obj?.[key];
    } else if (type === "Identifier") {
      return this.stack.get(code.name);
    } else if (type === "JSXExpressionContainer") {
      return this.executeExpression(code.expression);
    } else if (type === "TemplateLiteral") {
      const quasis = [];
      for (let i = 0; i < code.quasis.length; i++) {
        const element = code.quasis[i];
        if (element.type !== "TemplateElement") {
          throw new Error("Unknown quasis type: " + element.type);
        }
        quasis.push(element.value.cooked);
        if (!element.tail) {
          quasis.push(this.executeExpression(code.expressions[i]));
        }
      }
      return quasis.join("");
    } else if (type === "CallExpression" || type === "NewExpression") {
      const isNew = type === "NewExpression";
      const { obj, key, keyword } = this.resolveMemberExpression(code.callee, {
        callee: true,
      });
      const args = this.getArray(code.arguments);
      if (!keyword && obj?.[key] instanceof Function) {
        return isNew ? new obj[key](...args) : obj[key](...args);
      } else if (keyword || obj === this.stack.state || obj === this.vm.state) {
        return this.callFunction(
          keyword ?? "",
          key,
          args,
          code.optional,
          isNew
        );
      } else {
        if (code.optional) {
          return undefined;
        }
        throw new Error("Not a function call expression");
      }
    } else if (type === "Literal" || type === "JSXText") {
      return code.value;
    } else if (type === "JSXElement" || type === "JSXFragment") {
      return this.renderElement(code);
    } else if (type === "JSXExpressionContainer") {
      return this.executeExpression(code.expression);
    } else if (type === "BinaryExpression") {
      const left = this.executeExpression(code.left);
      const right = this.executeExpression(code.right);
      if (code.operator === "+") {
        return left + right;
      } else if (code.operator === "-") {
        return left - right;
      } else if (code.operator === "%") {
        return left % right;
      } else if (code.operator === "*") {
        return left * right;
      } else if (code.operator === "/") {
        return left / right;
      } else if (code.operator === "<") {
        return left < right;
      } else if (code.operator === "|") {
        return left | right;
      } else if (code.operator === "&") {
        return left & right;
      } else if (code.operator === ">") {
        return left > right;
      } else if (code.operator === "<=") {
        return left <= right;
      } else if (code.operator === ">=") {
        return left >= right;
      } else if (code.operator === "===" || code.operator === "==") {
        return left === right;
      } else if (code.operator === "!==" || code.operator === "!=") {
        return left !== right;
      } else if (code.operator === "in") {
        return left in right;
      } else {
        throw new Error(
          "Unknown BinaryExpression operator '" + code.operator + "'"
        );
      }
    } else if (type === "UnaryExpression") {
      if (code.operator === "delete") {
        const { obj, key } = this.resolveMemberExpression(code.argument, {
          left: true,
        });
        return delete obj?.[key];
      }
      const argument = this.executeExpression(code.argument);
      if (code.operator === "-") {
        return -argument;
      } else if (code.operator === "!") {
        return !argument;
      } else if (code.operator === "typeof") {
        return typeof argument;
      } else {
        throw new Error(
          "Unknown UnaryExpression operator '" + code.operator + "'"
        );
      }
    } else if (type === "LogicalExpression") {
      const left = this.executeExpression(code.left);
      if (code.operator === "||") {
        return left || this.executeExpression(code.right);
      } else if (code.operator === "&&") {
        return left && this.executeExpression(code.right);
      } else if (code.operator === "??") {
        return left ?? this.executeExpression(code.right);
      } else {
        throw new Error(
          "Unknown LogicalExpression operator '" + code.operator + "'"
        );
      }
    } else if (type === "ConditionalExpression") {
      const test = this.executeExpression(code.test);
      return test
        ? this.executeExpression(code.consequent)
        : this.executeExpression(code.alternate);
    } else if (type === "UpdateExpression") {
      const { obj, key } = this.resolveMemberExpression(code.argument, {
        left: true,
      });
      if (code.operator === "++") {
        return code.prefix ? ++obj[key] : obj[key]++;
      } else if (code.operator === "--") {
        return code.prefix ? --obj[key] : obj[key]--;
      } else {
        throw new Error(
          "Unknown UpdateExpression operator '" + code.operator + "'"
        );
      }
    } else if (type === "ObjectExpression") {
      return code.properties.reduce((object, property) => {
        if (property.type === "Property") {
          const key = this.resolveKey(property.key, property.computed);
          object[key] = this.executeExpression(property.value);
        } else if (property.type === "SpreadElement") {
          const value = this.executeExpression(property.argument);
          assertNotReservedObject(value);
          Object.assign(object, value);
        } else {
          throw new Error("Unknown property type: " + property.type);
        }
        return object;
      }, {});
    } else if (type === "ArrayExpression") {
      return this.getArray(code.elements);
    } else if (type === "JSXEmptyExpression") {
      return null;
    } else if (type === "ArrowFunctionExpression") {
      return this.createFunction(code.params, code.body, code.expression);
    } else if (type === "TaggedTemplateExpression") {
      // Currently on `styled` component is supported.

      let styledTemplate;

      if (
        code.tag.type === "MemberExpression" ||
        code.tag.type === "CallExpression"
      ) {
        const { key, keyword } = this.resolveMemberExpression(
          code.tag.type === "MemberExpression" ? code.tag : code.tag.callee,
          {
            callee: true,
          }
        );
        if (keyword !== "styled") {
          throw new Error(
            "TaggedTemplateExpression is only supported for `styled` components"
          );
        }

        if (code.tag.type === "CallExpression") {
          const args = this.getArray(code.tag.arguments);
          const arg = args?.[0];
          if (!isStyledComponent(arg)) {
            throw new Error("styled() can only take `styled` components");
          }
          styledTemplate = styled(arg);
        } else {
          if (key === "keyframes") {
            styledTemplate = keyframes;
          } else if (key in ApprovedTags) {
            styledTemplate = styled(key);
          } else {
            throw new Error("Unsupported styled tag: " + key);
          }
        }
      } else {
        throw new Error(
          "TaggedTemplateExpression is only supported for `styled` components"
        );
      }

      if (code.quasi.type !== "TemplateLiteral") {
        throw new Error("Unknown quasi type: " + code.quasi.type);
      }
      const quasis = code.quasi.quasis.map((element) => {
        if (element.type !== "TemplateElement") {
          throw new Error("Unknown quasis type: " + element.type);
        }
        return element.value.cooked;
      });
      const expressions = code.quasi.expressions.map((expression) =>
        this.executeExpression(expression)
      );

      if (styledTemplate instanceof Function) {
        return styledTemplate(quasis, ...expressions);
      } else {
        throw new Error("styled error");
      }
    } else {
      throw new Error("Unknown expression type '" + type + "'");
    }
  }

  createFunction(params, body, isExpression) {
    params = params.map(requirePattern);
    return (...args) => {
      if (!this.vm.alive) {
        return;
      }
      const isTrusted = !!(
        args?.[0]?.nativeEvent instanceof Event &&
        args?.[0]?.nativeEvent.isTrusted
      );
      const stack = this.newStack(isTrusted);
      params.forEach((param, i) => {
        let v = undefined;
        let arg = args?.[i];
        if (arg !== undefined) {
          try {
            if (arg?.nativeEvent instanceof Event) {
              arg.preventDefault();
              arg = arg.nativeEvent;
              arg = {
                target: {
                  value: arg?.target?.value,
                  id: arg?.target?.id,
                  dataset: arg?.target?.dataset,
                  href: arg?.target?.href,
                  checked: arg?.target?.checked,
                },
                data: arg?.data,
                code: arg?.code,
                key: arg?.key,
                ctrlKey: arg?.ctrlKey,
                altKey: arg?.altKey,
                shiftKey: arg?.shiftKey,
                metaKey: arg?.metaKey,
                button: arg?.button,
                buttons: arg?.buttons,
                clientX: arg?.clientX,
                clientY: arg?.clientY,
                screenX: arg?.screenX,
                screenY: arg?.screenY,
                touches: arg?.touches,
              };
            }
            v = deepCopy(arg);
          } catch (e) {
            console.warn(e);
          }
        }
        stack.stackDeclare(param, v);
      });
      return isExpression
        ? stack.executeExpression(body)
        : stack.executeStatement(body)?.["result"];
    };
  }

  stackDeclare(pattern, value) {
    if (pattern.type === "Identifier") {
      this.stack.state[pattern.name] = value;
    } else if (pattern.type === "ArrayPattern") {
      assertNotReservedObject(value);
      pattern.elements.forEach((element, i) => {
        if (element.type === "RestElement") {
          this.stackDeclare(element.argument, value.slice(i));
        } else {
          this.stackDeclare(element, value?.[i]);
        }
      });
    } else if (pattern.type === "ObjectPattern") {
      assertNotReservedObject(value);
      const seen = new Set();
      pattern.properties.forEach((property) => {
        if (property.type === "RestElement") {
          const rest = {};
          if (isObject(value)) {
            Object.assign(rest, value);
            seen.forEach((key) => delete rest[key]);
          }
          this.stackDeclare(property.argument, rest);
        } else {
          this.stackDeclare(property.value, value?.[property.key.name]);
          seen.add(property.key.name);
        }
      });
    } else {
      throw new Error("Unknown pattern type: " + pattern.type);
    }
  }

  executeStatement(token) {
    StatementDebug && console.log(token);
    if (!token || token.type === "EmptyStatement") {
      return null;
    } else if (token.type === "VariableDeclaration") {
      token.declarations.forEach((declaration) => {
        if (declaration.type === "VariableDeclarator") {
          this.stackDeclare(
            requirePattern(declaration.id),
            this.executeExpression(declaration.init)
          );
        } else {
          throw new Error(
            "Unknown variable declaration type '" + declaration.type + "'"
          );
        }
      });
    } else if (token.type === "ReturnStatement") {
      return {
        result: this.executeExpression(token.argument),
      };
    } else if (token.type === "FunctionDeclaration") {
      this.stackDeclare(
        requireIdentifier(token.id),
        this.createFunction(token.params, token.body, token.expression)
      );
    } else if (token.type === "ExpressionStatement") {
      this.executeExpression(token.expression);
    } else if (token.type === "BlockStatement" || token.type === "Program") {
      const body = token.body;
      const stack = this.newStack();
      for (let i = 0; i < body.length; i++) {
        const result = stack.executeStatement(body[i]);
        if (result) {
          return result;
        }
      }
    } else if (token.type === "ForStatement") {
      const stack = this.newStack();
      stack.executeStatement(token.init);
      while (this.vm.loopLimit-- > 0) {
        if (token.test) {
          const test = stack.executeExpression(token.test);
          if (!test) {
            break;
          }
        }
        const result = stack.executeStatement(token.body);
        if (result) {
          if (result.break) {
            break;
          } else {
            return result;
          }
        }
        stack.executeExpression(token.update);
      }
      if (this.vm.loopLimit <= 0) {
        throw new Error("Exceeded loop limit");
      }
    } else if (token.type === "ForOfStatement") {
      const stack = this.newStack();
      const right = stack.executeExpression(token.right);
      assertNotReservedObject(right);
      for (const value of right) {
        if (this.vm.loopLimit-- <= 0) {
          throw new Error("Exceeded loop limit");
        }
        if (token.left.type === "VariableDeclaration") {
          if (token.left.declarations.length !== 1) {
            throw new Error("Invalid for-of statement");
          }
          token.left.declarations.forEach((declaration) => {
            if (declaration.type === "VariableDeclarator") {
              this.stackDeclare(requirePattern(declaration.id), value);
            } else {
              throw new Error(
                "Unknown variable declaration type '" + declaration.type + "'"
              );
            }
          });
        } else {
          const { obj, key } = this.resolveMemberExpression(token.left, {
            left: true,
          });
          obj[key] = value;
        }
        const result = stack.executeStatement(token.body);
        if (result) {
          if (result.break) {
            break;
          } else {
            return result;
          }
        }
      }
    } else if (token.type === "WhileStatement") {
      const stack = this.newStack();
      while (this.vm.loopLimit-- > 0) {
        const test = stack.executeExpression(token.test);
        if (!test) {
          break;
        }
        const result = stack.executeStatement(token.body);
        if (result) {
          if (result.break) {
            break;
          } else {
            return result;
          }
        }
      }
      if (this.vm.loopLimit <= 0) {
        throw new Error("Exceeded loop limit");
      }
    } else if (token.type === "IfStatement") {
      const test = this.executeExpression(token.test);
      const stack = this.newStack();
      const result = !!test
        ? stack.executeStatement(token.consequent)
        : stack.executeStatement(token.alternate);
      if (result) {
        return result;
      }
    } else if (token.type === "BreakStatement") {
      return {
        break: true,
      };
    } else if (token.type === "ThrowStatement") {
      throw this.executeExpression(token.argument);
    } else if (token.type === "TryStatement") {
      try {
        const stack = this.newStack();
        const result = stack.executeStatement(token.block);
        if (result) {
          return result;
        }
      } catch (e) {
        if (!this.vm.alive || !token.handler) {
          return null;
        }
        if (token.handler.type !== "CatchClause") {
          throw new Error(
            "Unknown try statement handler type '" + token.handler.type + "'"
          );
        }
        const stack = this.newStack();
        if (token.handler.param) {
          stack.stackDeclare(
            requireIdentifier(token.handler.param),
            deepCopy(
              e instanceof Error
                ? {
                    name: e?.name,
                    message: e?.message,
                    toString: () => e.toString(),
                  }
                : e
            )
          );
        }
        const result = stack.executeStatement(token.handler.body);
        if (result) {
          return result;
        }
      } finally {
        if (this.vm.alive) {
          const stack = this.newStack();
          stack.executeStatement(token.finalizer);
        }
      }
    } else if (token.type === "SwitchStatement") {
      const discriminant = this.executeExpression(token.discriminant);
      const stack = this.newStack();
      const cases = token.cases;
      let found = false;
      for (const caseToken of cases) {
        if (caseToken.type !== "SwitchCase") {
          throw new Error("Unknown switch case type '" + caseToken.type + "'");
        }
        if (!found && caseToken.test) {
          const test = stack.executeExpression(caseToken.test);
          if (test !== discriminant) {
            continue;
          }
          found = true;
        }
        if (found) {
          let isBreak = false;
          for (const statement of caseToken.consequent) {
            const result = stack.executeStatement(statement);
            if (result) {
              if (result.break) {
                isBreak = true;
                break;
              } else {
                return result;
              }
            }
          }
          if (isBreak) {
            break;
          }
        }
      }
    } else {
      throw new Error("Unknown token type '" + token.type + "'");
    }
    return null;
  }
}

export default class VM {
  constructor(options) {
    const {
      near,
      code,
      setReactState,
      cache,
      refreshCache,
      confirmTransactions,
      depth,
      widgetSrc,
      requestCommit,
    } = options;

    if (!code) {
      throw new Error("Not a program");
    }

    this.alive = true;

    this.near = near;
    this.code = code;
    this.setReactState = setReactState;
    this.cache = cache;
    this.refreshCache = refreshCache;
    this.confirmTransactions = confirmTransactions;
    this.depth = depth;
    this.widgetSrc = widgetSrc;
    this.requestCommit = requestCommit;
  }

  cachedPromise(promise, subscribe) {
    const invalidate = {
      onInvalidate: () => {
        if (this.alive) {
          this.refreshCache();
        }
      },
      subscribe: !!subscribe,
    };
    return deepCopy(promise(invalidate));
  }

  cachedSocialGet(keys, recursive, blockId, options) {
    keys = Array.isArray(keys) ? keys : [keys];
    return this.cachedPromise(
      (invalidate) =>
        this.cache.socialGet(
          this.near,
          keys,
          recursive,
          blockId,
          options,
          invalidate
        ),
      options?.subscribe
    );
  }

  storageGet(domain, key) {
    return this.cachedPromise((invalidate) =>
      this.cache.localStorageGet(domain, key, invalidate)
    );
  }

  storageSet(domain, key, value) {
    return this.cache.localStorageSet(domain, key, value);
  }

  cachedSocialKeys(keys, blockId, options) {
    keys = Array.isArray(keys) ? keys : [keys];
    return this.cachedPromise(
      (invalidate) =>
        this.cache.cachedViewCall(
          this.near,
          NearConfig.contractName,
          "keys",
          {
            keys,
            options,
          },
          blockId,
          invalidate
        ),
      options?.subscribe
    );
  }

  asyncNearView(contractName, methodName, args, blockId) {
    return this.near.viewCall(contractName, methodName, args, blockId);
  }

  cachedNearView(contractName, methodName, args, blockId, subscribe) {
    return this.cachedPromise(
      (invalidate) =>
        this.cache.cachedViewCall(
          this.near,
          contractName,
          methodName,
          args,
          blockId,
          invalidate
        ),
      subscribe
    );
  }

  cachedNearBlock(blockId, subscribe) {
    return this.cachedPromise(
      (invalidate) => this.cache.cachedBlock(this.near, blockId, invalidate),
      subscribe
    );
  }

  asyncFetch(url, options) {
    return this.cache.asyncFetch(url, options);
  }

  cachedFetch(url, options) {
    return this.cachedPromise(
      (invalidate) => this.cache.cachedFetch(url, options, invalidate),
      options?.subscribe
    );
  }

  cachedIndex(action, key, options) {
    return this.cachedPromise(
      (invalidate) => this.cache.socialIndex(action, key, options, invalidate),
      options?.subscribe
    );
  }

  useCache(promiseGenerator, dataKey, options) {
    return this.cachedPromise(
      (invalidate) =>
        this.cache.cachedCustomPromise(
          {
            widgetSrc: this.widgetSrc,
            dataKey,
          },
          promiseGenerator,
          invalidate
        ),
      options?.subscribe
    );
  }

  socialSet(data, options) {
    return this.requestCommit({
      data,
      force: options?.force,
      onCommit: options?.onCommit,
      onCancel: options?.onCancel,
    });
  }

  renderCode({ props, context, state }) {
    if (this.depth >= MaxDepth) {
      return "Too deep";
    }
    this.gIndex = 0;
    this.state = {
      props: deepCopy(props),
      context,
      state: deepCopy(state),
      nacl: frozenNacl,
      elliptic: frozenElliptic,
    };
    this.loopLimit = LoopLimit;
    this.vmStack = new VmStack(this, undefined, this.state);
    const executionResult = this.vmStack.executeStatement(this.code);
    if (executionResult?.break) {
      throw new Error("BreakStatement outside of a loop");
    }
    const result = executionResult?.result;

    return isReactObject(result) ||
      typeof result === "string" ||
      typeof result === "number" ? (
      result
    ) : (
      <pre>{JSON.stringify(result, undefined, 2)}</pre>
    );
  }
}
