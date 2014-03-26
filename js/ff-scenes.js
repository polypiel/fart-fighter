; Quintus.FfScenes = function(Q) {
  // BACKGROUND /////////////////////////////////////////////////////////////
  Q.Sprite.extend("Background",{
    init: function(p) {
      this._super(p, {
        x: 0,
        y: 0,
        z: -10,
        cx: 0,
        cy: 0,
        asset: 'i853.png',
        type: 0,
        jump: 0
      });
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
    stage.insert(new Q.Bar({x: 349, w:239, y: 19, h:20, color: "yellow", background: "red",   border: "white", per: function(){return phillip.p.life;}}));
    stage.insert(new Q.Bar({x: 349, w:239, y: 47, h:8,  color: "brown",  border:     "white", per: function(){return phillip.p.fart;}}));
    stage.insert(new Q.Bar({x: 51,  w:239, y: 19, h:20, color: "yellow", background: "red",   border: "white", per: function(){return terrance.p.life;}, inv: true}));
    stage.insert(new Q.Bar({x: 51,  w:239, y: 47, h:8,  color: "brown",  border:     "white", per: function(){return terrance.p.fart;}, inv: true}));

    // timer
    stage.insert(new Q.Timer({scene: "gameOver"}));
  }, {"sort": true});

  Q.scene("gameOver", function(stage) {
    Q("Fighter", 0).invoke("finish");

    var label = stage.insert(new Q.UI.Text({
      size: 64,
      color: 'red',
      x: Q.width/2,
      y: Q.height/2,
      label: "Game Over"
    }));
  });
};
