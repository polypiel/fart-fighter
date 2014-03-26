; Quintus.FfSprites = function(Q) {
  var FPS = 24;
  var FLOOR_Y= 360;

  var FLOOR_BENDED_DOWN_T = 400;
  var FLOOR_BENDED_DOWN_P = 435;

  var STATE_STANDING = 0;
  var STATE_DOWN = 1;
  var STATE_JUMPING = 2;
  var STATE_FARTING = 3;

  // FIGHTER ///////////////////////////////////////////////////////////////
  // States: standing, down, jumping                                      //
  //////////////////////////////////////////////////////////////////////////
  Q.Sprite.extend("Fighter", {
    SPEED_X: 20,
    GAP_X: 60,
    FART_POWER_INC: 15, // 20 fart points/sec
    FART_DELAY: 0.2, // 500ms
    FART_HIT_POINTS: [4, 6, 3, 0],

    init: function(p) {
      this._super(p, {
        x: (p.terrance ? this.GAP_X : 640 - this.GAP_X),
        y: FLOOR_Y,
        z: 1,
        asset: p.terrance ? "i021.png" : "i001.png",
        collisionMask: Q.SPRITE_PARTICLE,

        life: 100,
        fart: 100,
        fart_cont: 0,
        jump: 0,
        jump_x: 0,
        keyMod: (p.terrance ? "2" : "1"),
        fartLock: false,
        oponent: null,
        state: STATE_STANDING,
        fartDelay: 0,
        back: false,
        finished: false
      });
      // Listen for hit event and call the collision method
      this.on("hit", this, "collision");
    },
    step: function(dt) {
      var p = this.p;
      //console.log('s: ' + p.state + ', y: ' + p.fartDelay);
      //console.log('f: ' + this.p.fart);

      // Game Over
      if(p.finished) { return; }

      // incs fart power
      if(p.fart < 100) {
        p.fart_cont += dt;
        var inc = p.fart_cont * this.FART_POWER_INC;
        var inc_f = Math.floor(inc);
        p.fart_cont = (inc - inc_f) / this.FART_POWER_INC;
        p.fart += inc_f;
      } else {
        p.fart_cont = 0;
      }

      // unlocks fire lock
      if(p.fartLock && !this.key("action")) {
        p.fartLock = false;
      }
      // Collisions
      this.stage.collide(this);

      // Movement
      if(p.state == STATE_STANDING) {
        this.setAsset(1);//this.asset(21, 1);
        p.y = FLOOR_Y;
        p.flip = (p.x > p.oponent.p.x) ? "x" : ""; // Facing
        p.back = false;

        if(this.key('down')) {
          p.state = STATE_DOWN;

        } else {
          if(this.key('right')) {p.x += this.SPEED_X; p.back = (p.x > p.oponent.p.x);}
          else if(this.key('left')) {p.x -= this.SPEED_X; p.back = !(p.x > p.oponent.p.x);}
        }
        if(this.key('up')) {
          p.jump = FPS;
          p.state = STATE_JUMPING;
          if(this.key('right')) {p.jump_x = 5;}
          else if(this.key('left')) {p.jump_x = -5;}
        }

      } else if(p.state == STATE_DOWN) {
        this.setAsset(4);
        p.y = p.terrance ? FLOOR_BENDED_DOWN_T : FLOOR_BENDED_DOWN_P;
        if(!this.key('down')) { p.state = STATE_STANDING; }

      } else if(this.p.state == STATE_JUMPING) {
        this.setAsset(2);
        p.y -= p.jump;
        p.x += p.jump_x;
        p.jump--;

        if(p.y >= FLOOR_Y) {
          //console.log("land");
          p.y = FLOOR_Y;
          p.jump = 0;
          p.jump_x = 0;
          p.state = STATE_STANDING;
        }

      } else if(p.state == STATE_FARTING) {
        this.setAsset(p.back ? 5 : 3);
        p.fartDelay -= dt;
        if(p.fartDelay < 0) {
          p.fartDelay = 0;
          p.state = STATE_STANDING;
        }
      }

      // Farting
      if(this.key("action") && p.fart >= 5 && !p.fartLock && p.state != STATE_FARTING) {
        //this.setAsset(3);
        p.fartLock = true;
        var hp = this.FART_HIT_POINTS[p.state];
        if(p.state == STATE_STANDING && p.back) {hp = this.FART_HIT_POINTS[STATE_DOWN];}
        var fart = Q.stage().insert(new Q.Fart({player: p, hitPower: hp}));
        if(p.state == STATE_STANDING) {
          p.state = STATE_FARTING;
          p.fartDelay = this.FART_DELAY;
        }
      }

      // Checks boundaries
      if(p.x > 610) {p.x = 610;}
      else if(p.x < 30) {p.x = 30;}
    },
    collision: function(col) {
      if(col.obj.p.pid != this.p.id) {
        this.p.life -= col.obj.p.hitPower;
        col.obj.p.hitPower = 0;
        console.log('Collision: ' + col);
      }
    },

    // Helper functions
    finish: function() {
      var p = this.p;

      p.finished = true;
      if(p.life > p.oponent.p.life) {
        this.setAsset(6); // victory
      } else if(p.life < p.oponent.p.life) {
        p.y =
        this.setAsset(7); // defeat
      }
    },
    /*
     * Sets the asset given a number. It sets the proper asset for fighter
     */
    setAsset: function(a) {
      var a = '00' + this.curr(a+20, a);
      this.p.asset = 'i' + (a.substring(a.length-3, a.length)) + '.png';
    },
    key: function(str) {
      return Q.inputs[str + this.p.keyMod];
    },
    curr: function(val1, val2) {
      return this.p.terrance ? val1 : val2;
    }
  });
  // FART ///////////////////////////////////////////////////////////////////
  Q.Sprite.extend("Fart", {
    DX: 4,
    LIFE_SPAN: 0.75,

    init: function(p) {
      this._super(p, {
        asset: "i100.png",
        z: -5,
        type: Q.SPRITE_PARTICLE,
        x: p.player.x,
        y: p.player.y,
        flip: p.player.flip,
        dir: p.player.flip == "" ? 1 : -1,
        pid: p.player.id,
        age: 0
      });
      this.p.player.fart -= this.p.hitPower*3;
    },
    step: function(dt) {
      this.p.age += dt;
      if(this.p.age > this.LIFE_SPAN) {
        Q.stage().remove(this);
        return;
      }

      this.p.x += this.p.dir*this.DX;
    }
  });
  // PLAYER SHADOW //////////////////////////////////////////////////////////
  Q.Sprite.extend("Shadow", {
    init: function(p) {
      this._super(p, {
        y: FLOOR_Y + 90,
        z: -6,
        asset: "i101.png"
      });
    },
    step: function(dt) {
      this.p.x = this.p.player.p.x;
      this.p.scale = 1 - (FLOOR_Y - this.p.player.p.y)/500;
    }
  });
  // LIFE BAR  //////////////////////////////////////////////////////////////
  Q.Sprite.extend("Bar", {
    init: function(p) {
      this._super(p, {
        mw: p.w,
        cx: 0,
        cy: 0,
        z: 5,
        inv: false
      });
    },
    step: function(df) {
      this.p.w = Math.max((this.p.per() * this.p.mw), 0) / 100;
    },
    draw: function(ctx) {
      var p = this.p;

      if(p.border) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = p.border;
        ctx.strokeRect(-p.cx-1, -p.cy-1, p.mw+2, p.h+2);
      }

      if(p.background) {
        ctx.fillStyle = p.background;
        ctx.fillRect(-p.cx, -p.cy, p.mw, p.h);
      }

      ctx.fillStyle = p.color;
      if(p.inv) {
        ctx.fillRect(-p.cx, -p.cy, p.w, p.h);
      } else {
        ctx.fillRect(-p.cx + p.mw - p.w, -p.cy, p.w, p.h);
      }
    }
  });
  // TIMER ////////////////////////////////////////////////////////////////////
  Q.Sprite.extend("Timer", {
    MAX_TIME: 10.0,

    init: function(p) {
      this._super(p, {
        time: this.MAX_TIME,
        color: "#FF0000",
        z: 5,
        renderAlways: true
      });
    },
    step: function(dt) {
      if(this.p.time > 0) {
        this.p.time -= dt;
        if(this.p.time < 0) {
          this.p.time = 0;
          Q.stageScene(this.p.scene, 1);
        }
      }
    },
    draw: function(ctx) {
      //console.log(Math.floor(this.p.time));
      ctx.font = "bold 32px Shoryuken";
      ctx.textAlign = "center";
      ctx.fillStyle = this.p.color;
      ctx.fillText(Math.floor(this.p.time)+'', 320, 50);
    }
  });
};
