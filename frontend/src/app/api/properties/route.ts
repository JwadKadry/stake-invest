import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'properties.local.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const properties = JSON.parse(fileContents)

    return NextResponse.json({
      success: true,
      data: properties,
    })
  } catch (error) {
    console.error('Error reading properties file:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load properties',
      },
      { status: 500 }
    )
  }
}

