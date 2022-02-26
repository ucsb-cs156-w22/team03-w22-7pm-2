package edu.ucsb.cs156.example.collections;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import edu.ucsb.cs156.example.documents.CollegiateSubreddits;

@Repository
public interface CollegiateSubredditsCollection extends MongoRepository<CollegiateSubreddits, ObjectId> {
    Optional<CollegiateSubreddits> findById(String id);
    Optional<CollegiateSubreddits> findByName(String name);
    Optional<CollegiateSubreddits> findByLocation(String location);
    Optional<CollegiateSubreddits> findBySubreddit(String subreddit);
    
    Optional<CollegiateSubreddits> deleteById(String id);
    Optional<CollegiateSubreddits> deleteByName(String name);
    Optional<CollegiateSubreddits> deleteByLocation(String location);
    Optional<CollegiateSubreddits> deleteBySubreddit(String subreddit);   
}
