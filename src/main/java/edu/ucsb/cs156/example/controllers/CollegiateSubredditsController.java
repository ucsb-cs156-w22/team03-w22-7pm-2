package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.collections.CollegiateSubredditsCollection;
import edu.ucsb.cs156.example.documents.CollegiateSubreddits;
//import edu.ucsb.cs156.example.entities.CollegiateSubreddits;
import edu.ucsb.cs156.example.repositories.CollegiateSubredditsRepository;
import edu.ucsb.cs156.example.entities.User;
import edu.ucsb.cs156.example.models.CurrentUser;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Optional;

@Api(description = "Table of Collegiate Subreddits from https://github.com/karlding/college-subreddits")
@Slf4j
@RestController
@RequestMapping("/api/collegiateSubreddits")
public class CollegiateSubredditsController extends ApiController {

	public class CollegiateSubredditOrError {
        String id;
        CollegiateSubreddits reddit;
        ResponseEntity<String> error;

        public CollegiateSubredditOrError(String id) {
            this.id = id;
        }
    }

    @Autowired
    CollegiateSubredditsCollection CollegiateSubredditsCollection;

    @Autowired
    ObjectMapper mapper;

    @ApiOperation(value = "List all collegiate subreddits in the database")
    //@PreAuthorize("hasRole('ROLE_USER')")  // ah - "Allowing everyone to find all the subreddits, even if not logged in"
    @GetMapping("/all")
    public Iterable<CollegiateSubreddits> allCollegiateSubreddits() {
        //loggingService.logMethod();
        Iterable<CollegiateSubreddits> reddits = CollegiateSubredditsCollection.findAll();
        return reddits;
    }

    @ApiOperation(value = "Create a new Collegiate subreddit")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/post")
    public CollegiateSubreddits postCollegiateSubreddit(
			@ApiParam("name") @RequestParam String name,
            @ApiParam("location") @RequestParam String location,
            @ApiParam("subreddit") @RequestParam String subreddit) {
        //loggingService.logMethod();

        CollegiateSubreddits reddit = new CollegiateSubreddits();
        reddit.setName(name);
        reddit.setLocation(location);
        reddit.setSubreddit(subreddit);
        CollegiateSubreddits savedReddit = CollegiateSubredditsCollection.save(reddit);
        return savedReddit;
    }

	@ApiOperation(value = "Get Collegiate Subreddit by ID")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public ResponseEntity<String> getCollegiateSubredditById(
            @ApiParam("id") @RequestParam String id) throws JsonProcessingException {
        //loggingService.logMethod();
        CollegiateSubredditOrError cse = new CollegiateSubredditOrError(id);

        cse = doesCollegiateSubredditOrErrorExist(cse);
        if (cse.error != null) {
            return cse.error;
        }

        String body = mapper.writeValueAsString(cse.reddit);
        return ResponseEntity.ok().body(body);
    }

	@ApiOperation(value = "Update Collegiate Subreddit by ID)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("")
    public ResponseEntity<String> putCollegiateSubredditById(
            @ApiParam("id") @RequestParam String id,
            @RequestBody @Valid CollegiateSubreddits incomingCollegiateSubreddit) throws JsonProcessingException {
        //loggingService.logMethod();

        CollegiateSubredditOrError cse = new CollegiateSubredditOrError(id);

        cse = doesCollegiateSubredditOrErrorExist(cse);
        if (cse.error != null) {
            return cse.error;
        }

        incomingCollegiateSubreddit.setId(id);
        CollegiateSubredditsCollection.save(incomingCollegiateSubreddit);

        String body = mapper.writeValueAsString(incomingCollegiateSubreddit);
        return ResponseEntity.ok().body(body);
    }

	@ApiOperation(value = "Delete a Collegiate Subreddit by ID")
	@PreAuthorize("hasRole('ROLE_USER')")
	@DeleteMapping("")
	public ResponseEntity<String> deleteCollegiateSubredditbyID(
		@ApiParam("id") @RequestParam String id) {
	//loggingService.logMethod();

	CollegiateSubredditOrError cse = new CollegiateSubredditOrError(id);

	cse = doesCollegiateSubredditOrErrorExist(cse);
	if (cse.error != null) {
		return cse.error;
	}

	CollegiateSubredditsCollection.deleteById(id);

	return ResponseEntity.ok().body(String.format("CollegiateSubreddit with id " + id + " deleted"));

}

	public CollegiateSubredditOrError doesCollegiateSubredditOrErrorExist (CollegiateSubredditOrError cse)
	{
		Optional<CollegiateSubreddits> optionalCollegiateSubreddit = CollegiateSubredditsCollection.findById(cse.id);

		if(optionalCollegiateSubreddit.isEmpty())
		{
			cse.error = ResponseEntity
					.badRequest()
					.body(String.format("CollegiateSubreddit with id "+ cse.id + " not found"));
		}
		else
			cse.reddit = optionalCollegiateSubreddit.get();
		return cse;
    }
} 