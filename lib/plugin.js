var plantuml = require("node-plantuml");
var path = require("path");
var fs = require("fs");
var pako = require("pako");
var encode64 = require("./encode64");

function plugin (pluginHost, cb) {

    var umlExpression = /<uml(?:\s+alt\s*=\s*['"](.+)['"]\s*)?>([\s\S]*?)<\/uml>/gi,
        encodedUmlExpression = /<img src="http:\/\/www\.plantuml\.com\/plantuml\/(?:img|png|svg)\/([^"]*)"(?: alt="(.*)")?>/g,
        outputDirectory,
        server = "http://www.plantuml.com/plantuml/",
        format,
        location,
        autoClassDiagramPosition,
        autoClassDiagramHideEmptyMembers,
        autoClassDiagramTopDownLayoutMaxSiblings;

    var app = pluginHost.application;

    // setup options
    app.options.addDeclaration({
        name: 'umlLocation',
        help: 'local|remote',
        defaultValue: 'local'
    });

    app.options.addDeclaration({
        name: 'umlFormat',
        help: 'png|svg',
        defaultValue: 'png'
    });

    app.options.addDeclaration({
        name: 'umlClassDiagramPosition',
        help: 'above|below',
        defaultValue: null
    });

    app.options.addDeclaration({
        name: 'umlClassDiagramHideEmptyMembers',
        help: 'true|false',
        defaultValue: 'false'
    });

    app.options.addDeclaration({
        name: 'umlClassDiagramTopDownLayoutMaxSiblings',
        help: 'An integer indicating the max number of siblings to be used with the default top down layout.',
        defaultValue: 8
    });

    // on resolve replace uml blocks with image link to encoded uml data
    app.converter.on("resolveEnd", function (context) {

        // ensure valid format
        format = app.options.getValue("umlFormat");
        if (format) {
            format = format.toLowerCase();
        }
        if (format != "png" && format != "svg") {
            format = "png";
        }

        // ensure valid location
        location = app.options.getValue("umlLocation");
        if (location) {
            location = location.toLowerCase();
        }
        if (location != "local" && location != "remote") {
            location = "local";
        }

        // check if class diagrams should be generated
        autoClassDiagramPosition = app.options.getValue("umlClassDiagramPosition");
        if (autoClassDiagramPosition) {
            // position for the automatic generation of class diagrams
            autoClassDiagramPosition = autoClassDiagramPosition.toLowerCase();

            if (autoClassDiagramPosition != "above" && autoClassDiagramPosition != "below") {
                autoClassDiagramPosition = "below";
            }

            // more options regarding the automatic generation of class diagrams
            autoClassDiagramHideEmptyMembers = app.options.getValue("umlClassDiagramHideEmptyMembers");
            if (autoClassDiagramHideEmptyMembers) {
                autoClassDiagramHideEmptyMembers = autoClassDiagramHideEmptyMembers.toLowerCase();
            }
            if (autoClassDiagramHideEmptyMembers != "true" && autoClassDiagramHideEmptyMembers != "false") {
                autoClassDiagramHideEmptyMembers = "false";
            }

            autoClassDiagramTopDownLayoutMaxSiblings = app.options.getValue("umlClassDiagramTopDownLayoutMaxSiblings");
            if (autoClassDiagramTopDownLayoutMaxSiblings) {
                autoClassDiagramTopDownLayoutMaxSiblings = parseInt(autoClassDiagramTopDownLayoutMaxSiblings, 10);
            }
            if (!autoClassDiagramTopDownLayoutMaxSiblings) {
                autoClassDiagramTopDownLayoutMaxSiblings = 8;
            }
        }

        var project = context.project;

        // go through all the comments
        for (var key in project.reflections) {
            var reflection = project.reflections[key];

            if(reflection.comment) {
                // add UML tag for class diagram only for classes and interfaces
                if (autoClassDiagramPosition && (reflection.kind == 128 || reflection.kind == 256)) {
                    addClassDiagramPlantUmlToComment(reflection);
                }
    
                // convert UML tags to PlantUML image links
                reflection.comment.shortText = processText(reflection.comment.shortText);
                reflection.comment.text = processText(reflection.comment.text);
            }
        }
    });

    /**
     * Removes duplicates from an array of reflections.
     * @param {Reflection[]} reflections The array from which duplicates should be removed.
     * @returns {Reflection[]} The new array without duplicates.
     */
    function removeDuplicatesFromReflectionArray(reflections) {
        if (reflections.length == 0)
            return [];

        var newArray = []; // this array is returned

        // We use a map and the reflection's name as the key to remove duplicates.
        var mapObj = {};

        for (var i = 0; i < reflections.length; ++i) {
            mapObj[reflections[i].name] = reflections[i];
        }

        for (var key in mapObj) {
            newArray.push(mapObj[key]);
        }

        return newArray;
    }

    /**
     * Returns all (recursive) reflections the given reflection is extending or implementing.
     * @param {Reflection} reflection The reflection whoes parent types are wanted.
     * @returns {Reflection[]} The reflections the given reflection is extending or implementing.
     */
    function getParentTypesForReflection(reflection) {
        var parentTypes = [];

        // add all extended types of the reflection
        if (reflection.extendedTypes) {
            for (var i = 0; i < reflection.extendedTypes.length; ++i) {
                if (reflection.extendedTypes[i].reflection) {
                    parentTypes.push(reflection.extendedTypes[i].reflection);
                    parentTypes = parentTypes.concat(getParentTypesForReflection(reflection.extendedTypes[i].reflection));
                }
            }
        }

        // add all implemented types of the reflection
        if (reflection.implementedTypes) {
            for (var i = 0; i < reflection.implementedTypes.length; ++i) {
                if (reflection.implementedTypes[i].reflection) {
                    parentTypes.push(reflection.implementedTypes[i].reflection);
                    parentTypes = parentTypes.concat(getParentTypesForReflection(reflection.implementedTypes[i].reflection));
                }
            }
        }

        return removeDuplicatesFromReflectionArray(parentTypes);
    }

    /**
     * Returns all (recursive) reflections the given reflection is extended by or implemented by.
     * @param {Reflection} reflection The reflection whoes sub types are wanted.
     * @returns {Reflection[]} The reflections the given reflection is extended by or implemented by.
     */
    function getSubTypesForReflection(reflection) {
        var subTypes = [];

        // add all extensions of the reflection
        if (reflection.extendedBy) {
            for (var i = 0; i < reflection.extendedBy.length; ++i) {
                if (reflection.extendedBy[i].reflection) {
                    subTypes.push(reflection.extendedBy[i].reflection);
                    subTypes = subTypes.concat(getSubTypesForReflection(reflection.extendedBy[i].reflection));
                }
            }
        }

        // add all implementations of the reflection
        if (reflection.implementedBy) {
            for (var i = 0; i < reflection.implementedBy.length; ++i) {
                if (reflection.implementedBy[i].reflection) {
                    subTypes.push(reflection.implementedBy[i].reflection);
                    subTypes = subTypes.concat(getSubTypesForReflection(reflection.implementedBy[i].reflection));
                }
            }
        }

        return removeDuplicatesFromReflectionArray(subTypes);
    }

    /**
     * Returns the reflections the given reflection is extending.
     * @param {Reflection} reflection The reflection whoes extended types are wanted.
     * @returns {Reflection[]} The reflections the given reflection is extending.
     */
    function getExtendedTypesForReflection(reflection) {
        var extendedTypes = [];

        if (reflection.extendedTypes) {
            // build a list of all extended types of the reflection
            for (var i = 0; i < reflection.extendedTypes.length; ++i) {
                if (reflection.extendedTypes[i].reflection) {
                    extendedTypes.push(reflection.extendedTypes[i].reflection);
                }
            }
        }

        return extendedTypes;
    }

    /**
     * Returns the reflections that are extending the given reflection.
     * @param {Reflection} reflection The reflection whoes sub types are wanted.
     * @returns {Reflection[]} The reflections that are extending the given reflection.
     */
    function getExtendedBysForReflection(reflection) {
        var extendedBys = [];

        if (reflection.extendedBy) {
            // build a list of all types extending the reflection
            for (var i = 0; i < reflection.extendedBy.length; ++i) {
                if (reflection.extendedBy[i].reflection) {
                    extendedBys.push(reflection.extendedBy[i].reflection);
                }
            }
        }

        return extendedBys;
    }

    /**
     * Returns the reflections the given reflection is implementing.
     * @param {Reflection} reflection The reflection whoes implemented types are wanted.
     * @returns {Reflection[]} The reflections the given reflection is implementing.
     */
    function getImplementedTypesForReflection(reflection) {
        var implementedTypes = [];

        if (reflection.implementedTypes) {
            // build a list of all implemented types of the reflection
            // note: this list also includes all implemented types that base classes are implementing
            for (var i = 0; i < reflection.implementedTypes.length; ++i) {
                if (reflection.implementedTypes[i].reflection) {
                    implementedTypes.push(reflection.implementedTypes[i].reflection);
                }
            }

            if (reflection.extendedTypes) {
                var extendedTypeParents = [];

                // build a list of all parent types of the extended types
                for (var i = 0; i < reflection.extendedTypes.length; ++i) {
                    if (reflection.extendedTypes[i].reflection) {
                        extendedTypeParents = extendedTypeParents.concat(getParentTypesForReflection(reflection.extendedTypes[i].reflection));
                    }
                }

                // remove all implemented types that are implemented by base classes
                for (var i = 0; i < extendedTypeParents.length; ++i) {
                    for (var j = 0; j < implementedTypes.length; ++j) {
                        if (implementedTypes[j].name == extendedTypeParents[i].name) {
                            implementedTypes.splice(j, 1);
                            --j;
                        }
                    }
                }
            }
        }

        return implementedTypes;
    }

    /**
     * Returns the reflections that are implementing the given reflection.
     * @param {Reflection} reflection The reflection whoes implementations are wanted.
     * @returns {Reflection[]} The reflections that are implementing the given reflection.
     */
    function getImplementedBysForReflection(reflection) {
        var implementedBys = [];

        if (reflection.implementedBy) {
            // build a list of all implementations of the reflection
            // note: this list also includes sub classes
            for (var i = 0; i < reflection.implementedBy.length; ++i) {
                if (reflection.implementedBy[i].reflection) {
                    implementedBys.push(reflection.implementedBy[i].reflection);
                }
            }

            // build a list of all sub types of the implementations
            var implementedBySubTypes = [];

            for (var i = 0; i < implementedBys.length; ++i) {
                implementedBySubTypes = implementedBySubTypes.concat(getSubTypesForReflection(implementedBys[i]));
            }

            // remove all implementations that are sub classes of implementations
            for (var i = 0; i < implementedBySubTypes.length; ++i) {
                for (var j = 0; j < implementedBys.length; ++j) {
                    if (implementedBys[j].name == implementedBySubTypes[i].name) {
                        implementedBys.splice(j, 1);
                        --j;
                    }
                }
            }
        }

        return implementedBys;
    }

    /**
     * Creates a UML-tag with a class diagram in the comment of the reflection.
     * @param {Reflection} reflection The reflection whoes comment is extended.
     */
    function addClassDiagramPlantUmlToComment(reflection) {
        var plantUmlLines = [];
        var siblingsAbove = 0;
        var siblingsBelow = 0;

        // add class/interface
        if (reflection.kind == 128) {
            plantUmlLines.push("class " + reflection.name);
        } else if (reflection.kind == 256) {
            plantUmlLines.push("interface " + reflection.name);
        }

        // add classes/interfaces this type is extending
        var extendedTypes = getExtendedTypesForReflection(reflection);

        for (var i = 0; i < extendedTypes.length; ++i) {
            if (extendedTypes[i].kind == 128) {
                plantUmlLines.push("class " + extendedTypes[i].name);
            } else if (extendedTypes[i].kind == 256) {
                plantUmlLines.push("interface " + extendedTypes[i].name);
            }

            plantUmlLines.push(extendedTypes[i].name + " <|-- " + reflection.name);
            ++siblingsAbove;
        }

        // add classes/interfaces this type is implementing
        var implementedTypes = getImplementedTypesForReflection(reflection);

        for (var i = 0; i < implementedTypes.length; ++i) {
            if (implementedTypes[i].kind == 128) {
                plantUmlLines.push("class " + implementedTypes[i].name);
            } else if (implementedTypes[i].kind == 256) {
                plantUmlLines.push("interface " + implementedTypes[i].name);
            }

            plantUmlLines.push(implementedTypes[i].name + " <|.. " + reflection.name);
            ++siblingsAbove;
        }

        // add classes/interfaces that are extending this type
        var extendedBys = getExtendedBysForReflection(reflection);

        for (var i = 0; i < extendedBys.length; ++i) {
            if (extendedBys[i].kind == 128) {
                plantUmlLines.push("class " + extendedBys[i].name);
            } else if (extendedBys[i].kind == 256) {
                plantUmlLines.push("interface " + extendedBys[i].name);
            }

            plantUmlLines.push(reflection.name + " <|-- " + extendedBys[i].name);
            ++siblingsBelow;
        }

        // add classes that are implementing this type
        var implementedBys = getImplementedBysForReflection(reflection);

        for (var i = 0; i < implementedBys.length; ++i) {
            if (implementedBys[i].kind == 128) {
                plantUmlLines.push("class " + implementedBys[i].name);
            } else if (implementedBys[i].kind == 256) {
                plantUmlLines.push("interface " + implementedBys[i].name);
            }

            plantUmlLines.push(reflection.name + " <|.. " + implementedBys[i].name);
            ++siblingsBelow;
        }

        // Only add class diagramm, if there is inheritance or implementation involved.
        if (plantUmlLines.length > 1) {
            plantUmlLines.unshift("<uml>");

            if (autoClassDiagramHideEmptyMembers == "true") {
                plantUmlLines.splice(1, 0, "hide empty members");
            }

            if (siblingsAbove > autoClassDiagramTopDownLayoutMaxSiblings || siblingsBelow > autoClassDiagramTopDownLayoutMaxSiblings) {
                plantUmlLines.splice(1, 0, "left to right direction");
            }

            plantUmlLines.push("</uml>");

            if (autoClassDiagramPosition == "above") {
                // the two spaces are necessary to generate a line break in markdown
                reflection.comment.shortText = plantUmlLines.join("\n") + "  \n" + reflection.comment.shortText;
            } else {
                reflection.comment.text = reflection.comment.text + "\n" + plantUmlLines.join("\n");
            }
        }
    }

    /**
     * Replaces UML-tags in a comment with Markdown image links.
     * @param {string} text The text of the comment to process.
     * @returns {string} The processed text of the comment.
     */
    function processText(text) {
        var match,
            index = 0,
            segments = [];

        // if we have comment body text look for uml blocks
        if(text) {
            while ((match = umlExpression.exec(text)) != null) {

                segments.push(text.substring(index, match.index));

                // replace the uml block with a link to plantuml.com with the encoded uml data
                if (match[2]) {
                    segments.push("![");
                    if (match[1]) {
                        // alternate text
                        segments.push(match[1]);
                    }
                    segments.push("](" + server + format + "/");
                    segments.push(encode(match[2]));
                    segments.push(")");
                }

                index = match.index + match[0].length;
            }

            // write modified comment back
            if(segments.length > 0) {
                segments.push(text.substring(index, text.length));
                return segments.join("");
            }
        }

        return text;
    }

    function encode(text) {

        return encode64.encode(pako.deflate(text, { level: 9, to: 'string' }));
    }

    // get the output directory
    app.renderer.on("beginRender", function(event) {

        outputDirectory = path.join(event.outputDirectory, "assets/images/");
    });

    // append style to main.css
    app.renderer.on("endRender", function(event) {

        var filename = path.join(event.outputDirectory, "assets/css/main.css");
        var data = fs.readFileSync(filename, "utf8") + "\n.uml { max-width: 100%; }\n";
        fs.writeFileSync(filename, data, "utf8");
    });

    // on render replace the external urls with local ones
    app.renderer.on("endPage", function(page) {

        // rewrite the image links to: 1) generate local images, 2) transform to <object> tag for svg, 3) add css class
        var contents = page.contents,
            index = 0,
            match,
            segments = [],
            started = 0;

        if (contents) {
            while ((match = encodedUmlExpression.exec(contents)) != null) {

                segments.push(contents.substring(index, match.index));

                // get the image source
                var src = match[1],
                    alt = match[2];

                // decode image and write to disk if using local images
                if (location == "local") {
                    // keep track of how many images are still being written to disk
                    started++;
                    src = writeLocalImage(page.filename, src, function () {
                        started--;
                        if (started == 0 && match == null && cb) {
                            cb();
                        }
                    });
                }
                else {
                    // this is the case where we have a remote file, so we don't need to write out the image but
                    // we need to add the server back into the image source since it was removed by the regex
                    src = server + format + "/" + src;
                }

                // re-write image tag
                if (format == "png") {
                    segments.push("<img class=\"uml\" src=");
                    // replace external path in content with path to image to assets directory
                    segments.push("\"" + src + "\"");
                    if (alt) {
                        segments.push(" alt=\"" + alt + "\"");
                    }
                    segments.push(">");
                }
                else {
                    segments.push("<object type=\"image/svg+xml\" class=\"uml\" data=\"");
                    segments.push(src);
                    segments.push("\">");
                    if (alt) {
                        segments.push(alt);
                    }
                    segments.push("</object>");
                }

                index = match.index + match[0].length;
            }

            // write modified contents back to page
            if (segments.length > 0) {
                segments.push(contents.substring(index, contents.length));
                page.contents = segments.join("");
            }
        }

        // if local images were not generated then call the callback now if we have one
        if(location == "remote" && cb) {
            setTimeout(cb, 0);
        }
    });

    // the uml image number
    var num = 0;

    function writeLocalImage(pageFilename, src, cb) {

        // setup plantuml encoder and decoder
        var decode = plantuml.decode(src);
        var gen = plantuml.generate({format: format});

        // get image filename
        var filename = "uml" + (++num) + "." + format;
        var imagePath = path.join(outputDirectory, filename);

        // decode and save png to assets directory
        decode.out.pipe(gen.in);
        gen.out.pipe(fs.createWriteStream(imagePath));
        gen.out.on('finish', cb);

        // get relative path filename
        var currentDirectory = path.dirname(pageFilename);
        // return the relative path
        return path.relative(currentDirectory, imagePath);
    }
}

module.exports = plugin;
