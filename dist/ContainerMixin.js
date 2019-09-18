"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
require("./renderers");
pixi_js_1.Container.prototype.render = function (renderer) {
    if (this._activeParentLayer && this._activeParentLayer != renderer._activeLayer) {
        return;
    }
    if (!this.visible) {
        this.displayOrder = 0;
        return;
    }
    this.displayOrder = renderer.incDisplayOrder();
    // if the object is not visible or the alpha is 0 then no need to render this element
    if (this.worldAlpha <= 0 || !this.renderable) {
        return;
    }
    renderer._activeLayer = null;
    this.containerRenderWebGL(renderer);
    renderer._activeLayer = this._activeParentLayer;
};
pixi_js_1.Container.prototype.containerRenderWebGL = pixi_js_1.Container.prototype.render;
