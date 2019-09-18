import {Container, Renderer} from 'pixi.js';
import "./renderers"

declare module "pixi.js" {
    interface Container {
        containerRenderWebGL: (renderer: Renderer) => void;
    }
}

Container.prototype.render = function (renderer: Renderer): void {
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

Container.prototype.containerRenderWebGL = Container.prototype.render;


