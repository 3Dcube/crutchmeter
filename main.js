var whistle = new Audio('whistle.mp3');
var bubblePoppingSound = [new Audio('bubble_popping.mp3'), new Audio('bubble_popping_2.mp3')];

var crutchCounter = 0;

var resources = [
    {dom: whistle, event: "canplaythrough"},
    {dom: bubblePoppingSound[0], event: "canplaythrough"},
    {dom: bubblePoppingSound[1], event: "canplaythrough"}
];

var images = ["img/background.png", "img/left_gear.png", "img/right_gear.png", "img/right_gear_small.png", "img/device.png", "img/button_border.png", "img/button.png", "img/button_3d_effect.png", "img/plus.png", "img/meter_front.png", "img/meter_back.png", "img/meter_arrow.png", "img/tube_front.png", "img/tube_back.png", "img/crutch.png", "img/lines/line_0.png", "img/lines/line_1.png", "img/lines/line_2.png", "img/lines/line_3.png", "img/numbers/0.png", "img/numbers/1.png", "img/numbers/2.png", "img/numbers/3.png", "img/numbers/4.png", "img/numbers/5.png", "img/numbers/6.png", "img/numbers/7.png", "img/numbers/8.png", "img/numbers/9.png"];

images.forEach(function (imageUrl) {
    var img = new Image();
    img.src = imageUrl;
    resources.push({
        dom: img,
        event: "load"
    })
});

var resourcesLoaded = 0;

function resourceLoadCallback() {
    resourcesLoaded++;
    if(resourcesLoaded === resources.length) {
        if(sessionStorage.getItem("in-cache") === "yes") {
            run();
        } else {
            document.body.style.transition = "background-color 2s";
            document.body.style.backgroundColor = "#000";
            sessionStorage.setItem("in-cache", "yes");
            setTimeout(run, 2000);
        }
    }
}

resources.forEach(function(resource) {
   resource.dom.addEventListener(resource.event, resourceLoadCallback);
});

    Object.defineProperty(Element.prototype, 'documentOffsetTop', {
        get: function () {
            return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop : 0 );
        }
    });

    Object.defineProperty(Element.prototype, 'documentOffsetLeft', {
        get: function () {
            return this.offsetLeft + ( this.offsetParent ? this.offsetParent.documentOffsetLeft : 0 );
        }
    });

