import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

export default function OfferItem({ offer, onPress }) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      {offer.listing.image && <Image source={{ uri: offer.listing.image }} style={styles.image} />}
      <View style={styles.info}>
        <Text style={styles.title}>{offer.listing.title}</Text>
        <Text>{`${t("buyer")}: ${offer.buyer.name}`}</Text>
        <Text>{`${t("offer")}: $${offer.price}`}</Text>
        <Text style={[styles.status, styles[offer.status]]}>{t(offer.status.toLowerCase())}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: "row", backgroundColor: "white", padding: 10, marginBottom: 8, borderRadius: 5 },
  image: { width: 60, height: 60, borderRadius: 3, marginRight: 8 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold" },
  status: { marginTop: 5, fontWeight: "bold" },
  accepted: { color: "green" },
  declined: { color: "red" },
  pending: { color: "orange" },
});