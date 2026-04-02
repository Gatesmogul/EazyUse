import React from "react";
import { View, Button } from "react-native";
import { initStripe, useStripe } from "@stripe/stripe-react-native";


export default function StripeCheckout() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const openCheckout = async () => {
    const res = await fetch("https://api.eazyuse.com/create-stripe-session", {
      method: "POST",
    });
    const { paymentIntent, ephemeralKey, customer } = await res.json();

    await initPaymentSheet({
      merchantDisplayName: "EazyUse",
      paymentIntentClientSecret: paymentIntent,
      customerEphemeralKeySecret: ephemeralKey,
      customerId: customer,
    });

    await presentPaymentSheet();
  };

  return (
    <View>
      <Button title="Checkout" onPress={openCheckout} />
    </View>
  );
}
