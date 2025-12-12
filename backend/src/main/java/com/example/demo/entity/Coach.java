package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "coaches")
public class Coach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String licensePlate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CoachType type;

    @Column(nullable = false)
    private Integer totalSeats;

    private String description;

    @OneToMany(mappedBy = "coach", cascade = CascadeType.ALL)
    private List<Trip> trips;

    public Coach() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
    public CoachType getType() { return type; }
    public void setType(CoachType type) { this.type = type; }
    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<Trip> getTrips() { return trips; }
    public void setTrips(List<Trip> trips) { this.trips = trips; }

    public enum CoachType { VIP, STANDARD }

    public static CoachBuilder builder() { return new CoachBuilder(); }

    public static class CoachBuilder {
        private String licensePlate;
        private CoachType type;
        private Integer totalSeats;
        private String description;

        public CoachBuilder licensePlate(String licensePlate) { this.licensePlate = licensePlate; return this; }
        public CoachBuilder type(CoachType type) { this.type = type; return this; }
        public CoachBuilder totalSeats(Integer totalSeats) { this.totalSeats = totalSeats; return this; }
        public CoachBuilder description(String description) { this.description = description; return this; }

        public Coach build() {
            Coach coach = new Coach();
            coach.licensePlate = this.licensePlate;
            coach.type = this.type;
            coach.totalSeats = this.totalSeats;
            coach.description = this.description;
            return coach;
        }
    }
}
