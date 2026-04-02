import React, { useEffect, useState } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

export default function LiveTicker() {
  const [feed, setFeed] = useState<string[]>([]);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    const ws = new WebSocket("wss://echo.websocket.events");
    ws.onmessage = () => {
      setFeed(prev => [
        `Txn #${Math.floor(Math.random() * 999999)} @ ${new Date().toLocaleTimeString()}`,
        ...prev,
      ]);
    };
    return () => ws.close();
  }, []);

  return (
    <Animated.View style={styles.tickerContainer}>
      {feed.slice(0, 5).map((item, i) => (
        <Text key={i} style={styles.tickerText}>{item}</Text>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tickerContainer: { padding: 10, backgroundColor: "#001F3F" },
  tickerText: { color: "#00FFFF", fontWeight: "bold" },
});
