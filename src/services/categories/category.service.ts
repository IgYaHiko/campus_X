import { asc, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { categories } from "../../db/schema/categories";
import { departments } from "../../db/schema/department";
import { CategoryListItem } from "../../dto/categories/categories.dto";

export async function listCategories(): Promise<CategoryListItem[]> {

    // fetch row from category schema
    const row = await db
    .select({
        id: categories.id,
        slug: categories.slug,
        name: categories.name,
        description: categories.description,
        defaultDepartmentId: categories.defaultDepartmentId,
        defaultDepartmentName: departments.name,
        isActive: categories.isActive,
    })
    .from(categories)
    .leftJoin(
        departments,
        eq(departments.id, categories.defaultDepartmentId)
    )
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.name))



    return row.map((r) => ( {
        id: r.id,
        slug: r.slug,
        name: r.name,
        description: r.description,
        defaultDepartmentId: r.defaultDepartmentId,
        defaultDepartmentName: r.defaultDepartmentName,
    }))
}


// find category by slug
export async function findCategoryBySlug(slug: string) {
  const [row] = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      defaultDepartmentId: categories.defaultDepartmentId,
      isActive: categories.isActive,
    })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  return row ?? null;
}