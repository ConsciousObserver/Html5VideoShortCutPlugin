# Html5VideoShortCutPlugin

This is a simple jQuery plugin which allows us to add keyboard shortcuts and mouse functions to HTML 5 video player.
Following functionalities are currently supported:

1. Video navigation (10 seconds, 25 seconds and 40 seconds) (left and right arrow in combination with shift or ctrl)
2. Volume control (up and down arrow)
3. Change to fullscreen ('f' key)
4. Fast forward ('+' key)
5. Slow down ('-' key)
6. Rewind (Not working)
7. taking a screenshot

Following are supported options :

```javascript
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
				screenshotKey: 69// 'e' 
			}
```
####Example usage : 
```javascript
var vid = $("#vid");
vid.videoShortCuts({
	videoNavigationCallback: function (location) {console.log("video navigated at : " + location);},
	volumeChangeCallback: function (volume) {console.log("Volume changed to : " + volume);}
});
```

**I have added a video from W3Schools in the sample file public/index.html, which is fairly short (only 10 seconds).
This may not show you the navigation capability as the shortest default jump is 10 seconds. You'll have to add your 
own video to test the navigation capabilities.**
