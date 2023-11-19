package com.bloggersworld.BWBackend.service;

import com.bloggersworld.BWBackend.DTO.BlogRequest;
import com.bloggersworld.BWBackend.DTO.EditBlogRequest;
import com.bloggersworld.BWBackend.DTO.projections.AuthorBlogsProjection;
import com.bloggersworld.BWBackend.DTO.projections.BlogProjection;
import com.bloggersworld.BWBackend.DTO.projections.SearchAuthorProjection;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface BlogService {
    void saveBlog(BlogRequest request, HttpServletRequest servletRequest);

    List<BlogProjection> findAllBlog(HttpServletRequest request, int page);

    List<SearchAuthorProjection> searchAuthorNames(String search);


    List<BlogProjection> findAuthorsBlogs(Long authorId,int page);

    List<BlogProjection> findBlogByCategory(Long categoryId, int page);

    BlogProjection findBlog(Long id);

    List<AuthorBlogsProjection> fetchBlogReferences(Long id);

    Set<String> getTagSuggestion();

    List<BlogProjection> getBlogsFromTags(String tagname,int page);

    String editBlog(EditBlogRequest request);
}
