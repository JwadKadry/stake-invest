import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Property from '@/models/Property'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await connectDB()

    if (db) {
      const property = await Property.findOne({ id }).lean()

      if (property) {
        return NextResponse.json({
          success: true,
          data: property,
        })
      }
    }

    try {
      const filePath = path.join(process.cwd(), 'public', 'data', 'properties.local.json')
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const properties = JSON.parse(fileContents)
      const fallbackProperty = properties.find((p: { id: string }) => p.id === id)

      if (fallbackProperty) {
        return NextResponse.json({
          success: true,
          data: fallbackProperty,
        })
      }
    } catch (fallbackError) {
      console.error('Fallback read failed:', fallbackError)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Property not found',
      },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error fetching property:', error)

    try {
      const { id } = await params
      const filePath = path.join(process.cwd(), 'public', 'data', 'properties.local.json')
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const properties = JSON.parse(fileContents)
      const fallbackProperty = properties.find((p: { id: string }) => p.id === id)

      if (fallbackProperty) {
        return NextResponse.json({
          success: true,
          data: fallbackProperty,
        })
      }
    } catch (fallbackError) {
      console.error('Fallback read failed:', fallbackError)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load property',
      },
      { status: 500 }
    )
  }
}
