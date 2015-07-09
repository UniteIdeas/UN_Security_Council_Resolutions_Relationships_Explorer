/*
* User: Digvijay.Upadhyay
* Date: 10/11/13
* Time: 1:12 PM
* To change this template use File | Settings | File Templates.
*/

/*----------------------------------------------------------------------------*/
/*
* The function will generate constellation
*/
function generateConstellation(p_callback){

    //--------------------------------------------------------


    //--------------------------------------------------------

    var LWinHt = $(window).height(),
        LWinWd = $(window).width(),
        LCntnr = $('#constellaition-viz-cntnr'),
        LCntnrTop = LCntnr.offset().top,
        LCntnrLft = LCntnr.offset().left;

    //Load the data
    d3.json("data/const_dem.json", function(json) {
        var LConfig = {
            renderTo : '#constellaition-viz-cntnr',
            data : json,
            svgAtrrId : 'constellation-svg',
            displayNodeLevelFromCenter : 2,
            width : LWinWd/2,
            height : LWinHt - LCntnrTop,
            onGetClass : function(d){
                var LClasses = 'svg-rect'
                if(d.type == "resolution")
                {
                    LClasses = LClasses + ' ' + 'rect-circular';
                }
                return LClasses;
            },
            onGetRectWidth : function(d){
                if(d.graphic_shape == "rect")
                {
                    return d.graphic_size_width;
                }
                return d.graphic_size;
            },
            onGetRectHeight : function(d){
                if(d.graphic_shape == "rect")
                {
                    return d.graphic_size_height;
                }
                return d.graphic_size;
            },
            onGetRadiusX : function(d){
                if(d.graphic_shape == "rect")
                {
                    return 0;
                }
                return d.graphic_size;
            },
            onGetRadiusY : function(d){
                if(d.graphic_shape == "rect")
                {
                    return 0;
                }
                return d.graphic_size;
            },
            onGetColor : function(d){
                if(d.graphic_fill_color)
                {
                    return d.graphic_fill_color;
                }
                return '#f9f9f9';
            },
            onCreateGroup : function(p_Data){
                var LGroup = this;

                if(p_Data.type == "mandates"){

                    var LMandateRect = d3.select(LGroup).append("rect");
                    LMandateRect.attr("width", LConfig.onGetRectWidth)
                        .attr("height", LConfig.onGetRectHeight)
                        //.attr("x", function(d) { return d.x - d.width/2; })
                        //.attr("y", function(d) { return d.y - d.height/2; })
                        .attr("title", function(d){ return d.tooltip })
                        .attr("class", "rect-mandate")
                        .attr("transform", function(d){
                            return "rotate(-45 35 35)";
                        })
                        .style("fill", LConfig.onGetColor)
                        .on("click", LConfig.onNodeClick);

                    d3.select(LGroup).append("rect")
                        .attr("x", -15)
                        .attr("y", 24.5)
                        .attr("fill", "#f9f9f9")
                        .attr("height", 17)
                        .attr("rx", 5)
                        .attr("ry", 5)
                        .attr("title", function(d){ return d.tooltip })
                        .attr("class", "rect-mandate-title")
                        .attr("width", 101);

                    var LText1 = d3.select(LGroup).append("text")
                        .attr("dx", 0)
                        .attr("dy", 37)
                        .attr("title", function(d){ return d.tooltip })
                        .text(function(d) { return d.label });

                    if(p_Data.isSelected)
                    {
                        //LMainRect.classed('selected-circle-rect', true);
                        //LMainRect.style("fill", '#7A88A0');
                        LText1.classed('selected-text', true);
                        //LText2.classed('selected-text while-selected-text', true);
                    }
                }
                else if(p_Data.type == "root"){

                    $(LGroup).hover(function(e){
                         var top = e.pageY+'px';
                         var left = e.pageX+'px'
                         $('#hint-div').css({position:'absolute',top:top,left:left}).show();
                         $('#hint-div').html(p_Data.tooltip);
                    },
                    function(){
                       $('#hint-div').hide();
                    });


                    var LMainRect = d3.select(LGroup).append("rect");
                    LMainRect.attr("rx", LConfig.onGetRadiusX)
                        .attr("ry", LConfig.onGetRadiusY)
                        .attr("width", LConfig.onGetRectWidth)
                        .attr("height", LConfig.onGetRectHeight)
                        //.attr("title", function(d){ return d.tooltip })
                        .attr("class", LConfig.onGetClass)
                        .style("fill", LConfig.onGetColor)
                        .on("click", LConfig.onNodeClick);


                    var LTitleRect = d3.select(LGroup).append("rect")
                        .attr("x", -5)
                        .attr("y", 20.5)
                        .attr("fill", "#FFFFFF")
                        .attr("height", 50)
                        .attr("rx", 5)
                        .attr("ry", 5)
                        //.attr("title", function(d){ return d.tooltip })
                        .attr("class", "rect-root-title")
                        .attr("width", 101);


                    d3.select(LGroup).append("image")
                        .attr("xlink:href", "img/globe.png")
                        .attr("x", -5)
                        .attr("y", 20.5)
                        .attr("width", 50)
                        //.attr("title", function(d){ return d.tooltip })
                        .attr("height", 50);

                    var LText1 = d3.select(LGroup).append("text")
                        .attr("dx", 45)
                        .attr("dy", 49)
                        //.attr("title", function(d){ return d.tooltip })
                        .text(function(d) { return d.label });

                    if(p_Data.isSelected)
                    {
                        LMainRect.classed('selected-circle-rect', true);
                        LMainRect.style("fill", '#7A88A0');
                        LTitleRect.classed('selected-rect', true);
                        LText1.classed('selected-text', true);
                    }

                }
                else if(p_Data.type == "person_sub_node"){
                    var LMainRect = d3.select(LGroup).append("rect")
                        .attr("rx", LConfig.onGetRadiusX)
                        .attr("ry", LConfig.onGetRadiusY)
                        .attr("width", LConfig.onGetRectWidth)
                        .attr("height", LConfig.onGetRectHeight)
                        .attr("title", function(d){ return d.tooltip })
                        .attr("class", LConfig.onGetClass)
                        .style("fill", LConfig.onGetColor)
                        .on("click", LConfig.onNodeClick);

                    d3.select(LGroup).append("image")
                        .attr("xlink:href", function(d){
                            return d.left_icon_url;
                        })
                        .attr("x", -5)
                        .attr("y", 0)
                        .attr("width", 50)
                        .attr("title", function(d){ return d.tooltip })
                        .attr("height", 50);

                    var LText1 = d3.select(LGroup).append("text")
                        .attr("dx", 45)
                        .attr("dy", 30)
                        .attr("title", function(d){ return d.tooltip })
                        .text(function(d) { return d.label });

                    if(p_Data.isSelected)
                    {
                        LMainRect.classed('selected-circle-rect', true);
                        LText1.classed('selected-text', true);
                    }

                }
                else if(p_Data.type == "person"){
                    var LMainRect = d3.select(LGroup).append("rect")
                        .attr("rx", LConfig.onGetRadiusX)
                        .attr("ry", LConfig.onGetRadiusY)
                        .attr("width", LConfig.onGetRectWidth)
                        .attr("height", LConfig.onGetRectHeight)
                        .attr("title", function(d){ return d.tooltip })
                        .attr("class", LConfig.onGetClass)
                        .style("fill", LConfig.onGetColor)
                        .on("click", LConfig.onNodeClick);

                    d3.select(LGroup).append("image")
                        .attr("xlink:href", function(d){
                            return d.left_icon_url;
                        })
                        .attr("x", 2)
                        .attr("y", 2)
                        .attr("width", 50)
                        .attr("title", function(d){ return d.tooltip })
                        .attr("height", 50);

                    if(p_Data.isSelected)
                    {
                        LMainRect.style('fill', '#FFFFFF');
                        LMainRect.classed('selected-rect', true);
                    }
                }
                else if(p_Data.type == "dollar"){
                    var LMainRect = d3.select(LGroup).append("rect")
                        .attr("rx", LConfig.onGetRadiusX)
                        .attr("ry", LConfig.onGetRadiusY)
                        .attr("width", LConfig.onGetRectWidth)
                        .attr("height", LConfig.onGetRectHeight)
                        .attr("title", function(d){ return d.tooltip })
                        .attr("class", LConfig.onGetClass)
                        .style("fill", LConfig.onGetColor)
                        .on("click", LConfig.onNodeClick);

                    d3.select(LGroup).append("image")
                        .attr("xlink:href", function(d){
                            return d.left_icon_url;
                        })
                        .attr("x", -5)
                        .attr("y", 0)
                        .attr("width", 50)
                        .attr("title", function(d){ return d.tooltip })
                        .attr("height", 50);

                    var LText1 = d3.select(LGroup).append("text")
                        .attr("dx", 35)
                        .attr("dy", 30)
                        .attr("title", function(d){ return d.tooltip })
                        .text(function(d) { return d.label });

                    if(p_Data.isSelected)
                    {
                        LMainRect.classed('selected-circle-rect', true);
                        LText1.classed('selected-text', true);
                    }

                }
                else if(p_Data.type == "resolution"){
                    var LMainRect = d3.select(LGroup).append("rect")
                        .attr("rx", LConfig.onGetRadiusX)
                        .attr("ry", LConfig.onGetRadiusY)
                        .attr("width", LConfig.onGetRectWidth)
                        .attr("height", LConfig.onGetRectHeight)
                        .attr("title", function(d){ return d.tooltip })
                        .attr("class", LConfig.onGetClass)
                        .style("fill", LConfig.onGetColor)
                        .on("click", LConfig.onNodeClick);

                    LText1 = d3.select(LGroup).append("text")
                        .attr("dx", function(d){ return d.labelX })
                        .attr("dy", function(d){ return d.labelY })
                        .attr("class", "resolution-text")
                        .attr("title", function(d){ return d.tooltip })
                        .text(function(d) { return d.label });

                    LText2 = d3.select(LGroup).append("text")
                        .attr("dx", function(d){ return d.sub_labelX })
                        .attr("dy", function(d){ return d.sub_labelY })
                        .attr("title", function(d){ return d.tooltip })
                        .text(function(d) { return d.sub_label });

                    if(p_Data.isSelected)
                    {
                        LMainRect.classed('selected-circle-rect', true);
                        LMainRect.style("fill", '#7A88A0');
                        LText1.classed('selected-text while-selected-text', true);
                        LText2.classed('selected-text while-selected-text', true);
                    }

                }
                else
                {
                    d3.select(LGroup).append("rect")
                        .attr("rx", LConfig.onGetRadiusX)
                        .attr("ry", LConfig.onGetRadiusY)
                        .attr("width", LConfig.onGetRectWidth)
                        .attr("height", LConfig.onGetRectHeight)
                        .attr("x", function(d) { return d.x - d.width/2; })
                        .attr("y", function(d) { return d.y - d.height/2; })
                        .attr("title", function(d){ return d.tooltip })
                        .attr("class", LConfig.onGetClass)
                        .style("fill", LConfig.onGetColor)
                        .on("click", LConfig.onNodeClick);

                    d3.select(LGroup).append("text")
                        .attr("dx", 15)
                        .attr("dy", 30)
                        .text(function(d) { return d.label });
                }


            },
            eventOnNodeClick : function(p_NodeData){
                clearDetailsArea();
                if(p_NodeData.type == "resolution")
                {
                    //the clicked node is a resolution
                    displayResolutionDetails(p_NodeData);
                }
                else if(p_NodeData.type == "mandates")
                {
                    //the clicked node is a resolution
                    displayMandatesDetails(p_NodeData);
                }
            },
            eventOnLinkClick : function(p_LinkData){
                clearDetailsArea();
                displayLinkDetails(p_LinkData);
            }
        }

        //create a new constellation
        var Graph = new clsConstellationVisualization(LConfig);

        if(p_callback)
        {
            p_callback(Graph)
        }
    });
}

/*----------------------------------------------------------------------------*/
