parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"kpD3":[function(require,module,exports) {

var t,e,n=module.exports={};function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(e){if(t===setTimeout)return setTimeout(e,0);if((t===r||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}function u(t){if(e===clearTimeout)return clearTimeout(t);if((e===o||!e)&&clearTimeout)return e=clearTimeout,clearTimeout(t);try{return e(t)}catch(n){try{return e.call(null,t)}catch(n){return e.call(this,t)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:r}catch(n){t=r}try{e="function"==typeof clearTimeout?clearTimeout:o}catch(n){e=o}}();var c,s=[],l=!1,a=-1;function f(){l&&c&&(l=!1,c.length?s=c.concat(s):a=-1,s.length&&h())}function h(){if(!l){var t=i(f);l=!0;for(var e=s.length;e;){for(c=s,s=[];++a<e;)c&&c[a].run();a=-1,e=s.length}c=null,l=!1,u(t)}}function m(t,e){this.fun=t,this.array=e}function p(){}n.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];s.push(new m(t,e)),1!==s.length||l||i(h)},m.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.env={},n.argv=[],n.version="",n.versions={},n.on=p,n.addListener=p,n.once=p,n.off=p,n.removeListener=p,n.removeAllListeners=p,n.emit=p,n.prependListener=p,n.prependOnceListener=p,n.listeners=function(t){return[]},n.binding=function(t){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(t){throw new Error("process.chdir is not supported")},n.umask=function(){return 0};
},{}],"E66h":[function(require,module,exports) {
var define;
var process = require("process");
var global = arguments[3];
},{"process":"kpD3"}],"liDP":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e(require("phaser"));function e(t){return t&&t.__esModule?t:{default:t}}function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){for(var i=0;i<e.length;i++){var r=e[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,n(r.key),r)}}function s(t,e,i){return e&&o(t.prototype,e),i&&o(t,i),Object.defineProperty(t,"prototype",{writable:!1}),t}function n(t){var e=a(t,"string");return"symbol"===i(e)?e:String(e)}function a(t,e){if("object"!==i(t)||null===t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var o=r.call(t,e||"default");if("object"!==i(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}function l(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&h(t,e)}function h(t,e){return(h=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t})(t,e)}function u(t){var e=p();return function(){var i,r=f(t);if(e){var o=f(this).constructor;i=Reflect.construct(r,arguments,o)}else i=r.apply(this,arguments);return d(this,i)}}function d(t,e){if(e&&("object"===i(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return c(t)}function c(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function p(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}function f(t){return(f=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var y=function(e){l(o,t.default.Scene);var i=u(o);function o(){var t;return r(this,o),(t=i.call(this)).score=0,t}return s(o,[{key:"preload",value:function(){this.load.image("sky","assets/sky.png"),this.load.image("ground","assets/platform.png"),this.load.image("star","assets/star.png"),this.load.image("bomb","assets/bomb.png"),this.load.spritesheet("dude","assets/dude.png",{frameWidth:32,frameHeight:48})}},{key:"create",value:function(){var e,i,r;this.windowWidth=null===(e=this.cameras.main)||void 0===e?void 0:e.width,this.windowHeight=null===(i=this.cameras.main)||void 0===i?void 0:i.height,this.add.tileSprite(0,0,2*this.windowWidth,2*this.windowHeight,"sky"),this.platforms=this.physics.add.staticGroup(),this.platforms.create(0,this.windowHeight-30,"ground").setScale(7,2).refreshBody(),this.platforms.create(0,this.windowHeight/4,"ground"),this.platforms.create(0,this.windowHeight/2,"ground"),this.platforms.create(this.windowWidth/2,this.windowHeight/2+50,"ground"),this.platforms.create(.9*this.windowWidth,this.windowHeight/6,"ground"),this.player=this.physics.add.sprite(100,450,"dude"),this.player.setBounce(.2),this.player.setCollideWorldBounds(!0),this.anims.create({key:"left",frames:this.anims.generateFrameNumbers("dude",{start:0,end:3}),frameRate:10,repeat:-1}),this.anims.create({key:"turn",frames:[{key:"dude",frame:4}],frameRate:20}),this.anims.create({key:"right",frames:this.anims.generateFrameNumbers("dude",{start:5,end:8}),frameRate:10,repeat:-1}),this.player.setGravityY(300),this.playerCollider=this.physics.add.collider(this.player,this.platforms),this.cursors=null===(r=this.input.keyboard)||void 0===r?void 0:r.createCursorKeys(),this.stars=this.physics.add.group({key:"star",repeat:this.windowWidth/70,setXY:{x:12,y:0,stepX:this.windowWidth/(this.windowWidth/70)}}),this.stars.children.iterate(function(e){return e.setBounceY(t.default.Math.FloatBetween(.4,.8)),!0}),this.physics.add.collider(this.stars,this.platforms),this.physics.add.overlap(this.player,this.stars,this.handleCollectStar,void 0,this),this.scoreText=this.add.text(16,16,"Score: 0",{fontSize:"32px",color:"#000"}),this.bombs=this.physics.add.group(),this.physics.add.collider(this.bombs,this.platforms),this.physics.add.collider(this.bombs,this.player,this.handleBombHit,void 0,this),this.add.dom(this.cameras.main.centerX,this.cameras.main.centerY,"div","background-color: black; width: 220px; height: 100px; font: 48px Arial;","Go Right").on("click",this.goRight)}},{key:"update",value:function(){var t,e,i,r,o,s,n,a,l,h,u;(null===(t=this.cursors)||void 0===t?void 0:t.left.isDown)&&!this.gameOver?(null===(e=this.player)||void 0===e||e.setVelocityX(-160),null===(i=this.player)||void 0===i||i.anims.play("left",!0)):(null===(r=this.cursors)||void 0===r?void 0:r.right.isDown)&&!this.gameOver?(null===(o=this.player)||void 0===o||o.setVelocityX(160),null===(s=this.player)||void 0===s||s.anims.play("right",!0)):(null===(n=this.player)||void 0===n||n.setVelocityX(0),null===(a=this.player)||void 0===a||a.anims.play("turn")),(null===(l=this.cursors)||void 0===l?void 0:l.up.isDown)&&(null===(u=null===(h=this.player)||void 0===h?void 0:h.body)||void 0===u?void 0:u.touching.down)&&!this.gameOver&&this.player.setVelocityY(.8*-this.windowHeight)}},{key:"goLeft",value:function(){var t,e;null===(t=this.player)||void 0===t||t.setVelocityX(-160),null===(e=this.player)||void 0===e||e.anims.play("left",!0)}},{key:"goRight",value:function(){var t,e;console.log("asdasd"),null===(t=this.player)||void 0===t||t.setVelocityX(-160),null===(e=this.player)||void 0===e||e.anims.play("left",!0)}},{key:"jumb",value:function(){this.player.setVelocityY(.8*-this.windowHeight)}},{key:"handleCollectStar",value:function(e,i){var r,o;i.disableBody(!0,!0),this.score+=10,this.scoreText.setText("Score: ".concat(this.score)),0===(null===(r=this.stars)||void 0===r?void 0:r.countActive())&&this.stars.children.iterate(function(t){var e=t;e.enableBody(!0,e.x,0,!0,!0)});var s=this.player.x<400?t.default.Math.Between(400,800):t.default.Math.Between(0,400),n=null===(o=this.bombs)||void 0===o?void 0:o.create(s,16,"bomb");n.setBounce(1),n.setCollideWorldBounds(!0),n.setVelocity(t.default.Math.Between(-200,200),20)}},{key:"handleBombHit",value:function(t,e){this.player.setTint(16711680),this.player.anims.play("turn"),this.physics.world.removeCollider(this.playerCollider),this.player.setCollideWorldBounds(!1),this.gameOver=!0,setTimeout(function(){window.location.href=""},5e3)}}]),o}();exports.default=y;
},{"phaser":"E66h"}],"ZCfc":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("phaser")),a=t(require("./scenes/MainScene"));function t(e){return e&&e.__esModule?e:{default:e}}var r={type:e.default.AUTO,scale:{mode:e.default.Scale.FIT,autoCenter:e.default.Scale.CENTER_BOTH,zoom:1},dom:{createContainer:!0},parent:"canvas",backgroundColor:"red",title:"Onion Man",physics:{default:"arcade",arcade:{gravity:{y:300},debug:!1}},scene:[a.default]},d=new e.default.Game(r);exports.default=d;
},{"phaser":"E66h","./scenes/MainScene":"liDP"}]},{},["ZCfc"], null)
//# sourceMappingURL=/main.1e591751.js.map