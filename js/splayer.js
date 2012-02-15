var splayer = function(selector) {
	this.win = {};
	this.list = {
		node: document.querySelector(selector),
		images: {},
		mask: document.createElement("li"),
		expanded: false,
		height: 0,
		open_height: 0,
		width: 0,
		top_offset: {
			last_break: 0,
			current_row: 0,
			total: 0,
			rows: {
				0: {
					width: 0
				}
			}
		}
	};
	
	this.init();
};
splayer.prototype = {
	center: function () {
		for(image in this.list.images) {
			this.list.images[image].start_top = ((this.list.height - this.list.images[image].height) / 2);
			this.list.images[image].start_position = Math.floor((this.list.width - this.list.images[image].width) / 2);
			this.list.images[image].hover_position += this.list.images[image].start_position;
			this.list.images[image].open_top += this.list.images[image].start_top;
			
			this.list.images[image].node.style.top = this.list.images[image].start_top + "px";
			this.list.images[image].node.style.left = this.list.images[image].start_position + "px";
		}
		for (row in this.list.top_offset.rows) {
			this.list.open_height += this.list.top_offset.rows[row].height + 10;
		}
		this.list.open_height += 80;
	},
	roll_in: function () {
		if (!this.list.expanded) {
			this.list.node.style.zIndex = "9999";
			for (image in this.list.images) {
				this.list.images[image].node.style.left = this.list.images[image].hover_position + "px";
			}
		}
	},
	roll_out: function () {
		if (!this.list.expanded) {
			this.list.node.style.zIndex = "auto";
			for (image in this.list.images) {
				this.list.images[image].node.style.left = this.list.images[image].start_position + "px";
			}
		}
	},
	click_handle: function () {
		if (!this.list.expanded) {
			this.list.expanded = true;
			this.list.node.style.zIndex = "9999";
			this.list.node.className = "splayer expanded";
			
			this.list.mask.style.height = this.list.open_height + "px";
			this.list.mask.style.width = this.win.width + "px";
			this.list.mask.style.top = (10 - this.list.node.offsetTop) + "px";
			this.list.mask.style.left = (10 - this.list.node.offsetLeft) + "px";
			this.list.mask.style.background = "rgba(0,0,0,.5)";
			
			for (image in this.list.images) {
				var xtra_space = (this.win.width - this.list.top_offset.rows[this.list.images[image].row].width) / 2;
				this.list.images[image].node.style.top = (50 - this.list.node.offsetTop + this.list.images[image].open_top) + "px";
				this.list.images[image].node.style.left = this.list.images[image].open_position - this.list.node.offsetLeft + xtra_space + "px";
			}
		}
		else {
			this.list.expanded = false;
			this.list.node.style.zIndex = "auto";
			this.list.node.className = "splayer";
			
			this.list.mask.style.height = this.list.height + "px";
			this.list.mask.style.width = this.list.width + "px";
			this.list.mask.style.top = "0px";
			this.list.mask.style.left = "0px";
			this.list.mask.style.background = "rgba(0,0,0,0)";
			
			for (image in this.list.images) {
				this.list.images[image].node.style.zIndex = this.list.images[image].z_index;
				this.list.images[image].node.style.top = this.list.images[image].start_top + "px";
				this.list.images[image].node.style.left = this.list.images[image].start_position + "px";
			}
		}
	},
	init: function () {
		var that = this,
			images = [],
			child_lis = this.list.node.getElementsByTagName("li"),
			full_offset = 0;
		
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
				this.list.top_offset.total += this.list.top_offset.rows[this.list.top_offset.current_row].height + 10;
				this.list.top_offset.current_row += 1;
				this.list.top_offset.rows[this.list.top_offset.current_row] = {};
				this.list.top_offset.rows[this.list.top_offset.current_row].width = 0;
				full_offset = 50;
			}
		
			this.list.images[i] = {
				node: images[i],
				parent: images[i].parentElement,
				height: images[i].offsetHeight,
				width: images[i].offsetWidth,
				area: images[i].offsetHeight * images[i].offsetWidth,
				z_index: 9999 - Math.floor((images[i].offsetHeight * images[i].offsetWidth) / 1000),
				start_top: 0,
				open_top: this.list.top_offset.total,
				start_position: 0,
				hover_position: i * 5,
				open_position: full_offset,
				row: this.list.top_offset.current_row
			};
			
			//this.list.mask.appendChild(this.list.images[i].node.parentElement);
			
			this.list.images[i].node.style.zIndex = this.list.images[i].z_index;
			this.list.top_offset.rows[this.list.top_offset.current_row].height = (this.list.height < this.list.images[i].height) ? this.list.images[i].height : this.list.height;
			this.list.top_offset.rows[this.list.top_offset.current_row].width += parseInt(this.list.images[i].width,10) + 10;
			this.list.height = (this.list.height < this.list.images[i].height) ? this.list.images[i].height : this.list.height;
			this.list.width = (this.list.width < this.list.images[i].width) ? this.list.images[i].width : this.list.width;
			
			full_offset += (this.list.images[i].width + 10);
		}
		
		this.list.node.appendChild(this.list.mask);
		this.list.mask.className = "mask";
		this.list.mask.style.height = this.list.height + "px";
		this.list.mask.style.width = this.list.width + "px";
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