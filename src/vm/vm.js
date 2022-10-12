import React from "react";
import {
  cachedFetch,
  cachedViewCall,
  socialGet,
  Widget,
} from "../components/Widget/Widget";
import { ipfsUpload, ipfsUrl, Loading } from "../data/utils";
import Files from "react-files";
import { sanitizeUrl } from "@braintree/sanitize-url";
import { NearConfig } from "../data/near";

const LoopLimit = 10000;
const MaxDepth = 32;

const ReactKey = "$$typeof";
const KeywordKey = "$$keyword";
const FunctionKeyword = "Function";
const isReactObject = (o) =>
  o !== null && typeof o === "object" && !!o[ReactKey];
const isKeywordObject = (o) =>
  o !== null && typeof o === "object" && !!o[KeywordKey];
const isFunctionObject = (o) =>
  o !== null && typeof o === "object" && o[KeywordKey] === FunctionKeyword;
const StakeKey = "state";

const ExecutionDebug = false;

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
};

const assertNotReservedKey = (key) => {
  if (key === ReactKey || key === KeywordKey) {
    throw new Error(`${key} is reserved and can't be used`);
  }
};

const assertNotKeywordObject = (obj) => {
  if (isKeywordObject(obj)) {
    throw new Error("Keyword objects shouldn't be modified");
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

export default class VM {
  constructor(near, gkey, code, setReactState, setCache, commitData, depth) {
    if (!code) {
      throw new Error("Not a program");
    }
    this.near = near;
    this.gkey = gkey;
    this.code = code;
    this.setReactState = setReactState;
    this.setCache = setCache;
    this.commitData = commitData;
    this.fetchingCache = {};
    this.alive = true;
    this.depth = depth;
  }

  requireIdentifier(id) {
    if (id.type !== "Identifier") {
      throw new Error("Non identifier: " + id.type);
    }
    return id.name;
  }

  requireJSXIdentifier(id) {
    if (id.type !== "JSXIdentifier") {
      throw new Error("Non JSXIdentifier: " + id.type);
    }
    return id.name;
  }

  cachedPromise(key, promise) {
    if (key in this.cache) {
      return this.cache[key];
    }
    if (!(key in this.fetchingCache)) {
      this.fetchingCache[key] = true;
      promise()
        .then((data) => {
          if (this.alive) {
            this.setCache(
              Object.assign({}, this.cache, {
                [key]: data,
              })
            );
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
    return null;
  }

  cachedSocialGet(key, recursive, blockId, options) {
    return this.cachedPromise(
      `get:${JSON.stringify({ key, recursive, blockId, options })}`,
      () => socialGet(this.near, key, recursive, blockId, options)
    );
  }

  cachedSocialKeys(key, blockId, options) {
    return this.cachedPromise(
      `keys:${JSON.stringify({ key, blockId, options })}`,
      () =>
        cachedViewCall(
          this.near,
          NearConfig.contractName,
          "keys",
          {
            keys: [key],
            options,
          },
          blockId
        )
    );
  }

  cachedNearView(contractName, methodName, args, blockId) {
    return this.cachedPromise(
      `viewCall:${JSON.stringify({ contractName, methodName, args, blockId })}`,
      () => cachedViewCall(this.near, contractName, methodName, args, blockId)
    );
  }

  cachedFetch(url, options) {
    return this.cachedPromise(`fetch:${JSON.stringify({ url, options })}`, () =>
      cachedFetch(url, options)
    );
  }

  executeExpression(code) {
    ExecutionDebug && console.log("Executing code:", code?.type);
    const res = this.execCodeInternal(code);
    ExecutionDebug && console.log(code?.type, res);
    return res;
  }

  renderElement(code) {
    const element = this.requireJSXIdentifier(code.openingElement.name);
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

    for (let i = 0; i < code.openingElement.attributes.length; i++) {
      const attribute = code.openingElement.attributes[i];
      if (attribute.type !== "JSXAttribute") {
        throw new Error("Non JSXAttribute: " + attribute.type);
      }
      const name = this.requireJSXIdentifier(attribute.name);

      if (
        name === "value" &&
        element === "input" &&
        attribute.value.type === "JSXExpressionContainer"
      ) {
        const [obj, key] = this.resolveMemberExpression(
          attribute.value.expression,
          {
            requireState: true,
          }
        );
        attributes.value = obj?.[key] || "";
        attributes.onChange = (e) => {
          e.preventDefault();
          obj[key] = e.target.value;
          this.setReactState(this.state.state);
          return false;
        };
      } else if (name === "data" && element === "CommitButton") {
        attributes.onClick = (e) => {
          e.preventDefault();
          const data = this.executeExpression(attribute.value);
          this.commitData(data);
          return false;
        };
      } else if (
        name === "image" &&
        element === "IpfsImageUpload" &&
        attribute.value.type === "JSXExpressionContainer"
      ) {
        let [obj, key] = this.resolveMemberExpression(
          attribute.value.expression,
          {
            requireState: true,
          }
        );
        status.img = obj[key];
        attributes.onChange = async (files) => {
          obj[key] = null;
          if (files?.length > 0) {
            obj[key] = {
              uploading: true,
              cid: null,
            };
            this.setReactState(this.state.state);
            const cid = await ipfsUpload(files[0]);
            [obj, key] = this.resolveMemberExpression(
              attribute.value.expression,
              {
                requireState: true,
              }
            );
            obj[key] = {
              cid,
            };
          }
          this.setReactState(this.state.state);
          return false;
        };
      } else if (
        name === "onClick" &&
        element === "button" &&
        attribute.value.type === "JSXExpressionContainer"
      ) {
        // console.log(attribute.value);
        const f = this.executeExpression(attribute.value.expression);
        attributes.onClick = (e) => {
          e.preventDefault();
          if (!this.alive) {
            return false;
          }
          if (isFunctionObject(f)) {
            this.executeFunction(f);
          } else {
            throw new Error("onClick is not a function");
          }
          return false;
        };
      } else {
        attributes[name] = this.executeExpression(attribute.value);
      }
    }
    attributes.key = `${this.gkey}-${this.gIndex++}`;
    attributes.dangerouslySetInnerHTML = undefined;
    if (element === "img") {
      attributes.alt = attributes.alt ?? "not defined";
    } else if (element === "a") {
      if ("href" in attributes) {
        attributes.href = sanitizeUrl(attributes.href);
      }
    } else if (element === "Widget") {
      attributes.depth = this.depth + 1;
    }
    const withChildren = ApprovedTags[element];
    if (withChildren === false && code.children.length) {
      throw new Error(
        "And element '" + element + "' contains children, but shouldn't"
      );
    }
    const children = code.children.map((child) =>
      this.executeExpression(child)
    );
    if (element === "Widget") {
      return <Widget {...attributes} />;
    } else if (element === "CommitButton") {
      return <button {...attributes}>{children}</button>;
    } else if (element === "IpfsImageUpload") {
      return (
        <div className="image-upload" key={`${this.gkey}-${this.gIndex++}`}>
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

  callFunction(obj, callee, args) {
    const keyword = obj?.[KeywordKey];
    if (keyword) {
      callee = `${keyword}.${callee}`;
      obj = this.state;
    }

    if (isFunctionObject(obj?.[callee])) {
      const f = obj?.[callee];
      for (let i = 0; i < Math.min(f.params.length, args.length); i++) {
        this.state[f.params[i]] = args[i];
      }
      return this.executeFunction(f);
    }

    if (obj === this.state) {
      if (callee === "Social.getr" || callee === "socialGetr") {
        if (args.length < 1) {
          throw new Error("Missing argument 'keys' for Social.getr");
        }
        return this.cachedSocialGet(args[0], true, args[1], args[2]);
      } else if (callee === "Social.get" || callee === "socialGet") {
        if (args.length < 1) {
          throw new Error("Missing argument 'keys' for Social.get");
        }
        return this.cachedSocialGet(args[0], false, args[1], args[2]);
      } else if (callee === "Near.view") {
        if (args.length < 2) {
          throw new Error(
            "Method: Near.view. Required arguments: 'contractName', 'methodName'. Optional: 'args', 'blockId/finality'"
          );
        }
        return this.cachedNearView(...args);
      } else if (callee === "fetch") {
        if (args.length < 1) {
          throw new Error(
            "Method: fetch. Required arguments: 'url'. Optional: 'options'"
          );
        }
        return this.cachedFetch(...args);
      } else if (callee === "parseInt") {
        return parseInt(...args);
      } else if (callee === "parseFloat") {
        return parseFloat(...args);
      } else if (callee === "isNaN") {
        return isNaN(...args);
      } else if (callee === "Social.keys") {
        if (args.length < 1) {
          throw new Error("Missing argument 'keys' for Social.keys");
        }
        return this.cachedSocialKeys(args[0], args[1], args[2]);
      } else if (callee === "JSON.stringify" || callee === "stringify") {
        if (args.length < 1) {
          throw new Error("Missing argument 'obj' for JSON.stringify");
        }
        return JSON.stringify(args[0], undefined, 2);
      } else if (callee === "JSON.parse") {
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
      } else if (callee === "Object.keys") {
        if (args.length < 1) {
          throw new Error("Missing argument 'obj' for Object.keys");
        }
        return Object.keys(args[0]);
      } else if (callee === "Object.values") {
        if (args.length < 1) {
          throw new Error("Missing argument 'obj' for Object.values");
        }
        return Object.values(args[0]);
      } else if (callee === "Object.entries") {
        if (args.length < 1) {
          throw new Error("Missing argument 'obj' for Object.entries");
        }
        return Object.entries(args[0]);
      } else if (callee === "initState" || callee === "State.init") {
        if (args.length < 1) {
          throw new Error("Missing argument 'initialState' for State.init");
        }
        if (args[0] === null || typeof args[0] !== "object") {
          throw new Error("'initialState' is not an object");
        }
        if (this.state.state !== undefined) {
          return null;
        }
        const newState = JSON.parse(JSON.stringify(args[0]));
        this.setReactState(newState);
        this.state.state = newState;
      } else if (callee === "State.update") {
        if (this.state.state === undefined) {
          throw new Error("The error was not initialized");
        }
        const newState = JSON.parse(JSON.stringify(this.state.state));
        this.setReactState(newState);
        this.state.state = newState;
      } else {
        throw new Error("Unknown callee method '" + callee + "'");
      }
    } else if (Array.isArray(obj)) {
      if (callee === "push") {
        return obj.push(...args);
      } else if (callee === "join") {
        return obj.join(...args);
      } else if (callee === "slice") {
        return obj.slice(...args);
      } else {
        throw new Error("Unknown callee method '" + callee + "' on an array");
      }
    } else if (typeof obj === "string") {
      if (callee === "toLowerCase") {
        return obj.toLowerCase();
      } else if (callee === "toUpperCase") {
        return obj.toUpperCase();
      } else if (callee === "replace") {
        return obj.replace(...args);
      } else if (callee === "replaceAll") {
        return obj.replaceAll(...args);
      } else if (callee === "slice") {
        return obj.slice(...args);
      } else if (callee === "split") {
        return obj.split(...args);
      } else if (callee === "endsWith") {
        return obj.endsWith(...args);
      } else if (callee === "startsWith") {
        return obj.startsWith(...args);
      } else if (callee === "indexOf") {
        return obj.indexOf(...args);
      } else if (callee === "trim") {
        return obj.trim(...args);
      } else if (callee === "trimStart") {
        return obj.trimStart(...args);
      } else if (callee === "trimEnd") {
        return obj.trimEnd(...args);
      } else {
        throw new Error("Unknown callee method '" + callee + "' on a string");
      }
    } else {
      throw new Error(
        "Unsupported callee method '" +
          callee +
          "' on a given object '" +
          obj +
          "'"
      );
    }
  }

  /// Resolves the underlying object and the key to modify.
  /// Should only be used by left hand expressions for assignments.
  /// Options:
  /// - requireState requires the top object key be `state`
  resolveMemberExpression(code, options) {
    if (code.type === "Identifier") {
      assertNotReservedKey(code.name);
      if (options?.requireState && code.name !== StakeKey) {
        throw new Error(`The top object should be ${StakeKey}`);
      }
      return [this.state, code.name];
    } else if (code.type === "MemberExpression") {
      const [innerObj, key] = this.resolveMemberExpression(
        code.object,
        options
      );
      const property = this.resolveKey(code.property, code.computed);
      const obj = innerObj?.[key];
      if (isReactObject(obj)) {
        throw new Error("React objects shouldn't be modified");
      }
      if (!options?.callee) {
        assertNotKeywordObject(obj);
      }
      return [obj, property];
    } else {
      throw new Error("Unsupported member type: '" + code.type + "'");
    }
  }

  execCodeInternal(code) {
    if (!code) {
      return null;
    }
    const type = code?.type;
    if (type === "AssignmentExpression") {
      const [obj, key] = this.resolveMemberExpression(code.left);
      assertNotKeywordObject(obj[key]);
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
      } else {
        throw new Error(
          "Unknown AssignmentExpression operator '" + code.operator + "'"
        );
      }
    } else if (type === "MemberExpression") {
      const obj = this.executeExpression(code.object);
      const key = this.resolveKey(code.property, code.computed);
      return obj?.[key];
    } else if (type === "Identifier") {
      return this.state[code.name];
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
    } else if (type === "CallExpression") {
      const [obj, callee] = this.resolveMemberExpression(code.callee, {
        callee: true,
      });
      const args = code.arguments.map((arg) => this.executeExpression(arg));
      return this.callFunction(obj, callee, args);
    } else if (type === "Literal") {
      return code.value;
    } else if (type === "JSXElement") {
      return this.renderElement(code);
    } else if (type === "JSXText") {
      return code.value;
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
        return left * right;
      } else if (code.operator === "<") {
        return left < right;
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
      } else {
        throw new Error(
          "Unknown BinaryExpression operator '" + code.operator + "'"
        );
      }
    } else if (type === "UnaryExpression") {
      const argument = this.executeExpression(code.argument);
      if (code.operator === "-") {
        return -argument;
      } else if (code.operator === "!") {
        return !argument;
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
      const [obj, key] = this.resolveMemberExpression(code.argument);
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
        if (property.type !== "Property") {
          throw new Error("Unknown property type: " + property.type);
        }
        const key = this.resolveKey(property.key, property.computed);
        object[key] = this.executeExpression(property.value);
        return object;
      }, {});
    } else if (type === "ArrayExpression") {
      return code.elements.map((element) => this.executeExpression(element));
    } else if (type === "JSXEmptyExpression") {
      return null;
    } else if (type === "ArrowFunctionExpression") {
      return this.createFunction(code.params, code.body, code.expression);
    } else {
      throw new Error("Unknown expression type '" + type + "'");
    }
  }

  createFunction(params, body, isExpression) {
    params = params.map((param) => {
      const arg = this.requireIdentifier(param);
      assertNotReservedKey(arg);
      assertNotKeywordObject(this.state[arg]);
      return arg;
    });
    return {
      [KeywordKey]: FunctionKeyword,
      params,
      isExpression,
      body,
    };
  }

  stateAssign(id, value) {
    assertNotKeywordObject(this.state[id]);
    this.state[id] = value;
  }

  executeFunction(f) {
    return f.isExpression
      ? this.executeExpression(f.body)
      : this.executeStatement(f.body);
  }

  executeStatement(token) {
    if (!token || token.type === "EmptyStatement") {
      return null;
    } else if (token.type === "VariableDeclaration") {
      token.declarations.forEach((declaration) => {
        if (declaration.type === "VariableDeclarator") {
          this.stateAssign(
            this.requireIdentifier(declaration.id),
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
      this.stateAssign(
        this.requireIdentifier(token.id),
        this.createFunction(token.params, token.body, token.expression)
      );
    } else if (token.type === "ExpressionStatement") {
      this.executeExpression(token.expression);
    } else if (token.type === "BlockStatement" || token.type === "Program") {
      const body = token.body;
      for (let i = 0; i < body.length; i++) {
        const result = this.executeStatement(body[i]);
        if (result) {
          return result;
        }
      }
    } else if (token.type === "ForStatement") {
      this.executeStatement(token.init);
      while (this.loopLimit-- > 0) {
        if (token.test) {
          const test = this.executeExpression(token.test);
          if (!test) {
            break;
          }
        }
        const result = this.executeStatement(token.body);
        if (result) {
          if (result.break) {
            break;
          } else {
            return result;
          }
        }
        this.executeExpression(token.update);
      }
      if (this.loopLimit <= 0) {
        throw new Error("Exceeded loop limit");
      }
    } else if (token.type === "WhileStatement") {
      while (this.loopLimit-- > 0) {
        const test = this.executeExpression(token.test);
        if (!test) {
          break;
        }
        const result = this.executeStatement(token.body);
        if (result) {
          if (result.break) {
            break;
          } else {
            return result;
          }
        }
      }
      if (this.loopLimit <= 0) {
        throw new Error("Exceeded loop limit");
      }
    } else if (token.type === "IfStatement") {
      const test = this.executeExpression(token.test);
      const result = !!test
        ? this.executeStatement(token.consequent)
        : this.executeStatement(token.alternate);
      if (result) {
        return result;
      }
    } else if (token.type === "BreakStatement") {
      return {
        break: true,
      };
    } else {
      throw new Error("Unknown token type '" + token.type + "'");
    }
    return null;
  }

  renderCode({ props, context, state, cache }) {
    if (this.depth >= MaxDepth) {
      return "Too deep";
    }
    this.gIndex = 0;
    this.state = JSON.parse(
      JSON.stringify({
        props,
        context,
        state,
        JSON: {
          [KeywordKey]: "JSON",
        },
        Object: {
          [KeywordKey]: "Object",
        },
        Social: {
          [KeywordKey]: "Social",
        },
        Near: {
          [KeywordKey]: "Near",
        },
        State: {
          [KeywordKey]: "State",
        },
      })
    );
    this.cache = cache;
    this.loopLimit = LoopLimit;
    const executionResult = this.executeStatement(this.code);
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
