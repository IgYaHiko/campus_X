import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { students } from "../../db/schema/students";
import { ApiError } from "../../utils/ApiError";
import { UpdateProfileInput } from "../../validators/student/student.validator";



export async function getMyProfile(studentId: number) {
    const [student] = await db
    .select({
      id: students.id,
      name: students.name,
      email: students.email,
      phone: students.phone,
      branch: students.branch,
      year: students.year,
      rollNumber: students.rollNumber,
    })
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);


    if(!student) {
      throw ApiError.notFound("Student profile not found");
    }

    return student;
}


export async function updateMyProfile(studentId: number, input: UpdateProfileInput) {
    if(input.email) {
        const [existing] = await db.
        select({
            id: students.id
        })
        .from(students)
        .where(eq(students.email, input.email))
        .limit(1);


    if (existing && existing.id !== studentId) {
      throw ApiError.badRequest("Email is already in use by another account");
         }
    }

    // Update the student
  await db
    .update(students)
    .set({
      ...(input.name && { name: input.name }),
      ...(input.email && { email: input.email }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.branch !== undefined && { branch: input.branch }),
      ...(input.year !== undefined && { year: input.year }),
    })
    .where(eq(students.id, studentId));
    return getMyProfile(studentId)
}