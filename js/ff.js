window.addEventListener("load",function() {

	var Q = Quintus({
		development: true, // DEBUG
		maximize: "touch",
		width: 640,
		height: 480,

	}).include([Quintus.Sprites, Quintus.Scenes, Quintus.Input, Quintus.UI ])
	.include([Quintus.FfScenes, Quintus.FfSprites])
	.setup("canvas");

	// maps keys
	Q.input.keyboardControls({
		38: "up1",     // up
		39: "right1",  // right
		40: "down1",   // down
		37: "left1",   // left
		17: "action1", // ctrl
		87: "up2",     // w
		68: "right2",  // d
		83: "down2",   // s
		65: "left2",   // a
		70: "action2"  // f
	});


	// init
	Q.load([ "i001.png", "i002.png", "i003.png", "i004.png", "i005.png", "i006.png", "i007.png",
		"i021.png", "i022.png", "i023.png", "i024.png",	"i025.png", "i026.png", "i027.png", "i100.png",
		"i101.png", "i853.png" ], function() {

		// start
	  Q.stageScene("level1");
	});

	window.Q = Q;
}, true);
