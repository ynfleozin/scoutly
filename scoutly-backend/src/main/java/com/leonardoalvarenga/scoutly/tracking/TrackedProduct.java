package com.leonardoalvarenga.scoutly.tracking;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tracked_product")
@Getter
@NoArgsConstructor
public class TrackedProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Setter
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Setter
    @Column(nullable = false)
    private String name;

    @Setter
    @Column(nullable = false)
    private String url;

    @Setter
    @Column(name = "target_price", nullable = false)
    private BigDecimal targetPrice;

    @Column(nullable = false)
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "trackedProduct", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PriceHistory> prices = new ArrayList<>();

    public void deactivateAlert(){
        this.active = false;
    }

    public void addPriceHistory(PriceHistory history){
        this.prices.add(history);
        history.setTrackedProduct(this);
    }
}
