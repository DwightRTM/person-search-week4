//app/actions/actions.ts

'use server'

import { revalidatePath } from 'next/cache'
import { User, userSchema } from './schemas'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'

// Seed initial data if database is empty
async function seedDatabase() {
    const count = await prisma.person.count()
    if (count === 0) {
        const seedData = [
            { name: 'John Doe', phoneNumber: '0412345678', email: 'john@example.com' },
            { name: 'Jane Smith', phoneNumber: '0423456789', email: 'jane@example.com' },
            { name: 'Alice Johnson', phoneNumber: '0434567890', email: 'alice@example.com' },
            { name: 'Bob Williams', phoneNumber: '0445678901', email: 'bob@example.com' },
            { name: 'Charlie Brown', phoneNumber: '0456789012', email: 'charlie@example.com' },
            { name: 'Emily Davis', phoneNumber: '0467890123', email: 'emily@example.com' },
            { name: 'Frank Miller', phoneNumber: '0478901234', email: 'frank@example.com' },
            { name: 'Grace Lee', phoneNumber: '0489012345', email: 'grace@example.com' },
            { name: 'Henry Moore', phoneNumber: '0490123456', email: 'henry@example.com' },
            { name: 'Isabella Young', phoneNumber: '0401234567', email: 'isabella@example.com' },
        ]

        for (const data of seedData) {
            await prisma.person.create({ data })
        }
    }
}

export async function searchUsers(query: string): Promise<User[]> {
    try {
        await seedDatabase()
        const results = await prisma.person.findMany({
            where: {
                name: {
                    startsWith: query,
                },
            },
        })
        return results.map((person: typeof results[number]) => ({
            id: person.id,
            name: person.name,
            email: person.email,
            phoneNumber: person.phoneNumber || '',
        }))
    } catch (error) {
        console.error('Search users error:', error)
        throw new Error('Failed to search users')
    }
}

export async function addUser(data: Omit<User, 'id'>): Promise<User> {
    try {
        const validatedUser = userSchema.omit({ id: true }).parse(data)
        const newPerson = await prisma.person.create({
            data: validatedUser,
        })
        return {
            id: newPerson.id,
            name: newPerson.name,
            email: newPerson.email,
            phoneNumber: newPerson.phoneNumber || '',
        }
    } catch (error) {
        console.error('Add user error:', error)
        throw new Error('Failed to add user')
    }
}

export async function deleteUser(id: string): Promise<void> {
    try {
        const person = await prisma.person.findUnique({
            where: { id },
        })
        if (!person) {
            throw new Error(`User with id ${id} not found`)
        }
        await prisma.person.delete({
            where: { id },
        })
        revalidatePath('/')
    } catch (error) {
        console.error('Delete user error:', error)
        throw new Error('Failed to delete user')
    }
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
    try {
        const person = await prisma.person.findUnique({
            where: { id },
        })
        if (!person) {
            throw new Error(`User with id ${id} not found`)
        }

        const validatedData = userSchema.omit({ id: true }).partial().parse(data)
        const updatedPerson = await prisma.person.update({
            where: { id },
            data: validatedData,
        })
        revalidatePath('/')

        return {
            id: updatedPerson.id,
            name: updatedPerson.name,
            email: updatedPerson.email,
            phoneNumber: updatedPerson.phoneNumber || '',
        }
    } catch (error) {
        console.error('Update user error:', error)
        throw new Error('Failed to update user')
    }
}

export const getUserById = cache(async (id: string) => {
    try {
        await seedDatabase()
        const person = await prisma.person.findUnique({
            where: { id },
        })
        if (!person) return null
        return {
            id: person.id,
            name: person.name,
            email: person.email,
            phoneNumber: person.phoneNumber || '',
        } as User
    } catch (error) {
        console.error('Get user by id error:', error)
        return null
    }
})
