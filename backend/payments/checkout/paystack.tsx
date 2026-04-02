import React from "react";
const PaystackWebView = require("react-native-paystack-webview").default;

export default function PaystackCheckout() {
  const handleSuccess = (res: any) => {
    console.log("Payment Success:", res);
  };

  const handleCancel = () => {
    console.log("Payment Cancelled");
  };

  return (
    <PaystackWebView
      paystackKey="pk_test_xxxx"
      amount={5000} // in kobo (50 Naira)
      billingEmail="user@email.com"
      onCancel={handleCancel}
      onSuccess={handleSuccess}
      autoStart={true}
    />
  );
}