$(function() {
    /*$( document ).tooltip({
        //items: "img, [data-geo], [title]",
        content: function() {
            var element = $( this),
            LData = d3.select(this).datum();
            if(LData && LData.id && (LData.id == "unmis"))
            {
                //The node is central node
                return LData.tooltip;
            }
            else
            {
                return element.attr('title');
            }
        }
    });*/
});

function Initialize(){
    //generate the constellation
    generateConstellation(function( p_Graph ){
        var LSVGEl = $('#' + p_Graph.svgAtrrId),
            LOffset = LSVGEl.offset(),
            LBtnTop = LOffset.top + LSVGEl.height() - 20,
            LBtnLeft = LOffset.left + LSVGEl.width() / 2;

        var LZx = $(window).height() * 31 / 100,
            LZy = $(window).width() * 03 / 100,
            LMx = $(window).height() * 61 / 100,
            LMy = $(window).width() * 03 / 100;

        LBtnTop += "px";
        LBtnLeft += "px";
        $("#cleanup-btn-main-constellation").css({
            "position" : "absolute",
            "top" : LBtnTop,
            "left" : LBtnLeft
        });

        $("#cleanup-btn-main-constellation").on('click', function(){
            clearDetailsArea();
            p_Graph.cleanupNavigationContext();
        })

        $('.zoom-slider-cntnr').css({
            top : LZx,
            left : LZy
        });
        $('.node-slider-cntnr').css({
            top : LMx,
            left : LMy
        });
        $( "#zoom-slider" ).slider({
            value:100,
            min: 50,
            max: 150,
            step: 10,
            orientation: "vertical",
            slide: function( event, ui ) {
                $('#zoom-value').text( ui.value );
                $('#' + p_Graph.svgAtrrId).css( 'transform', 'scale(' + (ui.value/100) + ')'  );
            }
        });

        $( "#node-slider" ).slider({
            value:2,
            min: 1,
            max: 5,
            step: 1,
            orientation: "vertical",
            slide: function( event, ui ) {
                $('#nodes-frm-center').text( ui.value );
                p_Graph.displayNodeLevelFromCenter = ui.value;
                p_Graph.refreshTheCenterNode();
            }
        });
    });


    return;


    var width = 960,
        height = 500,
        root;

    var force = d3.layout.force()
        .size([width, height])
        .charge(-1000)
        .linkDistance(150)
        .on("tick", tick);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");

    d3.json("data/const_dem.json", function(json) {
        root = json;
        update();
    });

    function update() {
        var nodes = flatten(root),
            links = d3.layout.tree().links(nodes);

        // Restart the force layout.
        force
            .nodes(nodes)
            .links(links)
            .start();

        // Update the links�
        link = link.data(links, function(d) { return d.target.internalId; });

        // Exit any old links.
        link.exit().remove();

        // Enter any new links.
        link.enter().insert("line", ".node")
            .attr("class", "link")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        // Update the nodes�
        node = node.data(nodes, function(d) { return d.id; }).style("fill", color);

        // Exit any old nodes.
        node.exit().remove();

        // Enter any new nodes.
        /*node.enter().append("circle")
         .attr("class", "node")
         .attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; })
         .attr("r", function(d) { return 30 })
         .attr("title", function(d){ return d.label })
         .style("fill", color)
         .on("click", click)
         .call(force.drag);*/

        node.enter().append("rect")
            .attr("class", "node")
            .attr("x", function(d) { return d.x - 50; })
            .attr("y", function(d) { return d.y - 25; })
            //.attr("r", function(d) { return 30 })
            .attr("width", "100")
            .attr("height", "50")
            .attr("title", function(d){ return d.label })
            .style("fill", color)
            .on("click", click)
            .call(force.drag);
    }

    function tick() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("x", function(d) { return d.x - 50; })
            .attr("y", function(d) { return d.y - 25; });
    }

    // Color leaf nodes orange, and packages white or blue.
    function color(d) {
        return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
    }

    // Toggle children on click.
    function click(d) {
        if (!d3.event.defaultPrevented) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update();
        }
    }

    // Returns a list of all nodes under the root.
    function flatten(root) {
        var nodes = [], i = 0;

        function recurse(node) {
            if (node.children) node.children.forEach(recurse);
            if (!node.internalId) node.internalId = ++i;
            nodes.push(node);
        }

        recurse(root);
        return nodes;
    }
}