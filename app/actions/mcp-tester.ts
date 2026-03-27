'use server'

import { prisma } from '@/lib/prisma'

export interface MCPToolResult {
  success: boolean
  result?: unknown
  error?: string
  toolName?: string
  toolInput?: Record<string, unknown>
}

// MCP Tool implementations using Prisma directly
// This mirrors the MCP server's functionality for testing
export async function testMCPTool(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<MCPToolResult> {
  try {
    let result: unknown

    switch (toolName) {
      case 'create_person': {
        const name = toolInput.name as string
        const email = toolInput.email as string
        const phoneNumber = (toolInput.phoneNumber as string) || null

        result = await prisma.person.create({
          data: {
            name,
            email,
            phoneNumber,
          },
        })
        break
      }

      case 'read_person': {
        const id = toolInput.id as string
        result = await prisma.person.findUnique({
          where: { id },
        })
        if (!result) {
          throw new Error(`Person with ID ${id} not found`)
        }
        break
      }

      case 'read_all_people': {
        result = await prisma.person.findMany({
          orderBy: { createdAt: 'desc' },
        })
        break
      }

      case 'update_person': {
        const id = toolInput.id as string
        const updateData: Record<string, unknown> = {}

        if (toolInput.name !== undefined) updateData.name = toolInput.name
        if (toolInput.email !== undefined) updateData.email = toolInput.email
        if (toolInput.phoneNumber !== undefined) updateData.phoneNumber = toolInput.phoneNumber

        result = await prisma.person.update({
          where: { id },
          data: updateData,
        })
        break
      }

      case 'delete_person': {
        const id = toolInput.id as string
        const person = await prisma.person.delete({
          where: { id },
        })
        result = `Person ${person.name} (ID: ${person.id}) deleted successfully`
        break
      }

      case 'search_people': {
        const query = toolInput.query as string
        result = await prisma.person.findMany({
          where: {
            name: {
              contains: query,
            },
          },
        })
        break
      }

      default:
        throw new Error(`Unknown tool: ${toolName}`)
    }

    return {
      success: true,
      result,
      toolName,
      toolInput,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      error: errorMessage,
      toolName,
      toolInput,
    }
  }
}

// Direct Prisma operations for quick testing
export async function getAllPeople() {
  try {
    const people = await prisma.person.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return {
      success: true,
      result: people,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
