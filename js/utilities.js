//--------------------------------------------------------
function clearDetailsArea(){
    $('#' + GCONST.CONSTELLATION_DETAIL_CONTAINER_ID).html('');
}

//--------------------------------------------------------
function displayResolutionDetails(p_ResolutionDetails){
    //Get Resolution label
    var LResolution = p_ResolutionDetails.label,
    //Generate data file name
        LDataFileName = GCONST.G_DATA_FILE_PREFIX + LResolution + GCONST.G_DATA_FILE_EXT,
    //Generate file path
        LDataFilePath = GCONST.G_DATA_FILE_LOCATION + '/' + LDataFileName,
    //LParentSVGEl = d3.select('#dataSVGEl')
        LCont = d3.select('#' + GCONST.CONSTELLATION_DETAIL_CONTAINER_ID);

    //Load the data file
    d3.json(LDataFilePath, function(p_Error, p_Root){
        /*
         * This function will draw the layout after loading the data
         */

        if(p_Error)
        {
            //Some error occurred while loading the data file
            //alert('Unable to load the data file.');
            return;
        }

        //Set titles
        LCont.append('div')
            .attr('class', 'visual-element-title')
            .text('VOTING RECORD');

        LCont.append('div')
            .attr('class', 'visual-element-title element-title')
            .text(p_ResolutionDetails.label);

        var LSVGCntnr = LCont.append('div').attr('class', 'resolution-dtl-svg-cntnr'),
            LSVGEl = LSVGCntnr.append('svg'),
             LRow = LCont.append('div')
                .attr('class', 'resolution-dtl-legend-cntnr')
                .append('table')
                .append('tr')
                .attr('valign', 'top');

        LRow.append('td')
            .text('LEGEND');

        LLegendsCntnr = LRow.append('td')
            .append('div');

            //.attr('class', 'visual-element-title element-title')
            //.text(p_ResolutionDetails.label);

        //File has been loaded successfully
        //Load the data
        var LDataCollection = p_Root.image,
            LResolutionDetail = new clsResolutionDetails();

        //Draw the data
        LResolutionDetail.DrawData(LDataCollection, LSVGEl);
        LSVGCntnr.style('width', LSVGEl.attr('width') + 'px');
        LResolutionDetail.DrawLegends(LLegendsCntnr);
    });

    //DrawLegends();
}

//--------------------------------------------------------
function displayLinkDetails(p_LinkData){
    var LSource = p_LinkData.source,
        LTarget = p_LinkData.target;

    if(LSource.type == "resolution" && LTarget.type == "resolution")
    {
        var LCont = d3.select('#' + GCONST.CONSTELLATION_DETAIL_CONTAINER_ID)
        //Set titles
        LCont.append('div')
            .attr('class', 'visual-element-title')
            .text('RESOLUTION VARIATIONS');

        LCont.append('div')
            .attr('class', 'visual-element-title element-title')
            .text(LSource.label + ' & ' + LTarget.label);

        var URL = GCONST.RESOLUTION_DIFF_IMG_PATH + '/' +LSource.label + '_' + LTarget.label + GCONST.RESOLUTION_DIFF_IMG_POSTFIX;
        LCont.append('img')
            .style('padding', '10px')
            .style('border', '1px solid #999999')
            .attr('src', URL);
    }
}

//--------------------------------------------------------
function displayMandatesDetails(p_MandateData){

    var LCont = d3.select('#' + GCONST.CONSTELLATION_DETAIL_CONTAINER_ID),
        LDataFilePath = 'data/mandates.json';

    function L_ProcessData(p_Data){
        function L__GetIndexOfNode(p_id)
        {
            for(var LLoopIndex1 = 0; LLoopIndex1 < p_Data.nodes.length; LLoopIndex1++)
            {
                var LNode = p_Data.nodes[LLoopIndex1];
                if(LNode.id == p_id)
                {
                    return LLoopIndex1;
                }
            }
        }

        function L__addDataToEdge(p_Edge){
            var LSourceIndex = L__GetIndexOfNode(p_Edge.head_node_id),
                LTargetIndex = L__GetIndexOfNode(p_Edge.tail_node_id);
            if(LSourceIndex == undefined)
            {
                //invalid edge
                return false;
            }
            if(LTargetIndex == undefined)
            {
                //invalid edge
                return false;
            }

            p_Edge.source = LSourceIndex;
            p_Edge.target = LTargetIndex;
            return true;
        }

        for(var LLoopIndex = 0; LLoopIndex < p_Data.edges.length; LLoopIndex++)
        {
            var LEdge = p_Data.edges[LLoopIndex];
            if(L__addDataToEdge(LEdge) !== true)
            {
                //some error must have occurred in the data remvoe the data
                p_Data.edges.splice(LLoopIndex, 1);

                //take the new edge and process again
                var LEdge = p_Data.edges[LLoopIndex];
                L__addDataToEdge(LEdge)
            }
        }

        return p_Data;
    }

    //Load the data file
    d3.json(LDataFilePath, function(p_Error, p_Root){
        /*
         * This function will draw the layout after loading the data
         */

        if(p_Error)
        {
            //Some error occurred while loading the data file
            //alert('Unable to load the data file.');
            return;
        }

        //Data loaded
        //Set titles
        LCont.append('div')
            .attr('class', 'visual-element-title')
            .text('THRUST AREAS');

        LCont.append('div')
            .attr('id', 'mandates-svg-cntnr')
            .style('border', '1px solid #999999');

        p_Root = L_ProcessData(p_Root);

        var LWinHt = $(window).height(),
            LWinWd = $(window).width(),
            LCntnr = $('#constellaition-viz-cntnr'),
            LCntnrTop = LCntnr.offset().top,
            LCntnrLft = LCntnr.offset().left;

        var LConfig = {
            renderTo : '#mandates-svg-cntnr',
            data : p_Root,
            width : LCntnr.width() - 50,
            height : LWinHt - LCntnrTop
        };

        var LMandatesGraph = new clsMandatesVisualization(LConfig);

        //Draw the data
        //LMandatesGraph.drawChart(LDataCollection, LSVGEl);
    });
}

//--------------------------------------------------------
