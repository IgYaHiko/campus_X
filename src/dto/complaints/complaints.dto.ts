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


export interface ComplaintComment {
    id: number;
    body: string;
    commenterType: "student" | "staff";
    authorName: string;
    authorId: number;
    createdAt: string;
}


export interface ComplaintStatusChange {
    id: number;
    oldStatus: string | null;
    newStatus: string;
    changedByName: string | null;
    changedById: number | null;
    note: string | null;
    changedAt: string;
}


export interface ComplaintTag {
  id: number;
  slug: string;  
  name: string;
  color: string;
}


export interface ComplaintDetail extends ComplaintListItem {
  resolutionNote: string | null;
  comments: ComplaintComment[];
  statusHistory: ComplaintStatusChange[];
  tags: ComplaintTag[];
}


