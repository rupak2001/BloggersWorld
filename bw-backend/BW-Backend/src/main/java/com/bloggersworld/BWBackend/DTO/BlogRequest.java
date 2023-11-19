package com.bloggersworld.BWBackend.DTO;

import com.bloggersworld.BWBackend.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogRequest {
    private String title;
    private String desc;
    private String content;
    private String category;
    private List<String> tags;
    public String timetoread;
    public Boolean isPublished;
}
