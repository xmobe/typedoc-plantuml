"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pako = require("pako");
var index_1 = require("typedoc/dist/lib/models/index");
/**
 * Class with utility functions regarding PlantUML code.
 */
var PlantUmlUtils = /** @class */ (function () {
    function PlantUmlUtils() {
    }
    /**
     * Returns an array of PlantUML lines for generating the box (including its properties and methods) of a given type.
     * @param reflection The reflection for which the PlantUML should be generated.
     * @param includeChildren Specifies whether the resulting PlantUML should include the properties and methods of
     *                        the given reflection as well.
     * @returns The PlantUML lines for the given type.
     */
    PlantUmlUtils.getPlantUmlForReflection = function (reflection, includeChildren) {
        var plantUmlLines = new Array();
        if (reflection.kind === index_1.ReflectionKind.Class || reflection.kind === index_1.ReflectionKind.Interface) {
            plantUmlLines.push(PlantUmlUtils.getPlantUmlForClassOrInterface(reflection) + " {");
            if (includeChildren && reflection.children) {
                for (var _i = 0, _a = reflection.children; _i < _a.length; _i++) {
                    var children = _a[_i];
                    if (children.kind === index_1.ReflectionKind.Property) {
                        plantUmlLines.push(PlantUmlUtils.getPlantUmlForProperty(children));
                    }
                    else if (children.kind === index_1.ReflectionKind.Method) {
                        plantUmlLines.push(PlantUmlUtils.getPlantUmlForMethod(children));
                    }
                }
            }
            plantUmlLines.push("}");
        }
        return plantUmlLines;
    };
    /**
     * Encodes the given string to a nearly base64 format.
     * @param text The string to encode.
     * @returns The encoded string.
     */
    PlantUmlUtils.encode = function (text) {
        return PlantUmlUtils.encode64(pako.deflate(text, { level: 9, to: "string" }));
    };
    /**
     * Returns the PlantUML line for generating the output for a given property.
     * @param property The property for which the PlantUML should be generated.
     * @returns The PlantUML line for the given property.
     */
    PlantUmlUtils.getPlantUmlForProperty = function (property) {
        var plantUml = "";
        if (property.flags.isStatic) {
            plantUml += "{static} ";
        }
        if (property.flags.isPrivate) {
            plantUml += "-";
        }
        else if (property.flags.isProtected) {
            plantUml += "#";
        }
        else {
            plantUml += "+"; // default is public for JS/TS
        }
        plantUml += property.name;
        if (property.type instanceof index_1.IntrinsicType ||
            property.type instanceof index_1.ReferenceType ||
            property.type instanceof index_1.TypeParameterType ||
            property.type instanceof index_1.UnknownType) {
            plantUml += " : " + property.type.name;
        }
        return plantUml;
    };
    /**
     * Returns the PlantUML line for generating the output for a given method.
     * @param methode The method for which the PlantUML should be generated.
     * @returns The PlantUML line for the given method.
     */
    PlantUmlUtils.getPlantUmlForMethod = function (method) {
        var plantUml = "";
        if (method.flags.isStatic) {
            plantUml += "{static} ";
        }
        if (method.flags.isAbstract) {
            plantUml += "{abstract} ";
        }
        if (method.flags.isPrivate) {
            plantUml += "-";
        }
        else if (method.flags.isProtected) {
            plantUml += "#";
        }
        else {
            plantUml += "+"; // public is default for JS/TS
        }
        plantUml += method.name + "()";
        if (method.type) {
            if (method.type instanceof index_1.IntrinsicType ||
                method.type instanceof index_1.ReferenceType ||
                method.type instanceof index_1.TypeParameterType ||
                method.type instanceof index_1.UnknownType) {
                plantUml += " : " + method.type.name;
            }
        }
        else {
            plantUml += " : void";
        }
        return plantUml;
    };
    /**
     * Returns the PlantUML line for the introduction of a class or interface.
     * @param reflection The class or interface for which the PlantUML should be generated.
     * @returns The PlantUML line for the given class or interface.
     */
    PlantUmlUtils.getPlantUmlForClassOrInterface = function (reflection) {
        var plantUml = "";
        if (reflection.flags.isStatic) {
            plantUml += "static ";
        }
        if (reflection.flags.isAbstract) {
            plantUml += "abstract ";
        }
        if (reflection.kind === index_1.ReflectionKind.Class) {
            plantUml += "class ";
        }
        else {
            plantUml += "interface ";
        }
        plantUml += reflection.name;
        return plantUml;
    };
    /**
     * Returns a 6-bit encoded version of the given byte.
     * @param b The byte to encode.
     * @returns The encoded byte.
     */
    PlantUmlUtils.encode6bit = function (b) {
        if (b < 10) {
            return String.fromCharCode(48 + b);
        }
        b -= 10;
        if (b < 26) {
            return String.fromCharCode(65 + b);
        }
        b -= 26;
        if (b < 26) {
            return String.fromCharCode(97 + b);
        }
        b -= 26;
        if (b === 0) {
            return "-";
        }
        if (b === 1) {
            return "_";
        }
        return "?";
    };
    /**
     * Appends 3 bytes using a 6-bit encoding.
     * @param b1 Byte one.
     * @param b2 Byte two.
     * @param b3 Byte three.
     * @returns The appended three bytes with a 6-bit encoding.
     */
    PlantUmlUtils.append3bytes = function (b1, b2, b3) {
        var c1 = b1 >> 2;
        var c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
        var c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
        var c4 = b3 & 0x3f;
        var r = "";
        r += PlantUmlUtils.encode6bit(c1 & 0x3f);
        r += PlantUmlUtils.encode6bit(c2 & 0x3f);
        r += PlantUmlUtils.encode6bit(c3 & 0x3f);
        r += PlantUmlUtils.encode6bit(c4 & 0x3f);
        return r;
    };
    /**
     * Returns a 64-bit encoding of a given data string.
     * @param data The data string to encode.
     * @returns The 64-bit encoded version of the data string.
     * @remarks Code taken from: http://plantuml.sourceforge.net/codejavascript2.html
     *          It is described as being "a transformation close to base64".
     *          The code has been slightly modified to pass linters.
     */
    PlantUmlUtils.encode64 = function (data) {
        var r = "";
        for (var i = 0; i < data.length; i += 3) {
            if (i + 2 === data.length) {
                r += PlantUmlUtils.append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
            }
            else if (i + 1 === data.length) {
                r += PlantUmlUtils.append3bytes(data.charCodeAt(i), 0, 0);
            }
            else {
                r += PlantUmlUtils.append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), data.charCodeAt(i + 2));
            }
        }
        return r;
    };
    /** URL to the PlantUML web page, where one can generate UML diagrams. */
    PlantUmlUtils.plantUmlServerUrl = "http://www.plantuml.com/plantuml/";
    return PlantUmlUtils;
}());
exports.PlantUmlUtils = PlantUmlUtils;
//# sourceMappingURL=plantuml_utils.js.map