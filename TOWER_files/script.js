var Dase = {};

$(document).ready(function() {
	Dase.initDelete('login');
	Dase.initDelete('set');
	Dase.initDelete('topic');
	Dase.initDelete('notes');
	Dase.initDelete('lecture');
	Dase.initToggle('target');
	Dase.initToggle('email');
	Dase.initToggle('setup');
	//Dase.initSortable('set');
	Dase.initSortableTable('set');
	Dase.initUserPrivs();
	Dase.initFormDelete();
	Dase.initToggleCheck();
	Dase.initColorbox('loclink');
	Dase.initColorbox('qf_add');
	Dase.initInactiveLinks();
	Dase.initBenchmarkForm();
	Dase.initChat();
	Dase.initColorboxTest();
	Dase.initResize();
	Dase.initTogglePlayer();
	Dase.initPopoutPlayer();

	$('.dropdown-toggle').dropdown();

});

Dase.initDialog = function() {
	alert('ss');
	$('#mediaplayer').dialog( { position:"top" } );
};

Dase.initPopoutPlayer = function() {
	$('#popoutPlayer').popupWindow({ 
		height:380, 
		width:656, 
		top:50, 
		left:50
	}); 
};

Dase.initTogglePlayer = function() {
	$('#togglePlayer').click(function() {
		if ($('#mediaplayer').is(':visible')) {
			Dase.playerWidth = jwplayer().getWidth();
			Dase.playerHeight = jwplayer().getHeight();
			jwplayer().resize(0,0);
			jwplayer().stop();
			$('#mediaplayer').hide();
		} else {
			jwplayer().resize(Dase.playerWidth,Dase.playerHeight);
			jwplayer().play();
			$('#mediaplayer').show();
		}
		return false;
	});

};

Dase.initResize = function() {
	$('#plus').click(function() {
		var w = jwplayer().getWidth();
		var h= jwplayer().getHeight();
		jwplayer().resize(w+16,h+9);
		return false;
	});
	$('#minus').click(function() {
		var w = jwplayer().getWidth();
		var h= jwplayer().getHeight();
		jwplayer().resize(w-16,h-9);
		return false;
	});

};


Dase.initColorboxTest = function() {
	$("#cb").colorbox(
		{iframe:true, innerWidth:800, innerHeight:500,onClosed: function() {location.reload()}}
	);
};

Dase.initChat = function() {
	var chat_count = 0;
	if (document.getElementById('chatwindow')) {
		var refreshId = setInterval(function(){
			if (chat_count < 50) {
				$.get('chat/log',function(html) {
					chat_count++;
					console.log('chat_count: '+chat_count);
					$('#chatwindow').html(html);
					$('#chatwindow').scrollTop($('#chatwindow')[0].scrollHeight); 
				});
			}
		}, 2000);
	}

	$('form[action="chat"]').submit(function() {
		var chat_o = {
			'url': $(this).attr('action'),
			'type':'POST',
			'data':$(this).serialize(),
			'success': function() {
				//location.reload();
				var cb = new Date().getTime();
				$.get('chat/log?cb='+cb,function(html) {
					chat_count = 0;
					$('#chatwindow').html(html);
					$('#chatwindow').scrollTop($('#chatwindow')[0].scrollHeight); 
				});
			},
			'error': function() {
				alert('sorry, an error occurred');
			}
		};
		$.ajax(chat_o);
			$(this).find('input[type=text]').val('');
			return false;
		});

};

Dase.initBenchmarkForm = function() {
	$('#targetAddBenchmark').find('select[name="lecture_id"]').change(function() {
		var lecture_id = $(this).find('option:selected').val();
		var url = $('base').attr('href')+'admin/benchmark_hint/'+lecture_id+'.json';
		$.getJSON(url,function(data) {
			$('#targetAddBenchmark').find('input[name="name"]').attr('value',data.name);
			if (data.topic_id) {
				$('#targetAddBenchmark').find('select[name="topic_id"] option[value="'+data.topic_id+'"]').attr('selected','selected');
			} else {
				$('#targetAddBenchmark').find('select[name="topic_id"] option:first').attr('selected','selected');
			}
		});
	});

};

Dase.initInactiveLinks = function() {
	$("li.disabled a").click(function() { return false; });
};

Dase.initColorbox = function(id) {
	$('#'+id).colorbox(
		{iframe:false, innerWidth:800, left: true, opacity: 0, innerHeight:500,onClosed: function() {location.reload()}}
	);
};

Dase.initToggleCheck = function() {
	var checked = false;
	$('#toggle_check').click(function() {
		if (checked) {
			$('table#items').find('input[type="checkbox"]').attr('checked',false);
			checked = false;
		} else {
			$('table#items').find('input[type="checkbox"]').attr('checked',true);
			checked = true;
		}
		return false;
	});
};

Dase.initToggle = function(id) {
	$('#'+id).find('a.toggle').click(function() {
		var id = $(this).attr('id');
		var tar = id.replace('toggle','target');
		$('#'+tar).toggle();
		return false;
	});	
};

Dase.initFormDelete = function() {
	$("form[method='delete']").submit(function() {
		if (confirm('are you sure?')) {
			var del_o = {
				'url': $(this).attr('action'),
				'type':'DELETE',
				'success': function() {
					location.reload();
				},
				'error': function() {
					alert('sorry, cannot delete');
				}
			};
			$.ajax(del_o);
		}
		return false;
	});
};

Dase.initDelete = function(id) {
	$('#'+id).find("a.delete").click(function() {
		if (confirm('are you sure?')) {
			var del_o = {
				'url': $(this).attr('href'),
				'type':'DELETE',
				'success': function(resp) {
					if (resp.location) {
						location.href = resp.location;
					} else {
						location.reload();
					}
				},
				'error': function() {
					alert('sorry, cannot delete');
				}
			};
			$.ajax(del_o);
		}
		return false;
	});
};

Dase.initSortable = function(id) {
	$('#'+id).sortable({ 
		cursor: 'crosshair',
		opacity: 0.6,
		revert: true, 
		start: function(event,ui) {
			ui.item.addClass('highlight');
		},	
		stop: function(event,ui) {
			$('#proceed-button').addClass('hide');
			$('#unsaved-changes').removeClass('hide');
			$('#'+id).find("li").each(function(index){
				$(this).find('span.key').text(index+1);
			});	
			ui.item.removeClass('highlight');
		}	
	});
};

Dase.initSortableTable = function(id) {
	$('#'+id).sortable({ 
		cursor: 'crosshair',
		opacity: 0.6,
		revert: true, 
		start: function(event,ui) {
			ui.item.addClass('highlight');
		},	
		stop: function(event,ui) {
			var order_data = [];
			$('#'+id).find("tr").each(function(index){
				$(this).find('span.key').text(index);
				order_data[order_data.length] = $(this).attr('id');
			});	
			var url = $('link[rel="items_order"]').attr('href');
			var _o = {
				'url': url,
				'type':'POST',
				processData: false,
				data: order_data.join('|'),
				'success': function(resp) {
					//alert(resp);
					//location.reload();
				},
				'error': function() {
					alert('sorry, there was a problem');
				}
			};
			$.ajax(_o);
			ui.item.removeClass('highlight');
		}	
	});
};

Dase.initUserPrivs = function() {
	$('#user_privs').find('a').click( function() {
		var method = $(this).attr('data-method');
		var url = $(this).attr('href');
		var _o = {
			'url': url,
			'type':method,
			'success': function(resp) {
				alert(resp);
				location.reload();
			},
			'error': function() {
				alert('sorry, there was a problem');
			}
		};
		$.ajax(_o);
		return false;
	});
};

