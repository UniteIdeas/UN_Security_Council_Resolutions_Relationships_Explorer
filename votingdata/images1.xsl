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
   <xsl:variable name="height">
    <xsl:value-of select="./uniformImageHeight"/>
  </xsl:variable>
 
  <xsl:element name="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <xsl:attribute name="title">
      <xsl:value-of select="./title"/>
    </xsl:attribute>
    <xsl:attribute name="width">
      <xsl:value-of select="./viewbox_width"/>
    </xsl:attribute>
    <xsl:attribute name="height">
      <xsl:value-of select="viewbox_height"/>
    </xsl:attribute>
    <xsl:attribute name="viewBox">
      <xsl:value-of select="concat('0 0 ', ./viewbox_width, ' ', ./viewbox_height)"/>
    </xsl:attribute>
    <xsl:attribute name="id">
      <xsl:value-of select="'imagesSVG'"/> 
    </xsl:attribute>
    <xsl:attribute name="imageBorderDefault">
      <xsl:value-of select="./imageBorderDefault"/>
    </xsl:attribute>
    <xsl:attribute name="imageBorderHighlight">
      <xsl:value-of select="./imageBorderHighlight"/>
    </xsl:attribute>

    <xsl:apply-templates select="image" />
  </xsl:element>
</xsl:template>

<xsl:template match="image">
  <xsl:element name="svg">

    <xsl:variable name="width">
      <xsl:value-of select="../uniformImageWidth"/>
    </xsl:variable>
    <xsl:variable name="height">
      <xsl:value-of select="../uniformImageHeight"/>
    </xsl:variable>
    <xsl:variable name="imageBorderDefault">
      <xsl:value-of select="../imageBorderDefault"/>
    </xsl:variable>
    <xsl:variable name="imageBorderHighlight">
      <xsl:value-of select="../imageBorderHighlight"/>
    </xsl:variable>


    <xsl:attribute name="id">
      <xsl:value-of select="concat('image', @position, 'svg')" />
    </xsl:attribute>
    <xsl:attribute name="width">
      <xsl:value-of select="concat($width, 'px')" />
    </xsl:attribute>
    <xsl:attribute name="height">
      <xsl:value-of select="concat($height, 'px')" />
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
      <xsl:attribute name="fill">white</xsl:attribute>
      <xsl:attribute name="stroke">white</xsl:attribute>
      <xsl:attribute name="stroke-width">1</xsl:attribute>
    </xsl:element>

    <xsl:element name="image">
      <xsl:attribute name="id">
        <xsl:value-of select="concat('image', @position)" />
      </xsl:attribute>
      <xsl:attribute name="width">
        <xsl:value-of select="$width" />
      </xsl:attribute>
      <xsl:attribute name="height">
        <xsl:value-of select="$height" />
      </xsl:attribute>
      <xsl:attribute name="xlink:href">
        <xsl:choose>
          <xsl:when test="@vote = 'y'">
            images/greenperson.png
          </xsl:when>
          <xsl:when test="@vote = 'n'">
            images/redperson.png
          </xsl:when>
          <xsl:when test="@vote = 'a'">
            images/greyperson.png
          </xsl:when>
          <xsl:when test="@vote = 'blankspot'">
            images/whiteperson.png
          </xsl:when>
          <xsl:otherwise>
            images/person.png
          </xsl:otherwise>
        </xsl:choose>
      </xsl:attribute> 
    </xsl:element>

    <!-- xsl:element name="image">
      <xsl:attribute name="id">
        <xsl:value-of select="concat('image', @position, 'flag')" />
      </xsl:attribute>
      <xsl:attribute name="width">
        <xsl:value-of select="$width" />
      </xsl:attribute>
      <xsl:attribute name="height">
        <xsl:value-of select="$height" />
      </xsl:attribute>
      <xsl:attribute name="xlink:href">
        <xsl:value-of select="concat('images/', @name, '.png')"/>
      </xsl:attribute> 
      <xsl:attribute name="x">10</xsl:attribute>
      <xsl:attribute name="y">
        <xsl:value-of select="$height - 10"/>
      </xsl:attribute>
    </xsl:element -->

    <xsl:element name="text">
      <xsl:attribute name="id">
        <xsl:value-of select="concat('image', @position, 'Label')" />
      </xsl:attribute>
      <xsl:attribute name="name">
        <xsl:value-of select="@name" />
      </xsl:attribute>
      <xsl:attribute name="font-size">10pt</xsl:attribute>
      <xsl:attribute name="fill">black</xsl:attribute> 
      <xsl:attribute name="x">10</xsl:attribute>
      <xsl:attribute name="y">
        <xsl:value-of select="$height - 10"/>
      </xsl:attribute>
      <xsl:value-of select="@name" />
    </xsl:element>

  </xsl:element>
</xsl:template>

</xsl:stylesheet>

