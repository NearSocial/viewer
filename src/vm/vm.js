import React from "react";

export default class VM {
  constructor(near, gkey) {
    this.near = near;
    this.gkey = gkey;
    this.gIndex = 0;
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

  async socialGetr(key) {
    let data = await this.near.contract.get({
      keys: [`${key}/**`],
    });
    console.log(data);
    key.split("/").forEach((part) => {
      data = data?.[part];
    });
    return data;
  }

  async execCode(code) {
    console.log("Executing code:", code?.type);
    const res = await this.execCodeInternal(code);
    console.log(code?.type, res);
    return res;
  }

  async renderElement(code) {
    const element = this.requireJSXIdentifier(code.openingElement.name);
    const attributes = {};
    for (let i = 0; i < code.openingElement.attributes.length; i++) {
      const attribute = code.openingElement.attributes[i];
      if (attribute.type !== "JSXAttribute") {
        throw new Error("Non JSXAttribute: " + attribute.type);
      }
      const name = this.requireJSXIdentifier(attribute.name);
      attributes[name] = await this.execCode(attribute.value);
    }
    attributes.key = `${this.gkey}-${this.gIndex++}`;
    const children = [];
    for (let i = 0; i < code.children.length; i++) {
      children.push(await this.execCode(code.children[i]));
    }
    if (element === "div") {
      return <div {...attributes}>{children}</div>;
    } else if (element === "img") {
      return <img {...attributes} alt={attributes.alt ?? "not defined"} />;
    } else if (element === "br") {
      return <br {...attributes} />;
    } else if (element === "span") {
      return <span {...attributes}>{children}</span>;
    } else {
      throw new Error("Unsupported element: " + element);
    }
  }
  async execCodeInternal(code) {
    if (!code) {
      return null;
    }
    const type = code?.type;
    if (type === "AssignmentExpression") {
      const right = await this.execCode(code.right);
      const left = this.requireIdentifier(code.left);

      if (code.operator === "=") {
        return (this.state[left] = right);
      } else if (code.operator === "+=") {
        return (this.state[left] += right);
      } else if (code.operator === "-=") {
        return (this.state[left] -= right);
      } else if (code.operator === "*=") {
        return (this.state[left] *= right);
      } else if (code.operator === "/=") {
        return (this.state[left] /= right);
      } else {
        throw new Error(
          "Unknown AssignmentExpression operator '" + code.operator + "'"
        );
      }
    } else if (type === "MemberExpression") {
      const object = await this.execCode(code.object);
      const property = this.requireIdentifier(code.property);
      return object?.[property];
    } else if (type === "Identifier") {
      return this.state[code.name];
    } else if (type === "JSXExpressionContainer") {
      return await this.execCode(code.expression);
    } else if (type === "TemplateLiteral") {
      const quasis = [];
      for (let i = 0; i < code.quasis.length; i++) {
        const element = code.quasis[i];
        if (element.type !== "TemplateElement") {
          throw new Error("Unknown quasis type: " + element.type);
        }
        quasis.push(element.value.cooked);
        if (!element.tail) {
          quasis.push(await this.execCode(code.expressions[i]));
        }
      }
      return quasis.join("");
    } else if (type === "CallExpression") {
      const callee = this.requireIdentifier(code.callee);
      if (callee === "socialGetr") {
        const args = [];
        for (let i = 0; i < code.arguments.length; i++) {
          args.push(await this.execCode(code.arguments[i]));
        }
        if (args.length < 1) {
          throw new Error("Missing argument 'keys' for socialGetr");
        }
        return await this.socialGetr(args[0]);
      } else {
        throw new Error("Unknown callee method '" + callee + "'");
      }
    } else if (type === "Literal") {
      return code.value;
    } else if (type === "JSXElement") {
      return await this.renderElement(code);
    } else if (type === "JSXText") {
      return code.value;
    } else if (type === "JSXExpressionContainer") {
      return await this.execCode(code.expression);
    } else if (type === "BinaryExpression") {
      const left = await this.execCode(code.left);
      const right = await this.execCode(code.right);
      if (code.operator === "+") {
        return left + right;
      } else if (code.operator === "-") {
        return left - right;
      } else if (code.operator === "*") {
        return left * right;
      } else if (code.operator === "/") {
        return left * right;
      } else {
        throw new Error(
          "Unknown BinaryExpression operator '" + code.operator + "'"
        );
      }
    } else if (type === "UnaryExpression") {
      const argument = await this.execCode(code.argument);
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
      const left = await this.execCode(code.left);
      if (code.operator === "||") {
        return left || (await this.execCode(code.right));
      } else if (code.operator === "&&") {
        return left && (await this.execCode(code.right));
      } else if (code.operator === "??") {
        return left ?? (await this.execCode(code.right));
      } else {
        throw new Error(
          "Unknown LogicalExpression operator '" + code.operator + "'"
        );
      }
    } else if (type === "ConditionalExpression") {
      const test = await this.execCode(code.test);
      return test
        ? await this.execCode(code.consequent)
        : await this.execCode(code.alternate);
    } else if (type === "UpdateExpression") {
      const argument = this.requireIdentifier(code.argument);
      if (code.operator === "++") {
        return code.prefix ? ++this.state[argument] : this.state[argument]++;
      } else if (code.operator === "--") {
        return code.prefix ? --this.state[argument] : this.state[argument]--;
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
        const key = this.requireIdentifier(property.key);
        object[key] = await this.execCode(property.value);
      }
      return object;
    } else if (type === "ArrayExpression") {
      let array = [];
      for (let i = 0; i < code.elements.length; i++) {
        array.push(await this.execCode(code.elements[i]));
      }
      return array;
    } else {
      throw new Error("Unknown expression type '" + type + "'");
    }
  }

  async renderCode(code, props) {
    if (!code || code.type !== "Program") {
      throw new Error("Not a program");
    }
    this.state = { props };
    this.code = code;
    let lastExpression = null;
    const body = this.code.body;
    for (let i = 0; i < body.length; i++) {
      const token = body[i];
      if (token.type === "VariableDeclaration") {
        for (let j = 0; j < token.declarations.length; j++) {
          const declaration = token.declarations[j];
          if (declaration.type === "VariableDeclarator") {
            this.state[this.requireIdentifier(declaration.id)] =
              await this.execCode(declaration.init);
          }
        }
      } else if (token.type === "ReturnStatement") {
        lastExpression = await this.execCode(token.argument);
        break;
      } else if (token.type === "ExpressionStatement") {
        lastExpression = await this.execCode(token.expression);
      }
    }

    return (typeof lastExpression === "object" &&
      !!lastExpression["$$typeof"]) ||
      typeof lastExpression === "string" ||
      typeof lastExpression === "number" ? (
      lastExpression
    ) : (
      <pre>{JSON.stringify(lastExpression, undefined, 2)}</pre>
    );
  }
}
