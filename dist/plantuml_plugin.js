"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
var plantuml = require("node-plantuml"); // there are no type definitions for this module :-(
var fs = require("fs");
var path = require("path");
var typedoc_1 = require("typedoc");
var converter_1 = require("typedoc/dist/lib/converter");
var events_1 = require("typedoc/dist/lib/output/events");
var plantuml_plugin_options_1 = require("./plantuml_plugin_options");
var plantuml_utils_1 = require("./plantuml_utils");
var typedoc_utils_1 = require("./typedoc_utils");
/**
 * The PlantUML plugin.
 *
 * # What does it do?
 *
 * This plugin replaces PlantUML diagrams embedded in UML tags within comments by images.
 *
 * # How does it do it?
 *
 * 1. If the plugin option for automatically creating UML diagrams is enabled the plugin scans through
 *    all declaration reflections' comments and injects a UML tag into them. The UML tag contains the
 *    PlantUML code that represents the class diagram for that reflection.
 *
 * 2. The plugin replaces each UML tag within a comment by markdown for an image with a URL to
 *    the official PlantUML server. The URL contains the encoded PlantUML lines from the UML tag.
 *
 * 3. If the plugin option for generating local images is enabled the plugin uses the node-plantuml
 *    module to generate image files out of the image URLs from step one and stores them as local files.
 *    The markdown for the images is updated respectively.
 */
