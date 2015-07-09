<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="text"/>

<xsl:template match="data/mission">
  <xsl:for-each select="*[not(*)]">
    <xsl:if test="normalize-space(@desc) != ''">
<xsl:text>
</xsl:text>
<xsl:value-of select="concat(normalize-space(@desc), ':  ', normalize-space(.))"/>
    </xsl:if>
  </xsl:for-each>
  <xsl:for-each select="./*[not(name() = 'finances') and not(name() = 'personnel')]//*[not(*)]">
    <xsl:if test="normalize-space(@desc) != ''">
<xsl:text>
</xsl:text>
<xsl:value-of select="concat(normalize-space(@desc), ':  ', normalize-space(.))"/>
    </xsl:if>
  </xsl:for-each>
</xsl:template>

</xsl:stylesheet>
