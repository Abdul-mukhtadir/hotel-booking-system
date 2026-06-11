import {
  jsPDF,
} from "jspdf";

export const downloadInvoice = (
  booking
) => {
  const doc = new jsPDF();

  const pageWidth =
    doc.internal.pageSize.getWidth();

  doc.setFillColor(
    20,
    45,
    90
  );
  doc.rect(
    0,
    0,
    pageWidth,
    38,
    "F"
  );

  doc.setTextColor(
    255,
    255,
    255
  );
  doc.setFontSize(22);
  doc.setFont(
    "helvetica",
    "bold"
  );
  doc.text(
    "Hotel Booking System",
    20,
    16
  );

  doc.setFontSize(13);
  doc.setFont(
    "helvetica",
    "normal"
  );
  doc.text(
    "Booking Invoice",
    20,
    28
  );

  doc.setTextColor(
    0,
    0,
    0
  );

  doc.setFontSize(16);
  doc.setFont(
    "helvetica",
    "bold"
  );
  doc.text(
    "Invoice Details",
    20,
    55
  );

  doc.setDrawColor(
    220,
    220,
    220
  );
  doc.line(
    20,
    60,
    190,
    60
  );

  const row = (
    label,
    value,
    y
  ) => {
    doc.setFontSize(11);
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.text(
      label,
      20,
      y
    );

    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.text(
      String(value || "N/A"),
      75,
      y
    );
  };

  row(
    "Invoice ID:",
    booking._id,
    75
  );

  row(
    "Hotel:",
    booking.hotel?.name,
    88
  );

  row(
    "City:",
    booking.hotel?.city,
    101
  );

  row(
    "Room Type:",
    booking.room?.roomType,
    114
  );

  row(
    "Room Number:",
    booking.room?.roomNumber,
    127
  );

  row(
    "Check In:",
    new Date(
      booking.checkInDate
    ).toLocaleDateString(),
    140
  );

  row(
    "Check Out:",
    new Date(
      booking.checkOutDate
    ).toLocaleDateString(),
    153
  );

  row(
    "Guests:",
    booking.guests,
    166
  );

  row(
    "Payment Status:",
    booking.paymentStatus,
    179
  );

  row(
    "Booking Status:",
    booking.bookingStatus,
    192
  );

  doc.setFillColor(
    235,
    245,
    255
  );
  doc.roundedRect(
    20,
    205,
    170,
    25,
    3,
    3,
    "F"
  );

  doc.setFontSize(16);
  doc.setFont(
    "helvetica",
    "bold"
  );
  doc.setTextColor(
    20,
    80,
    170
  );
  doc.text(
    `Total Amount: Rs. ${booking.totalPrice}`,
    28,
    221
  );

  doc.setTextColor(
    0,
    0,
    0
  );
  doc.setFontSize(11);
  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "Thank you for booking with Hotel Booking System.",
    20,
    250
  );

  doc.text(
    "This is a computer generated invoice.",
    20,
    260
  );

  doc.save(
    `Invoice-${booking._id}.pdf`
  );
};