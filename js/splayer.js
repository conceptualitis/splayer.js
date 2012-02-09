function splayer() {
	var parental = {
			/* snag our wrapping UL */
			dom_node: document.querySelector(arguments[0]),
			
			/* the list has three states we should track: is it expanded? is it hovered? is it animating? */
			expanded: false,
			hovered: false,
			animating: false,
			
			height: 0,
			width: 0,
			
			/* setinterval variable for animation control */
			anim_intvl: undefined,
			
			/* functions for the UL */
			vertically_center: function () {
				for(item in children) {
					children[item].dom_node.style.top = ((this.height - children[item].height) / 2) + "px";
				}
			},
			apply_styles: function () {
				this.dom_node.style.cssText = "padding:0;margin:0 10px 10px 0;list-style:none;position:relative;height:" + this.height + "px;width:" + this.width + "px;";
			},
			anim_intvl_check: function () {
				if (!parental.animating) {
					window.clearInterval(parental.anim_intvl);
				}
			},
			hover: function () {
				for(item in children) {
					if (children[item].left < children[item].stop_position) {
						children[item].left += 2;
						children[item].dom_node.style.left = children[item].left + "px";
						parental.animating = true;
					}
					else {
						parental.animating = false;
					}
				}
				this.anim_intvl_check();
			},
			hover_out: function () {
				for(item in children) {
					if (0 < children[item].left) {
						children[item].left -= 5;
						children[item].dom_node.style.left = children[item].left + "px";
						parental.animating = true;
					}
					else {
						parental.animating = false;
					}
				}
				this.anim_intvl_check();
			},
			expand: function () {
				for(item in children) {
					if (children[item].left < children[item].open_position) {
						children[item].left += Math.floor(children[item].open_position / 10);
						children[item].dom_node.style.left = children[item].left + "px";
						parental.animating = true;
					}
					else {
						parental.animating = false;					
					}
				}
				this.anim_intvl_check();
			},
			close: function () {
				for(item in children) {
					if (0 < children[item].left) {
						children[item].left = Math.floor(children[item].left - (children[item].left / 10));
						children[item].dom_node.style.left = children[item].left + "px";
						parental.animating = true;
					}
					else {
						parental.animating = false;
					}
				}
				this.anim_intvl_check();
			}
		},
		container = parental.dom_node.parentElement,
		child_lis = parental.dom_node.getElementsByTagName("li"),
		children = new Array();
	
	function roll_in(e) {
		if (!parental.expanded && !parental.hovered && !parental.animating) {
			parental.dom_node.style.zIndex = "9999";
			parental.animating = true;
			parental.hovered = true;
			parental.anim_intvl = setInterval(function () {
				parental.hover();
			}, 5);
		}
	}
	
	function roll_out (e) {
		var rel_targ = e.relatedTarget || e.toElement,
			rel_parent = rel_targ.parentElement;
			
		if (!parental.expanded && !parental.animating && ("LI" === rel_targ.nodeName || "IMG" === rel_targ.nodeName)) {
			while ("UL" !== rel_parent.nodeName) {
				rel_parent = rel_parent.parentElement;
			}
		}
		
		if (!parental.expanded && !parental.animating && (("LI" !== rel_targ.nodeName && "IMG" !== rel_targ.nodeName) || (rel_parent !== parental.dom_node))) {
			parental.dom_node.style.zIndex = "auto";
			parental.animating = true;
			parental.hovered = false;
			parental.anim_intvl = setInterval(function () {
				parental.hover_out();
			}, 5);
		}/*
		else if (!parental.expanded && ("LI" === rel_targ.nodeName || "IMG" === rel_targ.nodeName)) {
			while ("UL" !== rel_parent.nodeName) {
				rel_parent = rel_parent.parentElement;
			}
			if (rel_parent !== parental.dom_node) {
				console.log('fff');
			}
		}*/
	}
	
	function click_in(e) {
		if (!parental.expanded && !parental.animating) {
			e.stopPropagation();
			parental.dom_node.style.zIndex = "9999";
			parental.expanded = true;
			parental.animating = true;
			parental.anim_intvl = setInterval(function () {
				parental.expand();
			}, 5);
		}
	}
	
	function click_out(e) {
		if (parental.expanded && !parental.animating) {
			parental.animating = true;
			parental.expanded = false;
			parental.anim_intvl = setInterval(function () {
				parental.close();
			}, 5);
		}		
	}
	
	function init() {
	
		var images = [],
			full_offset = 10;
		
		/*
			Extract our images into an array for sorting
		*/
		for (var x = 0; x < child_lis.length; x++) {
			images[x] = child_lis[x].getElementsByTagName("img")[0];
		}
		
		/*
			Sort children by future z-index so they'll animate in the appropriate order
		*/
		images.sort(function (a, b) {
			var a_z_index = 9999 - Math.floor((a.offsetHeight * a.offsetWidth) / 1000),
				b_z_index = 9999 - Math.floor((b.offsetHeight * b.offsetWidth) / 1000);
			if (a_z_index < b_z_index) {
				return 1;
			}
			if (a_z_index > b_z_index) {
				return -1;
			}
			/*
				If the z-indexes are the same we actually want to return 1 to ensure the
				image uses the correct offset
			*/
			return 1;
		});
		
		for (var i = 0; i < images.length; i++) {
			/*
				Build out our image objects
			*/
			children[i] = {
				dom_node: images[i],
				parent: images[i].parentElement,
				height: images[i].offsetHeight + 10,
				width: images[i].offsetWidth + 10,
				area: images[i].offsetHeight * images[i].offsetWidth,
				left: 0,
				z_index: 9999 - Math.floor((images[i].offsetHeight * images[i].offsetWidth) / 1000),
				stop_position: i * 10,
				open_position: full_offset
			};
			
			parental.height = (parental.height < children[i].height) ? children[i].height : parental.height;
			parental.width = (parental.width < children[i].width) ? children[i].width : parental.width;

			children[i].parent.style.cssText = "padding:0;margin:0;list-style:none;";
			children[i].dom_node.style.cssText = "position:absolute;left:0;cursor:pointer;box-shadow:0 0 5px rgba(0,0,0,.25);background:#fff;padding:5px;z-index:" + children[i].z_index + ";";
			
			full_offset += (children[i].width + 10);
			
			/*
				Attach handlers to the images
			*/
			children[i].dom_node.addEventListener("mouseout", roll_out, false);
			children[i].dom_node.addEventListener("click", click_in, false);
			children[i].dom_node.addEventListener("mouseover", roll_in, false);
		}
		
		parental.apply_styles();
		parental.vertically_center();
		
		//parental.dom_node.addEventListener("mouseout", roll_out, false);
		parental.dom_node.addEventListener("click", click_out, false);
	}
	
	init();
};