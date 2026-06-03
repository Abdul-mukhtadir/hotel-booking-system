import { jsPDF } from "jspdf";

export const downloadInvoice = (
  booking
) => {

  const doc = new jsPDF();

  doc.setFontSize(22);

  doc.text(
    "HOTEL BOOKING INVOICE",
    20,
    20
  );

  doc.setFontSize(12);

  doc.text(
    `Invoice ID: ${booking._id}`,
    20,
    40
  );

  doc.text(
    `Hotel: ${booking.hotel?.name}`,
    20,
    55
  );

  doc.text(
    `Room Type: ${booking.room?.roomType}`,
    20,
    70
  );

  doc.text(
    `Room Number: ${booking.room?.roomNumber}`,
    20,
    85
  );

  doc.text(
    `Check In: ${new Date(
      booking.checkInDate
    ).toLocaleDateString()}`,
    20,
    100
  );

  doc.text(
    `Check Out: ${new Date(
      booking.checkOutDate
    ).toLocaleDateString()}`,
    20,
    115
  );

  doc.text(
    `Guests: ${booking.guests}`,
    20,
    130
  );

  doc.text(
    `Payment Status: ${booking.paymentStatus}`,
    20,
    145
  );

  doc.text(
    `Booking Status: ${booking.bookingStatus}`,
    20,
    160
  );

  doc.setFontSize(18);

  doc.text(
    `Total Amount: ₹${booking.totalPrice}`,
    20,
    185
  );

  doc.setFontSize(12);

  doc.text(
    "Thank you for booking with us.",
    20,
    220
  );

  doc.save(
    `Invoice-${booking._id}.pdf`
  );
};