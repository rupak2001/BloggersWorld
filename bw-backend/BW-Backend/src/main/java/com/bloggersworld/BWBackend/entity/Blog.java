package com.bloggersworld.BWBackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

//TODO: add time to read column
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String blogtitle;

    @Column(nullable = false)
    private String blogdesc;

    @Column(nullable = false)
    private String blogcontent;

    @Column(nullable = false)
    private String timetoread;

    private boolean isPublished;

    @ElementCollection(targetClass = String.class,fetch = FetchType.EAGER)
    private List<String> tags = new ArrayList<>();

    private Instant blogcreated;
    private Instant blogupdated;

    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name = "blogtocategory",referencedColumnName = "id")
    private Category blogcategory;

    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name = "usertoblog",referencedColumnName = "id")
    private UserTable author;
}
