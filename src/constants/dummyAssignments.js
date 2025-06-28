export const dummyAssignments = [
    {
        assignmentId: '001',
        nodes: [
            { id: '1', label: 'Student A', submittedAt: '2025-03-01 12:00' },
            { id: '2', label: 'Student B', submittedAt: '2025-03-01 12:05' },
        ],
        edges: [{ from: '1', to: '2', similarity: 80 }],
    },
    {
        assignmentId: '002',
        nodes: [
            { id: '1', label: 'Student A', submittedAt: '2025-03-08 12:00' },
            { id: '2', label: 'Student B', submittedAt: '2025-03-08 12:05' },
            { id: '3', label: 'Student C', submittedAt: '2025-03-08 12:06' },
        ],
        edges: [
            { from: '1', to: '2', similarity: 90 },
            { from: '2', to: '3', similarity: 70 },
        ],
    },
    {
        assignmentId: '003',
        nodes: [
            { id: '1', label: 'Student A', submittedAt: '2025-03-15 12:00' },
            { id: '3', label: 'Student C', submittedAt: '2025-03-15 12:06' },
        ],
        edges: [{ from: '1', to: '3', similarity: 85 }],
    },
];
