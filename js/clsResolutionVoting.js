/**
 * User: Digvijay.Upadhyay
 * Date: 10/11/13
 * Time: 1:18 PM
 * The file contains class to display the details legend
 */

function clsResolutionDetails(p_Config)
{
    //PROPERTIES ---------------------------------------
    var LMe = this;
    //renderTo(Javascript object) - The Area object where the chart should be rendered
    LMe.renderTo = null;
    //js object having the data to dia
    LMe.data = {};

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

    };

    /*----------------------------------------------------------------------------*/
    LMe.DrawLegends = function(p_LegendContainerEl){
        var LLegendKey,
            LLegendContainer = p_LegendContainerEl;
        for(LLegendKey in G_LEGENDS)
        {
            var LLegend = G_LEGENDS[LLegendKey],
                LTable = LLegendContainer.append('table'),
                LTr = LTable.append('tr'),
                LTdSVG = LTr.append('td'),
                LTdTitle = LTr.append('td'),
                LSVG = LTdSVG.append('svg:svg')
                    .attr("width", 50)
                    .attr("height", 35);

            LSVG.append('circle')
                .attr("fill", function(d) { return LLegend.color })
                .attr("cx", function(d) { return 22; })
                .attr("cy", function(d) { return 3 })
                .attr("r", function(d) { return 3 });

            //Draw body of the human
            LSVG.append('path')
                .attr("fill", function(d) { return LLegend.color })
                .attr("d", function(d) { return LMe.GetPersonBodyPath(0 , -21) });

            LTdTitle.text(LLegend.text);
        }
    };

    /*----------------------------------------------------------------------------*/
    LMe.DrawData = function (p_DataCollection, p_ParentSVGEl)
    {
        //-----------------------------------------------
        function L_GetXYCoordinateOfData(p_Position){
            var LRelPos = p_Position - 1,
                LXposition = LRelPos % GCONST.G_ALLOWED_DATA_ENTRIES_IN_X,
                LYposition = Math.floor(LRelPos / GCONST.G_ALLOWED_DATA_ENTRIES_IN_X),
                LResult = {
                    X : 0,
                    Y : 0
                };

            //Compute the exact position of the block
            LResult.X = LXposition * GCONST.G_SVG_DATA_EL_WIDTH;
            LResult.Y = LYposition * GCONST.G_SVG_DATA_EL_HEIGHT;

            //Return the result
            return LResult;
        }
        //-----------------------------------------------
        function L_addInternalIndex()
        {
            for(var LLoopindex = 0; LLoopindex < p_DataCollection.length; LLoopindex++)
            {
                var LItem = p_DataCollection[LLoopindex];
                LItem.innerPosition = LLoopindex + 1;
            }
        }

        //-----------------------------------------------

        L_addInternalIndex();

        //Select all the rectangles
        var LGroup = p_ParentSVGEl.selectAll("g")
            .data(p_DataCollection)
            .enter().append("g");

        //Compute the XY co-ordinate values for each data block\
        LGroup.each(function(d){
            var LPosition = L_GetXYCoordinateOfData(d.innerPosition);
            d.coordinates = LPosition;
        });

        //Append text ie title of the data
        LGroup.append('text')
            .text(function(d) { return d.name; })
            .attr("x", function(d) { return d.coordinates.X })
            .attr("y", function(d) { return d.coordinates.Y + GCONST.G_SVG_DATA_EL_HEIGHT - 20; });

        //Draw human icon
        //Draw his head
        LGroup.append('circle')
            .attr("fill", function(d) { return LMe.GetColorForData(d)})
            .attr("cx", function(d) { return d.coordinates.X + 22; })
            .attr("cy", function(d) { return d.coordinates.Y + 24 })
            .attr("r", function(d) { if(! d.name){return;} return 3 });

        //Draw body of the human
        LGroup.append('path')
            .attr("fill", function(d) {
                return LMe.GetColorForData(d)
            })
            .attr("d", function(d) { if(! d.name){return;} return LMe.GetPersonBodyPath(d.coordinates.X, d.coordinates.Y) });


        //Adjust width of the SVG
        var LLength = LGroup[0].length,
            LSVGWidth = GCONST.G_ALLOWED_DATA_ENTRIES_IN_X * GCONST.G_SVG_DATA_EL_WIDTH,
            LNoOfYEntries = Math.floor(LLength / GCONST.G_ALLOWED_DATA_ENTRIES_IN_X),
            LSVGHeight = 0;

        if(LLength / GCONST.G_ALLOWED_DATA_ENTRIES_IN_X == LNoOfYEntries)
        {
            LSVGHeight = LNoOfYEntries * GCONST.G_SVG_DATA_EL_HEIGHT;
        }
        else
        {
            LSVGHeight = (LNoOfYEntries + 1) * GCONST.G_SVG_DATA_EL_HEIGHT;
        }

        p_ParentSVGEl.attr("width", LSVGWidth);
        p_ParentSVGEl.attr("height", LSVGHeight);

    }

    /*----------------------------------------------------------------------------*/
    /*
     * The function will return corresponding icon fill color of the data entry
     */
    LMe.GetColorForData = function (p_Data)
    {
        if(! G_LEGENDS[p_Data.vote])
        {
            return "#FFFFFF";
        }
        return G_LEGENDS[p_Data.vote].color;
    };

    /*----------------------------------------------------------------------------*/
    /*
     * The function will generate path to draw figure of person
     */
    LMe.GetPersonBodyPath = function (p_X, p_Y){
        var LPath = '';

        LPath += ' M ' + (p_X + 17.26) + ' ' + (p_Y + 28.24) + ' ';

        LPath += ' C ' + (p_X + 20.62) + ' ' + (p_Y + 28.16) + ' ' +
            (p_X + 24.05) + ' ' + (p_Y + 27.46) + ' ' +
            (p_X + 27.36) + ' ' + (p_Y + 28.35);

        LPath += ' C ' + (p_X + 27.48) + ' ' + (p_Y + 32.27) + ' ' +
            (p_X + 28.29) + ' ' + (p_Y + 36.15) + ' ' +
            (p_X + 28.24) + ' ' + (p_Y + 40.07);


        LPath += ' C ' + (p_X + 27.92) + ' ' + (p_Y + 40.37) + ' ' +
            (p_X + 27.28) + ' ' + (p_Y + 40.97) + ' ' +
            (p_X + 26.96) + ' ' + (p_Y + 41.26);

        LPath += ' C ' + (p_X + 26.77) + ' ' + (p_Y + 39.73) + ' ' +
            (p_X + 26.58) + ' ' + (p_Y + 38.20) + ' ' +
            (p_X + 26.37) + ' ' + (p_Y + 36.67);


        LPath += ' C ' + (p_X + 25.09) + ' ' + (p_Y + 42.36) + ' ' +
            (p_X + 26.17) + ' ' + (p_Y + 48.24) + ' ' +
            (p_X + 25.95) + ' ' + (p_Y + 54.01);

        LPath += ' C ' + (p_X + 25.21) + ' ' + (p_Y + 54.01) + ' ' +
            (p_X + 23.75) + ' ' + (p_Y + 54.01) + ' ' +
            (p_X + 23.01) + ' ' + (p_Y + 54.01);

        LPath += ' C ' + (p_X + 23.03) + ' ' + (p_Y + 50.01) + ' ' +
            (p_X + 22.87) + ' ' + (p_Y + 46.02) + ' ' +
            (p_X + 22.53) + ' ' + (p_Y + 42.03);

        LPath += ' C ' + (p_X + 22.10) + ' ' + (p_Y + 45.98) + ' ' +
            (p_X + 22.04) + ' ' + (p_Y + 50.00) + ' ' +
            (p_X + 21.12) + ' ' + (p_Y + 53.88);

        LPath += ' C ' + (p_X + 20.54) + ' ' + (p_Y + 53.95) + ' ' +
            (p_X + 19.38) + ' ' + (p_Y + 54.08) + ' ' +
            (p_X + 18.80) + ' ' + (p_Y + 54.14);

        LPath += ' C ' + (p_X + 18.75) + ' ' + (p_Y + 47.31) + ' ' +
            (p_X + 19.41) + ' ' + (p_Y + 40.43) + ' ' +
            (p_X + 18.47) + ' ' + (p_Y + 33.64);

        LPath += ' C ' + (p_X + 18.01) + ' ' + (p_Y + 36.12) + ' ' +
            (p_X + 18.47) + ' ' + (p_Y + 38.90) + ' ' +
            (p_X + 17.12) + ' ' + (p_Y + 41.14);

        LPath += ' L ' + (p_X + 16.36) + ' ' + (p_Y + 40.59);

        LPath += ' C ' + (p_X + 16.00) + ' ' + (p_Y + 36.46) + ' ' +
            (p_X + 17.01) + ' ' + (p_Y + 32.35) + ' ' +
            (p_X + 17.26) + ' ' + (p_Y + 28.24);

        LPath += ' Z ';

        return LPath;

    }

    /*----------------------------------------------------------------------------*/


    //Invoke the constructor
    LMe.constructor();

    return LMe;
};


