"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plantuml_plugin_1 = require("./plantuml_plugin");
/**
 * Initializes the plugin.
 * @param host Reference to the host that is loading the plugin.
 */
function load(host) {
    new plantuml_plugin_1.PlantUmlPlugin().initialize(host.application);
}
exports.load = load;
//# sourceMappingURL=index.js.map