package edu.ucsb.cs156.example.collections;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import edu.ucsb.cs156.example.documents.UCSBSubject;

@Repository
public interface UCSBSubjectCollection extends MongoRepository<UCSBSubject, ObjectId> {
  Optional<UCSBSubject> findBySubjectCode(String subjectCode);
  Optional<UCSBSubject> findById(String id);
  Optional<UCSBSubject> deleteById(String id);
}