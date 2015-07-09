<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="xml" indent="yes"/>

<xsl:variable name="newline" select="'&lt;br&gt;'"/>

<xsl:template match="database">

<data>

  <xsl:for-each select="./document">
    <xsl:sort select="./item[@name='DS1']/text" order="descending"/>
 
      <xsl:variable name="date" select="substring-before(./item[@name='PubDate']/datetime,' ')"/>
      <xsl:variable name="daytemp" select="substring-before($date, '/')"/>
      <xsl:variable name="day">
        <xsl:choose>
          <xsl:when test="$daytemp != ''">
            <xsl:copy-of select="normalize-space($daytemp)"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="'01'"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:variable>
      <xsl:variable name="monthyear" select="substring-after($date, '/')"/>
      <xsl:variable name="monthtemp" select="substring-before($monthyear, '/')"/>
      <xsl:variable name="month">
        <xsl:choose>
          <xsl:when test="$monthtemp != ''">
            <xsl:copy-of select="normalize-space($monthtemp)"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="'01'"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:variable>
      <xsl:variable name="year" select="normalize-space(substring-after($monthyear, '/'))"/>

      <xsl:if test="$year != ''">
  
        <xsl:element name="event">
 
        <xsl:variable name="correctdate" select="concat($month,'/',$day,'/',$year)"/>                            
        <xsl:attribute name="start">
          <xsl:copy-of select="$correctdate" />
        </xsl:attribute>

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
        <xsl:attribute name="title">
          <xsl:copy-of select="$resnumber"/>
          <xsl:value-of select="' - '"/>
          <!-- xsl:call-template name="sentence-case">
            <xsl:with-param name="string-subset" select="translate($restitle, translate($restitle, $uc, $lc)"/>, $lc)"/>
            </xsl:call-template -->
          <xsl:copy-of select="translate($restitle, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')"/>
        </xsl:attribute>

        <xsl:attribute name="link">
          <xsl:value-of select="'htmlevents/aft93/sres'"/>
          <xsl:copy-of select="$resnumber"/>
          <xsl:value-of select="'.html'"/>
        </xsl:attribute>

        <xsl:apply-templates select="./item[@name='PDF']/richtext/par[@def='2'][1]"
                             mode="addcontent">
             <xsl:with-param name="print" select="'false'"/>
        </xsl:apply-templates>
        <!-- xsl:value-of select="'Clauses:'"/ -->

      </xsl:element>

    </xsl:if>
  </xsl:for-each>
</data>
</xsl:template>


<xsl:template match="*" mode="addcontent">
  <xsl:param name="print" />
  
  <xsl:variable name="index" select="substring-before(.,'.')"/>
  <xsl:choose>
    <xsl:when test="string(number($index)) != 'NaN'">
       <xsl:variable name="clause" select="substring-after(.,'.')"/>
       <xsl:value-of select="'&lt;b&gt;'"/>
       <xsl:copy-of select="$index"/>
       <xsl:value-of select="'&lt;&#047;b&gt;'"/>
       <xsl:copy-of select="$clause"/>
       <xsl:copy-of select="$newline"/>
       <xsl:apply-templates select="./following-sibling::*[1]"
                           mode="addcontent">
          <xsl:with-param name="print" select="'true'"/>
       </xsl:apply-templates>
     </xsl:when>
     <xsl:otherwise>
       <xsl:choose>
          <xsl:when test=". != ''">
             <xsl:if test="$print = 'true'">
                <xsl:value-of select="."/>
                <xsl:copy-of select="$newline"/>
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
