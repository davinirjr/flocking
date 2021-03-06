/*jshint camelcase: true, browser:true, maxlen: 100, curly: true, eqeqeq: true, immed: true, latedef: true, noarg: true, noempty: true, nonew: true, quotmark: true, undef: true, unused: true, strict: true, maxdepth: 3, maxstatements:20, maxcomplexity: 5 */
/* global   THREE:true*/


var Sim = {
        globals: {

                ENERGY: 10,
                MAX_SPEED: 3,
                MAX_FORCE: 0.1,
                SEPARATION_RANGE: 30,
                LOOK_RANGE: 100,
                SMELL_RANGE: 300,
                LENGTH: 20,
                FERTILITY: 0.1,
                BITE: 0.1,
                POPULATION: 15,
                MIN_MASS: 0.5,
                MAX_MASS: 2.5,
                FOOD_RATIO: 0.5,
                SCREEN: 1.5,
                HALF_PI: Math.PI * 0.5,
                TWO_PI: Math.PI * 2
        },
        renderer: {
                fps: 30,
                now: 0,
                then: 0,
                fpsInterval: 1000 / this.fps,
                delta: 0,
                canvas: undefined,
                ctx: undefined,
                init: function init(canvasElem,width,height) {
                        this.canvas = canvasElem;

                        this.then = Date.now();
                        this.fpsInterval = 1000 / this.fps;
                        this.canvas.width = width;
                        this.canvas.height = height;
                        this.ctx = this.canvas.getContext("2d");
                }

        }
};




Sim.globals.initialFood = Sim.globals.POPULATION * Sim.globals.FOOD_RATIO;

var sea = {
        width: 0,
        height: 0,
        population: [],
        food: [],
        obstacles: []
};
