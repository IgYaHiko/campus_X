export interface CategoryListItem {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    defaultDepartmentId: number | null;
    defaultDepartmentName: string | null;
}