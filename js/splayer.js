var splayer = function(selector) {
	this.win = {};
	this.list = {
		node: document.querySelector(selector),
		expanded: false,
		height: 0,
		open_height: 0,
		width: 0,
	};
	this.images = {};
	this.rows = {
		current_row: 0,
		total: 0,
		row: {
			0: {
				height: 0,
				width: 0
			}
		}
	};
	this.mask = {
		node: document.createElement("li")
	};
	this.length = 0;
	
	this.init();
};
splayer.prototype = {
	center: function () {
		for(image in this.images) {
			var thisImage = this.images[image];
		
			thisImage.start_top = ((this.list.height - thisImage.height) / 2);
			thisImage.start_position = Math.floor((this.list.width - thisImage.width) / 2);
			thisImage.hover_position += thisImage.start_position;
			thisImage.open_top = thisImage.open_top + ((this.rows.row[thisImage.row].height - thisImage.height) / 2) + 50 - this.list.node.offsetTop;
			thisImage.open_position = thisImage.open_position - this.list.node.offsetLeft + ((this.win.width - this.rows.row[thisImage.row].width) / 2);

			
			thisImage.node.style.top = thisImage.start_top + "px";
			thisImage.node.style.left = thisImage.start_position + "px";
			thisImage.node.style.visibility = thisImage.visibility;
		}
		for (row in this.rows.row) {
			this.list.open_height += this.rows.row[row].height + 10;
		}
		this.list.open_height += 80;
	},
	fan: function (finalPosition) {
		var loops = (6 > this.length) ? this.length : 6;
	
		for (var i = 0; i < loops; i++) {
			this.images[i].node.style.left = this.images[i][finalPosition] + "px";
		}
	},
	roll_in: function () {
		if (!this.list.expanded) {
			this.list.node.style.zIndex = "9999";
			this.fan("hover_position");
		}
	},
	roll_out: function () {
		if (!this.list.expanded) {
			this.list.node.style.zIndex = "auto";
			this.fan("start_position");
		}
	},
	click_handle: function () {
		if (!this.list.expanded) {
			this.list.expanded = true;
			this.list.node.style.zIndex = "9999";
			this.list.node.className = "splayer expanded";
			
			this.mask.node.style.cssText = "height:" + this.list.open_height + "px;" +
				"width:" + this.win.width + "px;" + 
				"top:" + (window.pageYOffset + 10 - this.list.node.offsetTop) + "px;" + 
				"left:" + (10 - this.list.node.offsetLeft) + "px;" +
				"background:rgba(0,0,0,.5);";
			
			for (image in this.images) {				
				this.images[image].node.style.cssText =
					"z-index:" + this.images[image].z_index + ";" +
					"top:" + (window.pageYOffset + this.images[image].open_top) + "px;" +
					"left:" + this.images[image].open_position + "px;" +
					"visibility:" + this.images[image].visibility;
			}
		}
		else {
			this.list.expanded = false;
			this.list.node.style.zIndex = "auto";
			this.list.node.className = "splayer";
			
			this.mask.node.style.cssText = "height:" + this.list.height + "px;" +
				"width:" + this.list.width + "px;" + 
				"top:0px;" + 
				"left:0px;" +
				"background:rgba(0,0,0,0);";
			
			for (image in this.images) {
				this.images[image].node.style.cssText =
					"z-index:" + this.images[image].z_index + ";" +
					"top:" + this.images[image].start_top + "px;" +
					"left:" + this.images[image].start_position + "px;" +
					"visibility:" + this.images[image].visibility;
			}
		}
	},
	generateStyles: function () {
		var head = document.getElementsByTagName('head')[0],
			style = document.createElement('style'),
			rules = document.createTextNode(
				".splayer { padding:0; list-style:none; list-style:none; position:relative; cursor:pointer; }" +
				".splayer li.mask { position:absolute; background:rgba(0,0,0,0); left:0; top:0; border-radius:10px; -moz-border-radius:10px; -webkit-border-radius:10px; transition-duration:.3s; transition-timing-function:ease-out; -moz-transition-property:left, top, background, width; -moz-transition-duration:.3s; -moz-transition-timing-function:ease-out; -webkit-transition-property:left, top, background, width;	-webkit-transition-duration:.3s; -webkit-transition-timing-function:ease-out; }" +
				".splayer li img { position:absolute; left:0; box-shadow:0 0 5px rgba(0,0,0,.25); background:#fff; padding:5px; transition-property:left, top; transition-duration:.1s; transition-timing-function:ease-out; -moz-transition-property:left, top; -moz-transition-duration:.1s; -moz-transition-timing-function:ease-out; -webkit-transition-property:left, top; -webkit-transition-duration:.1s; -webkit-transition-timing-function:ease-out; }" +
				".splayer.expanded li img { transition-duration:.3s; -moz-transition-duration:.3s; -webkit-transition-duration:.3s; }"
			);
		
		style.type = 'text/css';
		
		if (style.styleSheet) {
			style.styleSheet.cssText = rules.nodeValue;
		}
		else {
			style.appendChild(rules);
		}
		
		head.appendChild(style);	
	},
	init: function () {
		this.generateStyles();
		
		var that = this,
			images = [],
			image_nodes = this.list.node.getElementsByTagName("img"),
			hover_multiplier = 2;
		
		this.win.width = window.innerWidth - 35;
		this.list.node.className = "splayer";
		
		//Extract our images into an array for sorting
		for (var x = 0; x < image_nodes.length; x++) {
			images[x] = image_nodes[x];
		}
		
		//	Sort children by future z-index so they'll animate in the appropriate order
		images.sort(function (a, b) {
			var a_z_index = 9999 - Math.floor((a.offsetHeight * a.offsetWidth) / 1000),
				b_z_index = 9999 - Math.floor((b.offsetHeight * b.offsetWidth) / 1000);
			
			if (a_z_index < b_z_index) {
				return 1;
			}
			else if (a_z_index > b_z_index) {
				return -1;
			}
			// If the z-indexes are the same we actually want to return 1 to ensure the
			// image uses the correct offset
			return 1;
		});
		
		for (var i = 0; i < images.length; i++) {		
			if ((this.rows.row[this.rows.current_row].width + images[i].offsetWidth) > (this.win.width - 120)) {
				this.rows.total += this.rows.row[this.rows.current_row].height + 10;
				this.rows.current_row += 1;
				this.rows.row[this.rows.current_row] = {
					width: 0,
					height: 0
				};
			}
			
			hover_multiplier += 2;
		
			this.images[i] = {
				node: images[i],
				height: images[i].offsetHeight,
				width: images[i].offsetWidth,
				area: images[i].offsetHeight * images[i].offsetWidth,
				z_index: 9999 - Math.floor((images[i].offsetHeight * images[i].offsetWidth) / 1000),
				start_top: 0,
				open_top: this.rows.total,
				start_position: 0,
				hover_position: i * hover_multiplier,
				open_position: this.rows.row[this.rows.current_row].width,
				row: this.rows.current_row,
				visibility: (6 < i) ? "hidden" : "visible"
			};
			
			this.images[i].node.style.zIndex = this.images[i].z_index;
			this.rows.row[this.rows.current_row].height = (this.rows.row[this.rows.current_row].height < this.images[i].height) ? this.images[i].height	: this.rows.row[this.rows.current_row].height;
			this.rows.row[this.rows.current_row].width += parseInt(this.images[i].width,10) + 10;
			
			if (6 > i) {
				this.list.height = (this.list.height < this.images[i].height) ? this.images[i].height : this.list.height;
				this.list.width = (this.list.width < this.images[i].width) ? this.images[i].width : this.list.width;
			}
		}
		
		this.length = i;
		this.list.node.appendChild(this.mask.node);
		this.mask.node.className = "mask";
		this.mask.node.style.height = this.list.height + "px";
		this.mask.node.style.width = this.list.width + "px";
		this.list.node.style.height = this.list.height + "px";
		this.list.node.style.width = this.list.width + "px";
		
		this.center();			
		
		this.list.node.addEventListener("mouseover", function () {
			that.roll_in();
		}, false);
		this.list.node.addEventListener("mouseout", function () {
			that.roll_out();
		}, false);
		this.list.node.addEventListener("click", function () {
			that.click_handle();
		}, false);
	}
};