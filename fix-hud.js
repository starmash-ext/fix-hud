!function() {
  SWAM.on("gameRunning",async function () {
    const HUD_WIDTH = 196;
    const HUD_HEIGHT = 85;
    const BAR_WIDTH = 19.5;

    const previousPlayersUpdate =   Players.update
    const previousUIResizeHUD = UI.resizeHUD
    Graphics.render = function() {
      Graphics.renderer.render(game.graphics.layers.shadows, game.graphics.gui.shadows, true),
      Graphics.renderer.render(game.graphics.layers.game)
    };

    const sourceOrig = game.graphics.gui.hudHealth_mask.texture.orig
    const image = game.graphics.gui.hudHealth_mask.texture.baseTexture.source;
    const canvasHealth = document.createElement("canvas");
    canvasHealth.width = sourceOrig.width
    canvasHealth.height = sourceOrig.height
    const ctxHealth = canvasHealth.getContext("2d");
    ctxHealth.drawImage(image, sourceOrig.x, sourceOrig.y, sourceOrig.width, sourceOrig.height, 0, 0, sourceOrig.width, sourceOrig.height);
    const canvasHealthTexture = PIXI.Texture.fromCanvas(canvasHealth)

    const canvasEnergy = document.createElement("canvas");
    canvasEnergy.width = sourceOrig.width
    canvasEnergy.height = sourceOrig.height
    const ctxEnergy = canvasEnergy.getContext("2d");
    ctxEnergy.translate(sourceOrig.width,0)
    ctxEnergy.scale(-1,1)
    ctxEnergy.drawImage(canvasHealth, 0, 0);
    const canvasEnergyTexture = PIXI.Texture.fromCanvas(canvasEnergy)

    const hudHealthMask = new PIXI.Sprite(canvasHealthTexture)
    const hudEnergyMask = new PIXI.Sprite(canvasEnergyTexture)
    game.graphics.layers.aircraftme.addChild(hudHealthMask)
    game.graphics.layers.aircraftme.addChild(hudEnergyMask)

    UI.resizeHUD = function() {
      previousUIResizeHUD()
      const scaleFactor = game.scale / game.graphics.gui.hudSpriteEnergy.scale.x

      hudHealthMask.width = (BAR_WIDTH + 0.5) * scaleFactor;
      hudEnergyMask.width = (BAR_WIDTH + 0.5) * scaleFactor;
      game.graphics.gui.hudHealth_shadow.width = (BAR_WIDTH + 0.5) * scaleFactor;
      game.graphics.gui.hudEnergy_shadow.width = (BAR_WIDTH + 0.5) * scaleFactor;
      hudHealthMask.height = HUD_HEIGHT * scaleFactor;
      hudEnergyMask.height = HUD_HEIGHT * scaleFactor ;
      game.graphics.gui.hudHealth_shadow.height = (HUD_HEIGHT + 0.5) * scaleFactor;
      game.graphics.gui.hudEnergy_shadow.height = (HUD_HEIGHT + 0.5) * scaleFactor;
      game.graphics.layers.hudEnergy.scale.set(0.25 * scaleFactor);
      game.graphics.layers.hudHealth.scale.set(0.25 * scaleFactor);
    };
    UI.resizeHUD()



    SWAM.on("gamePrep", function() {
      game.graphics.layers.aircraftme.addChild(game.graphics.gui.hudHealth_shadow)
      game.graphics.layers.aircraftme.addChild(game.graphics.gui.hudEnergy_shadow)
      game.graphics.layers.aircraftme.addChild(game.graphics.layers.hudEnergy)
      game.graphics.layers.aircraftme.addChild(game.graphics.layers.hudHealth)
      game.graphics.layers.aircraftme.addChild(hudEnergyMask)
      game.graphics.layers.aircraftme.addChild(hudHealthMask)
      game.graphics.layers.aircraftme.addChild(game.graphics.gui.hudHealth_mask)
      game.graphics.layers.aircraftme.addChild(game.graphics.gui.hudEnergy_mask)


      game.graphics.layers.hudEnergy.mask = hudEnergyMask
      game.graphics.layers.hudHealth.mask = hudHealthMask
      UI.resizeHUD()
      Players.update = () => {
        previousPlayersUpdate()
        const me = Players.getMe()
        game.graphics.layers.hudEnergy.position.set(me.pos.x + 155, me.pos.y - 87)
        game.graphics.gui.hudEnergy_shadow.position.set(me.pos.x + 30, me.pos.y)
        game.graphics.gui.hudEnergy_mask.position.set(me.pos.x + 155, me.pos.y - 87)

        game.graphics.layers.hudHealth.position.set(me.pos.x - 195, me.pos.y - 87)
        game.graphics.gui.hudHealth_shadow.position.set(me.pos.x - 30, me.pos.y)
        game.graphics.gui.hudHealth_mask.position.set(me.pos.x + 100, me.pos.y - 87)

        const scaleFactor = game.scale / game.graphics.gui.hudSpriteEnergy.scale.x

        hudEnergyMask.position.set(me.pos.x - (BAR_WIDTH * scaleFactor) + (HUD_WIDTH * scaleFactor) / 2, me.pos.y - hudHealthMask.height / 2);
        hudHealthMask.position.set(me.pos.x - (HUD_WIDTH * scaleFactor) / 2, me.pos.y - hudHealthMask.height / 2);
      }
    })


  })

  SWAM.registerExtension({
      name: "Fix map border HUD",
      id: "fix-map-border-hud",
      description: "Fix HUD near the end of the map",
      author: "Debug",
      version: "1.0"
  });

}();


