<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="text"/>

<xsl:variable name="newline" select="'&lt;br&gt;'"/>

<xsl:template match="data">
  <xsl:for-each select="//personnel//*[not(*)]">
    <xsl:value-of select="concat(@desc, ':~', normalize-space(.))"/>
    <xsl:text>
    </xsl:text>
  </xsl:for-each>
</xsl:template>

</xsl:stylesheet>
