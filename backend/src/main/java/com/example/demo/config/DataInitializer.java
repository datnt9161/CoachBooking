package com.example.demo.config;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.entity.Coach;
import com.example.demo.entity.Route;
import com.example.demo.entity.Seat;
import com.example.demo.entity.Trip;
import com.example.demo.entity.User;
import com.example.demo.repository.CoachRepository;
import com.example.demo.repository.RouteRepository;
import com.example.demo.repository.SeatRepository;
import com.example.demo.repository.TripRepository;
import com.example.demo.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RouteRepository routeRepository;
    private final CoachRepository coachRepository;
    private final TripRepository tripRepository;
    private final SeatRepository seatRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, RouteRepository routeRepository,
            CoachRepository coachRepository, TripRepository tripRepository,
            SeatRepository seatRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.routeRepository = routeRepository;
        this.coachRepository = coachRepository;
        this.tripRepository = tripRepository;
        this.seatRepository = seatRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        createUsers();
        if (routeRepository.count() == 0) {
            createSampleData();
        }
        System.out.println("✅ Initialization completed!");
    }

    private void createUsers() {
        if (!userRepository.existsByEmail("admin@coachbooking.com")) {
            User admin = User.builder()
                    .fullName("Administrator")
                    .email("admin@coachbooking.com")
                    .phone("0900000000")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("👤 Admin: admin@coachbooking.com / admin123");
        }

        if (!userRepository.existsByEmail("test@example.com")) {
            User user = User.builder()
                    .fullName("Nguyễn Văn A")
                    .email("test@example.com")
                    .phone("0123456789")
                    .password(passwordEncoder.encode("123456"))
                    .role(User.Role.CUSTOMER)
                    .build();
            userRepository.save(user);
            System.out.println("👤 User: test@example.com / 123456");
        }
    }

    private void createSampleData() {
        System.out.println("🚌 Creating sample data...");

        // Create Routes
        List<Route> routes = new ArrayList<>();
        String[][] routeData = {
            {"Hà Nội", "Hải Phòng", "120", "150"},
            {"Hà Nội", "Nam Định", "90", "120"},
            {"Hà Nội", "Ninh Bình", "100", "130"},
            {"Hà Nội", "Thanh Hóa", "150", "180"},
            {"Hà Nội", "Nghệ An", "300", "360"},
            {"TP.HCM", "Vũng Tàu", "125", "150"},
            {"TP.HCM", "Đà Lạt", "310", "420"},
            {"TP.HCM", "Nha Trang", "450", "540"},
            {"TP.HCM", "Cần Thơ", "170", "210"},
            {"TP.HCM", "Phan Thiết", "200", "240"},
            {"Đà Nẵng", "Huế", "100", "150"},
            {"Đà Nẵng", "Quảng Ngãi", "130", "180"},
            {"Đà Nẵng", "Quy Nhơn", "300", "360"},
        };

        for (String[] r : routeData) {
            Route route = Route.builder()
                    .departure(r[0])
                    .destination(r[1])
                    .distance(Double.parseDouble(r[2]))
                    .estimatedDuration(Integer.parseInt(r[3]))
                    .build();
            routes.add(routeRepository.save(route));
        }
        System.out.println("📍 Created " + routes.size() + " routes");

        // Create Coaches
        List<Coach> coaches = new ArrayList<>();
        String[][] coachData = {
            {"29A-12345", "VIP", "34", "Xe giường nằm cao cấp"},
            {"29A-12346", "VIP", "34", "Xe giường nằm VIP"},
            {"29A-12347", "STANDARD", "45", "Xe ghế ngồi"},
            {"29A-12348", "STANDARD", "45", "Xe ghế ngồi tiêu chuẩn"},
            {"30A-11111", "VIP", "34", "Xe Limousine"},
            {"30A-22222", "VIP", "40", "Xe giường nằm"},
            {"51A-33333", "STANDARD", "45", "Xe ghế ngồi"},
            {"51A-44444", "VIP", "34", "Xe VIP cabin đôi"},
            {"51A-55555", "STANDARD", "50", "Xe ghế ngồi lớn"},
            {"43A-66666", "VIP", "34", "Xe giường nằm Đà Nẵng"},
        };

        for (String[] c : coachData) {
            Coach coach = Coach.builder()
                    .licensePlate(c[0])
                    .type(Coach.CoachType.valueOf(c[1]))
                    .totalSeats(Integer.parseInt(c[2]))
                    .description(c[3])
                    .build();
            coaches.add(coachRepository.save(coach));
        }
        System.out.println("🚌 Created " + coaches.size() + " coaches");

        // Create Trips for next 30 days
        LocalDateTime now = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        int tripCount = 0;
        int[] hours = {6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22};
        BigDecimal[] prices = {
            new BigDecimal("150000"), new BigDecimal("180000"), new BigDecimal("200000"),
            new BigDecimal("250000"), new BigDecimal("300000"), new BigDecimal("350000")
        };

        for (int day = 0; day < 30; day++) {
            LocalDateTime date = now.plusDays(day);
            
            for (Route route : routes) {
                // 2-4 trips per route per day
                int tripsPerDay = 2 + (int)(Math.random() * 3);
                
                for (int t = 0; t < tripsPerDay; t++) {
                    Coach coach = coaches.get((int)(Math.random() * coaches.size()));
                    int hour = hours[(int)(Math.random() * hours.length)];
                    int minute = (int)(Math.random() * 4) * 15; // 0, 15, 30, 45
                    
                    LocalDateTime departure = date.withHour(hour).withMinute(minute);
                    LocalDateTime arrival = departure.plusMinutes(route.getEstimatedDuration());
                    
                    BigDecimal price = prices[(int)(Math.random() * prices.length)];
                    if (coach.getType() == Coach.CoachType.VIP) {
                        price = price.multiply(new BigDecimal("1.5"));
                    }

                    Trip trip = Trip.builder()
                            .route(route)
                            .coach(coach)
                            .departureTime(departure)
                            .arrivalTime(arrival)
                            .price(price)
                            .status(Trip.TripStatus.SCHEDULED)
                            .build();
                    trip = tripRepository.save(trip);

                    // Create seats for this trip
                    createSeatsForTrip(trip, coach.getTotalSeats());
                    tripCount++;
                }
            }
        }
        System.out.println("🎫 Created " + tripCount + " trips for 30 days");
    }

    private void createSeatsForTrip(Trip trip, int totalSeats) {
        List<Seat> seats = new ArrayList<>();
        
        // Xe giường nằm 41 giường: Tầng 1 (A1-A18), Tầng 2 (B1-B23)
        // Tầng 1: 18 ghế
        for (int i = 1; i <= 18; i++) {
            Seat seat = Seat.builder()
                    .trip(trip)
                    .seatNumber("A" + i)
                    .status(Seat.SeatStatus.AVAILABLE)
                    .build();
            seats.add(seat);
        }
        
        // Tầng 2: 23 ghế
        for (int i = 1; i <= 23; i++) {
            Seat seat = Seat.builder()
                    .trip(trip)
                    .seatNumber("B" + i)
                    .status(Seat.SeatStatus.AVAILABLE)
                    .build();
            seats.add(seat);
        }
        
        seatRepository.saveAll(seats);
    }
}
