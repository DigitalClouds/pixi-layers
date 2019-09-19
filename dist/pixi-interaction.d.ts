declare module "@pixi/interaction" {
    import * as PIXI from 'pixi.js';
    export type InteractionPointerEvents = "pointerdown" | "pointercancel" | "pointerup" | "pointertap" | "pointerupoutside" | "pointermove" | "pointerover" | "pointerout";
    export type InteractionTouchEvents = "touchstart" | "touchcancel" | "touchend" | "touchendoutside" | "touchmove" | "tap";
    export type InteractionMouseEvents = "rightdown" | "mousedown" | "rightup" | "mouseup" | "rightclick" | "click" | "rightupoutside" | "mouseupoutside" | "mousemove" | "mouseover" | "mouseout";
    export type InteractionPixiEvents = "added" | "removed";
    export type InteractionEventTypes = InteractionPointerEvents | InteractionTouchEvents | InteractionMouseEvents | InteractionPixiEvents;
    /**
     * Event class that mimics native DOM events.
     *
     * @class
     * @memberof PIXI.interaction
     */
    export class InteractionEvent {
        constructor();
        /**
         * Whether this event will continue propagating in the tree.
         *
         * Remaining events for the {@link stopsPropagatingAt} object
         * will still be dispatched.
         *
         * @member {boolean} PIXI.interaction.InteractionEvent#stopped
         */
        stopped: boolean;
        /**
         * The object which caused this event to be dispatched.
         * For listener callback see {@link PIXI.interaction.InteractionEvent.currentTarget}.
         *
         * @member {PIXI.DisplayObject} PIXI.interaction.InteractionEvent#target
         */
        target: PIXI.DisplayObject;
        /**
         * The object whose event listener’s callback is currently being invoked.
         *
         * @member {PIXI.DisplayObject} PIXI.interaction.InteractionEvent#currentTarget
         */
        currentTarget: PIXI.DisplayObject;
        /**
         * Type of the event
         *
         * @member {string} PIXI.interaction.InteractionEvent#type
         */
        type: string;
        /**
         * InteractionData related to this event
         *
         * @member {PIXI.interaction.InteractionData} PIXI.interaction.InteractionEvent#data
         */
        data: PIXI.interaction.InteractionData;
        /**
         * Prevents event from reaching any objects other than the current object.
         *
         */
        stopPropagation(): void;
        /**
         * Resets the event.
         */
        reset(): void;
    }
    /**
     * The interaction manager deals with mouse, touch and pointer events.
     *
     * Any DisplayObject can be interactive if its `interactive` property is set to true.
     *
     * This manager also supports multitouch.
     *
     * An instance of this class is automatically created by default, and can be found at `renderer.plugins.interaction`
     *
     * @class
     * @extends PIXI.utils.EventEmitter
     * @memberof PIXI.interaction
     */
    export class InteractionManager extends PIXI.utils.EventEmitter {
        constructor(renderer: PIXI.Renderer, options?: {
            autoPreventDefault?: boolean;
            interactionFrequency?: number;
        });
        /**
         * The renderer this interaction manager works for.
         *
         * @member {PIXI.AbstractRenderer} PIXI.interaction.InteractionManager#renderer
         */
        renderer: PIXI.AbstractRenderer;
        /**
         * Should default browser actions automatically be prevented.
         * Does not apply to pointer events for backwards compatibility
         * preventDefault on pointer events stops mouse events from firing
         * Thus, for every pointer event, there will always be either a mouse of touch event alongside it.
         *
         * @member {boolean} PIXI.interaction.InteractionManager#autoPreventDefault
         * @default true
         */
        autoPreventDefault: boolean;
        /**
         * Frequency in milliseconds that the mousemove, mouseover & mouseout interaction events will be checked.
         *
         * @member {number} PIXI.interaction.InteractionManager#interactionFrequency
         * @default 10
         */
        interactionFrequency: number;
        /**
         * The mouse data
         *
         * @member {PIXI.interaction.InteractionData} PIXI.interaction.InteractionManager#mouse
         */
        mouse: PIXI.interaction.InteractionData;
        /**
         * An event data object to handle all the event tracking/dispatching
         *
         * @member {object} PIXI.interaction.InteractionManager#eventData
         */
        eventData: any;
        /**
         * The DOM element to bind to.
         *
         * @protected
         * @member {HTMLElement} PIXI.interaction.InteractionManager#interactionDOMElement
         */
        protected interactionDOMElement: HTMLElement;
        /**
         * This property determines if mousemove and touchmove events are fired only when the cursor
         * is over the object.
         * Setting to true will make things work more in line with how the DOM version works.
         * Setting to false can make things easier for things like dragging
         * It is currently set to false as this is how PixiJS used to work. This will be set to true in
         * future versions of pixi.
         *
         * @member {boolean} PIXI.interaction.InteractionManager#moveWhenInside
         * @default false
         */
        moveWhenInside: boolean;
        /**
         * Have events been attached to the dom element?
         *
         * @protected
         * @member {boolean} PIXI.interaction.InteractionManager#eventsAdded
         */
        protected eventsAdded: boolean;
        /**
         * Is the mouse hovering over the renderer?
         *
         * @protected
         * @member {boolean} PIXI.interaction.InteractionManager#mouseOverRenderer
         */
        protected mouseOverRenderer: boolean;
        /**
         * Does the device support touch events
         * https://www.w3.org/TR/touch-events/
         *
         * @readonly
         * @member {boolean} PIXI.interaction.InteractionManager#supportsTouchEvents
         */
        readonly supportsTouchEvents: boolean;
        /**
         * Does the device support pointer events
         * https://www.w3.org/Submission/pointer-events/
         *
         * @readonly
         * @member {boolean} PIXI.interaction.InteractionManager#supportsPointerEvents
         */
        readonly supportsPointerEvents: boolean;
        /**
         * Dictionary of how different cursor modes are handled. Strings are handled as CSS cursor
         * values, objects are handled as dictionaries of CSS values for interactionDOMElement,
         * and functions are called instead of changing the CSS.
         * Default CSS cursor values are provided for 'default' and 'pointer' modes.
         * @member {Object.<string, Object>} PIXI.interaction.InteractionManager#cursorStyles
         */
        cursorStyles: {
            [key: string]: any;
        };
        /**
         * The mode of the cursor that is being used.
         * The value of this is a key from the cursorStyles dictionary.
         *
         * @member {string} PIXI.interaction.InteractionManager#currentCursorMode
         */
        currentCursorMode: string;
        /**
         * The current resolution / device pixel ratio.
         *
         * @member {number} PIXI.interaction.InteractionManager#resolution
         * @default 1
         */
        resolution: number;
        /**
         * Hit tests a point against the display tree, returning the first interactive object that is hit.
         *
         * @param {PIXI.Point} globalPoint - A point to hit test with, in global space.
         * @param {PIXI.Container} [root] - The root display object to start from. If omitted, defaults
         * to the last rendered root of the associated renderer.
         * @return {PIXI.DisplayObject} The hit display object, if any.
         */
        hitTest(globalPoint: PIXI.Point, root?: PIXI.Container): PIXI.DisplayObject;
        /**
         * Sets the DOM element which will receive mouse/touch events. This is useful for when you have
         * other DOM elements on top of the renderers Canvas element. With this you'll be bale to delegate
         * another DOM element to receive those events.
         *
         * @param {HTMLElement} element - the DOM element which will receive mouse and touch events.
         * @param {number} [resolution=1] - The resolution / device pixel ratio of the new element (relative to the canvas).
         */
        setTargetElement(element: HTMLElement, resolution?: number): void;
        /**
         * Updates the state of interactive objects.
         * Invoked by a throttled ticker update from {@link PIXI.Ticker.system}.
         *
         * @param {number} deltaTime - time delta since last tick
         */
        update(deltaTime: number): void;
        /**
         * Sets the current cursor mode, handling any callbacks or CSS style changes.
         *
         * @param {string} mode - cursor mode, a key from the cursorStyles dictionary
         */
        setCursorMode(mode: string): void;
        /**
         * Maps x and y coords from a DOM object and maps them correctly to the PixiJS view. The
         * resulting value is stored in the point. This takes into account the fact that the DOM
         * element could be scaled and positioned anywhere on the screen.
         *
         * @param  {PIXI.Point} point - the point that the result will be stored in
         * @param  {number} x - the x coord of the position to map
         * @param  {number} y - the y coord of the position to map
         */
        mapPositionToPoint(point: PIXI.Point, x: number, y: number): void;
        /**
         * This function is provides a neat way of crawling through the scene graph and running a
         * specified function on all interactive objects it finds. It will also take care of hit
         * testing the interactive objects and passes the hit across in the function.
         *
         * @protected
         * @param {PIXI.interaction.InteractionEvent} interactionEvent - event containing the point that
         *  is tested for collision
         * @param {PIXI.Container|PIXI.Sprite|PIXI.TilingSprite} displayObject - the displayObject
         *  that will be hit test (recursively crawls its children)
         * @param {Function} [func] - the function that will be called on each interactive object. The
         *  interactionEvent, displayObject and hit will be passed to the function
         * @param {boolean} [hitTest] - this indicates if the objects inside should be hit test against the point
         * @param {boolean} [interactive] - Whether the displayObject is interactive
         * @param {boolean} [skipDelayed] - Whether to process delayed events before returning. This is
         *  used to avoid processing them too early during recursive calls.
         * @return {boolean} returns true if the displayObject hit the point
         */
        protected processInteractive(interactionEvent: PIXI.interaction.InteractionEvent, displayObject: PIXI.Container | PIXI.Sprite | PIXI.TilingSprite, func?: (...params: any[]) => any, hitTest?: boolean, interactive?: boolean, skipDelayed?: boolean): boolean;
        /**
         * Destroys the interaction manager
         *
         */
        destroy(): void;
    }
}
