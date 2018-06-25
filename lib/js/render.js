function render(el,data,d3,Dimensions,layoutColor, outercircleColor,self,qlik)
{
var svg = d3.select("svg"),
    margin = 20,
    //diameter = +svg.attr("width"),
	diameter = $("#svg").height(),
    g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

var root = data;
  

  root = d3.hierarchy(root)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });

  var focus = root,
      nodes = pack(root).descendants(),
      view;

  var circle = g.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
      .style("fill", function(d) { 
	  if (d.children) 
	  {return getDimColor(d.depth);//color(d.depth) 
  }
	  else { return d.data.color?d.data.color:getDimColor(d.depth);} 
	  })
      .on("click", function(d) { if (focus !== d) zoom(d),selectDimensionValue(d.depth,d.data.ElemNumber,d.data.name), d3.event.stopPropagation(); });

  var text = g.selectAll("text")
    .data(nodes)
    .enter().append("text")
      .attr("class", "label")
      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
      .text(function(d) { return d.data.name; });

  var node = g.selectAll("circle,text");

  svg
      .style("background", getDimColor(-1))
      .on("click", function() { zoom(root); });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
    var focus0 = focus; focus = d;
    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function(t) { zoomTo(i(t)); };
        });

    transition.selectAll("text")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }

function getDimColor(dimIndex){
if (dimIndex==0){
	return outercircleColor;
}
else if (dimIndex==-1){
	return layoutColor;
}
else{
return Dimensions[dimIndex-1].fillColor;
}
}
selectedData={}

function selectDimensionValue(dimIndex, Value, Name){
if (dimIndex==-1){
	return layoutColor;
}
else	
{
/*var app = qlik.currApp(self);  
app.field("["+Dimensions[dimIndex].qFallbackTitle+"]").selectValues([Value],true,true)*/
var arr = [];
arr.push(Value);
selectedData= { dimIndex:  Number(parseInt(dimIndex-1,10)), value: arr, name:Name  }

$('.select_button').html("Make Selection:" + Name);
$('.select_button').show().delay(5000).fadeOut();

//self.selectValues(Number(parseInt(dimIndex-1,10)), arr, false);


}
}	

  
}


var globalcounter=0
function convert(data)
{
globalcounter=0;
var json_data_head="{";
var json_data_tail="}";
var json_data={"name":"flare", "children":[]};
for (var i = 0;i<data.qLeft.length;i++)
{
		var n={};
		
		n.name=data.qLeft[i].qText;
		n.ElemNumber=data.qLeft[i].qElemNo;
		//n.children=[];
		addChildren(n,data.qLeft[i].qSubNodes,data);
		json_data.children.push(n);
		/*if (i==0){
		json_data=json_data+JSON.stringify(n).substring(1,JSON.stringify(n).length-2);
		}
		else{
		json_data=json_data+","+JSON.stringify(n).substring(1,JSON.stringify(n).length-2);
		}*/
}
//console.log(json_data);
return  json_data;
	
}

function addChildren(node,subNode,data)
{
	if (subNode.length>0){
		node.children=[];
	for (var i=0;i<subNode.length;i++)
	{
		
		var child={};	
		child.name=subNode[i].qText;
		child.ElemNumber=subNode[i].qElemNo;
		//child.children=[];
		addChildren(child,subNode[i].qSubNodes,data);
		node.children.push(child);
	}
	}
	else
	{
		node.size=data.qData[globalcounter][0].qNum;
		node.color= data.qData[globalcounter][0].qAttrExps.qValues[0].qText;
		globalcounter++;
	}
	
}