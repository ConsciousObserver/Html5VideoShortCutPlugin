(function ($) {
	$.fn.videoShortCuts = function (options) {
		/*
			options = {
				resizeEnabled: true,
				videoNavigationCallback: function (currentTime) {},
				volumeChangeCallback: function (volume) {},
				eventReceiverNode: $("body"),
				fullScreenKey: 70 ,// 'f'
				fullScreenChangeCallback: function () {},
				fastForwardKey: 109 and 187, // keyboard and numpad + (plus) key
				slowdownKey: 107 abd 189, // keyboard and numpad - (minus) key
				videoSpeedChangeCallback: function (playbackRate) {},
				rewindKey: 82, // 'r' rewind is not working, somehow playbackRate has no effect for negative value
				screenshotKey: 69// shift + 'e' 
			}
		*/
		options = options || {};

		options.videoNavigationCallback = options.videoNavigationCallback || noOp;
		options.volumeChangeCallback = options.volumeChangeCallback || noOp;
		options.eventReceiverNode = options.eventReceiverNode || $("body");
		options.fullScreenKey = options.fullScreenKey || 'F'.charCodeAt(0);
		options.fullScreenChangeCallback = options.fullScreenChangeCallback || noOp;
		options.fastForwardKey = options.fastForwardKey || 187;
		options.slowdownKey = options.slowdownKey || 189;
		options.videoSpeedChangeCallback = options.videoSpeedChangeCallback || noOp;
		options.rewindKey = options.rewindKey || 82;
		options.screenshotKey = options.screenshotKey || 69;
		
		var vid = this;
		var plainVid = vid.get(0);
		var isFullScreen = false;
		var currentPlaybackRate = 1;/*video playing speed*/
		var speedJump = 1;
		var backwardSpeedJump = 0.25;
		var screenshotCanvas = null;

		if(options.resizeEnabled) {
			options.eventReceiverNode.dblclick(function (event) {
				console.log("body double clicked");
				var x = event.clientX;
				var y = event.clientY;
				
				vid.attr("width", x);
				vid.attr("height", y);
			})
		}
		vid.click(function (event) {
			/*mouse click play/pause*/
			var y = event.clientY;
			var deltaY = (y - vid.offset().top);
			var clickableY = vid.height() * 9/10;
			var pl
			if(deltaY < clickableY) {
				plainVid.playbackRate = 1;/*resetting the playback rate to 1*/
				if(plainVid.paused) {
					plainVid.play();
				} else {
					plainVid.pause();
				}
			}
		}).dblclick(function () {
			if(!isFullScreen) {
				changeToFullScreen();
			} else {
				exitFullScreen();
			}
			isFullScreen = !isFullScreen;
		});	
		options.eventReceiverNode.keydown(function (event) {
			console.log("key pressed " + event.keyCode + " : '" + event.which + "'");
			var key = event.keyCode;
			
			var volumeShift = 0.01;
			
			if(key == 32) {/*spacebar for play/pause*/
				plainVid.playbackRate = 1;/*resetting the playback rate to 1*/
				if(plainVid.paused) {
					plainVid.play();
				} else {
					plainVid.pause();
				}
			} else if(event.ctrlKey && key == 37) {/*ctrl + left key, video navigation start*/
				plainVid.currentTime -= 40;
				options.videoNavigationCallback(plainVid.currentTime)
			} else if(event.ctrlKey && key == 39) {/*ctrl + right key*/
				plainVid.currentTime += 40;
				options.videoNavigationCallback(plainVid.currentTime)
			} else if(event.shiftKey && key == 37) {/*shift + left key*/
				plainVid.currentTime -= 25;
				options.videoNavigationCallback(plainVid.currentTime)
			} else if(event.shiftKey && key == 39) {/*shift + right key*/
				plainVid.currentTime += 25;
				options.videoNavigationCallback(plainVid.currentTime)
			} else if(key == 37) {/*left key*/
				plainVid.currentTime -= 10;
				options.videoNavigationCallback(plainVid.currentTime)
			} else if(key == 39) {/*right key, video navigation end*/
				plainVid.currentTime += 10;
				options.videoNavigationCallback(plainVid.currentTime)
			} else if(key == 38) {/*up key, volume control start*/
				var volumeValue = Math.round( (plainVid.volume + volumeShift) * 100);
				if(volumeValue <= 100) {
					plainVid.volume = volumeValue / 100;
				}
				options.volumeChangeCallback(plainVid.volume);
			} else if(key == 40) {/*down key, volume control end*/
				var volumeValue = Math.round( (plainVid.volume - volumeShift) * 100);
				if(volumeValue >= 0) {
					plainVid.volume = volumeValue / 100;
				}
				options.volumeChangeCallback(plainVid.volume);
			} else if(key == 13 || key == options.fullScreenKey) {
				changeToFullScreen();
				if(!isFullScreen) {
					changeToFullScreen();
				} else {
					exitFullScreen();
				}
				isFullScreen = !isFullScreen;
			} else if(key == options.fastForwardKey || key == 109) {
				increaseVideoSpeed();
			} else if(key == options.slowdownKey || key == 107) {
				decreaseVideoSpeed();
			} else if(key == options.rewindKey) {
				rewindVideo();
			} else if(/*event.shiftKey && */key == options.screenshotKey) {
				saveScreenshot();
			}
		});
		
		function changeToFullScreen () {
			if (plainVid.requestFullscreen) {
				plainVid.requestFullscreen();
			} else if (plainVid.mozRequestFullScreen) {
				plainVid.mozRequestFullScreen();
			} else if (plainVid.webkitRequestFullscreen) {
				plainVid.webkitRequestFullscreen();
			}

			options.fullScreenChangeCallback();
		}
		function exitFullScreen () {
			if (plainVid.exitFullscreen) {
				plainVid.exitFullscreen();
			} else if (plainVid.mozExitFullScreen) {
				plainVid.mozExitFullScreen();
			} else if (plainVid.webkitExitFullscreen) {
				plainVid.webkitExitFullscreen();
			}

			options.fullScreenChangeCallback();
		}
		function increaseVideoSpeed() {
			var nextRate = plainVid.playbackRate + speedJump;
			if( nextRate < 20) {
				plainVid.playbackRate = nextRate;
			}
			currentPlaybackRate = plainVid.playbackRate;
			options.videoSpeedChangeCallback(currentPlaybackRate);
		}
		function decreaseVideoSpeed() {
			var nextRate = null;
			if(plainVid.playbackRate > 1) {
				nextRate = plainVid.playbackRate - speedJump;
			} else {
				nextRate = plainVid.playbackRate - backwardSpeedJump;
			}
			if( nextRate > -1) {
				plainVid.playbackRate = nextRate;
			}
			currentPlaybackRate = plainVid.playbackRate;
			options.videoSpeedChangeCallback(currentPlaybackRate);
		}
		function rewindVideo() {
			var nextRate = plainVid.playbackRate - speedJump;
			if( nextRate > -20) {
				plainVid.playbackRate = nextRate;
			}
			currentPlaybackRate = plainVid.playbackRate;
			options.videoSpeedChangeCallback(currentPlaybackRate);
		}
		function saveScreenshot() {
			if(!screenshotCanvas) {
				screenshotCanvas = $("<canvas style='display:none;'></canvas>");
				$("body").append(screenshotCanvas);
			}
			var jCanvas = screenshotCanvas;
			var plainCanvas = jCanvas.get(0);
			var context = plainCanvas.getContext("2d");
			jCanvas.attr("width", vid.width());
			jCanvas.attr("height", vid.height());
			context.drawImage(plainVid, 0, 0, vid.width(), vid.height());
			var dataUrl = getCanvasImage(plainCanvas, 'png');		
			startDownload(dataUrl);
		}
		function getCanvasImage(canvas, type, quality) {
		var dataURL = null;
			if ( canvas.toDataURL ) {
				// JPEG quality defaults to 1
				if ( !quality) {
					quality = 1;
				}
				dataURL = canvas.toDataURL( 'image/' + type, quality );
			}
			return dataURL;
		}
		function startDownload (url) {
			window.open(url);/* I tried everything from form targeted iframe to anchor with download attribute, this is the only thing that works*/
		}
		function noOp() {

		}
	}
})(jQuery);