var PlantUmlPlugin = /** @class */ (function () {
    function PlantUmlPlugin() {
        /** Number of generated local image files. */
        this.numberOfGeneratedImages = 0;
        /** The options of this plugin. */
        this.options = new plantuml_plugin_options_1.PlantUmlPluginOptions();
    }
    /**
     * Initializes the plugin.
     * @param typedoc The TypeDoc application.
     */
    PlantUmlPlugin.prototype.initialize = function (typedoc) {
        this.addOptionsToApplication(typedoc);
        this.subscribeToApplicationEvents(typedoc);
    };
    /**
     * Adds the plugin's options to the application's options.
     * @param typedoc The TypeDoc application.
     */
    PlantUmlPlugin.prototype.addOptionsToApplication = function (typedoc) {
        this.options.addToApplication(typedoc);
    };
    /**
     * Subscribes to events of the application so that the plugin can do its work
     * in the particular doc generation phases.
     * @param typedoc The TypeDoc application.
     */
    PlantUmlPlugin.prototype.subscribeToApplicationEvents = function (typedoc) {
        var _this = this;
        typedoc.converter.on(converter_1.Converter.EVENT_RESOLVE_BEGIN, function (c) { return _this.onConverterResolveBegin(c); });
        typedoc.converter.on(converter_1.Converter.EVENT_RESOLVE_END, function (c) { return _this.onConverterResolveEnd(c); });
        typedoc.renderer.on(events_1.RendererEvent.BEGIN, function (e) { return _this.onRendererBegin(e); });
        typedoc.renderer.on(events_1.RendererEvent.END, function (e) { return _this.onRendererEnd(e); });
        typedoc.renderer.on(events_1.PageEvent.END, function (e) { return _this.onRendererEndPage(e); });
    };
    /**
     * Triggered when the TypeDoc converter begins resolving a project.
     * Reads plugin parameter values.
     * @param context Describes the current state the converter is in.
     */
    PlantUmlPlugin.prototype.onConverterResolveBegin = function (context) {
        this.options.readValuesFromApplication(context.converter.owner.application);
    };
    /**
     * Triggered when the TypeDoc converter has finished resolving a project.
     * Replaces UML tags in comments with image links to encoded UML data.
     * @param context Describes the current state the converter is in.
     */
    PlantUmlPlugin.prototype.onConverterResolveEnd = function (context) {
        var project = context.project;
        // go through all the reflections' comments
        for (var key in project.reflections) {
            var reflection = project.reflections[key];
            if (reflection && reflection.comment) {
                if (this.shouldCreateClassDiagramForReflection(reflection)) {
                    this.insertUmlTagWithClassDiagramIntoCommentOfReflection(reflection);
                }
                this.handleUmlTagsInCommentOfReflection(reflection);
            }
        }
    };
    /**
     * Returns if a class diagram should be generated for the given reflection.
     * @param reflection The reflection for which the question is asked.
     * @returns True, if a class diagram should be generated for the given reflection, otherwise false.
     */
    PlantUmlPlugin.prototype.shouldCreateClassDiagramForReflection = function (reflection) {
        if ((this.options.autoClassDiagramType === plantuml_plugin_options_1.ClassDiagramType.Simple ||
            this.options.autoClassDiagramType === plantuml_plugin_options_1.ClassDiagramType.Detailed) &&
            reflection instanceof typedoc_1.DeclarationReflection &&
            (reflection.kind === typedoc_1.ReflectionKind.Class || reflection.kind === typedoc_1.ReflectionKind.Interface) &&
            reflection.comment) {
            return true;
        }
        return false;
    };
    /**
     * Inserts an UML tag containing the PlantUML for a class diagram into the comment of the reflection.
     * @param reflection The reflection whoes comment should be manipulated.
     */
    PlantUmlPlugin.prototype.insertUmlTagWithClassDiagramIntoCommentOfReflection = function (reflection) {
        if (reflection.comment) {
            var classDiagramPlantUmlLines = this.getClassDiagramPlantUmlForReflection(reflection);
            if (classDiagramPlantUmlLines.length > 0) {
                if (this.options.autoClassDiagramPosition === plantuml_plugin_options_1.ClassDiagramPosition.Above) {
                    reflection.comment.shortText =
                        "<uml>\n" +
                            classDiagramPlantUmlLines.join("\n") +
                            "\n</uml>  \n" + // the two spaces are needed to generate a line break in markdown
                            reflection.comment.shortText;
                }
                else {
                    reflection.comment.text =
                        reflection.comment.text + "\n<uml>\n" + classDiagramPlantUmlLines.join("\n") + "\n</uml>";
                }
            }
        }
    };
    /**
     * Generates the Plant UML lines for the class diagram of the given reflection.
     * @param reflection The reflection for which to generate a class diagram.
     * @returns The Plant UML lines for the class diagram of the given reflection.
     *          If the given reflection is not part of an inheritance or implementation, the result is an empty array.
     */
    PlantUmlPlugin.prototype.getClassDiagramPlantUmlForReflection = function (reflection) {
        var includeChildren = this.options.autoClassDiagramType === plantuml_plugin_options_1.ClassDiagramType.Detailed;
        var plantUmlLines = new Array();
        var siblingsAbove = 0;
        var siblingsBelow = 0;
        // add class/interface
        plantUmlLines = plantUmlLines.concat(plantuml_utils_1.PlantUmlUtils.getPlantUmlForReflection(reflection, includeChildren));
        // add classes/interfaces this type is extending
        var extendedTypes = typedoc_utils_1.TypeDocUtils.getExtendedTypesForReflection(reflection);
        for (var _i = 0, extendedTypes_1 = extendedTypes; _i < extendedTypes_1.length; _i++) {
            var type = extendedTypes_1[_i];
            plantUmlLines = plantUmlLines.concat(plantuml_utils_1.PlantUmlUtils.getPlantUmlForReflection(type, includeChildren));
            plantUmlLines.push(type.name + " <|-- " + reflection.name);
            ++siblingsAbove;
        }
        // add classes/interfaces this type is implementing
        var implementedTypes = typedoc_utils_1.TypeDocUtils.getImplementedTypesForReflection(reflection);
        for (var _a = 0, implementedTypes_1 = implementedTypes; _a < implementedTypes_1.length; _a++) {
            var type = implementedTypes_1[_a];
            plantUmlLines = plantUmlLines.concat(plantuml_utils_1.PlantUmlUtils.getPlantUmlForReflection(type, includeChildren));
            plantUmlLines.push(type.name + " <|.. " + reflection.name);
            ++siblingsAbove;
        }
        // add classes/interfaces that are extending this type
        var extendedBys = typedoc_utils_1.TypeDocUtils.getExtendedBysForReflection(reflection);
        for (var _b = 0, extendedBys_1 = extendedBys; _b < extendedBys_1.length; _b++) {
            var type = extendedBys_1[_b];
            plantUmlLines = plantUmlLines.concat(plantuml_utils_1.PlantUmlUtils.getPlantUmlForReflection(type, includeChildren));
            plantUmlLines.push(reflection.name + " <|-- " + type.name);
            ++siblingsBelow;
        }
        // add classes that are implementing this type
        var implementedBys = typedoc_utils_1.TypeDocUtils.getImplementedBysForReflection(reflection);
        for (var _c = 0, implementedBys_1 = implementedBys; _c < implementedBys_1.length; _c++) {
            var type = implementedBys_1[_c];
            plantUmlLines = plantUmlLines.concat(plantuml_utils_1.PlantUmlUtils.getPlantUmlForReflection(type, includeChildren));
            plantUmlLines.push(reflection.name + " <|.. " + type.name);
            ++siblingsBelow;
        }
        // Return no UML if there is no inheritance or implementation involved
        if (siblingsAbove + siblingsBelow === 0) {
            plantUmlLines = [];
        }
        else {
            if (this.options.autoClassDiagramHideEmptyMembers) {
                plantUmlLines.unshift("hide empty fields");
                plantUmlLines.unshift("hide empty methods");
            }
            if (this.options.autoClassDiagramHideCircledChar) {
                plantUmlLines.unshift("hide circle");
            }
            if (siblingsAbove > this.options.autoClassDiagramTopDownLayoutMaxSiblings ||
                siblingsBelow > this.options.autoClassDiagramTopDownLayoutMaxSiblings) {
                plantUmlLines.unshift("left to right direction");
            }
            if (this.options.autoClassDiagramMemberVisibilityStyle === plantuml_plugin_options_1.ClassDiagramMemberVisibilityStyle.Text) {
                plantUmlLines.unshift("skinparam ClassAttributeIconSize 0");
            }
            if (this.options.autoClassDiagramHideShadow) {
                plantUmlLines.unshift("skinparam Shadowing false");
            }
            if (this.options.autoClassDiagramBoxBorderRadius) {
                plantUmlLines.unshift("skinparam RoundCorner " + this.options.autoClassDiagramBoxBorderRadius);
            }
            if (this.options.autoClassDiagramBoxBackgroundColor) {
                plantUmlLines.unshift("skinparam ClassBackgroundColor " + this.options.autoClassDiagramBoxBackgroundColor);
            }
            if (this.options.autoClassDiagramBoxBorderColor) {
                plantUmlLines.unshift("skinparam ClassBorderColor " + this.options.autoClassDiagramBoxBorderColor);
            }
            if (this.options.autoClassDiagramBoxBorderWidth >= 0) {
                plantUmlLines.unshift("skinparam ClassBorderThickness " + this.options.autoClassDiagramBoxBorderWidth);
            }
            if (this.options.autoClassDiagramArrowColor) {
                plantUmlLines.unshift("skinparam ClassArrowColor " + this.options.autoClassDiagramArrowColor);
            }
            if (this.options.autoClassDiagramClassFontName) {
                plantUmlLines.unshift("skinparam ClassFontName " + this.options.autoClassDiagramClassFontName);
            }
            if (this.options.autoClassDiagramClassFontSize) {
                plantUmlLines.unshift("skinparam ClassFontSize " + this.options.autoClassDiagramClassFontSize);
            }
            if (this.options.autoClassDiagramClassFontStyle !== plantuml_plugin_options_1.FontStyle.Undefined) {
                plantUmlLines.unshift("skinparam ClassFontStyle " + this.options.autoClassDiagramClassFontStyle.toString());
            }
            if (this.options.autoClassDiagramClassFontColor) {
                plantUmlLines.unshift("skinparam ClassFontColor " + this.options.autoClassDiagramClassFontColor);
            }
            if (this.options.autoClassDiagramClassAttributeFontName) {
                plantUmlLines.unshift("skinparam ClassAttributeFontName " + this.options.autoClassDiagramClassAttributeFontName);
            }
            if (this.options.autoClassDiagramClassAttributeFontSize) {
                plantUmlLines.unshift("skinparam ClassAttributeFontSize " + this.options.autoClassDiagramClassAttributeFontSize);
            }
            if (this.options.autoClassDiagramClassAttributeFontStyle !== plantuml_plugin_options_1.FontStyle.Undefined) {
                plantUmlLines.unshift("skinparam ClassAttributeFontStyle " +
                    this.options.autoClassDiagramClassAttributeFontStyle.toString());
            }
            if (this.options.autoClassDiagramClassAttributeFontColor) {
                plantUmlLines.unshift("skinparam ClassAttributeFontColor " + this.options.autoClassDiagramClassAttributeFontColor);
            }
        }
        return plantUmlLines;
    };
    /**
     * Convert UML tags within the comment of the reflection into PlantUML image links.
     * @param reflection The reflection whoes comment should be manipulated.
     */
    PlantUmlPlugin.prototype.handleUmlTagsInCommentOfReflection = function (reflection) {
        if (reflection.comment) {
            reflection.comment.shortText = this.handleUmlTags(reflection.comment.shortText);
            reflection.comment.text = this.handleUmlTags(reflection.comment.text);
        }
    };
    /**
     * Replaces UML-tags in a comment with Markdown image links.
     * @param text The text of the comment to process.
     * @returns The processed text of the comment.
     */
    PlantUmlPlugin.prototype.handleUmlTags = function (text) {
        // regexp for finding UML tags
        var umlExpression = /<uml(?:\s+alt\s*=\s*['"](.+)['"]\s*)?>([\s\S]*?)<\/uml>/gi;
        // if we have comment body text look for uml blocks
        if (text) {
            var index = 0;
            var segments = new Array();
            var match = umlExpression.exec(text);
            while (match != null) {
                segments.push(text.substring(index, match.index));
                // replace the uml block with a link to plantuml.com with the encoded uml data
                if (match[2]) {
                    segments.push("![");
                    if (match[1]) {
                        // alternate text
                        segments.push(match[1]);
                    }
                    segments.push("](" + plantuml_utils_1.PlantUmlUtils.plantUmlServerUrl + this.options.outputImageFormat.toString() + "/~1");
                    segments.push(plantuml_utils_1.PlantUmlUtils.encode(match[2]));
                    segments.push(")");
                }
                index = match.index + match[0].length;
                match = umlExpression.exec(text);
            }
            // write modified comment back
            if (segments.length > 0) {
                segments.push(text.substring(index, text.length));
                return segments.join("");
            }
        }
        return text;
    };
    /**
     * Triggered before the renderer starts rendering a project.
     * @param event The event emitted by the renderer class.
     */
    PlantUmlPlugin.prototype.onRendererBegin = function (event) {
        this.typeDocImageDirectory = path.join(event.outputDirectory, "assets/images/");
    };
    /**
     * Triggered after the renderer has written all documents.
     * @param event The event emitted by the renderer class.
     */
    PlantUmlPlugin.prototype.onRendererEnd = function (event) {
        // append style to main.css
        var filename = path.join(event.outputDirectory, "assets/css/main.css");
        var data = fs.readFileSync(filename, "utf8") + "\n.uml { max-width: 100%; }\n";
        fs.writeFileSync(filename, data, "utf8");
    };
    /**
     * Triggered after a document has been rendered, just before it is written to disc.
     * Generates local image files and updates the image urls in the comments.
     * @param event The event emitted by the renderer class.
     */
    PlantUmlPlugin.prototype.onRendererEndPage = function (event) {
        // regexp for finding PlantUML image tags
        var encodedUmlExpression = /<img src="http:\/\/www\.plantuml\.com\/plantuml\/(?:img|png|svg)\/([^"]*)"(?: alt="(.*)")?>/g;
        // replace the external urls with local ones
        // rewrite the image links to: 1) generate local images, 2) transform to <object> tag for svg, 3) add css class
        var contents = event.contents;
        if (contents) {
            var index = 0;
            var segments = new Array();
            var match = encodedUmlExpression.exec(contents);
            while (match != null) {
                segments.push(contents.substring(index, match.index));
                // get the image source
                var src = match[1];
                var alt = match[2];
                // decode image and write to disk if using local images
                if (this.options.outputImageLocation === plantuml_plugin_options_1.ImageLocation.Local) {
                    src = this.writeLocalImage(event.filename, src);
                }
                else {
                    // this is the case where we have a remote file, so we don't need to write out the image but
                    // we need to add the server back into the image source since it was removed by the regex
                    src = plantuml_utils_1.PlantUmlUtils.plantUmlServerUrl + this.options.outputImageFormat.toString() + "/~1" + src;
                }
                // re-write image tag
                if (this.options.outputImageFormat === plantuml_plugin_options_1.ImageFormat.PNG) {
                    segments.push('<img class="uml" src=');
                    // replace external path in content with path to image to assets directory
                    segments.push('"' + src + '"');
                    if (alt) {
                        segments.push(' alt="' + alt + '"');
                    }
                    segments.push(">");
                }
                else {
                    segments.push('<object type="image/svg+xml" class="uml" data="');
                    segments.push(src);
                    segments.push('">');
                    if (alt) {
                        segments.push(alt);
                    }
                    segments.push("</object>");
                }
                index = match.index + match[0].length;
                match = encodedUmlExpression.exec(contents);
            }
            // write modified contents back to page
            if (segments.length > 0) {
                segments.push(contents.substring(index, contents.length));
                event.contents = segments.join("");
            }
        }
    };
    /**
     * Writes a class diagram as a local image to the disc.
     * @param pageFilename The filename of the generated TypeDoc page.
     * @param src The image URL of the class diagram.
     * @returns The relative path to the generated image file.
     */
    PlantUmlPlugin.prototype.writeLocalImage = function (pageFilename, src) {
        // setup plantuml encoder and decoder
        var decode = plantuml.decode(src);
        var gen = plantuml.generate({ format: this.options.outputImageFormat.toString() });
        // get image filename
        var filename = "uml" + ++this.numberOfGeneratedImages + "." + this.options.outputImageFormat.toString();
        var imagePath = path.join(this.typeDocImageDirectory, filename);
        // decode and save png to assets directory
        decode.out.pipe(gen.in);
        gen.out.pipe(fs.createWriteStream(imagePath));
        // get relative path filename
        var currentDirectory = path.dirname(pageFilename);
        // return the relative path
        return path.relative(currentDirectory, imagePath);
    };
    return PlantUmlPlugin;
}());
exports.PlantUmlPlugin = PlantUmlPlugin;
//# sourceMappingURL=plantuml_plugin.js.map