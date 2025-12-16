package com.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "payment")
public class PaymentConfig {

    private QRConfig momo = new QRConfig();
    private QRConfig bank = new QRConfig();
    private QRConfig vnpay = new QRConfig();

    public QRConfig getMomo() { return momo; }
    public void setMomo(QRConfig momo) { this.momo = momo; }
    public QRConfig getBank() { return bank; }
    public void setBank(QRConfig bank) { this.bank = bank; }
    public QRConfig getVnpay() { return vnpay; }
    public void setVnpay(QRConfig vnpay) { this.vnpay = vnpay; }

    public static class QRConfig {
        private String qrCodeUrl;
        private String accountName;
        private String accountNumber;
        private String bankName;

        public String getQrCodeUrl() { return qrCodeUrl; }
        public void setQrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; }
        public String getAccountName() { return accountName; }
        public void setAccountName(String accountName) { this.accountName = accountName; }
        public String getAccountNumber() { return accountNumber; }
        public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
        public String getBankName() { return bankName; }
        public void setBankName(String bankName) { this.bankName = bankName; }
    }
}
