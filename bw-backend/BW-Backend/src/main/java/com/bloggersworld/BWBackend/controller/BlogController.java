package com.bloggersworld.BWBackend.controller;

import com.bloggersworld.BWBackend.DTO.BlogRequest;
import com.bloggersworld.BWBackend.DTO.EditBlogRequest;
import com.bloggersworld.BWBackend.DTO.projections.AuthorBlogsProjection;
import com.bloggersworld.BWBackend.DTO.projections.AuthorProjection;
import com.bloggersworld.BWBackend.DTO.projections.BlogProjection;
import com.bloggersworld.BWBackend.DTO.projections.SearchAuthorProjection;
import com.bloggersworld.BWBackend.service.BlogService;
import com.bloggersworld.BWBackend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/blog")
public class BlogController {
    private final BlogService blogService;
    private final UserService userService;
    public BlogController(BlogService blogService, UserService userService) {
        this.blogService = blogService;
        this.userService = userService;
    }

    @GetMapping("/hello")
    public String hello(){
        return "hello from blog";
    }


    @PostMapping("/save")
    public ResponseEntity<String> saveBlog(@RequestBody BlogRequest request, HttpServletRequest servletRequest){
        blogService.saveBlog(request,servletRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("created");
    }

    @GetMapping("/feed/{page}")
    public List<BlogProjection> getBlogs(@PathVariable("page") int page, HttpServletRequest request){
        return blogService.findAllBlog(request,page);
    }

    @GetMapping("/search")
    public List<SearchAuthorProjection> searchAuthor(@RequestParam String search){
        return blogService.searchAuthorNames(search);
    }

    @GetMapping("/by-author")
    public List<BlogProjection> findAuthorsBlogs(@RequestParam Long authorId,@RequestParam int page){
        return blogService.findAuthorsBlogs(authorId,page);
    }

    @GetMapping("/by-category")
    public List<BlogProjection> findBlogByCategory(@RequestParam Long categoryId,@RequestParam int page){
        return blogService.findBlogByCategory(categoryId,page);
    }

    @GetMapping("get-blog/{id}")
    public BlogProjection getblog(@PathVariable("id") Long id){
        return blogService.findBlog(id);
    }

    @GetMapping("/get-author/{id}")
    public AuthorProjection getAuthor(@PathVariable("id") Long id){
        return userService.getAuthor(id);
    }

    @GetMapping("/fetch-blogreferences/{id}")
    public List<AuthorBlogsProjection> fetchBlogReferences(@PathVariable("id") Long id){
        return blogService.fetchBlogReferences(id);
    }

    @GetMapping("/get-tag-suggestion")
    public Set<String> getTagSuggestion(){
        return blogService.getTagSuggestion();
    }

    @GetMapping("/get-blogs-from-tags")
    public List<BlogProjection> getBlogsFromTags(@RequestParam String tagname, @RequestParam int page){
        return blogService.getBlogsFromTags(tagname,page);
    }

    @PostMapping("/edit-blog")
    public ResponseEntity<String> editBlog(@RequestBody EditBlogRequest request){
        String res =  blogService.editBlog(request);
        if(res.equals("Success")){
            return  ResponseEntity.status(HttpStatus.CREATED).body("Edited");
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error");
    }
}
