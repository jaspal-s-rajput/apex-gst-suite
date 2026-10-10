package com.apex.gstsuite.controller;

import com.apex.gstsuite.model.entity.Party;
import com.apex.gstsuite.model.entity.PartyType;
import com.apex.gstsuite.service.CompanyService;
import com.apex.gstsuite.service.PartyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/parties")
public class PartyController {

    private final PartyService partyService;
    private final CompanyService companyService;

    public PartyController(PartyService partyService, CompanyService companyService) {
        this.partyService = partyService;
        this.companyService = companyService;
    }

    @GetMapping
    public ResponseEntity<List<Party>> getParties(
            @RequestParam(required = false) UUID companyId,
            @RequestParam(required = false) PartyType type,
            @RequestParam(required = false) String search) {
        UUID effectiveCompanyId = companyId != null ? companyId : companyService.getOrCreateDefaultCompany().getId();
        return ResponseEntity.ok(partyService.getParties(effectiveCompanyId, type, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Party> getPartyById(@PathVariable UUID id) {
        return partyService.getParty(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Party> createParty(
            @RequestParam(required = false) UUID companyId,
            @Valid @RequestBody Party party) {
        UUID effectiveCompanyId = companyId != null ? companyId : companyService.getOrCreateDefaultCompany().getId();
        return ResponseEntity.ok(partyService.saveParty(effectiveCompanyId, party));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParty(@PathVariable UUID id) {
        partyService.deleteParty(id);
        return ResponseEntity.noContent().build();
    }
}
