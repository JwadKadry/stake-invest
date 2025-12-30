import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const filePath = path.join(process.cwd(), 'public', 'data', 'properties.local.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const properties = JSON.parse(fileContents)
    const property = properties.find((p: { id: string }) => p.id === id)

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: property,
    })
  } catch (error) {
    console.error('Error reading property file:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load property',
      },
      { status: 500 }
    )
  }
}

