export const dummySavedRecords = [
    {
        id: 'r1',
        assignmentName: '자료구조 3주차',
        type: 'network',
        fileA: {
            id: '1',
            label: '학생1.cpp',
            submittedAt: '2025-04-12 10:30',
            content: [],
            similarMap: {},
        },
        nodes: [
            {
                id: '1',
                label: '학생1.cpp',
                submittedAt: '2025-04-12 10:30',
                content: [],
                similarMap: {},
            },
            {
                id: '2',
                label: '학생2.cpp',
                submittedAt: '2025-04-12 10:35',
                content: [],
                similarMap: {},
            },
        ],
        edges: [
            {
                from: '1',
                to: '2',
                similarity: 85,
                count: 2,
            },
        ],
    },
    {
        id: 'r2',
        assignmentName: '자료구조 4주차',
        type: 'pair',
        fileA: {
            id: '3',
            label: '학생3.cpp',
            submittedAt: '2025-04-19 09:50',
            content: ['int main() {', 'return 0;', '}'],
            similarMap: {
                1: ['학생4.cpp'],
                2: [],
                3: [],
            },
        },
        fileB: {
            id: '4',
            label: '학생4.cpp',
            submittedAt: '2025-04-19 09:52',
            content: ['int main() {', 'return 0;', '}'],
            similarMap: {
                1: ['학생3.cpp'],
                2: [],
                3: [],
            },
        },
    },
];
