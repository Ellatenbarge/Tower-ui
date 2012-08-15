
$(document).ready(function() {
var streamer = "rtmp://optiplex.laits.utexas.edu:1935/vod";
var file = "lecture_pt2.mp4";
var ios_file = "http://optiplex.laits.utexas.edu:1935/vod/_definst_/mp4:sample.mp4/playlist.m3u8"
var ios_file = "http://optiplex.laits.utexas.edu:1935/vod/_definst_/mp4:lecture_pt2.mp4/playlist.m3u8"
jwplayer('mediaplayer').setup({
	'autostart':false,
	'id': 'playerID',
	'width': '320',
	'height': '180',
	'streamer': streamer, 
	'file':file,
	'modes': [
		{ type: 'flash', src: 'www/jwplayer/player.swf' },
		{ type: 'html5', config: { 'file': ios_file, 'provider': 'http' } }
	]
});
	$('#mediaplayer').dialog( { position:"top" });
});

