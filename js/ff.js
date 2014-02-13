window.addEventListener("load",function() {
	var FPS = 24;

	var FLOOR_Y= 360;

	var FLOOR_BENDED_DOWN_T = 400;
	var FLOOR_BENDED_DOWN_P = 435;

	var STATE_STANDING = 0;
	var STATE_DOWN = 1;
	var STATE_JUMPING = 2;

	var Q = Quintus({
		development: true,
		maximize: "touch",
		width: 640,
		height: 480,

	}).include([Quintus.Sprites, Quintus.Scenes, Quintus.Input ]).setup("canvas");

	// maps keys
	Q.input.keyboardControls({
		UP: "up1",
		RIGHT: "right1",
		DOWN: "down1",
		LEFT: "left1",
		ACTION: "action1",
	});
	Q.input.bindKey(87, "up2"); // w
	Q.input.bindKey(68, "right2"); // d
	Q.input.bindKey(83, "down2"); // s
	Q.input.bindKey(65, "left2"); //a
	Q.input.bindKey(70, "action2"); // f

	// BACKGROUND /////////////////////////////////////////////////////////////
	Q.Sprite.extend("Background",{
		init: function(p) {
			this._super(p,{
				x: 0,
				y: 0,
				cx: 0,
				cy: 0,
				asset: 'i853.png',
				type: 0,
				jump: 0
			});
		}
	});
	// FIGHTER ///////////////////////////////////////////////////////////////
	// States: standing, down, jumping                                      //
	//////////////////////////////////////////////////////////////////////////
	Q.Sprite.extend("Fighter", {
		SPEED_X: 20,
  	GAP_X: 60,
  	FART_POWER_INC: 15, // 20 fart points/sec

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
				state: STATE_STANDING
			});
			// Listen for hit event and call the collision method
			this.on("hit", this, "collision");
		},
		step: function(dt) {
		  	//console.log('s: ' +this.p.state + ', y: ' +this.p.y + ', j:' + this.p.jump);
		  	//console.log('f: ' + this.p.fart);

			// incs fart power
			if(this.p.fart < 100) {
				this.p.fart_cont += dt;
				var inc = this.p.fart_cont * this.FART_POWER_INC;
				var inc_f = Math.floor(inc);
				this.p.fart_cont = (inc - inc_f) / this.FART_POWER_INC;
			  this.p.fart += inc_f;
			} else {
				this.p.fart_cont = 0;
			}

			// unlocks fire lock
			if(this.p.fartLock && !this.key("action")) {
			  this.p.fartLock = false;
			}
			// Collisions
			this.stage.collide(this);

			// Movement
			if(this.p.state == STATE_STANDING) {
				this.setAsset(1);//this.asset(21, 1);
				this.p.y = FLOOR_Y;
				this.p.flip = (this.p.x > this.p.oponent.p.x) ? "x" : ""; // Facing

				if(this.key('down')) {
					this.p.state = STATE_DOWN;

				} else {
					if(this.key('right')) {this.p.x += this.SPEED_X;}
					else if(this.key('left')) {this.p.x -= this.SPEED_X;}
				}
				if(this.key('up')) {
					this.p.jump = FPS;
					this.p.state = STATE_JUMPING;
					if(this.key('right')) {this.p.jump_x = 5;}
					else if(this.key('left')) {this.p.jump_x = -5;}
				}

			} else if(this.p.state == STATE_DOWN) {
				this.setAsset(4);
				this.p.y = this.p.terrance ? FLOOR_BENDED_DOWN_T : FLOOR_BENDED_DOWN_P;
				if(!this.key('down')) { this.p.state = STATE_STANDING; }

			} else if(this.p.state == STATE_JUMPING) {
				this.setAsset(2);
				this.p.y -= this.p.jump;
				this.p.x += this.p.jump_x;
				this.p.jump--;

				if(this.p.y >= FLOOR_Y) {
					//console.log("land");
					this.p.y = FLOOR_Y;
					this.p.jump = 0;
					this.p.jump_x = 0;
					this.p.state = STATE_STANDING;
				}
			}

			// Farting
			if(this.key("action") && this.p.fart >= 5 && !this.p.fartLock) {
				// TODO
				this.setAsset(3);
				this.p.fartLock = true;
				var fart = Q.stage().insert(new Q.Fart({player: this}));
				this.p.fart -= fart.p.hitPower*4;
			}

			// Checks boundaries
			if(this.p.x > 610) {this.p.x = 610;}
			else if(this.p.x < 30) {this.p.x = 30;}
		},
		collision: function(col) {
			if(col.obj.p.player != this) {
				this.p.life -= col.obj.p.hitPower;
				col.obj.p.hitPower = 0;
				console.log('Collision: ' + col);
			}
		},

		// Helper functions
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
		},
	});
	// FART ///////////////////////////////////////////////////////////////////
	Q.Sprite.extend("Fart", {
		DX: 4,
		FART_POWER: 4,
		LIFE_SPAN: 0.75,

	  init: function(p) {
			this._super(p, {
				asset: "i100.png",
				y: p.player.p.y,
				x: p.player.p.x,
				z: -5,
				type: Q.SPRITE_PARTICLE,

				hitPower: this.FART_POWER,
				dir: 1,
				age: 0
			});
			p.fart -= this.FART_POWER;
		},
		step: function(dt) {
			this.p.age += dt;
			if(this.p.age > this.LIFE_SPAN) {
				Q.stage().remove(this);
				return;
			}

			this.p.x += this.DX;
		}
	});
	// PLAYER SHADOW //////////////////////////////////////////////////////////
	Q.Sprite.extend("Shadow", {
		init: function(p) {
			this._super(p, {
				y: FLOOR_Y + 90,
				z: -10,
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
				cy: 0
			});
		},
		step: function(df) {
			//console.log(-this.p.cx + ", " + -this.p.cy + ", " + this.p.w + ", " + this.p.h);
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
      ctx.fillRect(-p.cx, -p.cy, p.w, p.h);
		}
	});
	// TIMER ////////////////////////////////////////////////////////////////////
	Q.Sprite.extend("Timer", {
		MAX_TIME: 90.0,

		init: function(p) {
			this._super(p, {
				time: this.MAX_TIME
			});
		},
		step: function(dt) {
			this.p.time -= dt;
		},
		draw: function(ctx) {
			console.log(Math.floor(this.p.time));
			ctx.font = "bold 32px Verdana";
			ctx.textAlign = "center";
			ctx.fillText(Math.floor(this.p.time)+'', 320, 50);
		}
	});


	Q.scene("level1", function(stage) {
		var bg = stage.insert(new Q.Background({ type: Q.SPRITE_UI }));
		var terrance = stage.insert(new Q.Fighter({terrance: true}));
		var phillip = stage.insert(new Q.Fighter({terrance: false}));

		terrance.p.oponent = phillip;
		phillip.p.oponent = terrance;

		stage.insert(new Q.Shadow({player: phillip}));
		stage.insert(new Q.Shadow({player: terrance}));

		// bars
		stage.insert(new Q.Bar({x: 349, w:239, y: 19, h:20, color: "yellow", background: "red", border: "white", per: function(){return phillip.p.life;}}));
		stage.insert(new Q.Bar({x: 349, w:239, y: 47, h:8, color: "brown", border: "white", per: function(){return phillip.p.fart;}}));
		stage.insert(new Q.Bar({x: 51, w:239, y: 19, h:20, color: "yellow", background: "red", border: "white", per: function(){return terrance.p.life;}}));
		stage.insert(new Q.Bar({x: 51, w:239, y: 47, h:8, color: "brown", border: "white", per: function(){return terrance.p.fart;}}));

		// timer
		stage.insert(new Q.Timer({}));
	});

	// init
	Q.load([ "i001.png", "i002.png", "i003.png", "i004.png", "i005.png", "i021.png", "i022.png", "i023.png", "i024.png",
		"i025.png", "i100.png", "i101.png", "i853.png" ], function() {
	  Q.stageScene("level1");
	});
});
