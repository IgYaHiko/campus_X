export interface ComplaintListItem {
    id: number;
    title: string;
    description: string;
    location: string;
    building: string | null;
    priority: string;
    status: string;
    createdAt: Date;


    student: {
        id: number;
        email: string;
        name: string;
        rollNumber: string;
        
    };

    category: {
        id: number;
        name: string;
    };

    department: {
        id: number;
        name: string;
    } | null;

    assignedStaff: {
        id: number;
        name: string;
    }  | null;

}