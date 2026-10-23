import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { students } from "../../db/schema/students";
import { LoginSchemaInput } from "../../validators/auth/auth.validator";
import { ApiError } from "../../utils/ApiError";
import { comparePassword, generateToken } from "../../utils/auth";
import { JwtPayload } from "../../types/auth.types";
import { staff } from "../../db/schema/staff";

export async function login(input: LoginSchemaInput) {
    //check student table 
    const [student] = await db.select().from(students).where(eq(students.email, input.email)).limit(1);

    if(student) {
        if(!student.passwordHash) throw ApiError.badRequest("Please Login with Google");

        const isValid = await comparePassword(input.password, student.passwordHash);
        if(!isValid) throw ApiError.unauthorized("Invalid credentials");

        const payload: JwtPayload = {sub: student.id, role: "student", email: student.email, name: student.name};

        return {
            token: generateToken(payload),
            user: payload
        };
    }

    // check staff 
    const [staffMember] = await db
    .select()
    .from(staff)
    .where(eq(staff.email, input.email))
    .limit(1);

    if(staffMember) {
        if(!staffMember.passwordHash) {
            throw ApiError.badRequest("Please login with Google");
        }
        const isValid = await comparePassword(input.password, staffMember.passwordHash)

        if(!isValid) throw ApiError.unauthorized("Invalid credentials");

        const role = staffMember.role === "admin" ? "admin" : "staff";

        const payload: JwtPayload = {
            sub: staffMember.id,
            role,
            email: staffMember.email,
            name: staffMember.name
        };

        return {
            token: generateToken(payload),
            user: payload
        };
    }
    throw ApiError.unauthorized("Invalid credentials");
}