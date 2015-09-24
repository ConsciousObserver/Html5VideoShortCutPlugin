$(function () {
	var vid = $("#vid");
	vid.videoShortCuts({
		videoNavigationCallback: function (location) {console.log("video navigated at : " + location);},
		volumeChangeCallback: function (volume) {console.log("Volume changed to : " + volume);}
	});
	/*setVideo("vid.mov");*/
	function setVideo(url) {
		vid.find("source:eq(0)").attr("src", url);
	}
});