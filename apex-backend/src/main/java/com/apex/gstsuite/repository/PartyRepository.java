package com.apex.gstsuite.repository;

import com.apex.gstsuite.model.entity.Party;
import com.apex.gstsuite.model.entity.PartyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PartyRepository extends JpaRepository<Party, UUID> {
    List<Party> findByCompanyIdAndIsActiveTrue(UUID companyId);
    List<Party> findByCompanyIdAndPartyTypeAndIsActiveTrue(UUID companyId, PartyType partyType);
    List<Party> findByCompanyIdAndNameContainingIgnoreCaseAndIsActiveTrue(UUID companyId, String name);
}
