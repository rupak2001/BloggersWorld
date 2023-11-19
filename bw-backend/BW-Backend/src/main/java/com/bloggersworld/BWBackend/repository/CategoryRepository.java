package com.bloggersworld.BWBackend.repository;

import com.bloggersworld.BWBackend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {
    Category findByCategory(String category);

    Category getByCategory(String category);
}
