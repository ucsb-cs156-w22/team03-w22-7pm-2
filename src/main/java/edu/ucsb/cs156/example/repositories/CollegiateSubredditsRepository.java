package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.CollegiateSubreddits;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CollegiateSubredditsRepository extends CrudRepository<CollegiateSubreddits, Long> {
  Iterable<CollegiateSubreddits> findByName(String name);
  Iterable<CollegiateSubreddits> findByLocation(String location);//maybe?
  Iterable<CollegiateSubreddits> findBySubreddit(String subreddit);
}