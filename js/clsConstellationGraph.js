/**
 * User: Digvijay.Upadhyay
 * Date: 10/11/13
 * Time: 1:18 PM
 * The file contains constellation graph class
 */

function clsConstellationVisualization(p_Config)
{
    //PROPERTIES ---------------------------------------
    var LMe = this;

    //renderTo(Javascript object) - The Area object where the chart should be rendered
    LMe.renderTo = null;

    LMe.svg = null;
    LMe.width = 960;
    LMe.height = 500;
    LMe.svgAtrrId = 'svg';

    LMe.force = null;

    LMe.charge = -1000;
    LMe.linkDistance = 150;

    //js object having the data to dia
    LMe.data = {};

    LMe.flatData = null;
    LMe.hiddenNodes = [];

    LMe.link = null;
    LMe.node = null;
    LMe.rootNode = null;
    LMe.selectedNode = null;
    LMe.displayNodeLevelFromCenter = 2;

    LMe.eventOnNodeClick = null;
    LMe.eventOnLinkClick = null;

    //EVENTS -----------------------------------------

    /*----------------------------------------------------------------------------*/
    // Constructor of the bubble chart object, this will initialize chart
    // parameters and will render the chart
    LMe.constructor = function()
    {
        //Assign the configuration attributes
        for (p_Name in p_Config)
        {
            var LValue = null;
            LValue = p_Config[p_Name];
            LMe[p_Name] = LValue;
        }

        //Add a parent container for the chart
        LMe.pvtInitializeCanvas();

        //Draw the chart
        LMe.drawChart();

        //focus the centeral node
        LMe.makeNodeCenter(LMe.rootNode);
    };

    /*----------------------------------------------------------------------------*/
    //Function will add a parent div to the element and SVG element where chart is supposed to be rendered
    LMe.pvtInitializeCanvas = function()
    {
        LMe.force = d3.layout.force()
            .size([LMe.width, LMe.height])
            .charge(LMe.charge)
            .linkDistance(LMe.linkDistance)
            .on("tick", LMe.onTick);

        LMe.svg = d3.select(LMe.renderTo).append("svg")
            .attr("id", LMe.svgAtrrId)
            .attr("width", LMe.width)
            .attr("height", LMe.height);

        LMe.link = LMe.svg.selectAll(".link");
        LMe.node = LMe.svg.selectAll(".node");


    };

    /*----------------------------------------------------------------------------*/
    //Function will draw the chart
    LMe.drawChart = function()
    {

        //flatten the data
        LMe.flatData = LMe.flattenData(LMe.data);

        var nodes = LMe.flatData,
            links = d3.layout.tree().links(nodes);

        for(var LLoopIndex = 0; LLoopIndex < nodes.length; LLoopIndex++){
            var d = nodes[LLoopIndex];
            if(! d.parent)
            {
                LMe.rootNode = d;
            }
        }

        // Restart the force layout.
        LMe.force
            .nodes(nodes)
            .links(links)
            .start();

        // Update the links�
        LMe.link = LMe.link.data(links, function(d) { return d.target.internalId; });

        // Exit any old links.
        LMe.link.exit().remove();

        // Enter any new links.
        var LNewLinks = LMe.link.enter().insert("line", ".constellation-g")
            .attr("class", "link")
            .attr("marker-end","url(#arrow-head)")
            .on("click", LMe.onNodeLinkClick)
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .style("display", "none")
            .style("cursor", function(d) {
                if(d.source.type == "resolution" && d.target.type == "resolution"){
                    return 'pointer';
                }
            });


        // Update the nodes�
        LMe.node = LMe.node.data(nodes, function(d) { return d.id; });

        // Exit any old nodes.
        LMe.node.exit().remove();

        var LGroups = LMe.node.enter().append("g")
            .attr("class", "constellation-g")
            .style("display", "none" )
            .on("click", LMe.onNodeClick)
            .call(LMe.force.drag);


        setTimeout(function(){
            LGroups.style("display", "block" );
            LNewLinks.style("display", "block" );
        }, 500);

        LMe.node.each(LMe.onCreateGroup);

        /*LMe.node.append("rect")
            .attr("rx", LMe.onGetRadiusX)
            .attr("ry", LMe.onGetRadiusY)
            .attr("width", LMe.onGetRectWidth)
            .attr("height", LMe.onGetRectHeight)
            .attr("x", function(d) { return d.x - d.width/2; })
            .attr("y", function(d) { return d.y - d.height/2; })
            .attr("title", function(d){ return d.label })
            .attr("class", LMe.onGetClass)
            .style("fill", LMe.onGetColor)
            .on("click", LMe.onNodeClick)
            ;

        LMe.node.append("text")
            .attr("dx", 15)
            .attr("dy", 30)
            .text(function(d) { return d.label });*/


    };
    /*----------------------------------------------------------------------------*/

    LMe.onTick = function (e) {
        if(e.alpha < 0.03)
        {
            LMe.force.stop();
        }
        LMe.link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        /*LMe.node.attr("x", function(d) { return d.x - 50; })
            .attr("y", function(d) { return d.y - 25; });                                    */

        LMe.node.attr("transform", function(d) {
            var Lx =  d.x - LMe.onGetRectWidth(d)/2;
            var Ly =  d.y - LMe.onGetRectHeight(d)/2;
            return "translate(" + Lx + "," + Ly + ")";
        });
    }
    /*----------------------------------------------------------------------------*/

    LMe.flattenData = function (p_root){
        var LNodes = [], i = 0;

        function recurse(p_node) {
            if (p_node.children){
                //Children are present
                //Assign parent of the node
                p_node.children.forEach(function(p_Child){
                    p_Child.parent = p_node;
                });
                p_node.children.forEach(recurse);
            }
            if (!p_node.internalId){
                //Assign internal id
                p_node.internalId = ++i;
            }
            LNodes.push(p_node);
        }

        recurse(p_root);
        return LNodes;
    }

    /*----------------------------------------------------------------------------*/
    LMe.makeNodeCenter = function(p_CentralNode){
        /* children of the main node are visible but their children should not be
        * visible at all*/
        /*var d = p_CentralNode;
         if (!d3.event.defaultPrevented) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
        }*/
        function L_GetGroupElOfData(p_Data){
            var LResult;
            LMe.node.each(function(d){
                if(d.internalId == p_Data.internalId){
                    LResult = this;
                }
            });
            return LResult;
        }

        var LLevel = LMe.displayNodeLevelFromCenter;
        if(LMe.selectedNode && LMe.selectedNode.isSelected)
        {
            LMe.selectedNode.isSelected = null;
        }

        LMe.selectedNode = p_CentralNode;
        LMe.selectedNode.isSelected = true;
        //LMe.addSelectedNodeStyle(L_GetGroupElOfData(LMe.selectedNode))
        function L_DisplayNextNLevelChildren(p_Node, p_Level, p_SkipNode)
        {
            if(p_Node.children)
            {

                p_Level--;
                for(var LLoopIndex = 0; LLoopIndex < p_Node.children.length; LLoopIndex++)
                {

                    var LChild = p_Node.children[LLoopIndex];
                    if(p_CentralNode.internalId == LChild.internalId)
                    {
                        //skip centeral node
                        continue;
                    }

                    if(p_SkipNode)
                    {
                        if(p_SkipNode.internalId == LChild.internalId)
                        {
                            continue;
                        }
                    }

                    if(p_Level < 1)
                    {
                        //reached to the last level hide child nodes
                        if(LChild.children)
                        {
                            LChild._children = LChild.children;
                            LChild.children = null;
                            LMe.hiddenNodes.push(LChild);
                        }
                    }
                    else
                    {
                        L_DisplayNextNLevelChildren(LChild, p_Level);
                    }
                }
            }
        }


        function L_DisplayNextNLevelParent(p_Node, p_Level)
        {
            var LParentNode = p_Node.parent;
            if(LParentNode)
            {

                p_Level--;

                if(! LParentNode.parent)
                {
                    p_Level--;
                    //next node is the root node
                    if(p_Level < 0){
                        LParentNode._children = LParentNode.children;
                        LParentNode.children = [];
                        LParentNode.children.push(p_Node);
                        LMe.hiddenNodes.push(LParentNode);
                    }
                    else{
                        L_DisplayNextNLevelChildren(LParentNode, p_Level-1, p_Node);
                        /*for(var LLoopIndex2 = 0;LLoopIndex2 < LParentNode.children.length; LLoopIndex2++)
                        {
                            //Traverse all the children of the root node
                            var LChild = LParentNode.children[LLoopIndex2];
                            if(p_Node.internalId == LChild.internalId)
                            {
                                //Do not process the current node where focused node is situated
                                continue;
                            }

                            L_DisplayNextNLevelChildren(LChild, p_Level);
                        }*/
                    }
                    return;
                }
                L_DisplayNextNLevelParent(LParentNode, p_Level);
            }
        }

        for(var LLoopIndex1 = 0; LLoopIndex1 < LMe.hiddenNodes.length; LLoopIndex1++)
        {
            var LChild = LMe.hiddenNodes[LLoopIndex1];
            if(LChild._children)
            {
                LChild.children = LChild._children;
                LChild._children = null;
            }
        }

        LMe.hiddenNodes = [];

        //display n level parent


        //Display the next n level children
        L_DisplayNextNLevelChildren(p_CentralNode, LLevel);
        L_DisplayNextNLevelParent(p_CentralNode, LLevel);

        LMe.drawChart();
    }

    /*----------------------------------------------------------------------------*/
    LMe.addSelectedNodeStyle = function(p_NodeEl){
        var LRect = $(p_NodeEl).children('rect');
        $(LRect).addClass('selected-rect');
    }

    /*----------------------------------------------------------------------------*/
    LMe.removeSelectedNodeStyle = function(p_NodeEl){
        var LRect = d3.select(p_NodeEl).select('rect');
        LRect.classed('selected-rect', false);
    }

    /*----------------------------------------------------------------------------*/
    LMe.refreshTheCenterNode = function(){
        LMe.makeNodeCenter(LMe.selectedNode);
    }

    /*----------------------------------------------------------------------------*/
    LMe.onGetColor = function(){
        return '#CCCCCC';
    }

    /*----------------------------------------------------------------------------*/
    LMe.onNodeClick = function(p_data, p_index){
        //handle on node click
        LMe.makeNodeCenter(p_data);

        if(LMe.eventOnNodeClick)
        {
            LMe.eventOnNodeClick(p_data);
        }
    }

    /*----------------------------------------------------------------------------*/
    LMe.onNodeLinkClick = function(p_data, p_index){
        //handle on node click
        if(LMe.eventOnLinkClick)
        {
            LMe.eventOnLinkClick(p_data);
        }
    }

    /*----------------------------------------------------------------------------*/
    LMe.onGetClass = function (){

    }

    /*----------------------------------------------------------------------------*/
    LMe.onGetRectWidth = function (){
        return 100;
    }

    /*----------------------------------------------------------------------------*/
    LMe.onGetRectHeight = function (){
        return 50;
    }

    /*----------------------------------------------------------------------------*/
    LMe.onGetRadiusX = function (){
        return 0;
    }

    /*----------------------------------------------------------------------------*/
    LMe.onGetRadiusY = function (){
        return 0;
    }

    /*----------------------------------------------------------------------------*/
    LMe.cleanupNavigationContext = function(){
        LMe.makeNodeCenter(LMe.rootNode);
    }
    /*----------------------------------------------------------------------------*/


    //Invoke the constructor
    LMe.constructor();

    return LMe;
};


