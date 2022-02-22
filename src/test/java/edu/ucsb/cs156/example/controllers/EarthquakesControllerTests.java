package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.documents.UCSBSubject;
import edu.ucsb.cs156.example.entities.User;
import edu.ucsb.cs156.example.entities.Todo;
import edu.ucsb.cs156.example.collections.EarthquakesCollection;
import edu.ucsb.cs156.example.controllers.EarthquakesController;
import edu.ucsb.cs156.example.documents.Feature;
import edu.ucsb.cs156.example.documents.FeatureCollection;
import edu.ucsb.cs156.example.services.EarthquakeQueryService;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import static org.mockito.Mockito.doNothing;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;
import java.util.Optional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = EarthquakesController.class)
@Import(TestConfig.class)
public class EarthquakesControllerTests extends ControllerTestCase{
    
    @MockBean
    UserRepository userRepository;

    @MockBean
    EarthquakesCollection earthquakesCollection;

    @MockBean
    EarthquakeQueryService earthquakeQueryService;

    // TESTS FOR /all
    @Test
    public void api_all_not_logged_in() throws Exception
    {
        mockMvc.perform(get("/api/earthquakes/all"))
            .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_all_logged_in() throws Exception
    {
        // arrange
        Feature feature1 = new Feature();
        feature1.setType("Type Test 1");
        Feature feature2 = new Feature();
        feature2.setType("Type Test 2");

        List<Feature> expectedFeatures = new ArrayList<Feature>();
        expectedFeatures.addAll(Arrays.asList(feature1, feature2));

        when(earthquakesCollection.findAll()).thenReturn(expectedFeatures);

        // act
        MvcResult response = mockMvc.perform(get("/api/earthquakes/all"))
            .andExpect(status().isOk()).andReturn();

        // assert
        verify(earthquakesCollection, times(1)).findAll();
        String expected = mapper.writeValueAsString(expectedFeatures);
        String actual = response.getResponse().getContentAsString();
        assertEquals(expected, actual);
    }

    // TESTS FOR /purge

    @Test
    public void api_purge_not_logged_in() throws Exception
    {
        mockMvc.perform(post("/api/earthquakes/purge"))
            .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_purge_user() throws Exception
    {
        mockMvc.perform(post("/api/earthquakes/purge").with(csrf()))
            .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void api_purge_admin() throws Exception
    {

        doNothing().when(earthquakesCollection).deleteAll();

        mockMvc.perform(post("/api/earthquakes/purge").with(csrf()))
            .andExpect(status().isOk());

        verify(earthquakesCollection, times(1)).deleteAll();
    }

    // TESTS FOR /retrieve 

    @Test
    public void api_retrieve_not_logged_in() throws Exception
    {
        mockMvc.perform(post("/api/earthquakes/retrieve?distance=100&minMag=1").with(csrf()))
            .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_retrieve_user() throws Exception
    {
        mockMvc.perform(post("/api/earthquakes/retrieve?distance=100&minMag=1").with(csrf()))
            .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void api_retrieve_admin() throws Exception
    {
        String distance = "100";
        String minMag = "1";

        FeatureCollection fCol = new FeatureCollection();
        fCol.setType("Type Test 1");

        Feature f = new Feature();

        List<Feature> expectedFeatures = new ArrayList<Feature>();
        expectedFeatures.add(f);
        fCol.setFeatures(expectedFeatures);

        String fColJSON = mapper.writeValueAsString(fCol);
        when(earthquakeQueryService.getJSON(eq(distance), eq(minMag))).thenReturn(fColJSON);

        String fJSON = mapper.writeValueAsString(f);
        Feature savedFeature = mapper.readValue(fJSON, Feature.class);

        List<Feature> savedFeatures = new ArrayList<Feature>();
        savedFeatures.add(savedFeature);
        when(earthquakesCollection.saveAll(savedFeatures)).thenReturn(savedFeatures);
        
        MvcResult response = mockMvc.perform(post("/api/earthquakes/retrieve?distance=100&minMag=1").with(csrf()))
            .andExpect(status().isOk()).andReturn();

        verify(earthquakeQueryService, times(1)).getJSON(eq(distance), eq(minMag));
        verify(earthquakesCollection, times(1)).saveAll(savedFeatures);

        String savedJSON = mapper.writeValueAsString(savedFeatures);
        String actual = response.getResponse().getContentAsString();

        assertEquals(savedJSON, actual);
    }
}
