"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
pixi_js_1.Renderer.prototype._lastDisplayOrder = 0;
pixi_js_1.Renderer.prototype._activeLayer = null;
pixi_js_1.Renderer.prototype.incDisplayOrder = function () {
    return ++this._lastDisplayOrder;
};
pixi_js_1.Renderer.prototype.CONTEXT_UID = 0;
pixi_js_1.Renderer.prototype._oldRender = pixi_js_1.Renderer.prototype.render;
pixi_js_1.Renderer.prototype.render = function (displayObject, renderTexture, clear, transform, skipUpdateTransform) {
    if (!renderTexture) {
        this._lastDisplayOrder = 0;
    }
    this._activeLayer = null;
    if (displayObject.isStage) {
        displayObject.updateStage();
    }
    this._oldRender(displayObject, renderTexture, clear, transform, skipUpdateTransform);
};
