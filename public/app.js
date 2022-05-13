document.addEventListener('DOMContentLoaded', function () {

 	var canvas = null;
 	var context = null;
 	var nodeTree = null;
 	var nodeSequence = [];
 	var nodeObject;
 	var demo;
 	var activeDemo = 'depth';

	var nodeWindow = document.getElementById('node-window');
	function createNewNode(type, text, id, classArray, parent) {
		let newNode = document.createElement(type);
		classArray.forEach((className)=> newNode.classList.add(className));
		newNode.textContent = text;
		newNode.id = id;
		parent.appendChild(newNode);
		return newNode;
	}

	function createNodes(layers, maxChildren, currentLayer = 1, siblings = 1) {
		if (currentLayer <= layers) {
			let numOfSiblings;
			let newNode = document.createElement('DIV'); 
			newNode.classList.add('tree-node');
			newNode.textContent = currentLayer;

			//generate children
			numOfSiblings = Math.floor(Math.random() * (maxChildren - .70)) + 1;
			if (currentLayer == 1 && numOfSiblings == 3) { 
				numOfSiblings = 2;
			}
			for (let n = 1; n <= numOfSiblings; n++) {
				let child = createNodes(layers, maxChildren, currentLayer + 1, numOfSiblings);
				if (child != null) {
					newNode.appendChild(child);
				}
			}
			return newNode; 
		} else {
			return null;
		}	
	}

	function placeChildren(parent, width = 1200, layer = 1) {
		let nodeX = -(width / 2);
		let nodeY =  100;

		//console.log(nodeX, nodeY);
		let siblings = parent.children
		if (siblings) {
			spacing = width / (siblings.length + 1); 
			nodeX += spacing;
			for (let i = 0; i < siblings.length; i++) {
				let node = siblings[i];
				node.style.left = nodeX + 'px';
				node.style.top = nodeY + 'px';
				node.style.height = (60 - (layer * 8)) + 'px';
				node.style.width = (60 - (layer * 8)) + 'px';
				nodeX += spacing;
			}
			for (let i = 0; i < siblings.length; i++) {
				placeChildren(siblings[i], width * (.75 - (.155 * layer)), layer + 1);
			}
		}
	}

	function positionNodes(x, y, parent) {
		parent.style.left = x + '%';
		parent.style.top = y + 'px';
		parent.style.height = 50 + 'px';
		parent.style.width = 50 + 'px';
		placeChildren(parent);
	}

	function drawLine(x1, y1, x2, y2, color = 'black') {
		context.strokeStyle = color;
    	context.lineWidth = 2;
		context.beginPath();
 		context.moveTo(x1, y1);
 		context.lineTo(x2, y2);
 		context.stroke();
 		console.log(x1, y1, x2, y2);
	}

	function connectNodes(node) {
		let offsetX = canvas.getBoundingClientRect().x;
		let offsetY = canvas.getBoundingClientRect().y;
		let rect = node.getBoundingClientRect();
		let parentX = Math.floor(rect.x + (rect.width / 2)) - offsetX;
		let parentY = Math.floor(rect.y + (rect.height / 2)) - offsetY;
		let children = node.children;
		console.log(children);

		for (let i = 0; i < children.length; i++) {
			child = children[i];
			rect = child.getBoundingClientRect();
			let childX = Math.floor(rect.x + (rect.width / 2)) - offsetX;
			let childY = Math.floor(rect.y + (rect.height / 2)) - offsetY;

			console.log(parentX, parentY, childX, childY);
			drawLine(parentX, parentY , childX, childY , 'black');

		}
		for (let i = 0; i < children.length; i++) {
			child = children[i];
			connectNodes(child);
		}
	}

	function depthFirstSequence(node) {
		function traverse(node) {
			let children = node.children;
			nodeSequence.push(node);
			for(let i = 0; i < children.length; i++) {
				traverse(children[i]);
			}
		}
		nodeSequence = [];
		traverse(node);
		nodeObject = {sequence: nodeSequence, index: 0,
						length: nodeSequence.length};
	}

	function breadthFirstSequence(node) {
		function traverse(nodeArray) {
			let children = [];

			//If top node isn't in an array, put it in an array 
			if (!Array.isArray(nodeArray)) {
				nodeArray = [nodeArray];
			}

			nodeArray.forEach((node) => {
				nodeSequence.push(node);
			});

			nodeArray.forEach((node) => {
				let siblings = node.children;
				for (let i = 0; i < siblings.length; i++) {
					children.push(siblings[i]);
				}
			});
			if (children.length > 0) {
				traverse(children);
			}
		}
		nodeSequence = [];
		traverse(node);
		nodeObject = {sequence: nodeSequence, index: 0,
						length: nodeSequence.length};
	}

	function highlight(nodeObj) {
		let index = nodeObj['index'];
		let node = nodeObj['sequence'][index];
		node.classList.toggle('highlighted');
		nodeObj['index']++;
		if (nodeObj['index'] == nodeObj['length']) {
			nodeObj['index'] = 0;
		}
	}

	function clearHighlights() {
		nodeObject['sequence'].forEach((node) => {
			node.classList.remove('highlighted');
		});
	}

	function runDepthDemo() {
		//activeDemo = 'depth';
		if (demo) {
			clearInterval(demo);
		}
 		depthFirstSequence(nodeTree);
 		clearHighlights();
 		demo = setInterval(highlight, 750, nodeObject);
	}

	function runBreadthDemo() {
		//activeDemo = 'breadth';
		if (demo) {
			clearInterval(demo);
		}
 		breadthFirstSequence(nodeTree);
 		clearHighlights();
 		demo = setInterval(highlight, 750, nodeObject);
	}

	function runDemo(active) {
		activeDemo = active;
		if (activeDemo === 'depth') {
			runDepthDemo();
		} else if (activeDemo === 'breadth') {
			runBreadthDemo();
		}
	}

	function createGraph() {
		let parent = document.getElementById('tree-display');
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		if (demo) {
			clearInterval(demo);
		}

		document.querySelectorAll('.tree-node').forEach( n => n.remove() );
		nodeTree = createNodes(5, 3);
		parent.appendChild(nodeTree);
		positionNodes(50, 0, nodeTree);
		connectNodes(nodeTree);
		runDemo(activeDemo);
	}

	function depthTab() {
		//highlight depth tab
		document.getElementById('depth-tab').classList.add('selected');
		document.getElementById('breadth-tab').classList.remove('selected');
		//display depth function , hide breadth function
		document.getElementById('depth-function').style.visibility = 'visible';
		document.getElementById('breadth-function').style.visibility = 'hidden';

		//display depth text, hide breadth text
		document.getElementById('depth-text').style.visibility = 'visible';
		document.getElementById('breadth-text').style.visibility = 'hidden';
		runDemo('depth');
	}

	function breadthTab() {
		//highlight breadth tab
		document.getElementById('breadth-tab').classList.add('selected');
		document.getElementById('depth-tab').classList.remove('selected');

		//display breadth function , hide depth function
		document.getElementById('breadth-function').style.visibility = 'visible';
		document.getElementById('depth-function').style.visibility = 'hidden';

		//display breadth text, hide depth text
		document.getElementById('breadth-text').style.visibility = 'visible';
		document.getElementById('depth-text').style.visibility = 'hidden';
		runDemo('breadth');
	}
	function init() {
		canvas = document.querySelector('canvas');
 		context = canvas.getContext('2d');

 		document.getElementById('breadth-tab')
 			.addEventListener('click', breadthTab);

 		document.getElementById('depth-tab')
 			.addEventListener('click', depthTab);

 		document.getElementById('new-tab')
 			.addEventListener('click', createGraph);

 		createGraph();
 		depthTab();
		
	}
	init();
});