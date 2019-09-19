/// <reference path="pixi.js">
import { Container, Renderer } from 'pixi.js';

declare module "pixi.js" {
    interface Container {
        containerRenderWebGL: (renderer: Renderer) => void;
    }
}


import { Point, DisplayObject } from 'pixi.js';
declare module "pixi.js" {
    interface DisplayObject {
        parentGroup: Group;
        parentLayer?: Layer;
        _activeParentLayer?: Layer;
        zOrder?: number;
        updateOrder?: number;
        displayOrder?: number;
        layerableChildren?: boolean;
        isLayer?: boolean;
        containsPoint?(p: Point): boolean;
    }
}
import { utils } from 'pixi.js';


export declare class Group extends utils.EventEmitter {
    static _layerUpdateId: number;
    _activeLayer: Layer;
    _activeStage: Stage;
    _activeChildren: Array<DisplayObject>;
    _lastUpdateId: number;
    useRenderTexture: boolean;
    useDoubleBuffer: boolean;
    sortPriority: number;
    clearColor: ArrayLike<number>;
    canDrawWithoutLayer: boolean;
    canDrawInParentStage: boolean;
    zIndex: number;
    enableSort: boolean;
    constructor(zIndex: number, sorting: boolean | Function);
    _tempResult: Array<DisplayObject>;
    _tempZero: Array<DisplayObject>;
    useZeroOptimization: boolean;
    doSort(layer: Layer, sorted: Array<DisplayObject>): void;
    static compareZIndex(a: DisplayObject, b: DisplayObject): number;
    doSortWithZeroOptimization(layer: Layer, sorted: Array<DisplayObject>): void;
    clear(): void;
    addDisplayObject(stage: Stage, displayObject: DisplayObject): void;
    foundLayer(stage: Stage, layer: Layer): void;
    foundStage(stage: Stage): void;
    check(stage: Stage): void;
    static _lastLayerConflict: number;
    static conflict(): void;
}
declare module '@pixi/interaction' {
    interface InteractionManager {
        _queue: [Array<DisplayObject>, Array<DisplayObject>];
        _displayProcessInteractive: (point: Point, displayObject: DisplayObject, hitTestOrder: number, interactive: boolean, outOfMask: boolean) => number;
        _startInteractionProcess: () => void;
        _queueAdd: (displayObject: DisplayObject, order: number) => void;
        _finishInteractionProcess: (event: InteractionEvent, func: Function) => void;
    }
}
import { RenderTexture, Rectangle } from 'pixi.js';

export declare class LayerTextureCache {
    layer: Layer;
    constructor(layer: Layer);
    renderTexture: RenderTexture;
    doubleBuffer: Array<RenderTexture>;
    currentBufferIndex: number;
    _tempRenderTarget: RenderTexture;
    _tempRenderTargetSource: Rectangle;
    initRenderTexture(renderer?: Renderer): void;
    getRenderTexture(): RenderTexture;
    pushTexture(renderer: Renderer): void;
    popTexture(renderer: Renderer): void;
    destroy(): void;
}
export declare class Layer extends Container {
    constructor(group?: Group);
    isLayer: boolean;
    group: Group;
    _activeChildren: Array<DisplayObject>;
    _tempChildren: Array<DisplayObject>;
    _activeStageParent: Stage;
    _sortedChildren: Array<DisplayObject>;
    _tempLayerParent: Layer;
    textureCache: LayerTextureCache;
    insertChildrenBeforeActive: boolean;
    insertChildrenAfterActive: boolean;
    beginWork(stage: Stage): void;
    endWork(): void;
    useRenderTexture: boolean;
    useDoubleBuffer: boolean;
    clearColor: ArrayLike<number>;
    sortPriority: number;
    getRenderTexture(): RenderTexture;
    updateDisplayLayers(): void;
    doSort(): void;
    _preRender(renderer: Renderer): boolean;
    _postRender(renderer: Renderer): void;
    render(renderer: Renderer): void;
    destroy(options?: any): void;
}
declare module "@pixi/interaction" {
    import * as PIXI from 'pixi.js';
    type InteractionPointerEvents = "pointerdown" | "pointercancel" | "pointerup" | "pointertap" | "pointerupoutside" | "pointermove" | "pointerover" | "pointerout";
    type InteractionTouchEvents = "touchstart" | "touchcancel" | "touchend" | "touchendoutside" | "touchmove" | "tap";
    type InteractionMouseEvents = "rightdown" | "mousedown" | "rightup" | "mouseup" | "rightclick" | "click" | "rightupoutside" | "mouseupoutside" | "mousemove" | "mouseover" | "mouseout";
    type InteractionPixiEvents = "added" | "removed";
    type InteractionEventTypes = InteractionPointerEvents | InteractionTouchEvents | InteractionMouseEvents | InteractionPixiEvents;
    class InteractionEvent {
        constructor();
        stopped: boolean;
        target: PIXI.DisplayObject;
        currentTarget: PIXI.DisplayObject;
        type: string;
        data: PIXI.interaction.InteractionData;
        stopPropagation(): void;
        reset(): void;
    }
    class InteractionManager extends PIXI.utils.EventEmitter {
        constructor(renderer: PIXI.Renderer, options?: {
            autoPreventDefault?: boolean;
            interactionFrequency?: number;
        });
        renderer: PIXI.AbstractRenderer;
        autoPreventDefault: boolean;
        interactionFrequency: number;
        mouse: PIXI.interaction.InteractionData;
        eventData: any;
        protected interactionDOMElement: HTMLElement;
        moveWhenInside: boolean;
        protected eventsAdded: boolean;
        protected mouseOverRenderer: boolean;
        readonly supportsTouchEvents: boolean;
        readonly supportsPointerEvents: boolean;
        cursorStyles: {
            [key: string]: any;
        };
        currentCursorMode: string;
        resolution: number;
        hitTest(globalPoint: PIXI.Point, root?: PIXI.Container): PIXI.DisplayObject;
        setTargetElement(element: HTMLElement, resolution?: number): void;
        update(deltaTime: number): void;
        setCursorMode(mode: string): void;
        mapPositionToPoint(point: PIXI.Point, x: number, y: number): void;
        protected processInteractive(interactionEvent: PIXI.interaction.InteractionEvent, displayObject: PIXI.Container | PIXI.Sprite | PIXI.TilingSprite, func?: (...params: any[]) => any, hitTest?: boolean, interactive?: boolean, skipDelayed?: boolean): boolean;
        destroy(): void;
    }
}







declare module "pixi.js" {
    interface Renderer {
        _lastDisplayOrder: number;
        _activeLayer: Layer;
        incDisplayOrder: () => number;
        _oldRender: (displayObject: DisplayObject, renderTexture?: RenderTexture, clear?: boolean, transform?: Matrix, skipUpdateTransform?: boolean) => void;
        CONTEXT_UID: number;
    }
}
export declare class Stage extends Layer {
    constructor();
    static _updateOrderCounter: number;
    isStage: boolean;
    _tempGroups: Array<DisplayObject>;
    _activeLayers: Array<Layer>;
    _activeParentStage: Stage;
    clear(): void;
    destroy(options?: any): void;
    _addRecursive(displayObject: DisplayObject): void;
    _addRecursiveChildren(displayObject: DisplayObject): void;
    _updateStageInner(): void;
    updateAsChildStage(stage: Stage): void;
    updateStage(): void;
}
