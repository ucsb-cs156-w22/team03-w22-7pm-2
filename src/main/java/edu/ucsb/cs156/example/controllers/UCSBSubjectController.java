package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.collections.UCSBSubjectCollection;
import edu.ucsb.cs156.example.documents.UCSBSubject;
import edu.ucsb.cs156.example.repositories.UCSBSubjectRepository;

import org.springframework.beans.factory.annotation.Autowired;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.http.ResponseEntity;
import edu.ucsb.cs156.example.entities.User;
import edu.ucsb.cs156.example.models.CurrentUser;
import edu.ucsb.cs156.example.services.CurrentUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

import javax.validation.Valid;
import java.lang.String;
import java.lang.Boolean;
import java.util.Optional;


@Api(description="UCSB Subject Information")
@RequestMapping("/api/UCSBSubjects")
@RestController
@Slf4j
public class UCSBSubjectController extends ApiController{
    public class UCSBSubjectOrError {
        String id;
        UCSBSubject sub;
        ResponseEntity<String> error;

        public UCSBSubjectOrError(String id) {
            this.id = id;
        }
    }
    @Autowired
    UCSBSubjectCollection ucsbsubjectCollection;

    @Autowired
    ObjectMapper mapper;

    @ApiOperation(value = "Get a list of UCSB subjects")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
        public Iterable<UCSBSubject> UCSBSubjectInfo() {
            Iterable<UCSBSubject> subjects = ucsbsubjectCollection.findAll();
            return subjects;
        }

    @ApiOperation(value = "Add a Subject to the collection")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBSubject postUCSBSubject(
            @ApiParam("subjectTranslation") @RequestParam String subjectTranslation,
            @ApiParam("deptCode") @RequestParam String deptCode,
            @ApiParam("collegeCode") @RequestParam String collegeCode,
            @ApiParam("subjectCode") @RequestParam String subjectCode,
            @ApiParam("relatedDeptCode") @RequestParam String relatedDeptCode,
            @ApiParam("inactive") @RequestParam Boolean inactive) {
        //loggingService.logMethod();

        UCSBSubject ucsbsubject = new UCSBSubject();
        ucsbsubject.setSubjectTranslation(subjectTranslation);
        ucsbsubject.setDeptCode(deptCode);
        ucsbsubject.setCollegeCode(collegeCode);
        ucsbsubject.setSubjectCode(subjectCode);
        ucsbsubject.setRelatedDeptCode(relatedDeptCode);
        ucsbsubject.setInactive(inactive);
        UCSBSubject savedUCSBSubject = ucsbsubjectCollection.save(ucsbsubject);
        return savedUCSBSubject;
    }

    @ApiOperation(value = "Get a UCSB Subject with given id")
    @PreAuthorize("hasRole('ROLE_ADMIN')")

    @GetMapping("")
    public ResponseEntity<String> getUCSBSubjectById(
        @ApiParam("id") @RequestParam String id) throws JsonProcessingException {
        //loggingService.logMethod();

        UCSBSubjectOrError ucsbsub_error = new UCSBSubjectOrError(id);

        ucsbsub_error = doesUCSBSubjectExist(ucsbsub_error);
        if (ucsbsub_error.error != null) {
            return ucsbsub_error.error;
        }

        String body = mapper.writeValueAsString(ucsbsub_error.sub);
        return ResponseEntity.ok().body(body);
    }

    @ApiOperation(value = "Update a single UCSBSubject")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("")
    public ResponseEntity<String> putSubjectById(
            @ApiParam("id") @RequestParam String id,
            @RequestBody @Valid UCSBSubject incomingUCSBSubject) throws JsonProcessingException {
        //loggingService.logMethod();
        
        UCSBSubjectOrError ucsbsub_error = new UCSBSubjectOrError(id);

        ucsbsub_error = doesUCSBSubjectExist(ucsbsub_error);
        if (ucsbsub_error.error != null) {
            return ucsbsub_error.error;
        }

        incomingUCSBSubject.setId(id);
        ucsbsubjectCollection.save(incomingUCSBSubject);

        String body = mapper.writeValueAsString(incomingUCSBSubject);
        return ResponseEntity.ok().body(body);
    }

        public UCSBSubjectOrError doesUCSBSubjectExist(UCSBSubjectOrError ucsbsub_error) {

            Optional<UCSBSubject> optionalUCSBSubject = ucsbsubjectCollection.findById(ucsbsub_error.id);

            if (optionalUCSBSubject.isEmpty()) {
                ucsbsub_error.error = ResponseEntity
                        .badRequest()
                        .body(String.format("ucsb subject with id %d not found", ucsbsub_error.id));
            } else {
                ucsbsub_error.sub = optionalUCSBSubject.get();
            }
            return ucsbsub_error;
        }

    @ApiOperation(value = "Delete a UCSB Subject")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public ResponseEntity<String> deleteUCSBSubject(
            @ApiParam("id") @RequestParam String id) {

        UCSBSubjectOrError ucsbsub_error = new UCSBSubjectOrError(id);

        ucsbsub_error = doesUCSBSubjectExist(ucsbsub_error);
        if (ucsbsub_error.error != null) {
            return ucsbsub_error.error;
        }

        ucsbsubjectCollection.deleteById(id);
        return ResponseEntity.ok().body(String.format("ucsb subject with id %d deleted", id));

    }

}
