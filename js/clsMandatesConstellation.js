/**
 * User: Digvijay.Upadhyay
 * Date: 10/11/13
 * Time: 1:18 PM
 * The file contains constellation graph class
 */

function clsMandatesVisualization(p_Config)
{
    //PROPERTIES ---------------------------------------
    var LMe = this;

    //renderTo(Javascript object) - The Area object where the chart should be rendered
    LMe.renderTo = null;
    LMe.svg = null;
    LMe.width = 500;
    LMe.height = 500;
    LMe.svgAtrrId = 'svg-mandates';
    LMe.force = null;
    LMe.charge = -500;
    LMe.gravity = 0.3;
    LMe.linkDistance = 150;
    //js object having the data to dia
    LMe.data = {};

    LMe.link = null;
    LMe.node = null;

    LMe.linkData = null;
    LMe.nodeData = null;

    LMe.rootNode = null;
    LMe.selectedNode = null;
    LMe.displayNodeLevelFromCenter = 1;


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
        for(var LLoopindex = 0; LLoopindex < LMe.data.nodes.length; LLoopindex++)
        {
            var LNode = LMe.data.nodes[LLoopindex];
            if(LNode.id == 'unmismandates')
            {
                LMe.rootNode = LNode;
                break;
            }
        }

        LMe.makeNodeCenter(LMe.rootNode);

        setTimeout(function(){
            LMe.drawScales();
        }, 1000);
    };

    /*----------------------------------------------------------------------------*/
    //Function will add a parent div to the element and SVG element where chart is supposed to be rendered
    LMe.pvtInitializeCanvas = function()
    {
        LMe.force = d3.layout.force()
            .size([LMe.width, LMe.height])
            .charge(LMe.charge)
            .gravity(LMe.gravity)
            .linkDistance(LMe.linkDistance)
            .on("tick", LMe.onTick);

        LMe.svg = d3.select(LMe.renderTo).append("svg")
            .attr("id", LMe.svgAtrrId)
            .attr("width", LMe.width)
            .attr("height", LMe.height);

        LMe.nodeData = LMe.data.nodes;

        LMe.linkData = LMe.data.edges;
        LMe.link = LMe.svg.selectAll(".link");

        LMe.node = LMe.svg.selectAll(".node-mandates");
    };

    /*----------------------------------------------------------------------------*/
    //Function will draw the chart
    LMe.drawChart = function(){

        var nodes = LMe.nodeData,
            links = LMe.linkData;
        LMe.force
            .nodes(nodes)
            .links(links)
            .start();

        setTimeout(function(){
            LMe.link = LMe.link.data([]);
            //LMe.link = LMe.link.data(links, function(d) { return d.target.id; });

            // Exit any old links.
            LMe.link.exit().remove();


            LMe.link = LMe.link.data(LMe.linkData);

            LMe.link.enter().append("line")
                .attr("class", "link")
                .attr("x1", function(d) {
                    //if(d.source.x)
                    //{
                    return d.source.x;
                    //}
                    //return LMe.width/2;
                })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });


            LMe.node = LMe.node.data([])/*.attr('class', node)*/;
            //LMe.node = LMe.node.data(nodes, function(d) { return d.id; });

            // Exit any old nodes.
            LMe.node.exit().remove();

            LMe.node = LMe.node.data(LMe.nodeData)/*.attr('class', node)*/;

            var LGroup = LMe.node.enter().append("g")
                .attr("class", "node-mandates")
                .on('click', LMe.onNodeClick)
                .style('cursor', 'pointer')
                /*.style('transform', function(d){
                 var Lx = LMe.width/ 2,
                 Ly = LMe.height/2;
                 return "translate(" + Lx + "," + Ly + ")";
                 })*/
                .call(LMe.force.drag);

            LGroup.each(function(d){
                d.x = LMe.width/2;
                d.y = LMe.height/2;
            });

            var LRects = LGroup.append("rect")
                .attr("title", function(d){ return d.label });

            LGroup.append("text")
                .text(function(d){ d.textEl = this; return d.label })
                .attr("dx", function(d){
                    return - this.getBBox().width/2 - 5;
                })
                .attr("dy", function(d){
                    //return - this.getBBox().height/2;
                    return 0;
                })
                .on('click', LMe.onNodeClick)
                .attr('class', function(d){
                    if(d.isSelected)
                    {
                        return 'mandate-text-selected';
                    }
                    return 'mandate-text-transparent';
                });

            LRects.attr("width", function(d){
                var LText = d.textEl,
                    LWidth = LText.getBBox().width + 10;

                return LWidth;
            })
                .attr('height', function(d){
                    var LText = d.textEl,
                        LHeight = LText.getBBox().height;

                    return LHeight + 10;
                })
                //.attr("fill", '#EEEEEE')
                .attr("class", function(d){
                    if(d.isSelected)
                    {
                        return 'mandate-rect-selected';
                    }
                    return 'mandate-rect-transparent';
                })
                .attr('x', function(d){return - this.getBBox().width/2 - 5;})
                .attr('y', function(d){return - this.getBBox().height/2 - 5;})
                .attr('rx', function(d){return 5;})
                .attr('ry', function(d){return 5;});
        }, 600);
    };

    /*----------------------------------------------------------------------------*/

    LMe.onTick = function (e) {

        /*LMe.node.attr("x", function(d) { return d.x - 50; })
         .attr("y", function(d) { return d.y - 25; });                                    */

        /*LMe.node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });*/
        /*LMe.node.attr("transform", function(d) {
            var Lx = d.x = Math.max(10, Math.min(LMe.width - 10, d.x));
            var Ly = d.y = Math.max(10, Math.min(LMe.height - 10, d.y));
            if((LMe.width < d.x) || (0 > d.x))
            {
                //going out of scope
                Lx = LMe.width/2;
            }

            if((LMe.height < d.y) || (0 > d.y))
            {
                //going out of scope
                Ly = LMe.height/2;
            }

            return "translate(" + Lx + "," + Ly + ")";
        });*/

        if(e.alpha < 0.02)
        {
            LMe.force.stop();
        }

        LMe.node.attr("transform", function(d) {
            var Lx = d.x;
            var Ly = d.y;
            return "translate(" + Lx + "," + Ly + ")";
        });

        LMe.link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    }

    /*----------------------------------------------------------------------------*/
    LMe.makeNodeCenter = function(p_CentralNode){
        var LLevel = LMe.displayNodeLevelFromCenter;

        //-------------------------------------------------------
        function L_GetLinksForNode(p_Node, p_NodeIndex)
        {
            var LResult = [];
            for(var LLoopIndex1 = 0; LLoopIndex1 < LMe.data.edges.length; LLoopIndex1++)
            {
                var LEdge = LMe.data.edges[LLoopIndex1];
                if((LEdge.source.id == p_Node.id) || (LEdge.target.id == p_Node.id))
                {
                    LResult.push(LEdge);
                }
            }
            return LResult;
        }

        //-------------------------------------------------------
        function L_GetIndexOfNode(p_id)
        {
            for(var LLoopIndex1 = 0; LLoopIndex1 < LMe.data.nodes.length; LLoopIndex1++)
            {
                var LNode = LMe.data.nodes[LLoopIndex1];
                if(LNode.id == p_id)
                {
                    return LLoopIndex1;
                }
            }
        }

        //-------------------------------------------------------
        function L_MergeArr(p_Arry1, p_Arry2){
            for(var LLoopIndex1 = 0; LLoopIndex1 < p_Arry2.length; LLoopIndex1++)
            {
                var Litem = p_Arry2[LLoopIndex1],
                    Lfound = false;
                for(var LLoopIndex2 = 0; LLoopIndex2 < p_Arry1.length; LLoopIndex2++)
                {
                    var LitemArr1 = p_Arry1[LLoopIndex2];
                    if(LitemArr1.id == Litem.id)
                    {
                        //The item already exists
                        Lfound = true;
                        break;
                    }
                }
                if(Lfound === false)
                {
                    //The item was no found
                    p_Arry1.push(Litem);
                }
            }
        }

        //-------------------------------------------------------
        function L_DisplayChildrenOfNode(p_Node, p_Index){
            p_Index--;
            LMe.linkData.push();
            LMe.nodeData.push(p_Node);

            var LNodeIndex = L_GetIndexOfNode(p_Node.id),
                LNodeLinks = L_GetLinksForNode(p_Node, LNodeIndex),
                LConnectedNodes = [];

            for(var LLoopIndex = 0; LLoopIndex < LNodeLinks.length; LLoopIndex++)
            {
                var LConnectedNode = null,
                    LLink = LNodeLinks[LLoopIndex];
                if(LLink.source.id == p_Node.id)
                {
                    LConnectedNode = LLink.target;
                }
                else if(LLink.target.id == p_Node.id)
                {
                    LConnectedNode = LLink.source;
                }
                if(LConnectedNode)
                {
                    LConnectedNodes.push(LConnectedNode);
                }

            }

            L_MergeArr(LMe.linkData,LNodeLinks);
            L_MergeArr(LMe.nodeData,LConnectedNodes);

            if(p_Index > 0)
            {
                //display childrens of new connected nodes
                for(var LLoopIndex=0; LLoopIndex < LConnectedNodes.length; LLoopIndex++)
                {
                    var LNode = LConnectedNodes[LLoopIndex];
                    L_DisplayChildrenOfNode(LNode, p_Index);
                }
            }

            LMe.drawChart();
        }

        //-------------------------------------------------------
        LMe.linkData = [];
        LMe.nodeData = [];

        if(LMe.selectedNode)
        {
            LMe.selectedNode.isSelected = null;
            LMe.selectedNode = null
        }
        LMe.selectedNode = p_CentralNode;
        LMe.selectedNode.isSelected = true;
        L_DisplayChildrenOfNode(p_CentralNode, LLevel);

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
    LMe.onNodeClick = function(p_data, p_index){
        //handle on node click
        LMe.makeNodeCenter(p_data);

        if(LMe.eventOnNodeClick)
        {
            LMe.eventOnNodeClick(p_data);
        }
    }


    /*----------------------------------------------------------------------------*/
    LMe.drawScales = function(){
        var LZoomScaleCntnr = d3.select(LMe.renderTo)
            .append("div")
            .style('position', 'absolute')
            .attr('id', 'mandates-zoom-slider-cntnr')
            .attr('width', '20px');

        LZoomScaleCntnr.append('div')
            .attr('id', 'mandates-zoom-slider');

        LZoomScaleCntnr.append('div')
            .style('text-align', 'center')
            .style('margin-top', '5px')
            .style('width', '20px')
            .text('Zoom: ')
            .append('span')
            .text('100%')
            .attr('id', 'mandate-zoom-value');

        var LDepthScaleCntnr = d3.select(LMe.renderTo)
            .append("div")
            .style('position', 'absolute')
            .attr('id', 'mandates-tree-depth-slider-cntnr')
            .attr('width', '20px');

        LDepthScaleCntnr.append('div')
            .attr('id', 'mandates-tree-depth-slider');

        LDepthScaleCntnr.append('div')
            .style('text-align', 'center')
            .style('margin-top', '5px')
            .style('width', '20px')
            .text('Tree Depth: ')
            .append('span')
            .text('1')
            .attr('id', 'mandate-tree-depth-value');

        var LSVGEl = $('#' + LMe.svgAtrrId),
            LOffset = LSVGEl.offset(),
            LBtnTop = LOffset.top + LSVGEl.height() - 20,
            LBtnLeft = LOffset.left + LSVGEl.width() / 2;

        d3.select(LMe.renderTo)
            .append('a')
            .attr('href', '#')
            .attr('class', 'cleanup-nav-btn')
            .text('Cleanup navigation context')
            .style('position', 'absolute')
            //.style('top', LBtnTop + 'px')
            .style('top', '95%')
            //.style('left', LBtnLeft + 'px')
            .style('left', '70%')
            .on('click', LMe.cleanupNavigationContext);

        var LZx = $(window).height() * 31 / 100,
            LZy = $(window).width() * 53 / 100,
            LMx = $(window).height() * 61 / 100,
            LMy = $(window).width() * 53 / 100;

        $('#mandates-zoom-slider-cntnr').css({
            //top : LOffset.top + 20,
            top : LZx + 'px',
            //left : LOffset.left + 20
            left : LZy + 'px'
        });
        $('#mandates-tree-depth-slider-cntnr').css({
            //top : (LOffset.top + 200) + 'px',
            top : LMx + 'px',
            //left : (LOffset.left + 20) + 'px'
            left : LMy + 'px'
        });
        $( "#mandates-zoom-slider" ).slider({
            value:100,
            min: 50,
            max: 150,
            step: 10,
            orientation: "vertical",
            slide: function( event, ui ) {
                $('#zoom-value').text( ui.value + '%' );
                $('#' + LMe.svgAtrrId).css( 'transform', 'scale(' + (ui.value/100) + ')'  );
            }
        });

        $( "#mandates-tree-depth-slider" ).slider({
            value:1,
            min: 1,
            max: 2,
            step: 1,
            orientation: "vertical",
            slide: function( event, ui ) {
                $('#mandate-tree-depth-value').text( ui.value );
                LMe.displayNodeLevelFromCenter = ui.value;
                LMe.refreshTheCenterNode();
            }
        });

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


