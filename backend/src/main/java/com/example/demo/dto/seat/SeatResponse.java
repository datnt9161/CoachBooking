package com.example.demo.dto.seat;

public class SeatResponse {
    private Long id;
    private String seatNumber;
    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public static SeatResponseBuilder builder() { return new SeatResponseBuilder(); }

    public static class SeatResponseBuilder {
        private Long id;
        private String seatNumber;
        private String status;

        public SeatResponseBuilder id(Long id) { this.id = id; return this; }
        public SeatResponseBuilder seatNumber(String seatNumber) { this.seatNumber = seatNumber; return this; }
        public SeatResponseBuilder status(String status) { this.status = status; return this; }

        public SeatResponse build() {
            SeatResponse r = new SeatResponse();
            r.id = this.id; r.seatNumber = this.seatNumber; r.status = this.status;
            return r;
        }
    }
}
