package com.simba.repository;

import com.simba.model.Order;
import com.simba.model.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBranch(Branch branch);
}
