<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
<xsl:output method="text" name="text"/>
<xsl:template match="data">
  <xsl:for-each select="./missionData/mandateSource/res">
    <xsl:variable name="file" select="concat('interm/sres/sres',./num,'_areas')"/>
    <xsl:result-document href="{$file}" format="text">
      <xsl:for-each select="clauses/clause/area">
        <xsl:value-of select="normalize-space(.)"/>
        <xsl:text>
        </xsl:text>
      </xsl:for-each>
    </xsl:result-document>
  </xsl:for-each>
</xsl:template>

</xsl:stylesheet>

