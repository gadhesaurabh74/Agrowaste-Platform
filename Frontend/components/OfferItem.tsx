import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function OfferItem({ offer, onPress }) {
  const { t } = useTranslation();

  // Status icons & colors
  const statusIcons = {
    accepted: { icon: "check-circle", color: "#34C759" },
    pending: { icon: "hourglass-top", color: "#FF9500" },
    declined: { icon: "cancel", color: "#FF3B30" },
  };
  
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* Image */}
      {offer.listing.image && <Image source={{ uri: offer.listing.image }} style={styles.image} />}
      

      {/* Offer Details */}
      <View style={styles.details}>
        <Text style={styles.title}>{offer.listing.title}</Text>
        <Text style={styles.buyer}>{`${t("buyer")}: ${offer.buyer.name}`}</Text>
        <Text style={styles.price}>{`${t("offer")}: $${offer.price}`}</Text>
      </View>

      {/* Status Icon */}
      <View style={styles.statusContainer}>
        <MaterialIcons name={statusIcons[offer.status].icon} size={24} color={statusIcons[offer.status].color} />
        <Text style={[styles.statusText, { color: statusIcons[offer.status].color }]}>
          {t(offer.status.toLowerCase())}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },

  image: {
    width: 55,
    height: 55,
    borderRadius: 5,
    marginRight: 12,
  },

  details: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  buyer: {
    fontSize: 14,
    color: "#666",
  },

  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 4,
  },

  statusContainer: {
    alignItems: "center",
    marginLeft: 10,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 3,
  },
});