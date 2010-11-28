(function(windows) {

   // 2D context of the board <canvas>
   var context = document.getElementById("board").getContext("2d");

   var kBoardWidth = 320;
   var kBoardHeight = 460;
   var kCircleRadius = 32;
   var timeout = 1000; // in ms

   var Board = {};

   var pieces = {};

   Board.myPiece = {
      center : {
         x: kBoardWidth / 2
       , y: kBoardHeight / 2
       , xShift : 0
       , yShift : 0
      }
    , color: "#000"
    // myPiece may never be updated if the browser
    // does not support the DeviceOrientation Event API
    , updated: false
   };

   randomColor = function()
   {
      var red = Math.floor(Math.random() * 255);
      var green = Math.floor(Math.random() * 255);
      var blue = Math.floor(Math.random() * 255);
      return 'rgb('+red+','+green+','+blue+')';
   }

   Board.put = function(id, piece) {
      if (pieces[id]) {
          piece.color = pieces[id].color;
       } else {
          piece.color = randomColor();
       }
       pieces[id] = piece;
       pieces[id].timestamp = new Date().getTime();
   };

   Board.draw = function() {
      context.clearRect(0, 0, kBoardWidth,  kBoardHeight);

      Board.drawBoard();

      if (Board.myPiece.updated) {
         Board.drawPiece(Board.myPiece);
      }

      var now = new Date().getTime();
      for (id in pieces) {
         if (pieces.hasOwnProperty(id)) {
            var piece = pieces[id];
            if (now - piece.timestamp > timeout) {
               delete pieces[id];
            } else {
               Board.drawPiece(piece);
            }
         }
      }
   };

   Board.drawBoard = function() {
      context.beginPath();
      for (var x = 0.5; x < kBoardWidth; x += 10) {
         context.moveTo(x, 0);
         context.lineTo(x, kBoardHeight);
      }
      for (var y = 0.5; y < kBoardHeight; y += 10) {
         context.moveTo(0, y);
         context.lineTo(kBoardWidth, y);
      }
      context.closePath();

      context.strokeStyle = "#eee";
      context.stroke();
   };

   Board.drawPiece = function(piece) {
      context.fillStyle = piece.color;
      context.beginPath();
      context.arc(piece.center.x, piece.center.y, kCircleRadius, 0, Math.PI * 2, false);
      context.closePath();
      context.fill();
   };

   Board.updateCenter = function(acceleration) {
      c = Board.myPiece.center;
      c.xShift = c.xShift * 0.8 + acceleration.x * 2.0;
      c.yShift = c.yShift * 0.8 + acceleration.y * 2.0;
      c.x = Math.floor(c.x + c.xShift);
      // use *minus* to compute the center's new y
      c.y = Math.floor(c.y - c.yShift);
      // do not go outside the boundaries of the canvas
      if (c.x < kCircleRadius) {
         c.x = kCircleRadius;
      }
      if (c.x > kBoardWidth - kCircleRadius) {
         c.x = kBoardWidth - kCircleRadius;
      }
      if (c.y < kCircleRadius) {
         c.y = kCircleRadius;
      }
      if (c.y > kBoardHeight - kCircleRadius) {
         c.y = kBoardHeight - kCircleRadius;
      }
      Board.myPiece.center = c;
      Board.myPiece.updated = true;
   };


   // we draw at regular interval in case we
   // do not get any message from the server
   setInterval(function() {
      Board.draw();
   }, timeout);

   // first time, only the board will be drawn
   Board.draw();

   window.Board = Board;
})(window);