<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
<xsl:output method="text"/>
<xsl:output method="html" name="html"/>

<xsl:template match="database">

  <xsl:for-each select="./document">
        <xsl:sort select="./item[@name='DS1']/text" order="descending"/>
        <xsl:variable name="date" select="substring-before(./item[@name='PubDate']/datetime,' ')"/>
        <xsl:variable name="day" select="normalize-space(substring-before($date, '/'))"/>
        <xsl:variable name="monthyear" select="substring-after($date, '/')"/>
        <xsl:variable name="month" select="normalize-space(substring-before($monthyear, '/'))"/>
        <xsl:variable name="year" select="normalize-space(substring-after($monthyear, '/'))"/>
        <xsl:variable name="start" select="concat($month,'/',$day,'/',$year)"/>                            

        <xsl:variable name="resreftemp" select="substring-before(./item[@name='DS1']/text,'(')"/>
        <xsl:variable name="resref">
          <xsl:choose>
            <xsl:when test="$resreftemp != ''">
              <xsl:copy-of select="$resreftemp"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="./item[@name='DS1']/text"/>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:variable>
        <xsl:variable name="resnumber" select="normalize-space(substring-after($resref,'S/RES/'))"/>

        <xsl:if test="$resnumber != ''">
 
          <xsl:variable name="fullrestitle" select="substring-after(./item[@name='Title']/text,'[')"/> 
          <xsl:variable name="restitletemp" select="substring-before($fullrestitle,']')"/>
          <xsl:variable name="restitle">
            <xsl:choose>
              <xsl:when test="$restitletemp != ''">
                <xsl:copy-of select="normalize-space($restitletemp)"/>
              </xsl:when>
              <xsl:otherwise>
                <xsl:value-of select="normalize-space($fullrestitle)"/>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:variable>

          <xsl:variable name="title">
            <xsl:copy-of select="$resnumber"/>
            <xsl:value-of select="' - '"/>
            <!-- xsl:call-template name="sentence-case">
            <xsl:with-param name="string-subset" select="translate($restitle, translate($restitle, $uc, $lc)"/>, $lc)"/>
            </xsl:call-template -->
            <xsl:copy-of select="translate($restitle, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')"/>
          </xsl:variable>

          <xsl:variable name="image" select="concat('../../wordles/images/aft93/sres',$resnumber,'.awked.png')"/>
        
          <xsl:variable name="befparen" select="substring-before(./item[@name='DS1']/text,'(')"/>
          <xsl:variable name="afterparen" select="substring-after(./item[@name='DS1']/text,'(')"/> 
          <xsl:variable name="link" select="concat('http://daccess-ods.un.org/access.nsf/Get?Open&amp;DS=',$befparen,' (',$afterparen,'&amp;Lang=E')"/>

          <xsl:variable name="file" select="concat('htmlevents/aft93/sres',$resnumber,'.html')"/>

          <xsl:result-document href="{$file}" format="html">

            <html><body link="#3E3535" vlink="#999999" hover="#418DC7">
            <!-- div style="font-family:Tahoma; font-size: 9pt;" -->

            <!-- h1><xsl:copy-of select="$link"/></h1 -->
            <p align="center"><img src="{$image}" alt=""></img></p>
            <!-- p><b><u><xsl:copy-of select="$title"/></u></b></p -->
            <b><u><a href="{$link}" target="_blank"><xsl:copy-of select="$title"/></a></u></b>
            <br></br>
            <xsl:copy-of select="$start"/>
     
       
            <!-- p><b><u>Clauses:</u></b></p -->
            <xsl:apply-templates select="./item[@name='PDF']/richtext/par[@def='2'][1]"
                                 mode="addcontent">
              <xsl:with-param name="print" select="'false'"/>
            </xsl:apply-templates>

          <!-- /div -->
          </body></html>
      </xsl:result-document>

    </xsl:if>
  </xsl:for-each>
</xsl:template>

<xsl:template match="*" mode="addcontent">
  <xsl:param name="print" />
  
  <xsl:variable name="index" select="substring-before(.,'.')"/>
  <xsl:choose>
    <xsl:when test="string(number($index)) != 'NaN'">
       <xsl:variable name="clause" select="substring-after(.,'.')"/>
       <br></br>
       <b><xsl:copy-of select="$index"/></b>
       <xsl:copy-of select="$clause"/>
       <xsl:apply-templates select="./following-sibling::*[1]"
                           mode="addcontent">
          <xsl:with-param name="print" select="'true'"/>
       </xsl:apply-templates>
     </xsl:when>
     <xsl:otherwise>
       <xsl:choose>
          <xsl:when test=". != ''">
             <xsl:if test="$print = 'true'">
                <br></br><xsl:value-of select="."/>
             </xsl:if>
             <xsl:apply-templates select="./following-sibling::*[1]"
                            mode="addcontent">
                 <xsl:with-param name="print" select="$print"/>
             </xsl:apply-templates>
          </xsl:when>
          <xsl:otherwise>
             <xsl:if test="$print = 'false'">
                <xsl:apply-templates select="./following-sibling::*[1]"
                            mode="addcontent">
                   <xsl:with-param name="print" select="$print"/>
                </xsl:apply-templates>
             </xsl:if>
          </xsl:otherwise>
       </xsl:choose>
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>

</xsl:stylesheet>
