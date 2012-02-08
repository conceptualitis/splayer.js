function show_me_owls() {
	var parental = {
			dom_node: document.querySelector(arguments[0]),
			expanded: false,
			hovered: false,
			animating: false,
			height: 0,
			anim_intvl: undefined,
			vertically_center: function () {
				for(item in children) {
					children[item].dom_node.style.top = ((this.height - children[item].height) / 2) + "px";
				}
			},
			apply_styles: function () {
				this.dom_node.style.cssText = "padding:0;margin:0;list-style:none;position:relative;height:" + this.height + "px;";
			},
			hover: function () {
				for(item in children) {
					var left_int = parseInt(children[item].dom_node.style.left.slice(0, -2), 10);
					if (left_int < children[item].stop_position) {
						children[item].dom_node.style.left = (left_int + 2) + "px";
						parental.animating = true;
					}
					else {
						parental.animating = false;
					}
				}
				if (!parental.animating) {
					window.clearInterval(parental.anim_intvl);
				}
			},
			hover_out: function () {
				for(item in children) {
					var left_int = parseInt(children[item].dom_node.style.left.slice(0, -2), 10);
					if (0 < left_int) {
						children[item].dom_node.style.left = (left_int - 5) + "px";
						parental.animating = true;
					}
					else {
						parental.animating = false;
					}
				}
				if (!parental.animating) {
					window.clearInterval(parental.anim_intvl);
				}
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
				if (!parental.animating) {
					window.clearInterval(parental.anim_intvl);
				}
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
				if (!parental.animating) {
					window.clearInterval(parental.anim_intvl);
				}
			}
		},
		container = parental.dom_node.parentElement,
		child_lis = parental.dom_node.getElementsByTagName("li"),
		children = {};
	
	function roll_in(e) {
		if (!parental.expanded && !parental.hovered && !parental.animating) {
			parental.animating = true;
			parental.hovered = true;
			parental.anim_intvl = setInterval(function () {
				parental.hover();
			}, 5);
		}
	}
	
	function roll_out (e) {
		var rel_targ = e.relatedTarget || e.toElement;
		if (!parental.expanded && !parental.animating && "LI" !== rel_targ.nodeName && "IMG" !== rel_targ.nodeName ) {
			parental.animating = true;
			parental.hovered = false;
			parental.anim_intvl = setInterval(function () {
				parental.hover_out();
			}, 5);
		}
	}
	
	function click_in(e) {
		if (!parental.expanded) {
			e.stopPropagation();
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
		/*
			Build out our list objects
		*/
		var full_offset = 10;
		for (var i = 0; i < child_lis.length; i++) {
			var image = child_lis[i].getElementsByTagName("img")[0];
			
			child_lis[i].style.cssText = "padding:0;margin:0;list-style:none;";
			image.style.cssText = "position:absolute;left:0;cursor:pointer;box-shadow:0 0 5px rgba(0,0,0,.25);background:#fff;padding:5px;";
			
			if (parental.height < image.offsetHeight) {
				parental.height = image.offsetHeight;
			}
			children[i] = {
				dom_node: image,
				parent: child_lis[i],
				height: image.offsetHeight,
				width: image.offsetWidth,
				left:0,
				stop_position: i * 10,
				open_position: full_offset
			};
			
			full_offset += (children[i].width + 10);
			
			
			/*
				Attach handlers to the list elements
			*/
			image.addEventListener("mouseout", roll_out, false);
			image.addEventListener("click", click_in, false);
			image.addEventListener("mouseover", roll_in, false);
		}
		
		parental.apply_styles();
		parental.vertically_center();
		
		//parental.dom_node.addEventListener("mouseout", roll_out, false);
		parental.dom_node.addEventListener("click", click_out, false);
	}
	
	init();
};