package com.bloggersworld.BWBackend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditBlogRequest {
    private Long id;
    private String title;
    private String desc;
    private String content;
    private String category;
    private List<String> tags;
    public String timetoread;
    public Boolean isPublished;
}
