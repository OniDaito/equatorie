;(function(e,t,n){function r(n,i){if(!t[n]){if(!e[n]){var s=typeof require=="function"&&require;if(!i&&s)return s(n,!0);throw new Error("Cannot find module '"+n+"'")}var o=t[n]={exports:{}};e[n][0](function(t){var i=e[n][1][t];return r(i?i:t)},o,o.exports)}return t[n].exports}for(var i=0;i<n.length;i++)r(n[i]);return r})({1:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
/*
                       __  .__              ________ 
   ______ ____   _____/  |_|__| ____   ____/   __   \
  /  ___// __ \_/ ___\   __\  |/  _ \ /    \____    /
  \___ \\  ___/\  \___|  | |  (  <_> )   |  \ /    / 
 /____  >\___  >\___  >__| |__|\____/|___|  //____/  .co.uk
      \/     \/     \/                    \/         
                                              CoffeeGL
                                              Benjamin Blundell - ben@section9.co.uk
                                              http://www.section9.co.uk

This software is released under Creative Commons Attribution Non-Commercial Share Alike
http://creativecommons.org/licenses/by-nc-sa/3.0/
*/


(function() {
  var Equatorie, EquatorieString, EquatorieSystem, cgl, eq,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  EquatorieSystem = require('./system').EquatorieSystem;

  EquatorieString = require('./string').EquatorieString;

  Equatorie = (function() {
    function Equatorie() {
      this.draw = __bind(this.draw, this);
      this.onPhysicsEvent = __bind(this.onPhysicsEvent, this);
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
    }

    Equatorie.prototype.init = function() {
      var controller, cube, g, planets, r0,
        _this = this;
      this.top_node = new CoffeeGL.Node();
      this.string_height = 0.4;
      this.pickable = new CoffeeGL.Node();
      this.fbo_picking = new CoffeeGL.Fbo();
      this.ray = new CoffeeGL.Vec3(0, 0, 0);
      this.picked = void 0;
      this.test = 0;
      this.basic_nodes = new CoffeeGL.Node();
      this.mp = new CoffeeGL.Vec2(-1, -1);
      this.mpp = new CoffeeGL.Vec2(-1, -1);
      this.mpd = new CoffeeGL.Vec2(0, 0);
      this.mdown = false;
      this.system = new EquatorieSystem();
      r0 = new CoffeeGL.Request('../shaders/basic.glsl');
      r0.get(function(data) {
        var r1;
        _this.shader_basic = new CoffeeGL.Shader(data, {
          "uColour": "uColour"
        });
        _this.top_node.add(_this.basic_nodes);
        _this.basic_nodes.shader = _this.shader_basic;
        _this.deferent.shader = _this.shader_basic;
        _this.equant.shader = _this.shader_basic;
        _this.marker.shader = _this.shader_basic;
        r1 = new CoffeeGL.Request('../shaders/basic_lighting.glsl');
        return r1.get(function(data) {
          var r2;
          _this.shader = new CoffeeGL.Shader(data, {
            "uAmbientLightingColor": "uAmbientLightingColor"
          });
          r2 = new CoffeeGL.Request('../models/equatorie.js');
          return r2.get(function(data) {
            var q, r3;
            _this.g = new CoffeeGL.JSONModel(data);
            _this.top_node.add(_this.g);
            _this.pointer = _this.g.children[0];
            _this.epicycle = _this.g.children[1];
            _this.base = _this.g.children[2];
            _this.pointer.shader = _this.shader_basic;
            _this.epicycle.shader = _this.shader_basic;
            _this.base.shader = _this.shader;
            _this.base.uAmbientLightingColor = new CoffeeGL.Colour.RGBA(0.0, 1.0, 1.0, 1.0);
            _this.pointer.uColour = new CoffeeGL.Colour.RGBA(1.0, 1.0, 0.0, 1.0);
            _this.epicycle.uColour = new CoffeeGL.Colour.RGBA(0.6, 0.6, 0.0, 1.0);
            _this.g.remove(_this.pointer);
            _this.epicycle.add(_this.pointer);
            q = new CoffeeGL.Quaternion();
            q.fromAxisAngle(new CoffeeGL.Vec3(0, 1, 0), CoffeeGL.degToRad(-90.0));
            _this.base.matrix.mult(q.getMatrix4());
            r3 = new CoffeeGL.Request('../shaders/picking.glsl');
            return r3.get(function(data) {
              _this.shader_picker = new CoffeeGL.Shader(data, {
                "uPickingColour": "uPickingColour"
              });
              return _this.pickable.shader = _this.shader_picker;
            });
          });
        });
      });
      cube = new CoffeeGL.Shapes.Cuboid(new CoffeeGL.Vec3(0.2, 0.2, 0.2));
      this.deferent = new CoffeeGL.Node(cube);
      this.deferent.uColour = new CoffeeGL.Colour.RGBA(1.0, 0.0, 0.0, 1.0);
      this.top_node.add(this.deferent);
      this.equant = new CoffeeGL.Node(cube);
      this.equant.uColour = new CoffeeGL.Colour.RGBA(0.0, 1.0, 0.0, 1.0);
      this.top_node.add(this.equant);
      this.marker = new CoffeeGL.Node(cube);
      this.marker.uColour = new CoffeeGL.Colour.RGBA(0.0, 1.0, 1.0, 1.0);
      this.top_node.add(this.marker);
      this.c = new CoffeeGL.Camera.MousePerspCamera(new CoffeeGL.Vec3(0, 0, 25));
      this.top_node.add(this.c);
      this.pickable.add(this.c);
      this.light = new CoffeeGL.Light.PointLight(new CoffeeGL.Vec3(0.0, 5.0, 25.0), new CoffeeGL.Colour.RGB(1.0, 1.0, 1.0));
      this.light2 = new CoffeeGL.Light.PointLight(new CoffeeGL.Vec3(0.0, 15.0, 5.0), new CoffeeGL.Colour.RGB(1.0, 1.0, 1.0));
      this.top_node.add(this.light);
      this.top_node.add(this.light2);
      GL.enable(GL.CULL_FACE);
      GL.cullFace(GL.BACK);
      GL.enable(GL.DEPTH_TEST);
      g = new dat.GUI();
      g.remember(this);
      planets = ["mars", "venus", "jupiter", "saturn"];
      this.chosen_planet = "mars";
      controller = g.add(this, 'chosen_planet', planets);
      controller = g.add(this, 'solveForPlanet');
      controller = g.add(this, 'test', 0, 360);
      this.white_string = new EquatorieString(8.0, 0.08, 20);
      this.black_string = new EquatorieString(8.0, 0.08, 20);
      this.top_node.add(this.white_string);
      this.top_node.add(this.black_string);
      this.white_start = new CoffeeGL.Node(cube);
      this.pickable.add(this.white_start);
      this.white_start.matrix.translate(new CoffeeGL.Vec3(2, this.string_height, 2));
      this.white_start.uPickingColour = new CoffeeGL.Colour.RGBA(1.0, 0.0, 0.0, 1.0);
      this.white_end = new CoffeeGL.Node(cube);
      this.pickable.add(this.white_end);
      this.white_end.matrix.translate(new CoffeeGL.Vec3(-2, this.string_height, -2));
      this.white_end.uPickingColour = new CoffeeGL.Colour.RGBA(1.0, 1.0, 0.0, 1.0);
      this.black_start = new CoffeeGL.Node(cube);
      this.pickable.add(this.black_start);
      this.black_start.matrix.translate(new CoffeeGL.Vec3(-2, this.string_height, 2));
      this.black_start.uPickingColour = new CoffeeGL.Colour.RGBA(0.0, 1.0, 1.0, 1.0);
      this.black_end = new CoffeeGL.Node(cube);
      this.pickable.add(this.black_end);
      this.black_end.matrix.translate(new CoffeeGL.Vec3(-4, this.string_height, 2));
      this.black_end.uPickingColour = new CoffeeGL.Colour.RGBA(1.0, 1.0, 1.0, 1.0);
      this.basic_nodes.add(this.white_string).add(this.black_string);
      this.basic_nodes.add(this.white_start).add(this.white_end);
      this.basic_nodes.add(this.black_start).add(this.black_end);
      this.white_string.uColour = new CoffeeGL.Colour.RGBA(0.9, 0.9, 0.9, 1.0);
      this.black_string.uColour = new CoffeeGL.Colour.RGBA(0.1, 0.1, 0.1, 1.0);
      this.white_start.uColour = new CoffeeGL.Colour.RGBA(0.9, 0.2, 0.2, 0.8);
      this.white_end.uColour = new CoffeeGL.Colour.RGBA(0.9, 0.2, 0.2, 0.8);
      this.physics = new Worker('/js/physics.js');
      this.physics.onmessage = this.onPhysicsEvent;
      this.physics.postMessage({
        cmd: "startup"
      });
      CoffeeGL.Context.mouseDown.add(this.onMouseDown, this);
      CoffeeGL.Context.mouseOver.add(this.onMouseOver, this);
      CoffeeGL.Context.mouseOut.add(this.onMouseOut, this);
      CoffeeGL.Context.mouseMove.add(this.onMouseMove, this);
      CoffeeGL.Context.mouseUp.add(this.onMouseUp, this);
      CoffeeGL.Context.mouseMove.del(this.c.onMouseMove, this.c);
      return CoffeeGL.Context.mouseDown.del(this.c.onMouseDown, this.c);
    };

    Equatorie.prototype.update = function(dt) {
      var ep, m, x, y, _ref;
      this.angle = dt * 0.001 * CoffeeGL.degToRad(20.0);
      if (this.angle >= CoffeeGL.PI * 2) {
        this.angle = 0;
      }
      m = new CoffeeGL.Quaternion();
      m.fromAxisAngle(new CoffeeGL.Vec3(0, 1, 0), this.angle);
      m.transVec3(this.light.pos);
      _ref = this.system.calculateDeferentPosition(this.chosen_planet), x = _ref[0], y = _ref[1];
      this.deferent.matrix.identity();
      this.deferent.matrix.translate(new CoffeeGL.Vec3(x, 0.2, y));
      ep = this.system.calculateEquantPosition(this.chosen_planet);
      this.equant.matrix.identity();
      this.equant.matrix.translate(new CoffeeGL.Vec3(ep.x, 0.2, ep.y));
      return this;
    };

    Equatorie.prototype.solveForPlanet = function() {
      var c, cp, d, date, dr, eq, mr, mv, pangle, pv, tmatrix, v, _ref;
      date = new Date();
      mv = this.system.calculateMeanMotus(this.chosen_planet, date);
      mv.normalize();
      mv.multScalar(10.0);
      this.black_start.matrix.identity();
      this.black_start.matrix.translate(new CoffeeGL.Vec3(0, this.string_height, 0));
      this.black_end.matrix.identity();
      this.black_end.matrix.translate(new CoffeeGL.Vec3(mv.x, this.string_height, mv.y));
      this.physics.postMessage({
        cmd: "black_start_move",
        data: this.black_start.matrix.getPos()
      });
      this.physics.postMessage({
        cmd: "black_end_move",
        data: this.black_end.matrix.getPos()
      });
      eq = this.system.calculateEquantPosition(this.chosen_planet);
      pv = this.system.calculateParallel(this.chosen_planet, date);
      pv.sub(eq);
      pv.normalize();
      pv.multScalar(10.0);
      pv.add(eq);
      this.white_start.matrix.identity();
      this.white_start.matrix.translate(new CoffeeGL.Vec3(eq.x, this.string_height, eq.y));
      this.white_end.matrix.identity();
      this.white_end.matrix.translate(new CoffeeGL.Vec3(pv.x, this.string_height, pv.y));
      this.physics.postMessage({
        cmd: "white_start_move",
        data: this.white_start.matrix.getPos()
      });
      this.physics.postMessage({
        cmd: "white_end_move",
        data: this.white_end.matrix.getPos()
      });
      if (this.epicycle != null) {
        _ref = this.system.calculateEpicyclePosition(this.chosen_planet, date), d = _ref[0], c = _ref[1], v = _ref[2], dr = _ref[3], mr = _ref[4];
        this.epicycle.matrix.identity();
        this.epicycle.matrix.translate(new CoffeeGL.Vec3(c.x, 0, c.y));
        this.epicycle.matrix.rotate(new CoffeeGL.Vec3(0, 1, 0), CoffeeGL.degToRad(90 - dr));
        tmatrix = new CoffeeGL.Matrix4();
        tmatrix.translate(new CoffeeGL.Vec3(d.x, 0, d.y));
        tmatrix.rotate(new CoffeeGL.Vec3(0, 1, 0), CoffeeGL.degToRad(mr));
        tmatrix.mult(this.epicycle.matrix);
        this.epicycle.matrix.copyFrom(tmatrix);
      }
      pangle = this.system.calculatePointerAngle(this.chosen_planet, date);
      this.pointer.matrix.identity();
      this.pointer.matrix.rotate(new CoffeeGL.Vec3(0, 1, 0), CoffeeGL.degToRad(pangle));
      cp = this.system.calculatePointerPoint(this.chosen_planet, date);
      this.marker.matrix.identity();
      return this.marker.matrix.translate(new CoffeeGL.Vec3(cp.x, 0.2, cp.y));
    };

    Equatorie.prototype.updatePhysics = function(data) {
      this.white_string.update(data.white);
      return this.black_string.update(data.black);
    };

    Equatorie.prototype.onMouseDown = function(event) {
      console.log(event);
      this.mp.x = event.mouseX;
      this.mp.y = event.mouseY;
      this.ray = this.c.castRay(this.mp.x, this.mp.y);
      if (this.picked != null) {
        this.mdown = true;
      }
      if (!this.mdown) {
        return this.c.onMouseDown(event);
      }
    };

    Equatorie.prototype.onMouseMove = function(event) {
      var d, dd, np, p0, p1, tray;
      this.mpp.x = this.mp.x;
      this.mpp.y = this.mp.y;
      this.mp.x = event.mouseX;
      this.mp.y = event.mouseY;
      this.mpd.x = this.mp.x - this.mpp.x;
      this.mpd.y = this.mp.y - this.mpp.y;
      if (this.mdown && (this.picked != null)) {
        tray = this.c.castRay(this.mp.x, this.mp.y);
        d = CoffeeGL.rayPlaneIntersect(new CoffeeGL.Vec3(0, this.string_height, 0), new CoffeeGL.Vec3(0, 1, 0), this.c.pos, this.ray);
        dd = CoffeeGL.rayPlaneIntersect(new CoffeeGL.Vec3(0, this.string_height, 0), new CoffeeGL.Vec3(0, 1, 0), this.c.pos, tray);
        p0 = tray.copy();
        p0.multScalar(dd);
        p0.add(this.c.pos);
        p1 = this.ray.copy();
        p1.multScalar(d);
        p1.add(this.c.pos);
        p0.y = this.string_height;
        p1.y = this.string_height;
        np = CoffeeGL.Vec3.sub(p0, p1);
        this.ray.copyFrom(tray);
        this.picked.matrix.translate(np);
        if (this.picked === this.white_start) {
          return this.physics.postMessage({
            cmd: "white_start_move",
            data: this.picked.matrix.getPos()
          });
        } else if (this.picked === this.white_end) {
          return this.physics.postMessage({
            cmd: "white_end_move",
            data: this.picked.matrix.getPos()
          });
        } else if (this.picked === this.black_start) {
          return this.physics.postMessage({
            cmd: "black_start_move",
            data: this.picked.matrix.getPos()
          });
        } else if (this.picked === this.black_end) {
          return this.physics.postMessage({
            cmd: "black_end_move",
            data: this.picked.matrix.getPos()
          });
        }
      } else {
        return this.c.onMouseMove(event);
      }
    };

    Equatorie.prototype.onMouseOver = function(event) {
      this.mp.x = event.mouseX;
      return this.mp.y = event.mouseY;
    };

    Equatorie.prototype.onMouseUp = function(event) {
      return this.mdown = false;
    };

    Equatorie.prototype.onMouseOut = function(event) {
      this.mp.x = this.mpp.x = -1;
      this.mp.y = this.mpp.y = -1;
      this.mpd.x = this.mpd.y = 0;
      this.mdown = false;
      return this.picked = void 0;
    };

    Equatorie.prototype.onPhysicsEvent = function(event) {
      switch (event.data.cmd) {
        case "physics":
          return this.updatePhysics(event.data.data);
        case "ping":
          return console.log("Physics Ping: " + event.data.data);
        default:
          break;
      }
    };

    Equatorie.prototype.checkPicked = function(pixel) {
      this.picked = void 0;
      if (pixel[0] === 255) {
        if (pixel[1] === 255) {
          if (pixel[2] === 255) {
            return this.picked = this.black_end;
          } else {
            return this.picked = this.white_end;
          }
        } else {
          return this.picked = this.white_start;
        }
      } else if (pixel[1] === 255) {
        return this.picked = this.black_start;
      }
    };

    Equatorie.prototype.draw = function() {
      var pixel;
      GL.clearColor(0.15, 0.15, 0.15, 1.0);
      GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
      this.c.update();
      if (this.top_node != null) {
        this.top_node.draw();
      }
      if (this.shader_picker != null) {
        this.fbo_picking.bind();
        this.shader_picker.bind();
        this.pickable.draw();
        if (this.mp.y !== -1 && this.mp.x !== -1 && !this.mdown) {
          pixel = new Uint8Array(4);
          GL.readPixels(this.mp.x, this.fbo_picking.height - this.mp.y, 1, 1, GL.RGBA, GL.UNSIGNED_BYTE, pixel);
          this.checkPicked(pixel);
        }
        this.shader_picker.unbind();
        return this.fbo_picking.unbind();
      }
    };

    return Equatorie;

  })();

  eq = new Equatorie();

  cgl = new CoffeeGL.App('webgl-canvas', eq, eq.init, eq.draw, eq.update);

}).call(this);

},{"./system":2,"./string":3}],2:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var EquatorieSystem;

  EquatorieSystem = (function() {
    function EquatorieSystem() {
      this.base_radius = 6.0;
      this.epicycle_radius = 6.353;
      this.epicycle_thickness = this.epicycle_radius - this.base_radius;
      this.planet_data = {};
      this.planet_data.venus = {
        deferent_speed: 0.985,
        epicycle_speed: 0.616,
        epicycle_ratio: 0.72294,
        deferent_eccentricity: 0.0145,
        apogee_longitude: 98.1666667,
        mean_longitude: 279.7,
        mean_anomaly: 63.383
      };
      this.planet_data.mars = {
        deferent_speed: 0.524,
        epicycle_speed: 0.461,
        epicycle_ratio: 0.6563,
        deferent_eccentricity: 0.10284,
        apogee_longitude: 148.6166667,
        mean_longitude: 293.55,
        mean_anomaly: 346.15
      };
      this.planet_data.jupiter = {
        deferent_speed: 0.083,
        epicycle_speed: 0.902,
        epicycle_ratio: 0.1922,
        deferent_eccentricity: 0.04817,
        apogee_longitude: 188.9666667,
        mean_longitude: 238.16666667,
        mean_anomaly: 41.5333333
      };
      this.planet_data.saturn = {
        deferent_speed: 0.033,
        epicycle_speed: 0.952,
        epicycle_ratio: 0.10483,
        deferent_eccentricity: 0.05318,
        apogee_longitude: 148.6166667,
        mean_longitude: 266.25,
        mean_anomaly: 13.45
      };
    }

    EquatorieSystem.prototype.calculateDeferentAngle = function(planet) {
      return this.planet_data[planet].apogee_longitude;
    };

    EquatorieSystem.prototype.calculateDeferentPosition = function(planet) {
      var x, y;
      x = this.base_radius * this.planet_data[planet].deferent_eccentricity * Math.cos(CoffeeGL.degToRad(this.calculateDeferentAngle(planet)));
      y = this.base_radius * this.planet_data[planet].deferent_eccentricity * Math.sin(CoffeeGL.degToRad(this.calculateDeferentAngle(planet)));
      return [x, y];
    };

    EquatorieSystem.prototype.calculateEquantPosition = function(planet) {
      var x, y, _ref;
      _ref = this.calculateDeferentPosition(planet), x = _ref[0], y = _ref[1];
      return new CoffeeGL.Vec2(x * 2, y * 2);
    };

    EquatorieSystem.prototype.calculateDate = function(planet, date) {
      var epoch, passed;
      epoch = new Date("January 1, 1900 00:00:00");
      passed = Math.abs(date - epoch) / 86400000;
      return passed;
    };

    EquatorieSystem.prototype.calculateMeanMotus = function(planet, date) {
      var angle, passed;
      passed = this.calculateDate(planet, date);
      angle = this.planet_data[planet].mean_longitude + this.planet_data[planet].deferent_speed * passed % 360;
      return new CoffeeGL.Vec2(this.base_radius * Math.cos(CoffeeGL.degToRad(angle)), this.base_radius * Math.sin(CoffeeGL.degToRad(angle)));
    };

    EquatorieSystem.prototype.calculateParallel = function(planet, date) {
      var a, b, base_position, c, cr, d2, dangle, deferent_position, dir, discriminant, equant_position, f, motus_position, passed, r, sr, t, t1, t2, v;
      passed = this.calculateDate(planet, date);
      dangle = this.calculateDeferentAngle(planet);
      cr = Math.cos(CoffeeGL.degToRad(dangle));
      sr = Math.sin(CoffeeGL.degToRad(dangle));
      base_position = new CoffeeGL.Vec2(this.base_radius * cr, this.base_radius * sr);
      deferent_position = new CoffeeGL.Vec2(base_position.x * this.planet_data[planet].deferent_eccentricity, base_position.y * this.planet_data[planet].deferent_eccentricity);
      equant_position = this.calculateEquantPosition(planet);
      motus_position = this.calculateMeanMotus(planet, date);
      dir = motus_position.copy();
      dir.normalize();
      f = CoffeeGL.Vec2.sub(equant_position, deferent_position);
      r = this.base_radius;
      a = dir.dot(dir);
      b = 2 * f.dot(dir);
      c = f.dot(f) - r * r;
      v = new CoffeeGL.Vec2();
      discriminant = b * b - 4 * a * c;
      if (discriminant !== 0) {
        discriminant = Math.sqrt(discriminant);
        t1 = (-b - discriminant) / (2 * a);
        t2 = (-b + discriminant) / (2 * a);
        t = t2;
        if (t2 < 0) {
          t = t1;
        }
        v.copyFrom(equant_position);
        d2 = CoffeeGL.Vec2.multScalar(dir, t);
        v.add(d2);
        v.sub(deferent_position);
      }
      return v;
    };

    EquatorieSystem.prototype.calculateEpicyclePosition = function(planet, date) {
      var base_position, cr, dangle, deferent_position, equant_position, f0, f1, fangle, mangle, passed, sr, v;
      passed = this.calculateDate(planet, date);
      mangle = (this.planet_data[planet].mean_longitude + this.planet_data[planet].deferent_speed * passed) % 360;
      dangle = this.calculateDeferentAngle(planet);
      cr = Math.cos(CoffeeGL.degToRad(dangle));
      sr = Math.sin(CoffeeGL.degToRad(dangle));
      base_position = new CoffeeGL.Vec2(this.base_radius * cr, this.base_radius * sr);
      deferent_position = new CoffeeGL.Vec2(base_position.x * this.planet_data[planet].deferent_eccentricity, base_position.y * this.planet_data[planet].deferent_eccentricity);
      equant_position = this.calculateEquantPosition(planet);
      fangle = 0;
      v = this.calculateParallel(planet, date);
      if (v.x !== 0 && v.y !== 0) {
        f0 = CoffeeGL.radToDeg(Math.atan2(base_position.y - deferent_position.y, base_position.x - deferent_position.x));
        f1 = CoffeeGL.radToDeg(Math.atan2(v.y - deferent_position.y, v.x - deferent_position.x));
        fangle = f0 - f1;
      }
      return [deferent_position, base_position, v, dangle, fangle];
    };

    EquatorieSystem.prototype.calculatePointerAngle = function(planet, date) {
      var angle, passed;
      passed = this.calculateDate(planet, date);
      angle = this.planet_data[planet].mean_anomaly + this.planet_data[planet].epicycle_speed * passed % 360;
      return angle;
    };

    EquatorieSystem.prototype.calculatePointerPoint = function(planet, date) {
      var angle, base_position, dangle, deferent_position, dir, fangle, perp, v, _ref;
      angle = this.calculatePointerAngle(planet, date);
      _ref = this.calculateEpicyclePosition(planet, date), deferent_position = _ref[0], base_position = _ref[1], v = _ref[2], dangle = _ref[3], fangle = _ref[4];
      dir = CoffeeGL.Vec2.normalize(CoffeeGL.Vec2.sub(v, deferent_position));
      perp = dir.copy();
      perp.x = -dir.y;
      perp.y = dir.x;
      perp.multScalar(this.base_radius * this.planet_data[planet].epicycle_ratio);
      CoffeeGL.Vec2.add(perp, v);
      return v;
    };

    return EquatorieSystem;

  })();

  module.exports = {
    EquatorieSystem: EquatorieSystem
  };

}).call(this);

},{}],3:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var EquatorieString,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EquatorieString = (function(_super) {
    __extends(EquatorieString, _super);

    function EquatorieString(length, thickness, segments) {
      var i, seglength, segment_geom, segment_node, _i, _ref;
      EquatorieString.__super__.constructor.call(this);
      seglength = length / segments;
      segment_geom = new CoffeeGL.Shapes.Cylinder(thickness, 12, seglength);
      for (i = _i = 0, _ref = segments - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        segment_node = new CoffeeGL.Node(segment_geom);
        this.add(segment_node);
      }
    }

    EquatorieString.prototype.update = function(data) {
      var idx, phys, segment, tmatrix, tq, tv, _i, _len, _ref, _results;
      idx = 0;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        segment = _ref[_i];
        phys = data.segments[idx];
        segment.matrix.identity();
        tq = new CoffeeGL.Quaternion();
        tv = new CoffeeGL.Vec3(phys.rax, phys.ray, phys.raz);
        tq.fromAxisAngle(tv, phys.ra);
        tmatrix = tq.getMatrix4();
        tmatrix.setPos(new CoffeeGL.Vec3(phys.x, phys.y, phys.z));
        segment.matrix.copyFrom(tmatrix);
        _results.push(idx++);
      }
      return _results;
    };

    return EquatorieString;

  })(CoffeeGL.Node);

  module.exports = {
    EquatorieString: EquatorieString
  };

}).call(this);

},{}]},{},[1])
;