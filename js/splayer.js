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
	
	this.init();
};
splayer.prototype = {
	center: function () {
		for(image in this.images) {
			this.images[image].start_top = ((this.list.height - this.images[image].height) / 2);
			this.images[image].start_position = Math.floor((this.list.width - this.images[image].width) / 2);
			this.images[image].hover_position += this.images[image].start_position;
			this.images[image].open_top = this.images[image].open_top +	((this.rows.row[this.images[image].row].height - this.images[image].height) / 2) + 50 - this.list.node.offsetTop;
			this.images[image].open_position = this.images[image].open_position - this.list.node.offsetLeft + ((this.win.width - this.rows.row[this.images[image].row].width) / 2);

			
			this.images[image].node.style.top = this.images[image].start_top + "px";
			this.images[image].node.style.left = this.images[image].start_position + "px";
		}
		for (row in this.rows.row) {
			this.list.open_height += this.rows.row[row].height + 10;
		}
		this.list.open_height += 80;
	},
	roll_in: function () {
		if (!this.list.expanded) {
			this.list.node.style.zIndex = "9999";
			for (image in this.images) {
				this.images[image].node.style.left = this.images[image].hover_position + "px";
			}
		}
	},
	roll_out: function () {
		if (!this.list.expanded) {
			this.list.node.style.zIndex = "auto";
			for (image in this.images) {
				this.images[image].node.style.left = this.images[image].start_position + "px";
			}
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
				this.images[image].node.style.top = window.pageYOffset + this.images[image].open_top + "px";
				this.images[image].node.style.left = this.images[image].open_position + "px";
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
				this.images[image].node.style.zIndex = this.images[image].z_index;
				this.images[image].node.style.top = this.images[image].start_top + "px";
				this.images[image].node.style.left = this.images[image].start_position + "px";
			}
		}
	},
	init: function () {
		var that = this,
			images = [],
			child_lis = this.list.node.getElementsByTagName("li"),
			full_offset = 0,
			hover_multiplier = 2;
		
		this.win.width = window.innerWidth - 35;
		this.list.node.className = "splayer";
		
		//Extract our images into an array for sorting
		for (var x = 0; x < child_lis.length; x++) {
			images[x] = child_lis[x].getElementsByTagName("img")[0];
		}
		
		//	Sort children by future z-index so they'll animate in the appropriate order
		images.sort(function (a, b) {
			var a_z_index = 9999 - Math.floor((a.offsetHeight * a.offsetWidth) / 1000),
				b_z_index = 9999 - Math.floor((b.offsetHeight * b.offsetWidth) / 1000);
			if (a_z_index < b_z_index) {
				return 1;
			}
			if (a_z_index > b_z_index) {
				return -1;
			}
			// If the z-indexes are the same we actually want to return 1 to ensure the
			// image uses the correct offset
			return 1;
		});
		
		for (var i = 0; i < images.length; i++) {
			if ((full_offset + images[i].offsetWidth) > (this.win.width - 120)) {
				this.rows.total += this.rows.row[this.rows.current_row].height + 10;
				this.rows.current_row += 1;
				this.rows.row[this.rows.current_row] = {};
				this.rows.row[this.rows.current_row].width = 0;
				this.rows.row[this.rows.current_row].height = 0;
				full_offset = 0;
			}
			
			hover_multiplier += 2;
		
			this.images[i] = {
				node: images[i],
				parent: images[i].parentElement,
				height: images[i].offsetHeight,
				width: images[i].offsetWidth,
				area: images[i].offsetHeight * images[i].offsetWidth,
				z_index: 9999 - Math.floor((images[i].offsetHeight * images[i].offsetWidth) / 1000),
				start_top: 0,
				open_top: this.rows.total,
				start_position: 0,
				hover_position: i * hover_multiplier,
				open_position: full_offset,
				row: this.rows.current_row
			};
			
			this.images[i].node.style.zIndex = this.images[i].z_index;
			this.rows.row[this.rows.current_row].height = (this.rows.row[this.rows.current_row].height < this.images[i].height) ? this.images[i].height	: this.rows.row[this.rows.current_row].height;
			this.rows.row[this.rows.current_row].width += parseInt(this.images[i].width,10) + 10;
			this.list.height = (this.list.height < this.images[i].height) ? this.images[i].height : this.list.height;
			this.list.width = (this.list.width < this.images[i].width) ? this.images[i].width : this.list.width;
			
			full_offset += (this.images[i].width + 10);
		}
		
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