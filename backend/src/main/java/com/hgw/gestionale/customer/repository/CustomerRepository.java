package com.hgw.gestionale.customer.repository;

import com.hgw.gestionale.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    @Query("SELECT c FROM Customer c WHERE " +
           "(:nome IS NULL OR LOWER(c.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
           "(:cognome IS NULL OR LOWER(c.cognome) LIKE LOWER(CONCAT('%', :cognome, '%'))) AND " +
           "(:telefono IS NULL OR c.telefono LIKE CONCAT('%', :telefono, '%')) AND " +
           "(:email IS NULL OR LOWER(c.email) LIKE LOWER(CONCAT('%', :email, '%')))")
    List<Customer> search(
            @Param("nome") String nome,
            @Param("cognome") String cognome,
            @Param("telefono") String telefono,
            @Param("email") String email
    );
}
