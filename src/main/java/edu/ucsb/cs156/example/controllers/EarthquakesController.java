package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.collections.EarthquakesCollection;
import edu.ucsb.cs156.example.documents.Feature;
import edu.ucsb.cs156.example.documents.FeatureCollection;
import edu.ucsb.cs156.example.services.EarthquakeQueryService;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.extern.slf4j.Slf4j;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@Api(description = "Earthquake info from USGS")
@RequestMapping("/api/earthquakes")
@RestController
@Slf4j
public class EarthquakesController extends ApiController{
    
    @Autowired
    EarthquakesCollection earthquakesCollection;

    @Autowired
    ObjectMapper mapper;

    @Autowired
    EarthquakeQueryService earthquakeQueryService;

    @ApiOperation(value = "List all Earthquakes")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<Feature> listAllEarthquakes(){
        Iterable<Feature> earthquakes = earthquakesCollection.findAll();
        return earthquakes;
    }

    @ApiOperation(value = "Purge all Earthquakes", notes = "Only accessible to Admins")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/purge")
    public void purgeAllEarthquakes(){
        earthquakesCollection.deleteAll();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @ApiOperation(value = "Store query from USGS Eartquake API", notes = "Only accessible to Admins")
    @PostMapping("/retrieve")
    public Iterable<Feature> getEarthquake(
        @ApiParam("distance in km, e.g. 100") @RequestParam String distance,
        @ApiParam("minimum magnitude, e.g. 2.5") @RequestParam String minMag
    ) throws JsonProcessingException {
        log.info("getEarthquakes: distance={} minMag={}", distance, minMag);
        String json = earthquakeQueryService.getJSON(distance, minMag);
        
        FeatureCollection fCol = mapper.readValue(json, FeatureCollection.class);
        earthquakesCollection.saveAll(fCol.getFeatures());

        return fCol.getFeatures();
    }

}
