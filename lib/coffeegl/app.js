// Generated by CoffeeScript 1.6.1

/* ABOUT
                       __  .__              ________ 
   ______ ____   _____/  |_|__| ____   ____/   __   \
  /  ___// __ \_/ ___\   __\  |/  _ \ /    \____    /
  \___ \\  ___/\  \___|  | |  (  <_> )   |  \ /    / 
 /____  >\___  >\___  >__| |__|\____/|___|  //____/  .co.uk
      \/     \/     \/                    \/         
                                              CoffeeGL
                                              Benjamin Blundell - ben@section9.co.uk
                                              http://www.section9.co.uk

This software is released under the MIT Licence. See LICENCE.txt for details

- Resources

* http://www.yuiblog.com/blog/2007/06/12/module-pattern/
* http://www.plexical.com/blog/2012/01/25/writing-coffeescript-for-browser-and-nod/
* https://github.com/field/FieldKit.js
*/


(function() {
  var App, CoffeeGLError, CoffeeGLLog, Colour, Matrix4, OrthoCamera, PerspCamera, Shader, Vec2, Vec3, Vec4, makeDebugContext, makeMouseEmitter, makeTouchEmitter, _ref, _ref1, _ref2, _ref3,
    _this = this;

  _ref = require("./math"), Vec2 = _ref.Vec2, Vec3 = _ref.Vec3, Vec4 = _ref.Vec4, Matrix4 = _ref.Matrix4;

  Shader = require("./shader").Shader;

  _ref1 = require("./camera"), PerspCamera = _ref1.PerspCamera, OrthoCamera = _ref1.OrthoCamera;

  _ref2 = require("./signal"), makeMouseEmitter = _ref2.makeMouseEmitter, makeTouchEmitter = _ref2.makeTouchEmitter;

  Colour = require("./colour").Colour;

  _ref3 = require("./error"), CoffeeGLError = _ref3.CoffeeGLError, CoffeeGLLog = _ref3.CoffeeGLLog;

  makeDebugContext = require("./debug").makeDebugContext;

  /* App
  */


  App = (function() {

    function App(element, app_context, init, draw, update, onError, debug) {
      var _this = this;
      this.app_context = app_context;
      this.init = init;
      this.draw = draw;
      this.update = update;
      this.onError = onError;
      this.debug = debug != null ? debug : false;
      this.getDelta = function() {
        return App.prototype.getDelta.apply(_this, arguments);
      };
      this.run = function() {
        return App.prototype.run.apply(_this, arguments);
      };
      this.totalTime = 0.0;
      this.loops = 0;
      this.maxFrameSkip = 10;
      this.nextGameTick = (new Date).getTime();
      this.resources = 0;
      this.startTime = Date.now();
      this.oldTime = this.startTime;
      this.canvas = document.getElementById(element);
      this.height = this.canvas.height;
      this.width = this.canvas.width;
      this.gl = this.canvas.getContext('experimental-webgl');
      if (this.gl == null) {
        this.gl = canvas.getContext('webgl');
      }
      if (!this.gl) {
        if (this.onError != null) {
          this.onError();
        }
        CoffeeGLError("WebGL Not supported or context not found", "App");
        return;
      }
      this.profile();
      if (this.debug) {
        CoffeeGLLog("creating OpenGL debug context");
        makeDebugContext(this.gl);
      }
      this.resize(this.width, this.height);
      this._init();
    }

    App.prototype.profile = function() {
      var highp;
      this.profile = {};
      this.profile.antialias = this.gl.getContextAttributes().antialias;
      this.profile.aa_size = this.gl.getParameter(this.gl.SAMPLES);
      highp = this.gl.getShaderPrecisionFormat(this.gl.FRAGMENT_SHADER, this.gl.HIGH_FLOAT);
      this.profile.highpSupported = highp.precision !== 0;
      this.profile.maxTexSize = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE);
      this.profile.maxCubeSize = this.gl.getParameter(this.gl.MAX_CUBE_MAP_TEXTURE_SIZE);
      this.profile.maxRenderbufferSize = this.gl.getParameter(this.gl.MAX_RENDERBUFFER_SIZE);
      this.profile.vertexTextureUnits = this.gl.getParameter(this.gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
      this.profile.fragmentTextureUnits = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
      this.profile.combinedUnits = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
      this.profile.maxVSattribs = this.gl.getParameter(this.gl.MAX_VERTEX_ATTRIBS);
      this.profile.maxVertexShaderUniforms = this.gl.getParameter(this.gl.MAX_VERTEX_UNIFORM_VECTORS);
      this.profile.maxFragmentShaderUniforms = this.gl.getParameter(this.gl.MAX_FRAGMENT_UNIFORM_VECTORS);
      this.profile.maxVaryings = this.gl.getParameter(this.gl.MAX_VARYING_VECTORS);
      return console.log(this.profile);
    };

    App.prototype.run = function() {
      this._draw();
      return this._update(this.getDelta());
    };

    App.prototype._init = function() {
      CoffeeGL.Context = this;
      if (typeof window !== "undefined" && window !== null) {
        window.GL = this.gl;
      }
      if (typeof window !== "undefined" && window !== null) {
        makeMouseEmitter(this);
      }
      if (typeof window !== "undefined" && window !== null) {
        makeTouchEmitter(this);
      }
      if (this.init != null) {
        this.init.call(this.app_context);
      }
      if (typeof window !== "undefined" && window !== null) {
        window.onEachFrame(this.run);
      }
      return this;
    };

    App.prototype.getDelta = function() {
      var deltaTime;
      deltaTime = Date.now() - this.oldTime;
      this.oldTime = Date.now();
      return deltaTime;
    };

    App.prototype.resize = function(w, h) {
      if (this.canvas) {
        if (this.gl) {
          this.width = w;
          this.height = h;
          this.gl.viewportWidth = this.width;
          this.gl.viewportHeight = this.height;
          return this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
        }
      }
    };

    App.prototype._draw = function() {
      CoffeeGL.Context = this;
      if (typeof window !== "undefined" && window !== null) {
        window.GL = this.gl;
      }
      if (this.draw != null) {
        return this.draw.call(this.app_context);
      }
    };

    App.prototype._update = function(dt) {
      if (this.update != null) {
        return this.update.call(this.app_context, dt);
      }
    };

    return App;

  })();

  module.exports = {
    App: App
  };

}).call(this);