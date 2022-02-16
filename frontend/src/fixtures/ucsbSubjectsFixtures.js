const ucsbSubjectsFixtures = {
    oneSubject: {
        "id": 1,
        "subjectCode": "ANTH",
        "subjectTranslation": "Anthropology",
        "deptCode": "ANTH",
        "collegeCode": "L&S",
        "relatedDeptCode": "ANTH",
        "inactive": false
    },
    threeSubjects: [
        {
            "id": 1,
            "subjectCode": "ANTH",
            "subjectTranslation": "Anthropology",
            "deptCode": "ANTH",
            "collegeCode": "L&S",
            "relatedDeptCode": "ANTH",
            "inactive": false
        },
        {
            "id": 2,
            "subjectCode": "CMPSC",
            "subjectTranslation": "Computer Science",
            "deptCode": "CMPSC",
            "collegeCode": "COE",
            "relatedDeptCode": "CMPSC",
            "inactive": false
        },
        {
            "id": 3,
            "subjectCode": "PHIL",
            "subjectTranslation": "Philosophy",
            "deptCode": "PHIL",
            "collegeCode": "L&S",
            "relatedDeptCode": "PHIL",
            "inactive": true
        }
    ]
};


export { ucsbSubjectsFixtures };