function run() {
    (function() {
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = 'img/crutch.png';
        document.getElementsByTagName('head')[0].appendChild(link);
    })();
    document.title = "CrutchMeter";

    var meterArrowAngleMin = -70;
    var meterArrowAngleMax = 60;
    var meterArrowOverload = 15;
    var arrowSteps = 4;

    var numberWidth = [109, 85, 129, 197, 171, 149, 146, 153, 129, 120];
    var numberHeight = [169, 167, 191, 186, 192, 196, 175, 209, 186, 182];


    var buttonAnimation = {};
    var smokeAnimation = {};
    var deviceAnimation = {};
    var plusAnimation = {};
    var lateAnimation = {};
    var meterCrutchAnimation = {};
    var meterAnimation = {};
    var bubblesAnimation = {};
    var gearAnimation = {};

    var layout = document.querySelector(".layout");
    var crutchCounters = document.querySelector(".counters");
    var deviceBackground = document.querySelector(".device-background");
    var plus = document.querySelector(".plus");
    var meterCrutch = document.querySelector(".meter-crutch");
    var arrow = document.querySelector(".meter-arrow");
    var arrowWrapper = document.querySelector(".meter-arrow-wrapper");
    var meterArrowHoverWrapper = document.querySelector(".meter-hover-wrapper");
    var meterArrowHover = document.querySelector(".meter-hover");
    var leftGearWrapper = document.querySelector(".left-gear-wrapper");
    var rightGearWrapper = document.querySelector(".right-gear-wrapper");
    var rightSmallGearWrapper = document.querySelector(".right-gear-small-wrapper");
    var deviceTube = document.querySelector(".device-tube");

    whistle.volume = 0.7;


    layout.onscroll = function () {
        layout.scrollLeft = 0;
    };

    var arrowHoverPlaying = false;
    meterArrowHover.onmouseover = function () {
        if (!arrowHoverPlaying) {
            arrowWrapper.classList.add("play");
            setTimeout(function () {
                arrowWrapper.classList.remove("play");
                arrowHoverPlaying = false;
            }, 1000);
            arrowHoverPlaying = true;
        }
    };

    function bubblePoppingPlay(volume) {
        var sounds = bubblePoppingSound.filter(function (sound) {
            return sound.paused
        });
        if (sounds.length > 0) {
            sounds[Math.floor(Math.random() * sounds.length)].play();
        }
        for (var i = 0; i < bubblePoppingSound.length; i++) {
            var sound = bubblePoppingSound[i];
            if (sound.paused) {
                sound.volume = volume;
                sound.play();
                break;
            }
        }
    }


    var arrowStepAngle = (meterArrowAngleMax - meterArrowAngleMin) / arrowSteps;

    function timeout(animation, func, milliseconds, stopFunc) {
        if (!!animation.data)
            animation.data.stop();
        else
            animation.data = {};
        var newAnimationData = {};
        var timeout = setTimeout(function () {
            func();
            if (!!stopFunc)
                stopFunc();
        }, milliseconds);
        newAnimationData.stop = function () {
            clearTimeout(timeout);
            if (!!stopFunc)
                stopFunc();
        };
        animation.data = newAnimationData;
    }

    function intervalN(animation, func, milliseconds, N, stopFunc) {
        if (!!animation.data)
            animation.data.stop();
        else
            animation.data = {};
        var newAnimationData = {};
        var i = 0;
        var interval = setInterval(function () {
            func();
            i++;
            if (i >= N) {
                clearInterval(interval);
                if (!!stopFunc)
                    stopFunc();
            }
        }, milliseconds);
        newAnimationData.stop = function () {
            clearInterval(timeout);
            if (!!stopFunc)
                stopFunc();
        };
        animation.data = newAnimationData;
    }


    function showCrutchCounter(value) {
        for (var i = 0; i < crutchCounters.children.length; i++) {
            const element = crutchCounters.children[i];
            if (!element.classList.contains("old")) {
                element.classList.remove("show");
                element.classList.add("old");
                setTimeout(function () {
                    crutchCounters.removeChild(element);
                }, 3000);
            }
        }
        var newCounterWrapper = document.createElement("div");
        newCounterWrapper.classList.add("counter-wrapper");

        var newCounterValue = document.createElement("div");
        newCounterValue.classList.add("counter-value");
        newCounterWrapper.appendChild(newCounterValue);

        var width = 0;
        var height = 0;
        var digits = value.toString().split("");
        for (var i = 0; i < digits.length; i++) {
            var digit = document.createElement("div");
            digit.classList.add("number");
            digit.classList.add("number-" + digits[i]);
            width += numberWidth[digits[i]];
            height = Math.max(height, numberHeight[digits[i]]);
            newCounterValue.appendChild(digit);
        }
        newCounterValue.style.height = height + "px";
        newCounterValue.style.width = width + "px";
        var scale = Math.min(268 / width, 90 / height);

        var translateX = -(width - scale * width) * (1 / scale) / 2 + ((268 - width * scale) / 2) * (1 / scale);

        var translateY = -(height - scale * height) * (1 / scale) / 2 + ((90 - height * scale) / 2) * (1 / scale);
        newCounterValue.style.transform = "scale(" + scale + ") translate(" + translateX + "px, " + translateY + "px)";
        crutchCounters.appendChild(newCounterWrapper);
        setInterval(function () {
            newCounterWrapper.classList.add("show");
        }, 100);
    }

    function setArrowAngle() {
        if (crutchCounter <= arrowSteps) {
            arrow.style.transform = "rotate(" + (meterArrowAngleMin + crutchCounter * arrowStepAngle) + "deg)";
            meterArrowHoverWrapper.style.transform = "rotate(" + (meterArrowAngleMin + crutchCounter * arrowStepAngle) + "deg)";
        } else {
            arrow.style.transform = "rotate(" + (meterArrowAngleMax + meterArrowOverload) + "deg)";
            meterArrowHoverWrapper.style.transform = "rotate(" + (meterArrowAngleMax + meterArrowOverload) + "deg)";
            timeout(meterAnimation, function () {
                arrow.style.transform = "rotate(" + meterArrowAngleMax + "deg)";
                meterArrowHoverWrapper.style.transform = "rotate(" + meterArrowAngleMax + "deg)";
            }, 800, function () {
                arrow.style.transform = "rotate(" + meterArrowAngleMax + "deg)";
                meterArrowHoverWrapper.style.transform = "rotate(" + meterArrowAngleMax + "deg)";
            });
        }
    }

    function crutchAlert(playSound) {
        crutchCounter++;
        if (playSound) {
            // steam whistle
            setTimeout(function () {
                whistle.play();
            }, 900);
        }

        // bubbles animation
        timeout(bubblesAnimation, function () {
            intervalN(smokeAnimation, function () {
                var n = 2 + 2 * Math.floor(Math.random());
                for (var i = 0; i < n; i++) {
                    if (!tryCreateBubble(playSound)) {
                        break;
                    }
                }

            }, 500, 5);
        }, 4000);

        // device-background
        var deviceTurned = false;
        intervalN(deviceAnimation, function () {
            if (deviceTurned) {
                deviceBackground.classList.remove("turn");
            } else {
                deviceBackground.classList.add("turn");
            }
            deviceTurned = !deviceTurned;
        }, 300, 8, function () {
            deviceBackground.classList.remove("turn");
        });

        timeout(lateAnimation, function () {
            // smoke
            intervalN(smokeAnimation, function () {
                for (var i = 0; i < 100; i++) {
                    if (!tryCreateCloud(2)) {
                        break;
                    }
                }
            }, 100, 11);

            // counter
            showCrutchCounter(crutchCounter);

            // meter crutch
            meterCrutch.classList.add("scaled");
            timeout(meterCrutchAnimation, function () {
                meterCrutch.classList.remove("scaled");
            }, 500);

            // meter
            timeout(meterAnimation, function () {
                setArrowAngle();
            }, 1000);

            // gears
            var gears = [leftGearWrapper, rightGearWrapper, rightSmallGearWrapper];
            gears.forEach(function (gear) {
                gear.classList.add("faster");
            });
            timeout(gearAnimation, function () {
                gears.forEach(function (gear) {
                    gear.classList.remove("faster");
                });
            }, 5000)
        }, 1000);


        // plus
        plus.classList.add("scaled");
        timeout(plusAnimation, function () {
            plus.classList.remove("scaled");
        }, 500);
    }

    function buttonPressed() {
        crutchAlert(true);
        // button
        button.classList.add("pressed");
        timeout(buttonAnimation, function () {
            button.classList.remove("pressed")
        }, 500);
    }

    var button = document.querySelector(".button");
    button.onclick = function () {
        buttonPressed();
    };

    var app = new PIXI.Application(1200, 211, {transparent: true});
    app.interactive = true;
    deviceTube.appendChild(app.view);

    var totalSprites = 1020;

    var sprites = new PIXI.particles.ParticleContainer(totalSprites, {
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true
    });
    var bubblesSprites = new PIXI.particles.ParticleContainer(totalSprites, {
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true
    });

    var container = new PIXI.Container();

    app.stage.addChild(container);

    container.addChild(sprites);
    container.addChild(bubblesSprites);

// create an arrays to store all the sprites
    var clouds = [];
    var bubbles = [];

    var debugCursor = document.createElement("div");
    document.body.appendChild(debugCursor);


    var clickHandler = document.querySelector(".click-handler");
    clickHandler.onclick = function (e) {
        var x = e.pageX - clickHandler.documentOffsetLeft + layout.scrollLeft;
        var y = e.pageY - clickHandler.documentOffsetTop + layout.scrollTop;
        for (var i = 0; i < bubbles.length; i++) {
            var bubble = bubbles[i];
            if (bubble.alpha !== 0) {
                var distanceX = bubble.x - x;
                var distanceY = bubble.y - y;
                var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                if (distance < bubble.size / 2) {
                    bubblePoppingPlay(bubble.alpha * bubble.size / (256 * 5));
                    bubble.alpha = 0;
                    break;
                }
            }
        }
    };

    function tryCreateCloud(speedMultiplier) {
        for (var i = 0; i < clouds.length; i++) {
            var cloud = clouds[i];
            if (cloud.speed === 0) {
                cloudParamsRandomize(cloud, speedMultiplier);
                return true;
            }
        }
        return false;
    }

    function tryCreateBubble(playSound) {
        for (var i = 0; i < bubbles.length; i++) {
            var bubble = bubbles[i];
            if (bubble.speed === 0) {
                if (!!playSound)
                    bubble.playSound = playSound;
                bubbleParamsRandomize(bubble);
                return true;
            }
        }
        return false;
    }


    setInterval(function () {
        tryCreateCloud();
        tryCreateCloud();
    }, 100);


    function cloudParamsRandomize(cloud, speedMultiplier) {
        if (!speedMultiplier)
            speedMultiplier = 1;
        var size = Math.floor(Math.random() * 150) + 50;
        var scale = size / 256;

        cloud.size = size;

        cloud.scale.set(scale);

        cloud.x = 500;
        cloud.y = app.renderer.height + size / 2 + 1;

        cloud.rotation = Math.random() * 2 * Math.PI;

        var directionLimit = Math.atan2(36 + size / 2 + 1, (256 - size) / 2);

        cloud.direction = Math.PI / 2 + directionLimit + (Math.random() * (Math.PI - 2 * directionLimit));

        cloud.speed = speedMultiplier * (0.2 + 0.8 * Math.random()) * (1 / scale);

        cloud.alpha = 0.05 + 0.5 * Math.random() * (1 / cloud.speed);
    }

    function bubbleParamsRandomize(bubble) {
        var size = Math.floor(Math.random() * 100) + 30;
        var scale = size / 256;

        // diameter
        bubble.size = size;

        bubble.scale.set(scale);

        bubble.x = 500;
        bubble.y = app.renderer.height + size / 2 + 1;

        bubble.rotation = 2 * Math.random() * Math.PI - Math.PI / 2;

        var directionLimit = Math.atan2(36 + size / 2 + 1, (256 - size) / 2);

        bubble.direction = Math.PI / 2 + directionLimit + (Math.random() * (Math.PI - 2 * directionLimit));

        bubble.speed = 0.2 * (2 + 2 * Math.random());

        bubble.alpha = 0.7 + 0.3 * Math.random();
    }

    for (var i = 0; i < 1020; i++) {

        if (i < 1000) {
            var cloud = PIXI.Sprite.fromImage("img/cloud.png");

            cloud.anchor.set(0.5);

            cloudParamsRandomize(cloud);

            cloud.speed = 0;

            clouds.push(cloud);

            sprites.addChild(cloud);
        } else {
            var bubble = PIXI.Sprite.fromImage("img/bubble.png");
            bubble.anchor.set(0.5);

            bubbleParamsRandomize(bubble);

            bubble.speed = 0;
            bubble.playSound = false;

            bubbles.push(bubble);

            bubblesSprites.addChild(bubble);
        }
    }


    var cloudBounds = new PIXI.Rectangle(
        -200,
        -200,
        app.renderer.width + 200,
        app.renderer.height + 256
    );

    var bubbleBounds = new PIXI.Rectangle(
        0,
        0,
        app.renderer.width,
        app.renderer.height + 256
    );

    var tick = 0;

    app.ticker.add(function () {

        for (var i = 0; i < clouds.length; i++) {

            var cloud = clouds[i];
            cloud.x += Math.sin(cloud.direction) * (cloud.speed * cloud.scale.y);
            cloud.y += Math.cos(cloud.direction) * (cloud.speed * cloud.scale.y);
            cloud.rotation = -cloud.direction + Math.PI;
            cloud.alpha -= 0.0005;
            if (cloud.alpha < 0) {
                cloud.alpha = 0;
                cloud.speed = 0;
            }

            if (cloud.x < cloudBounds.x) {
                cloud.speed = 0;
            }
            else if (cloud.x > cloudBounds.x + cloudBounds.width) {
                cloud.speed = 0;
            }

            if (cloud.y < cloudBounds.y) {
                cloud.speed = 0;
            }
            else if (cloud.y > cloudBounds.y + cloudBounds.height) {
                cloud.speed = 0;
            }
        }

        for (var i = 0; i < bubbles.length; i++) {

            var bubble = bubbles[i];
            bubble.x += Math.sin(bubble.direction) * (bubble.speed * bubble.scale.y);
            bubble.y += Math.cos(bubble.direction) * (bubble.speed * bubble.scale.y);
            bubble.rotation = -bubble.direction + Math.PI;
            bubble.alpha -= 0.0005;
            if (bubble.alpha < 0) {
                bubble.alpha = 0;
                bubble.speed = 0;
            }

            if (bubble.x < bubbleBounds.x) {
                bubble.speed = 0;
            }
            else if (bubble.x > bubbleBounds.x + bubbleBounds.width) {
                bubble.speed = 0;
            }

            if (bubble.y - bubble.size / 2 < bubbleBounds.y) {
                if (bubble.alpha > 0.1 && bubble.playSound) {
                    bubblePoppingPlay(bubble.alpha * bubble.size / (256 * 5));
                }
                bubble.speed = 0;
                bubble.alpha = 0;
            }
            else if (bubble.y > bubbleBounds.y + bubbleBounds.height) {
                bubble.speed = 0;
            }
        }

        // increment the ticker
        tick += 0.1;
    });


    if(typeof crutchCounter !== "undefined") {
        showCrutchCounter(crutchCounter);
        setArrowAngle();
        layout.style.display = "block";
    }
}

