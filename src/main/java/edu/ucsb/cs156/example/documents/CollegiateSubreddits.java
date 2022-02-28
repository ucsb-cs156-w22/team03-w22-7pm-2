package edu.ucsb.cs156.example.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//import javax.persistence.GeneratedValue;
//import javax.persistence.GenerationType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "CollegiateSubreddits")
public class CollegiateSubreddits {
    @Id
    private String id;

    private String name;
    private String location;
    private String subreddit;
}
