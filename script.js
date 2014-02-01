$(function() {

    var balls = document.getElementById("balls");

    var liveBalls = [];
    var escapedCount = 0;

    function drawBackground() {
        
        // get the context we are going to draw to
        var context = document.getElementById("background").getContext('2d');

        // set the beatiful beach background
        var img = new Image();
        img.src = 'http://dl.dropbox.com/u/19593893/CDN/beach.jpg';
        img.onload = function() {
            // draw the background to the canvas
            context.drawImage(img, 0, 0);
        }
    }

    function createBall() {
        // create the ball image
        image = new Image();
        image.src = 'http://dl.dropbox.com/u/19593893/CDN/ball.png';

        // push a new ball object into the liveBalls array
        liveBalls.push({
            image: image,
            x: Math.floor(Math.random() * 580),
            y: 640,
            index: 0,
            speed: Math.floor(Math.random() * 5)
        });
    }

    function draw() {

        var context = balls.getContext('2d');

        // clear the context to make sure we have a clean canvas
        context.clearRect(0, 0, 640, 480);

        // keep track of our escaped balls with this array
        var escapedBalls = [];

        // for each of our live balls, see if the ball is still on the canvas, if it is,
        // move it up by the random speed of the ball.
        $.each(liveBalls, function(index, value) {
            this.index = index;
            this.y -= this.speed;
            if (this.y > -64) {
                context.drawImage(this.image, this.x, this.y);
            }
            else {
                // the ball is off the screen so add it to the escaped balls
                // collection and increment the score
                escapedBalls.push(this);
                escapedCount++;
                $("#score span").text(escapedCount);
            }
        });

        // remove each of the escaped balls from the liveBalls array
        $.each(escapedBalls, function(index, value) {
            liveBalls.splice(this.index, 1);
        });

        // this is the call to the function which will call draw again
        // at whatever the current framerate is.
        get_animation_frame()(draw, document.getElementById("balls"));
    }

    // get the framerate at 60 FPS or whatever the current framerate 
    function get_animation_frame() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback, element) {
            return window.setTimeout(callback, 1000 / 60);
        };
    };

    function detectCollision(x, y) {

        // enumerate through the balls and see if any of them collide with our mouse click
        var collisionDetected = false;
        var collisionIndex = 0;

        // collision detection is rough here, could be much better.  Basically detecting
        // if the mouse click falls inside a sqaure that's roughly the same size as the ball.
        $.each(liveBalls, function(index, value) {
            if (x > this.x && x < this.x + 64 && y > this.y + 20 && y < this.y + 100) {
                collisionDetected = true;
                collisionIndex = this.index;
            }
        });

        // if we detected a collision, remove the object.
        if (collisionDetected) {
            liveBalls.splice(collisionIndex, 1);
        }
    }

    // bind the mouse click event on the page to detect a collision
    $(document).click(function(e) {
        detectCollision(e.pageX, e.pageY);
    });

    drawBackground();

    // initialize the draw loop
    draw();

    // set an interval for creating random balls
    setInterval(createBall, 1000);

});