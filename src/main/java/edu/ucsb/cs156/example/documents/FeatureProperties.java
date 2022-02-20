package edu.ucsb.cs156.example.documents;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class FeatureProperties {
    @Id
    private String _id;

    private float mag;
    private String place;
    private int time;
    private int updated;
    private String url;
    private String detail;
    private int felt;
    private int cdi;
    private String status;
    private int tsunami;
    private int sig;
    private String net;
    private String code;
    private String ids;
    private String sources;
    private String types;
    private int nst;
    private float dmin;
    private float rms;
    private int gap;
    private String magType;
    private String type;
    private String title;
}
