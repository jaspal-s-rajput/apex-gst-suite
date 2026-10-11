package com.apex.gstsuite.config;

import com.apex.gstsuite.dto.InvoiceItemRequestDto;
import com.apex.gstsuite.dto.InvoiceRequestDto;
import com.apex.gstsuite.model.entity.*;
import com.apex.gstsuite.repository.CompanyRepository;
import com.apex.gstsuite.repository.ItemRepository;
import com.apex.gstsuite.repository.PartyRepository;
import com.apex.gstsuite.repository.UserRepository;
import com.apex.gstsuite.service.InvoiceService;
import com.apex.gstsuite.service.PasswordService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final CompanyRepository companyRepository;
    private final PartyRepository partyRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final InvoiceService invoiceService;
    private final PasswordService passwordService;

    public DataInitializer(CompanyRepository companyRepository,
                           PartyRepository partyRepository,
                           ItemRepository itemRepository,
                           UserRepository userRepository,
                           InvoiceService invoiceService,
                           PasswordService passwordService) {
        this.companyRepository = companyRepository;
        this.partyRepository = partyRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.invoiceService = invoiceService;
        this.passwordService = passwordService;
    }

    @Override
    public void run(String... args) {
        log.info("DataInitializer: Clean slate active. Zero pre-seeded stores or users.");
    }
}
