package edu.ucsb.cs156.example.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "UCSBSubjects")
public class UCSBSubject {
    @Id
    private long id;
    private String subjectCode;
    private String subjectTranslation;
    private String deptCode;
    private String collegeCode;
    private String relatedDeptCode;
    private boolean inactive;
}
