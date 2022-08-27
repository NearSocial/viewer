import React from "react";

export default class VM {
  constructor(near) {
    this.near = near;
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
      if (attribute.value.type !== "JSXExpressionContainer") {
        throw new Error("Non JSXExpressionContainer: " + attribute.value.type);
      }
      attributes[name] = await this.execCode(attribute.value.expression);
    }
    const children = [];
    for (let i = 0; i < code.children.length; i++) {
      children.push(await this.execCode(code.children[i]));
    }
    if (element === "div") {
      return <div {...attributes}>{children}</div>;
    } else if (element === "img") {
      return <img {...attributes} />;
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
      } else {
        throw new Error("Unknown operator '" + code.operator + "'");
      }
    } else if (type === "MemberExpression") {
      const object = await this.execCode(code.object);
      const property = this.requireIdentifier(code.property);
      return object?.[property];
    } else if (type === "Identifier") {
      return this.state[code.name];
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
        return await this.execCode(token.argument);
      } else if (token.type === "ExpressionStatement") {
        return await this.execCode(token.expression);
      }
    }

    return <div>Test</div>;
  }
}
