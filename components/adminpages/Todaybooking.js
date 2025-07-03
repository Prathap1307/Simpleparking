"use client";
import React, { useState, useEffect } from 'react';
import DynamicTable from '../Tablecmp';
import Dynamicmodal from '../Modalcmp';
import CustomDangerAlert from '../Dangeralert';
import { CircularProgress } from "@heroui/react";

export default function TodaysBookings() {
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [bookingData, setBookingData] = useState([]);

  // Form fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toDate, setToDate] = useState("");
  const [toTime, setToTime] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [location, setLocation] = useState("");
  const [airport, setAirport] = useState("");
  const [parkingSlot, setParkingSlot] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [Status,setStatus] = useState()
    
  //ftech locations
  const [LocationsData,setLocationsData] = useState([])
  const [ ParkingslotData, setParkingslotData] = useState([])

  const columns = [
    { name: "Order ID", uid: "OrderId" },
    { name: "Name", uid: "ParkingName" },
    { name: "Parking Space", uid: "ParkingSlot" },
    { name: "Customer Email", uid: "CustomerEmail" },
    { name: "Phone Number", uid: "CustomerPhone" },
    { name: "From Date", uid: "FromDate" },
    { name: "From Time", uid: "FromTime" },
    { name: "To Date", uid: "ToDate" },
    { name: "To Time", uid: "ToTime" },
    { name: "Airport", uid: "Airport" },
    { name: "Paid Price", uid: "PaidAmount" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const statusOptions = {
    confirmed: "success",
    cancelled: "danger",
    pending: "warning",
  };

  const generateOrderId = async () => {
    const res = await fetch("/api/Todaysbooking");
    const existingBookings = await res.json();

    const now = new Date();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentYear = String(now.getFullYear()).slice(-2);

    const currentMonthOrders = existingBookings.filter(booking => {
      if (!booking.OrderId) return false;
      return booking.OrderId.includes(`simpleparking${currentMonth}${currentYear}`);
    });

    let nextOrderNum = 1;
    if (currentMonthOrders.length > 0) {
      const lastOrder = currentMonthOrders[currentMonthOrders.length - 1];
      const lastOrderNum = parseInt(lastOrder.OrderId.split('-')[1]);
      nextOrderNum = lastOrderNum + 1;
    }

    return `simpleparking${currentMonth}${currentYear}-${String(nextOrderNum).padStart(2, '0')}`;
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/Todaysbooking");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookingData(data);
    } catch (err) {
      console.error("Error fetching booking data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const clearForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setFromDate("");
    setFromTime("");
    setToDate("");
    setToTime("");
    setPaidAmount("");
    setPaymentMethod("");
    setCarNumber("");
    setLocation("");
    setAirport("");
    setParkingSlot("");
    setBookingStatus("");
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const handleEdit = (item) => {
    setCurrentRecord(item);
    setIsEdit(true);
    setIsModalOpen(true);
    setCustomerName(item.ParkingName.replace(/\(.*\)/, '').trim()); // Remove (edited by admin) if present
    setCustomerEmail(item.CustomerEmail || "");
    setCustomerPhone(item.CustomerPhone || "");
    setFromDate(item.FromDate || "");
    setFromTime(item.FromTime || "");
    setToDate(item.ToDate || "");
    setToTime(item.ToTime || "");
    setPaidAmount(item.PaidAmount || "");
    setPaymentMethod(item.PaymentMethod || "");
    setCarNumber(item.CarNumber || "");
    setLocation(item.Location || "");
    setAirport(item.Airport || ""); // Make sure airport is set
    setParkingSlot(item.ParkingSlot || ""); // Make sure parking slot is set
    setBookingStatus(item.Status || "");
  };

  const handleDelete = (item) => {
    setRecordToDelete(item);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch("/api/Todaysbooking", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: recordToDelete.id }),
      });
      await fetchData();
    } catch (err) {
      console.error("Error deleting record:", err);
    } finally {
      setShowConfirm(false);
      setRecordToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setRecordToDelete(null);
  };

  const inputs = [
    { label: "Customer Name", value: customerName, onChange: (e) => setCustomerName(e.target.value), type: "text" },
    { label: "Customer Email", value: customerEmail, onChange: (e) => setCustomerEmail(e.target.value), type: "email" },
    { label: "Phone Number", value: customerPhone, onChange: (e) => setCustomerPhone(e.target.value), type: "text" },
    { label: "From Date", value: fromDate, onChange: (e) => setFromDate(e.target.value), type: "date" },
    { label: "From Time", value: fromTime, onChange: (e) => setFromTime(e.target.value), type: "time" },
    { label: "To Date", value: toDate, onChange: (e) => setToDate(e.target.value), type: "date" },
    { label: "To Time", value: toTime, onChange: (e) => setToTime(e.target.value), type: "time" },
    { label: "Paid Price", value: paidAmount, onChange: (e) => setPaidAmount(e.target.value), type: "number" },
    { label: "Paid Via", value: paymentMethod, onChange: (e) => setPaymentMethod(e.target.value), type: "text" },
    { label: "Car Number", value: carNumber, onChange: (e) => setCarNumber(e.target.value), type: "text" },
    {
      label: "Airport",
      value: airport,
      onChange: setAirport,
      type: "autocomplete",
      options: LocationsData.map(loc => ({
        label: loc.Airport_name,
        value: loc.Airport_name
      }))
    },
    {
      label: "Parking Space",
      value: parkingSlot,
      onChange: setParkingSlot,
      type: "autocomplete",
      options: ParkingslotData.map(loc => ({
        label: loc.ParkingName,
        value: loc.ParkingName
      }))
    },
    {
      label: "Status", value: Status, onChange: setStatus, type: "autocomplete",
      options: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }]
    }
  ];

  const buttons = [
    { text: "Close", color: "danger", variant: "flat", onClick: clearForm },
    {
      text: isEdit ? "Update" : "Save",
      color: "primary",
      onClick: async () => {
        try {
          const now = new Date();
          const newRecord = {
            ...(isEdit && { id: currentRecord.id }),
            ParkingName: isEdit ? `${customerName} (edited by admin)` : `${customerName} (added by admin)`,
            CustomerEmail: customerEmail,
            CustomerPhone: customerPhone,
            FromDate: fromDate,
            FromTime: fromTime,
            ToDate: toDate,
            ToTime: toTime,
            PaidAmount: paidAmount,
            PaymentMethod: paymentMethod,
            CarNumber: carNumber,
            Location: location || airport,
            Airport: airport,
            ParkingSlot: parkingSlot,
            Status: bookingStatus || 'confirmed',
          };

          if (!isEdit) {
            newRecord.OrderId = await generateOrderId();
            newRecord.id = String(Date.now());
            newRecord.createdAt = now.toISOString();
            newRecord.bookingDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
            newRecord.bookingTime = now.toTimeString().split(' ')[0]; // HH:MM:SS format
          }

          newRecord.updatedAt = now.toISOString();

          const response = await fetch("/api/Todaysbooking", {
            method: isEdit ? "PUT" : "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRecord),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save booking');
          }

          await fetchData();
          clearForm();
        } catch (err) {
          console.error("Save error:", err);
          alert(`Save failed: ${err.message}`);
        }
      },
    },
  ];

  const fetchlocations = async () => {
    try {
      const res = await fetch("/api/Locations");
      if (!res.ok) throw new Error("Failed to fetch locations data");
      const data = await res.json();
      setLocationsData(data);
    } catch (err) {
      console.error("Error refreshing locations data:", err);
    }
  };

  const fetchparkingslots = async () => {
      try {
      const res = await fetch("/api/Parkingspace");
      if (!res.ok) throw new Error("Failed to fetch parking data");
      const data = await res.json();
      setParkingslotData(data);
    } catch (err) {
      console.error("Error refreshing parking data:", err);
    }
  }
    
  useEffect(() => {
    fetchlocations();
    fetchparkingslots();
  }, []);

  return (
    <div>
      <div className="w-full flex justify-end p-4">
        <Dynamicmodal
          triggerButton={{
            color: "primary",
            text: "Add New Booking",
            variant: "solid",
            onClick: () => { clearForm(); setIsEdit(false); setIsModalOpen(true); },
          }}
          modalTitle={isEdit ? "Edit Booking" : "Add New Booking"}
          inputs={inputs}
          buttons={buttons}
          ModalOpen={isModalOpen}
          Editmode={isEdit}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress label="Loading..." size="lg" />
        </div>
      ) : (
        <DynamicTable
          columns={columns}
          data={bookingData}
          statusOptions={statusOptions}
          value="bookings"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showConfirm && recordToDelete && (
        <div className="fixed bottom-6 right-6 z-50 w-[300px]">
          <CustomDangerAlert
            title="Confirm Deletion"
            message={`Are you sure you want to delete booking for ${recordToDelete.ParkingName}?`}
            button1Label="Delete it anyway"
            button2Label="Keep it"
            onButton1Click={confirmDelete}
            onButton2Click={cancelDelete}
          />
        </div>
      )}
    </div>
  );
}