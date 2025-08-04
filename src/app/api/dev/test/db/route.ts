import { NextRequest, NextResponse } from "next/server"
import getClientPromise from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log('Testing MongoDB connection...')

    const client = await getClientPromise()
    console.log('Client obtained successfully')

    // Test the connection
    const db = client.db()
    const result = await db.admin().ping()
    console.log('MongoDB ping successful:', result)

    // Test a simple query
    const collections = await db.listCollections().toArray()
    console.log('Collections count:', collections.length)

    return NextResponse.json({
      status: 'success',
      message: 'MongoDB connection successful',
      ping: result,
      collectionsCount: collections.length,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGODB_URI,
        mongoUriPreview: process.env.MONGODB_URI ?
          process.env.MONGODB_URI.substring(0, 20) + '...' : 'missing'
      }
    })
  } catch (error) {
    console.error('MongoDB connection test failed:', error)

    return NextResponse.json({
      status: 'error',
      message: 'MongoDB connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGODB_URI,
        mongoUriPreview: process.env.MONGODB_URI ?
          process.env.MONGODB_URI.substring(0, 20) + '...' : 'missing'
      }
    }, { status: 500 })
  }
}
