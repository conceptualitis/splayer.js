function show_me_owls() {
	var parental = {
			dom_node: document.querySelector(arguments[0]),
			active: false,
			hovered: false,
			height: 0,
			vertically_center: function () {
				for(item in children) {
					children[item].dom_node.style.top = ((parental.height - children[item].height) / 2) + "px";
				}
			},
			apply_styles: function () {
				this.dom_node.style.cssText = "padding:0;margin:0;list-style:none;position:relative;height:" + this.height + "px;";
			}
		},
		child_lis = parental.dom_node.getElementsByTagName("li"),
		children = {};
	
	function roll_in(e) {
		if (!parental.active && !parental.hovered) {
			for(item in children) {
				children[item].dom_node.style.left = children[item].stop_position + "px";
			}
			parental.hovered = true;
		}
	}
	
	function roll_out (e) {
		if (!parental.active && parental.hovered) {
			for(item in children) {
				children[item].dom_node.style.left = "0";
				parental.active = false;
				parental.hovered = false;
			}
		}
	}
	
	function click_in(e) {
		if (!parental.active) {
			var full_offset = 10;
			for(item in children) {
				parental.active = true;
				children[item].dom_node.style.left = full_offset + "px";
				full_offset += (children[item].width + 10);
			}
			e.stopPropagation();			
		}
	}
	
	function click_out(e) {
		if (parental.active) {
			for(item in children) {
				children[item].dom_node.style.left = "0";
				parental.active = false;
			}
		}		
	}
	
	function set_list_styles() {
		parental.dom_node.style.cssText = "padding:0;margin:0;list-style:none;position:relative;height:" + parental.height + "px;";
	}
	
	function vertically_center_lis() {
		for(item in children) {
			children[item].dom_node.style.top = ((parental.height - children[item].height) / 2) + "px";
		}
	}
	
	function init() {
		/*
			Build out our list objects
		*/
		for (var i = 0; i < child_lis.length; i++) {
			var image = child_lis[i].getElementsByTagName("img")[0];
			
			child_lis[i].style.cssText = "padding:0;margin:0;list-style:none;position:absolute;cursor:pointer;";
			
			if (parental.height < image.offsetHeight) {
				parental.height = image.offsetHeight;
			}
			children[i] = {
				"dom_node": child_lis[i],
				"image": image,
				"height": image.offsetHeight,
				"width": image.offsetWidth,
				"stop_position": i * 10
			};
			
			
			/*
				Attach handlers to the list elements
			*/
			child_lis[i].addEventListener("mouseover", roll_in, false);
			child_lis[i].addEventListener("mouseout", roll_out, false);
			child_lis[i].addEventListener("click", click_in, false);
		}
		
		parental.apply_styles();
		parental.vertically_center();
		
		parental.dom_node.addEventListener("click", click_out, false);
	}
	
	init();
};