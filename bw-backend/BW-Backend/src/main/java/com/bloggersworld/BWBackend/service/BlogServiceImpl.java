package com.bloggersworld.BWBackend.service;

import com.bloggersworld.BWBackend.DTO.BlogRequest;
import com.bloggersworld.BWBackend.DTO.EditBlogRequest;
import com.bloggersworld.BWBackend.DTO.projections.AuthorBlogsProjection;
import com.bloggersworld.BWBackend.DTO.projections.SearchAuthorProjection;
import com.bloggersworld.BWBackend.entity.Blog;
import com.bloggersworld.BWBackend.entity.Category;
import com.bloggersworld.BWBackend.entity.UserTable;
import com.bloggersworld.BWBackend.repository.BlogRepository;
import com.bloggersworld.BWBackend.repository.CategoryRepository;
import com.bloggersworld.BWBackend.repository.UserRepository;
import com.bloggersworld.BWBackend.DTO.projections.BlogProjection;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class BlogServiceImpl implements BlogService{

    private BlogRepository blogRepository;
    private CategoryRepository categoryRepository;
    private UserRepository userRepository;
    private final JwtDecoder decoder;
    public BlogServiceImpl(BlogRepository blogRepository, CategoryRepository categoryRepository, UserRepository userRepository, JwtDecoder decoder) {
        this.blogRepository = blogRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.decoder = decoder;
    }

    @Override
    public void saveBlog(BlogRequest request, HttpServletRequest servletRequest){
        String token = null;
        String authHeader = servletRequest.getHeader("Authorization");

        if(authHeader!=null){
//            String key = "accessToken";
//            Optional<String> optAuthHeader =  Arrays.stream(servletRequest.getCookies())
//                    .filter(c -> key.equals(c.getName()))
//                    .map(Cookie::getValue)
//                    .findAny();
            token=authHeader.substring(7); //removing Bearer
        }

        String username = null;

        if(token != null){
            Jwt jwtCreds = decoder.decode(token);
            username = jwtCreds.getSubject();
        }
        else{
            throw new RuntimeException("Token Invalid");
        }

        UserTable userTable = userRepository.findByEmail(username);
        Category category = categoryRepository.findByCategory(request.getCategory());
        Blog blog = Blog.builder()
                .blogtitle(request.getTitle())
                .blogcontent(request.getContent())
                .blogdesc(request.getDesc())
                .timetoread(request.getTimetoread())
                .isPublished(request.getIsPublished())
                .tags(request.getTags())
                .blogcategory(category)
                .author(userTable)
                .blogcreated(Instant.now())
                .blogupdated(Instant.now())
                .build();

        blogRepository.save(blog);

    }

    @Override
    public List<BlogProjection> findAllBlog(HttpServletRequest request, int page) {
        String authHeader = request.getHeader("Authorization");
        String username = null;
        Jwt jwtCreds = null;

        if(authHeader!= null && authHeader.startsWith("Bearer")) {
            String token = authHeader.substring(7); //removing Bearer
            jwtCreds = decoder.decode(token);
            username = jwtCreds.getSubject();
        }
        UserTable currentUser = userRepository.findByEmail(username);
        Pageable pageWithPageNo = PageRequest.of(page,10,
                                Sort.by("blogupdated").descending()
                );

        return blogRepository.findBlogPages(pageWithPageNo,currentUser).getContent();
    }

    @Override
    public List<SearchAuthorProjection> searchAuthorNames(String search) {
        return userRepository.searchAuthors(search);
    }



    @Override
    public List<BlogProjection> findAuthorsBlogs(Long authorId,int page) {
        Optional<UserTable> author = userRepository.findById(authorId);
        if(author.isEmpty()) return new ArrayList<>();
        Pageable pageable = PageRequest.of(page,10,
                Sort.by("blogupdated").descending()
                );
        return blogRepository.findByAuthor(author.get(),pageable).getContent();
    }

    @Override
    public List<BlogProjection> findBlogByCategory(Long categoryId, int page) {
        Optional<Category> category = categoryRepository.findById(categoryId);
        if(category.isEmpty()) return new ArrayList<>();

        Pageable pageable = PageRequest.of(page,10,
                Sort.by("blogupdated").descending()
        );
        return blogRepository.findByBlogcategory(category.get(),pageable).getContent();
    }

    @Override
    public BlogProjection findBlog(Long id) {
        return blogRepository.findBlogById(id);
    }

    @Override
    public List<AuthorBlogsProjection> fetchBlogReferences(Long id) {
        return blogRepository.findBlogsByAuthor(id);
    }

    @Override
    public Set<String> getTagSuggestion() {
        Pageable pageable = PageRequest.of(0,50,
                Sort.by("blogupdated").descending()
                );
        List<String> tagList =  blogRepository.getTagSuggestion(pageable).getContent();
        return new HashSet<String>(tagList);
    }

    @Override
    public List<BlogProjection> getBlogsFromTags(String tagname,int page) {
        Pageable pageable = PageRequest.of(page,10,
                Sort.by("blogupdated").descending());

        return blogRepository.findBlogByTags(tagname,pageable).getContent();
    }

    @Override
    public String editBlog(EditBlogRequest request) {
        Optional<Blog> blogOpt = blogRepository.findById(request.getId());
        Category category = categoryRepository.getByCategory(request.getCategory());
        Blog blog = blogOpt.get();
        blog.setBlogtitle(request.getTitle());
        blog.setBlogdesc(request.getDesc());
        blog.setBlogcontent(request.getContent());
        blog.setBlogcategory(category);
        blog.setBlogupdated(Instant.now());
        blog.setPublished(request.getIsPublished());
        blog.setTags(request.getTags());
        blogRepository.save(blog);
        return "Success";
    }
}
