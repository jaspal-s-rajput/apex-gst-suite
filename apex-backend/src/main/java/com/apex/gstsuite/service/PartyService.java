package com.apex.gstsuite.service;

import com.apex.gstsuite.model.entity.Company;
import com.apex.gstsuite.model.entity.Party;
import com.apex.gstsuite.model.entity.PartyType;
import com.apex.gstsuite.repository.PartyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PartyService {

    private final PartyRepository partyRepository;
    private final CompanyService companyService;
    private final GstinValidatorService gstinValidatorService;

    public PartyService(PartyRepository partyRepository,
                        CompanyService companyService,
                        GstinValidatorService gstinValidatorService) {
        this.partyRepository = partyRepository;
        this.companyService = companyService;
        this.gstinValidatorService = gstinValidatorService;
    }

    @Transactional(readOnly = true)
    public List<Party> getParties(UUID companyId, PartyType partyType, String search) {
        if (search != null && !search.isBlank()) {
            return partyRepository.findByCompanyIdAndNameContainingIgnoreCaseAndIsActiveTrue(companyId, search.trim());
        }
        if (partyType != null) {
            return partyRepository.findByCompanyIdAndPartyTypeAndIsActiveTrue(companyId, partyType);
        }
        return partyRepository.findByCompanyIdAndIsActiveTrue(companyId);
    }

    @Transactional(readOnly = true)
    public Optional<Party> getParty(UUID id) {
        return partyRepository.findById(id);
    }

    @Transactional
    public Party saveParty(UUID companyId, Party party) {
        Company company = companyService.getCompany(companyId)
                .orElseGet(companyService::getOrCreateDefaultCompany);
        party.setCompany(company);

        if (party.getGstin() != null && !party.getGstin().isBlank()) {
            String cleanGstin = party.getGstin().trim().toUpperCase();
            party.setGstin(cleanGstin);
            String stateCode = gstinValidatorService.extractStateCode(cleanGstin);
            if (stateCode != null) {
                party.setStateCode(stateCode);
                party.setStateName(gstinValidatorService.getStateName(stateCode));
            }
            if (cleanGstin.length() >= 12) {
                party.setPan(cleanGstin.substring(2, 12));
            }
        }

        return partyRepository.save(party);
    }

    @Transactional
    public void deleteParty(UUID id) {
        partyRepository.findById(id).ifPresent(p -> {
            p.setIsActive(false);
            partyRepository.save(p);
        });
    }
}
