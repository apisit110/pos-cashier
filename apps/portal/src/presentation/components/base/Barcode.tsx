'use client'

import React, { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'

interface BarcodeProps {
  value: string
  format?: string
  width?: number
  height?: number
  displayValue?: boolean
}

export const Barcode: React.FC<BarcodeProps> = ({
  value,
  format = 'EAN13',
  width = 2,
  height = 100,
  displayValue = false
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        // Handle EAN13 barcode check
        const isEan13 = format === 'EAN13' || format === 'EAN8'
        const sanitizedValue = isEan13 ? value.replace(/[^0-9]/g, '') : value
        
        JsBarcode(svgRef.current, sanitizedValue, {
          format,
          width,
          height,
          displayValue,
          margin: 0,
          background: 'transparent'
        })
      } catch (e) {
        console.error('Barcode generation error:', e)
      }
    }
  }, [value, format, width, height, displayValue])

  return <svg ref={svgRef} />
}
