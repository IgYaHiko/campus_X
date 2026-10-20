import { asc } from "drizzle-orm";
import { db } from "../../db/client";
import { tags } from "../../db/schema/tags";
import { TagListItem } from "../../dto/tags/tag.dto";

export async function listTags(): Promise<TagListItem[]> {
    
    const row = await db
    .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
    })
    .from(tags)
    .orderBy(asc(tags.name));
    return row;
}