<p>function depthFirst(node) {</p>
<p>	let children = node.children</p>
<p></p>
<p>	highlight(node);</p>
<p></p>
<p>	for (let i = 0; i < children.length; i++) {</p>
<p>		depthFirst(node);</p>
<p>	}</p>
<p>}</p>