import React from "react";
import { socialGet, Widget } from "../components/Widget/Widget";

const LoopLimit = 10000;

const ReactKey = "$$typeof";
const KeywordKey = "$$keyword";
const isReactObject = (o) =>
  o !== null && typeof o === "object" && !!o[ReactKey];
const isKeywordObject = (o) =>
  o !== null && typeof o === "object" && !!o[KeywordKey];
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
  input: true,
  br: false,
  hr: false,
  img: false,
  Widget: false,
  CommitButton: true,
};

const assertNotReservedKey = (key) => {
  if (key === ReactKey || key === KeywordKey) {
    throw new Error(`${key} is reserved and can't be used`);
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
  constructor(near, gkey, code, setReactState, setCache, commitData) {
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

  cachedSocialGet(key, recursive) {
    return this.cachedPromise(`get:${recursive}:${key}`, () =>
      socialGet(this.near, key, recursive)
    );
  }

  cachedSocialKeys(key) {
    return this.cachedPromise(`keys:${key}`, () =>
      this.near.contract.keys({
        keys: [key],
      })
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
    if (element === "input") {
      attributes.className = "form-control";
    } else if (element === "CommitButton") {
      attributes.className = "btn btn-success";
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
        attributes.value = obj?.[key];
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
      } else {
        attributes[name] = this.executeExpression(attribute.value);
      }
    }
    attributes.key = `${this.gkey}-${this.gIndex++}`;
    if (element === "img") {
      attributes.alt = attributes.alt ?? "not defined";
    }
    const withChildren = ApprovedTags[element];
    if (withChildren === false && code.children.length) {
      throw new Error(
        "And element '" + element + "' contains children, but shouldn't"
      );
    }
    const children = [];
    for (let i = 0; i < code.children.length; i++) {
      children.push(this.executeExpression(code.children[i]));
    }
    if (element === "Widget") {
      return <Widget {...attributes} />;
    } else if (element === "CommitButton") {
      return <button {...attributes}>{children}</button>;
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

    if (obj === this.state) {
      if (callee === "Social.getr" || callee === "socialGetr") {
        if (args.length < 1) {
          throw new Error("Missing argument 'keys' for Social.getr");
        }
        return this.cachedSocialGet(args[0], true);
      } else if (callee === "Social.get" || callee === "socialGet") {
        if (args.length < 1) {
          throw new Error("Missing argument 'keys' for Social.get");
        }
        return this.cachedSocialGet(args[0], false);
      } else if (callee === "Social.keys") {
        if (args.length < 1) {
          throw new Error("Missing argument 'keys' for Social.keys");
        }
        return this.cachedSocialKeys(args[0]);
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
      } else if (callee === "initState") {
        if (args.length < 1) {
          throw new Error("Missing argument 'initialState' for initState");
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
    } else {
      throw new Error(
        "Unsupported callee method '" + callee + "' on a given object"
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
      if (!options?.callee && isKeywordObject(obj)) {
        throw new Error("Keyword objects shouldn't be modified");
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
      const [obj, key] = this.resolveMemberExpression(code.left, true);
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
      const args = [];
      for (let i = 0; i < code.arguments.length; i++) {
        args.push(this.executeExpression(code.arguments[i]));
      }
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
      let object = {};
      for (let i = 0; i < code.properties.length; i++) {
        const property = code.properties[i];
        if (property.type !== "Property") {
          throw new Error("Unknown property type: " + property.type);
        }
        const key = this.resolveKey(property.key, property.computed);
        object[key] = this.executeExpression(property.value);
      }
      return object;
    } else if (type === "ArrayExpression") {
      let array = [];
      for (let i = 0; i < code.elements.length; i++) {
        array.push(this.executeExpression(code.elements[i]));
      }
      return array;
    } else if (type === "JSXEmptyExpression") {
      return null;
    } else {
      throw new Error("Unknown expression type '" + type + "'");
    }
  }

  executeStatement(token) {
    if (!token || token.type === "EmptyStatement") {
      return null;
    } else if (token.type === "VariableDeclaration") {
      for (let j = 0; j < token.declarations.length; j++) {
        const declaration = token.declarations[j];
        if (declaration.type === "VariableDeclarator") {
          this.state[this.requireIdentifier(declaration.id)] =
            this.executeExpression(declaration.init);
        }
      }
    } else if (token.type === "ReturnStatement") {
      return {
        result: this.executeExpression(token.argument),
      };
    } else if (token.type === "ExpressionStatement") {
      this.executeExpression(token.expression);
    } else if (token.type === "BlockStatement") {
      const result = this.executeCode(token);
      if (result) {
        return result;
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
        const result = this.executeCode(token.body);
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
        const result = this.executeCode(token.body);
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
        ? this.executeCode(token.consequent)
        : this.executeCode(token.alternate);
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

  executeCode(code) {
    if (!code) {
      return null;
    }
    if (code.type === "EmptyStatement") {
      return null;
    }
    if (code.type !== "Program" && code.type !== "BlockStatement") {
      throw new Error("Unknown code type '" + code.type + "'");
    }
    const body = code.body;
    for (let i = 0; i < body.length; i++) {
      const result = this.executeStatement(body[i]);
      if (result) {
        return result;
      }
    }
    return null;
  }

  renderCode({ props, context, state, cache }) {
    this.gIndex = 0;
    this.state = JSON.parse(
      JSON.stringify({
        props,
        context,
        state,
        JSON: {
          $$keyword: "JSON",
        },
        Object: {
          $$keyword: "Object",
        },
        Social: {
          $$keyword: "Social",
        },
      })
    );
    this.cache = cache;
    this.loopLimit = LoopLimit;
    const executionResult = this.executeCode(this.code);
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
