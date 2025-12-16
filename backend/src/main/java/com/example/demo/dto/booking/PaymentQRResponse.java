package com.example.demo.dto.booking;

public class PaymentQRResponse {
    private String bookingCode;
    private String paymentMethod;
    private String qrCodeUrl;
    private String accountName;
    private String accountNumber;
    private String bankName;
    private String transferContent;
    private java.math.BigDecimal amount;

    public PaymentQRResponse() {}

    // Getters and Setters
    public String getBookingCode() { return bookingCode; }
    public void setBookingCode(String bookingCode) { this.bookingCode = bookingCode; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getQrCodeUrl() { return qrCodeUrl; }
    public void setQrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; }
    public String getAccountName() { return accountName; }
    public void setAccountName(String accountName) { this.accountName = accountName; }
    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
    public String getTransferContent() { return transferContent; }
    public void setTransferContent(String transferContent) { this.transferContent = transferContent; }
    public java.math.BigDecimal getAmount() { return amount; }
    public void setAmount(java.math.BigDecimal amount) { this.amount = amount; }

    public static PaymentQRResponseBuilder builder() { return new PaymentQRResponseBuilder(); }

    public static class PaymentQRResponseBuilder {
        private String bookingCode;
        private String paymentMethod;
        private String qrCodeUrl;
        private String accountName;
        private String accountNumber;
        private String bankName;
        private String transferContent;
        private java.math.BigDecimal amount;

        public PaymentQRResponseBuilder bookingCode(String bookingCode) { this.bookingCode = bookingCode; return this; }
        public PaymentQRResponseBuilder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public PaymentQRResponseBuilder qrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; return this; }
        public PaymentQRResponseBuilder accountName(String accountName) { this.accountName = accountName; return this; }
        public PaymentQRResponseBuilder accountNumber(String accountNumber) { this.accountNumber = accountNumber; return this; }
        public PaymentQRResponseBuilder bankName(String bankName) { this.bankName = bankName; return this; }
        public PaymentQRResponseBuilder transferContent(String transferContent) { this.transferContent = transferContent; return this; }
        public PaymentQRResponseBuilder amount(java.math.BigDecimal amount) { this.amount = amount; return this; }

        public PaymentQRResponse build() {
            PaymentQRResponse response = new PaymentQRResponse();
            response.bookingCode = this.bookingCode;
            response.paymentMethod = this.paymentMethod;
            response.qrCodeUrl = this.qrCodeUrl;
            response.accountName = this.accountName;
            response.accountNumber = this.accountNumber;
            response.bankName = this.bankName;
            response.transferContent = this.transferContent;
            response.amount = this.amount;
            return response;
        }
    }
}
