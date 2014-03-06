; Quintus.FfScenes = function(Q) {
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
    stage.insert(new Q.Bar({x: 51,  w:239, y: 19, h:20, color: "yellow", background: "red",   border: "white", per: function(){return terrance.p.life;}}));
    stage.insert(new Q.Bar({x: 51,  w:239, y: 47, h:8,  color: "brown",  border:     "white", per: function(){return terrance.p.fart;}}));

    // timer
    stage.insert(new Q.Timer({}));
  });
};
