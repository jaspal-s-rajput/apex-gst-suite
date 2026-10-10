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
        if (companyRepository.count() > 0) {
            return;
        }

        log.info("Seeding initial store and account for Premium Electronics...");

        // 1. Base Store (Premium Electronics)
        Company store = Company.builder()
                .legalName("Premium Electronics Retail Pvt Ltd")
                .tradeName("Premium Electronics")
                .gstin("27AAPFU0939F1ZV")
                .pan("AAPFU0939F")
                .stateCode("27")
                .stateName("Maharashtra")
                .addressLine1("Shop 101, Mega Electronics Mall, LBS Marg, Ghatkopar West")
                .city("Mumbai")
                .pincode("400086")
                .phone("+91 98765 43210")
                .email("rajputjaspalsingh@gmail.com")
                .upiId("premiumelectronics@upi")
                .bankName("HDFC Bank")
                .accountNumber("50200012345678")
                .ifscCode("HDFC0001234")
                .branchName("Ghatkopar West Branch")
                .invoicePrefix("PREM/26-27")
                .nextInvoiceSequence(101L)
                .build();
        store = companyRepository.save(store);

        // 2. Base User Account (rajputjaspalsingh@gmail.com / Jaspal@123)
        String salt = passwordService.generateSalt();
        String hash = passwordService.hashPassword("Jaspal@123", salt);

        User baseUser = User.builder()
                .company(store)
                .email("rajputjaspalsingh@gmail.com")
                .fullName("Jaspal Singh Rajput")
                .phone("+91 98765 43210")
                .passwordHash(hash)
                .salt(salt)
                .role("ADMIN")
                .isActive(true)
                .build();
        userRepository.save(baseUser);

        // 3. Parties (Customers for Premium Electronics)
        Party party1 = Party.builder()
                .company(store)
                .partyType(PartyType.CUSTOMER)
                .name("Reliance Retail Ltd")
                .gstin("27AAACR5055K1ZK")
                .pan("AAACR5055K")
                .stateCode("27")
                .stateName("Maharashtra")
                .phone("+91 91234 56789")
                .email("procurement@relianceretail.com")
                .billingAddress("Court House, Dhobi Talao, Marine Lines, Mumbai")
                .city("Mumbai")
                .pincode("400002")
                .creditPeriodDays(45)
                .creditLimit(BigDecimal.valueOf(500000))
                .openingBalance(BigDecimal.ZERO)
                .currentBalance(BigDecimal.ZERO)
                .isActive(true)
                .build();

        Party party2 = Party.builder()
                .company(store)
                .partyType(PartyType.CUSTOMER)
                .name("Infosys Technologies Ltd")
                .gstin("29AAACI4798H1ZE")
                .pan("AAACI4798H")
                .stateCode("29")
                .stateName("Karnataka")
                .phone("+91 80285 20361")
                .email("accounts@infosys.com")
                .billingAddress("Electronics City, Hosur Road, Bengaluru")
                .city("Bengaluru")
                .pincode("560100")
                .creditPeriodDays(30)
                .creditLimit(BigDecimal.valueOf(1000000))
                .openingBalance(BigDecimal.ZERO)
                .currentBalance(BigDecimal.ZERO)
                .isActive(true)
                .build();

        Party party3 = Party.builder()
                .company(store)
                .partyType(PartyType.CUSTOMER)
                .name("Sharma Retailers (Walk-in)")
                .stateCode("27")
                .stateName("Maharashtra")
                .phone("+91 98200 11223")
                .billingAddress("Shop 14, Market Yard, Pune")
                .city("Pune")
                .pincode("411037")
                .isActive(true)
                .build();

        partyRepository.saveAll(List.of(party1, party2, party3));

        // 4. Products Catalog (Tailored for Premium Electronics)
        Item item1 = Item.builder()
                .company(store)
                .name("Smart 4K UHD LED TV 55-Inch")
                .sku("ELE-TV-55")
                .barcode("8901234567890")
                .category("Home Entertainment")
                .itemType(ItemType.GOODS)
                .hsnSacCode("8528")
                .uom("PCS")
                .purchasePrice(BigDecimal.valueOf(26500.00))
                .sellingPrice(BigDecimal.valueOf(34999.00))
                .gstRate(BigDecimal.valueOf(18.00))
                .currentStock(BigDecimal.valueOf(18))
                .minStockAlert(BigDecimal.valueOf(5))
                .isActive(true)
                .build();

        Item item2 = Item.builder()
                .company(store)
                .name("Wireless Noise-Cancelling Headphones Pro")
                .sku("ELE-AUD-01")
                .barcode("8901234567891")
                .category("Audio Devices")
                .itemType(ItemType.GOODS)
                .hsnSacCode("8518")
                .uom("PCS")
                .purchasePrice(BigDecimal.valueOf(2800.00))
                .sellingPrice(BigDecimal.valueOf(4999.00))
                .gstRate(BigDecimal.valueOf(18.00))
                .currentStock(BigDecimal.valueOf(35))
                .minStockAlert(BigDecimal.valueOf(8))
                .isActive(true)
                .build();

        Item item3 = Item.builder()
                .company(store)
                .name("Fast Qi Wireless Charging Stand 15W")
                .sku("ELE-CHG-02")
                .barcode("8901234567892")
                .category("Accessories")
                .itemType(ItemType.GOODS)
                .hsnSacCode("8504")
                .uom("PCS")
                .purchasePrice(BigDecimal.valueOf(450.00))
                .sellingPrice(BigDecimal.valueOf(1299.00))
                .gstRate(BigDecimal.valueOf(18.00))
                .currentStock(BigDecimal.valueOf(4)) // Trigger low stock warning!
                .minStockAlert(BigDecimal.valueOf(10))
                .isActive(true)
                .build();

        Item item4 = Item.builder()
                .company(store)
                .name("Premium Electronics Comprehensive On-Site Warranty")
                .sku("SRV-WAR-01")
                .category("Services & Support")
                .itemType(ItemType.SERVICE)
                .hsnSacCode("9987")
                .uom("YEARS")
                .purchasePrice(BigDecimal.ZERO)
                .sellingPrice(BigDecimal.valueOf(1999.00))
                .gstRate(BigDecimal.valueOf(18.00))
                .currentStock(BigDecimal.ZERO)
                .minStockAlert(BigDecimal.ZERO)
                .isActive(true)
                .build();

        itemRepository.saveAll(List.of(item1, item2, item3, item4));

        // 5. Sample Invoices for Premium Electronics
        // Invoice 1: Intra-state sale (CGST + SGST)
        InvoiceItemRequestDto line1 = new InvoiceItemRequestDto();
        line1.setItemId(item1.getId());
        line1.setItemName(item1.getName());
        line1.setHsnSacCode(item1.getHsnSacCode());
        line1.setQuantity(BigDecimal.valueOf(1));
        line1.setUnitPrice(item1.getSellingPrice());
        line1.setGstRate(item1.getGstRate());

        InvoiceRequestDto req1 = new InvoiceRequestDto();
        req1.setCompanyId(store.getId());
        req1.setPartyId(party1.getId());
        req1.setInvoiceDate(LocalDate.now());
        req1.setDueDate(LocalDate.now().plusDays(30));
        req1.setPlaceOfSupply("27"); // Maharashtra (Intra-state)
        req1.setPaymentMode("NEFT");
        req1.setAmountPaid(BigDecimal.valueOf(20000));
        req1.setNotes("Thank you for shopping at Premium Electronics!");
        req1.setItems(List.of(line1));
        invoiceService.createInvoice(req1);

        // Invoice 2: Inter-state sale (IGST)
        InvoiceItemRequestDto line2 = new InvoiceItemRequestDto();
        line2.setItemId(item2.getId());
        line2.setItemName(item2.getName());
        line2.setHsnSacCode(item2.getHsnSacCode());
        line2.setQuantity(BigDecimal.valueOf(2));
        line2.setUnitPrice(item2.getSellingPrice());
        line2.setGstRate(item2.getGstRate());

        InvoiceRequestDto req2 = new InvoiceRequestDto();
        req2.setCompanyId(store.getId());
        req2.setPartyId(party2.getId());
        req2.setInvoiceDate(LocalDate.now());
        req2.setDueDate(LocalDate.now().plusDays(30));
        req2.setPlaceOfSupply("29"); // Karnataka (Inter-state)
        req2.setPaymentMode("UPI");
        req2.setAmountPaid(BigDecimal.ZERO);
        req2.setItems(List.of(line2));
        invoiceService.createInvoice(req2);

        log.info("Base store and account setup complete: Premium Electronics (User: rajputjaspalsingh@gmail.com)");
    }
}
