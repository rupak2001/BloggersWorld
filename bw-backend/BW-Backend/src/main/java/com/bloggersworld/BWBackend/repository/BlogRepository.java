package com.bloggersworld.BWBackend.repository;

import com.bloggersworld.BWBackend.DTO.projections.AuthorBlogsProjection;
import com.bloggersworld.BWBackend.DTO.projections.SearchAuthorProjection;
import com.bloggersworld.BWBackend.entity.Blog;
import com.bloggersworld.BWBackend.entity.Category;
import com.bloggersworld.BWBackend.entity.UserTable;
import com.bloggersworld.BWBackend.DTO.projections.BlogProjection;
import org.hibernate.query.spi.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog,Long> {

    @Query("Select b from Blog b where b.author != ?1 AND b.isPublished = true")
    Page<BlogProjection> findBlogPages(Pageable pageable, UserTable user);

    @Query("Select b from Blog b where b.author = ?1 AND b.isPublished = true")
    Page<BlogProjection> findByAuthor(UserTable author,Pageable pageable);

    @Query("Select b from Blog b where b.blogcategory = ?1 AND b.isPublished = true")
    Page<BlogProjection> findByBlogcategory(Category category, Pageable pageable);

    @Query("Select b from Blog b where id = ?1")
    BlogProjection findBlogById(Long id);

    @Query("Select b from Blog b where b.author.id = ?1 AND b.isPublished = true ORDER BY b.blogupdated DESC")
    List<AuthorBlogsProjection> findBlogsByAuthor(Long id);

    @Query("Select b.tags from Blog b INNER JOIN b.tags")
    Page<String> getTagSuggestion(Pageable pageable);

    Page<BlogProjection> findBlogByTags(String tagname,Pageable pageable);


    List<AuthorBlogsProjection> getBlogByAuthorIdOrderByBlogupdatedDesc(Long id);
}
