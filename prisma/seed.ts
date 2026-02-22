import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('password123', 10)

    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@tensorarena.dev' },
        update: { name: 'Ava Matheson', role: 'TEACHER' },
        create: {
            email: 'teacher@tensorarena.dev',
            name: 'Ava Matheson',
            password,
            role: 'TEACHER',
        },
    })

    const mockTeachers = [
        { name: "John Smith", email: "john.smith@school.edu" },
        { name: "Sarah Connor", email: "sarah.connor@school.edu" },
        { name: "Alan Turing", email: "aturing@school.edu" },
    ]

    await Promise.all(
        mockTeachers.map((t) =>
            prisma.user.upsert({
                where: { email: t.email },
                update: { name: t.name, role: "TEACHER", password },
                create: {
                    email: t.email,
                    name: t.name,
                    password,
                    role: "TEACHER",
                },
            })
        )
    )

    const students = await Promise.all(
        Array.from({ length: 10 }).map((_, index) =>
            prisma.user.upsert({
                where: { email: `student${index + 1}@tensorarena.dev` },
                update: { name: `Student ${index + 1}`, role: 'STUDENT' },
                create: {
                    email: `student${index + 1}@tensorarena.dev`,
                    name: `Student ${index + 1}`,
                    password,
                    role: 'STUDENT',
                },
            })
        )
    )

    const grade = await prisma.grade.upsert({
        where: { name: '10th Grade' },
        update: {},
        create: { name: '10th Grade' },
    })

    const division = await prisma.division.upsert({
        where: { gradeId_name: { gradeId: grade.id, name: 'A' } },
        update: {},
        create: { name: 'A', gradeId: grade.id },
    })

    const subject = await prisma.subject.upsert({
        where: { name: 'Mathematics' },
        update: {},
        create: { name: 'Mathematics' },
    })

    const classroom = await prisma.classroom.upsert({
        where: {
            teacherId_divisionId_subjectId: {
                teacherId: teacher.id,
                divisionId: division.id,
                subjectId: subject.id,
            },
        },
        update: {},
        create: {
            teacherId: teacher.id,
            divisionId: division.id,
            subjectId: subject.id,
        },
    })

    await Promise.all(
        students.map((student) =>
            prisma.studentEnrollment.upsert({
                where: {
                    studentId_divisionId: {
                        studentId: student.id,
                        divisionId: division.id,
                    },
                },
                update: {},
                create: {
                    studentId: student.id,
                    divisionId: division.id,
                },
            })
        )
    )

    console.log({
        teacher: teacher.email,
        classroom: `${grade.name} ${division.name} - ${subject.name}`,
        students: students.length,
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
