import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function ProjectOverview() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Person Search is a full-stack application with complete CRUD functionality for managing person records.
        </p>
        <p className="mb-4">
          Built with Next.js 16, React 19, TypeScript, and Prisma ORM, this application demonstrates 
          modern web development practices with server-side processing and real-time data management.
        </p>
        <p>
          Features include search functionality, CRUD operations, MCP server integration, 
          and a responsive user interface with dark mode support.
        </p>
      </CardContent>
    </Card>
  )
}

function DeveloperInfo() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Developer</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">Dwight Mongaya</code>
        </p>
      </CardContent>
    </Card>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">About Person Search</h1>
        <ProjectOverview />
        <DeveloperInfo />
        <Button asChild variant="link" className="mt-4">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
      </main>
    </div>
  )
}

