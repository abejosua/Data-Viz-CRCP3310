(function() {
  var controller, extraOutput;

  window.gui = new dat.GUI({
    autoPlace: false
  });

  gui.add(scope, 'x', -Math.PI, Math.PI);

  gui.add(scope, 'y', -Math.PI, Math.PI);

  gui.addColor(scope, 'color');

  gui.add(scope, 'rate', 0, 10);

  document.getElementById('guiContainer').appendChild(gui.domElement);

  extraOutput = document.createElement('div');

  extraOutput.id = 'extraOutput';

  extraOutput.style.paddingTop = '1.2em';

  extraOutput.style.color = 'white';

  document.getElementById('guiContainer').appendChild(extraOutput);

  window.controller = controller = new Leap.Controller({
    background: true
  });

  controller.use('riggedHand', {
    parent: window.scene,
    camera: window.camera,
    scale: 0.25,
    positionScale: 6,
    offset: new THREE.Vector3(0, -2, 0),
    renderFn: function() {},
    boneColors: function(boneMesh, leapHand) {
      return {
        hue: 0.6,
        saturation: 0.2,
        lightness: 0.8
      };
    }
  });

  controller.use('playback', {
    recording: 'pinch-and-move-57fps.json.lz',
    loop: false
  });

  controller.connect();

  controller.on('frame', function(frame) {
    var hand, handMesh, offsetDown, offsetForward, pos;
    if (!frame.hands[0]) {
      return;
    }
    hand = frame.hands[0];
    handMesh = hand.data('riggedHand.mesh');
    if (hand.pinchStrength > 0.5) {
      pos = Leap.vec3.clone(hand.palmPosition);
      offsetDown = Leap.vec3.clone(hand.palmNormal);
      Leap.vec3.multiply(offsetDown, offsetDown, [30, 30, 30]);
      Leap.vec3.add(pos, pos, offsetDown);
      offsetForward = Leap.vec3.clone(hand.direction);
      Leap.vec3.multiply(offsetForward, offsetForward, [30, 30, 30]);
      Leap.vec3.add(pos, pos, offsetForward);
      handMesh.scenePosition(pos, scope.light1position);
    }
    return extraOutput.innerHTML = scope.light1position.toArray().map(function(num) {
      return num.toPrecision(2);
    });
  });

  document.body.onkeydown = function(e) {
    switch (e.which) {
      case 32:
        return scope.pause();
      default:
        return console.log("unbound keycode: " + e.which);
    }
  };

}).call(this);