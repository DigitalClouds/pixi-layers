import {Stage} from './Stage';
import {DisplayObject, Transform, Renderer, RenderTexture} from 'pixi.js';
import Matrix = PIXI.Matrix;
import {Layer} from './Layer';
declare module "pixi.js" {
    interface Renderer {
        _lastDisplayOrder: number;
        _activeLayer: Layer;
        incDisplayOrder: () => number;
        _oldRender: (displayObject: DisplayObject, renderTexture?: RenderTexture, clear?: boolean, transform?: Matrix, skipUpdateTransform?: boolean) => void;
        CONTEXT_UID: number;
    }
}

Renderer.prototype._lastDisplayOrder = 0;
Renderer.prototype._activeLayer = null;
Renderer.prototype.incDisplayOrder = function () {
    return ++this._lastDisplayOrder;
};
Renderer.prototype.CONTEXT_UID = 0;
Renderer.prototype._oldRender = Renderer.prototype.render;

Renderer.prototype.render = function (displayObject: DisplayObject, renderTexture?: RenderTexture, clear?: boolean, transform?: Matrix, skipUpdateTransform?: boolean) {
    if (!renderTexture) {
        this._lastDisplayOrder = 0;
    }
    this._activeLayer = null;
    if ((displayObject as Stage).isStage) {
        (displayObject as Stage).updateStage()
    }
    this._oldRender(displayObject, renderTexture, clear, transform, skipUpdateTransform);
}


