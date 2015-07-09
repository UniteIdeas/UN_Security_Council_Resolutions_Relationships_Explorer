<?xml version='1.0'?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns="http://www.w3.org/2000/svg">
  <xsl:output method="xml" indent="yes" encoding="UTF-8" />


<xsl:template match="/images">

  <xsl:variable name="width">
    <xsl:value-of select="./uniformImageWidth"/>
  </xsl:variable>
  <xsl:variable name="numimages">
    <xsl:value-of select="count(./image)"/>
  </xsl:variable>
  <xsl:variable name="totwidth">
    <xsl:value-of select="$numimages * $width"/>
  </xsl:variable>
  <xsl:variable name="maxheight">
    <xsl:value-of select="image[not(preceding-sibling::image/@height > ./@height or following-sibling::image/@height > ./@height)]/@height"/>
  </xsl:variable>
 
  <xsl:element name="svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
    <xsl:attribute name="title">
      <xsl:value-of select="./title"/>
    </xsl:attribute>
    <xsl:attribute name="width">
      <xsl:value-of select="$totwidth"/>
    </xsl:attribute>
    <xsl:attribute name="height">
      <xsl:value-of select="$maxheight"/>
    </xsl:attribute>
    <xsl:attribute name="viewBox">
      <xsl:value-of select="concat('0 0 ', ./viewbox_width, ' ', ./viewbox_height)"/>
    </xsl:attribute>
    <xsl:attribute name="id">
      <xsl:value-of select="'imagesSVG'"/> 
    </xsl:attribute>
    <xsl:attribute name="imageSelected">
      <xsl:value-of select="./imageSelected"/>
    </xsl:attribute>
   <xsl:attribute name="imageBorderDefault">
      <xsl:value-of select="./imageBorderDefault"/>
    </xsl:attribute>
   <xsl:attribute name="imageBorderHighlight">
      <xsl:value-of select="./imageBorderHighlight"/>
    </xsl:attribute>

    <!-- g id="mover">
      <xsl:attribute name="transform">
        <xsl:value-of select="concat('translate(', (1 - $selected) * $width, ',0)')"/>
      </xsl:attribute -->
      <xsl:apply-templates select="image" />
    <!-- /g -->
  </xsl:element>
</xsl:template>

<xsl:template match="image">
  <xsl:element name="svg">

    <xsl:variable name="width">
      <xsl:value-of select="../uniformImageWidth"/>
    </xsl:variable>
    <xsl:variable name="imageSelected">
      <xsl:value-of select="../imageSelected"/>
    </xsl:variable>
    <xsl:variable name="imageBorderDefault">
      <xsl:value-of select="../imageBorderDefault"/>
    </xsl:variable>
    <xsl:variable name="imageBorderHighlight">
      <xsl:value-of select="../imageBorderHighlight"/>
    </xsl:variable>


    <xsl:attribute name="id">
      <xsl:value-of select="concat('image', @position)" />
    </xsl:attribute>
    <xsl:attribute name="width">
      <xsl:value-of select="concat($width, 'px')" />
    </xsl:attribute>
    <xsl:attribute name="height">
      <xsl:value-of select="concat(@height, 'px')" />
    </xsl:attribute>
    <xsl:attribute name="x">
      <xsl:value-of select="concat(((@position - 1) * $width), 'px')" />
    </xsl:attribute>
    <xsl:attribute name="y">
      <xsl:value-of select="'0px'"/>
    </xsl:attribute>

    <xsl:element name="rect">
      <xsl:attribute name="id">
        <xsl:value-of select="concat('image', @position, 'Rect')" />
      </xsl:attribute>
      <xsl:attribute name="width">100%</xsl:attribute>
      <xsl:attribute name="height">100%</xsl:attribute>
      <xsl:attribute name="fill">
        <xsl:value-of select="@color"/>
      </xsl:attribute>
      <xsl:attribute name="stroke">
        <xsl:choose>
          <xsl:when test="$imageSelected = @position">
            <xsl:value-of select="$imageBorderHighlight"/> 
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="$imageBorderDefault"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:attribute>
      <xsl:attribute name="stroke-width">5</xsl:attribute>
    </xsl:element>

    <xsl:element name="text">
      <xsl:attribute name="id">
        <xsl:value-of select="concat('image', @position, 'Label')" />
      </xsl:attribute>
      <xsl:attribute name="name">
        <xsl:value-of select="@name" />
      </xsl:attribute>
      <xsl:attribute name="font-size">
        <xsl:choose>
          <xsl:when test="$imageSelected = @position">
            22pt
          </xsl:when>
          <xsl:otherwise>
            18pt
          </xsl:otherwise>
        </xsl:choose>
      </xsl:attribute>
      <xsl:attribute name="fill">
        <xsl:choose>
          <xsl:when test="$imageSelected = @position">
            brown
          </xsl:when>
          <xsl:otherwise>
            black
          </xsl:otherwise>
        </xsl:choose>
      </xsl:attribute> 
      <xsl:attribute name="x">25px</xsl:attribute>
      <xsl:attribute name="y">40px</xsl:attribute>
      <xsl:value-of select="@name" />
    </xsl:element>

    <!-- xsl:element name="text">
      <xsl:attribute name="id">
        <xsl:value-of select="concat('image', @position, 'Type')" />
      </xsl:attribute>
      <xsl:attribute name="font-size">24pt</xsl:attribute>
      <xsl:attribute name="x">55px</xsl:attribute>
      <xsl:attribute name="y">150px</xsl:attribute>
      <xsl:attribute name="fill">black</xsl:attribute>
      <xsl:value-of select="@name" />
    </xsl:element -->

    <xsl:element name="a">
      <xsl:attribute name="xlink:href">
        <xsl:value-of select="concat('links/', @link)"/>
      </xsl:attribute> 
      <xsl:attribute name="target">
        <xsl:value-of select="'_blank'"/>
      </xsl:attribute> 
      <xsl:element name="text">
        <xsl:attribute name="id">
          <xsl:value-of select="concat('image', @position, 'Link')" />
        </xsl:attribute>
        <xsl:attribute name="font-size">12pt</xsl:attribute>
        <xsl:attribute name="x">25px</xsl:attribute>
        <xsl:attribute name="y">80px</xsl:attribute>
       <xsl:attribute name="fill">
        <xsl:choose>
          <xsl:when test="$imageSelected = @position">
            brown
          </xsl:when>
          <xsl:otherwise>
            black
          </xsl:otherwise>
        </xsl:choose>
      </xsl:attribute> 
        Click for info
      </xsl:element>
    </xsl:element>

  </xsl:element>
</xsl:template>

</xsl:stylesheet>

