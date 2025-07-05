"use client";
import React, { useState, useEffect } from 'react';
import DynamicTable from '../Tablecmp';
import Dynamicmodal from '../Modalcmp';
import CustomDangerAlert from '../Dangeralert';
import { CircularProgress , Card, CardHeader, CardBody, CardFooter , Input , Select , SelectItem , Button } from "@heroui/react";
import { useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function TodaysBookings() {
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [bookingData, setBookingData] = useState([]);

    // New states for UI elements
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("OrderId");
  const [dateFilterOption, setDateFilterOption] = useState("all");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");


  // Card data states
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPickups, setTotalPickups] = useState(0);
  const [totalDrops, setTotalDrops] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

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

  // Date formatting helpers
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    const formatTime = (timeString) => {
      if (!timeString) return "";
      if (timeString.includes("T")) {
        const time = new Date(timeString);
        return time.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      }
      return timeString.substring(0, 5);
    };

    // Helper to get today's date in YYYY-MM-DD format
      const getTodayDate = () => new Date().toISOString().split('T')[0];

      // Format date for display
      const formatDisplayDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      };

      // Format datetime for display
      const formatDateTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };

    // Filtered data calculation
    const filteredData = useMemo(() => {
      let result = [...bookingData];
      
      // Apply search filter
      if (searchTerm) {
        result = result.filter(booking => {
          const fieldValue = booking[searchOption]?.toString().toLowerCase() || '';
          return fieldValue.includes(searchTerm.toLowerCase());
        });
      }

      // Apply date filter
      if (dateFilterOption !== 'all') {
        const today = new Date().toISOString().split('T')[0];
        
        switch (dateFilterOption) {
          case 'booking':
            if (filterFromDate && filterToDate) {
              result = result.filter(booking => 
                booking.bookingDate >= filterFromDate && 
                booking.bookingDate <= filterToDate
              );
            }
            break;
            
          case 'pickup':
            result = result.filter(booking => {
              const fromDate = booking.FromDate.split('T')[0];
              return fromDate === today;
            });
            break;
            
          case 'drop':
            result = result.filter(booking => {
              const toDate = booking.ToDate.split('T')[0];
              return toDate === today;
            });
            break;
            
          case 'pickup_drop':
            result = result.filter(booking => {
              const fromDate = booking.FromDate.split('T')[0];
              const toDate = booking.ToDate.split('T')[0];
              return fromDate === today || toDate === today;
            });
            break;
        }
      }
      
      return result;
    }, [
      bookingData, 
      searchTerm, 
      searchOption,
      dateFilterOption,
      filterFromDate,
      filterToDate
    ]);

      // Date formatting helpers

      // count calculate

  useEffect(() => {
    if (bookingData.length === 0) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Total orders today
    const totalOrdersCount = bookingData.filter(
      booking => booking.bookingDate === today
    ).length;
    
    // Total pickups today
    const totalPickupsCount = bookingData.filter(booking => {
      const fromDate = booking.FromDate.split('T')[0];
      return fromDate === today;
    }).length;
    
    // Total drops today
    const totalDropsCount = bookingData.filter(booking => {
      const toDate = booking.ToDate.split('T')[0];
      return toDate === today;
    }).length;
    
    // Total sales (sum of all PaidAmount)
    const totalSalesAmount = bookingData.reduce(
      (sum, booking) => sum + parseFloat(booking.PaidAmount || 0),
      0
    );

    setTotalOrders(totalOrdersCount);
    setTotalPickups(totalPickupsCount);
    setTotalDrops(totalDropsCount);
    setTotalSales(totalSalesAmount);
  }, [bookingData]);

  //count calculates

  //Remove filter

  const handleRemoveFilters = () => {
    setSearchTerm("");
    setSearchOption("OrderId");
    setDateFilterOption("all");
    setFilterFromDate("");
    setFilterToDate("");
  };


  //Remove filter

  // report gennerate 

  const generateReportPDF = () => {
  const doc = new jsPDF();
  const reportData = filteredData.length > 0 ? filteredData : bookingData;
  const today = new Date().toLocaleDateString();
  
  // Add header
  doc.setFontSize(20);
  doc.setTextColor(40, 53, 147);
  doc.text('Simple Parking Report', 105, 15, null, null, 'center');
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated: ${today}`, 105, 22, null, null, 'center');
  
  // Add summary cards
  doc.setFontSize(14);
  doc.text('Summary', 14, 32);
  
  const cardData = [
    { title: 'Total Orders', value: totalOrders },
    { title: 'Total Pickups', value: totalPickups },
    { title: 'Total Drops', value: totalDrops },
    { title: 'Total Sales', value: `$${totalSales.toFixed(2)}` },
  ];
  
  cardData.forEach((card, index) => {
    const x = 14 + (index % 2) * 95;
    const y = 40 + Math.floor(index / 2) * 20;
    
    doc.setFillColor(240, 240, 240);
    doc.rect(x, y, 90, 15, 'F');
    doc.text(`${card.title}: ${card.value}`, x + 5, y + 10);
  });
  
  // Add bookings table
    doc.setFontSize(14);
    doc.text('Booking Details', 14, 80);
    
    const headers = [
      'Order ID',
      'Customer',
      'Phone',
      'Dates',
      'Location',
      'Amount',
      'Status'
    ];
    
    const rows = reportData.map(booking => [
      booking.OrderId,
      booking.ParkingName.substring(0, 20),
      booking.CustomerPhone,
      `${formatDate(booking.FromDate)} to ${formatDate(booking.ToDate)}`,
      `${booking.Location} (${booking.Airport})`.substring(0, 25),
      `$${booking.PaidAmount}`,
      booking.Status
    ]);

    autoTable(doc, {
      startY: 85,
      head: [headers],
      body: rows,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 1.5 },
      headStyles: { fillColor: [40, 53, 147] }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        null,
        null,
        'center'
      );
    }
    
    doc.save(`parking-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // report generate 

  // remove filter 

  <div className="flex justify-end mt-4">
  <Button 
    color="default"
    variant="bordered"
    onClick={handleRemoveFilters}
  >
    Remove All Filters
  </Button>
</div>

// remove filter 

    const searchOptions = [
    { value: "OrderId", label: "Order ID" },
    { value: "ParkingName", label: "Name" },
    { value: "ParkingSlot", label: "Parking Space" },
    { value: "CustomerEmail", label: "Customer Email" },
    { value: "CustomerPhone", label: "Phone Number" },
    { value: "FromDate", label: "Pickup Date" },
    { value: "ToDate", label: "Drop Date" },
    { value: "Airport", label: "Airport" },
  ];

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

  // Generate 

    const generateMainReport = () => {
        const reportData = filteredData.length > 0 ? filteredData : bookingData;
        generatePDFReport(reportData, "Parking Report");
      };

    const generatePDFReport = (reportData, reportTitle) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.text(reportTitle, 105, 15, null, null, 'center');
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated: ${today}`, 105, 22, null, null, 'center');
    
    // Add summary
    doc.setFontSize(14);
    doc.text('Report Summary', 14, 32);
    
    const summaryData = [
      { label: 'Report Title', value: reportTitle },
      { label: 'Total Records', value: reportData.length },
      { label: 'Generated Date', value: today }
    ];
    
    summaryData.forEach((item, index) => {
      const y = 40 + index * 10;
      doc.text(`${item.label}: ${item.value}`, 14, y);
    });
    
    // Add bookings table with ALL fields
    doc.setFontSize(14);
    doc.text('Booking Details', 14, 70);
    
    const headers = [
      'Order ID',
      'Customer Name',
      'Email',
      'Phone',
      'Airport',
      'Location',
      'Parking Slot',
      'Car Number',
      'From Date',
      'To Date',
      'Paid Amount',
      'Payment Method',
      'Status',
      'Booking Date',
      'Booking Time',
      'Created At',
      'Updated At'
    ];
    
    const rows = reportData.map(booking => [
      booking.OrderId || 'N/A',
      booking.ParkingName?.substring(0, 20) || 'N/A',
      booking.CustomerEmail || 'N/A',
      booking.CustomerPhone || 'N/A',
      booking.Airport || 'N/A',
      booking.Location || 'N/A',
      booking.ParkingSlot || 'N/A',
      booking.CarNumber || 'N/A',
      formatDisplayDate(booking.FromDate) || 'N/A',
      formatDisplayDate(booking.ToDate) || 'N/A',
      `$${booking.PaidAmount || '0.00'}`,
      booking.PaymentMethod || 'N/A',
      booking.Status || 'N/A',
      booking.bookingDate || 'N/A',
      booking.bookingTime || 'N/A',
      formatDateTime(booking.createdAt) || 'N/A',
      formatDateTime(booking.updatedAt) || 'N/A'
    ]);
    
    autoTable(doc, {
      startY: 75,
      head: [headers],
      body: rows,
      theme: 'grid',
      styles: { fontSize: 6, cellPadding: 1.5 },
      headStyles: { fillColor: [40, 53, 147] },
      margin: { top: 75 },
      tableWidth: 'wrap'
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        null,
        null,
        'center'
      );
    }
    
    doc.save(`${reportTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  // Generate report for today's orders
    const generateTodayOrdersReport = () => {
      const today = getTodayDate();
      const reportData = bookingData.filter(
        booking => booking.bookingDate === today
      );
      generatePDFReport(reportData, "Today's Orders Report");
    };

  // Generate report for today's pickups
  const generateTodayPickupsReport = () => {
    const today = getTodayDate();
    const reportData = bookingData.filter(booking => {
      const fromDate = booking.FromDate?.split('T')[0];
      return fromDate === today;
    });
    generatePDFReport(reportData, "Today's Pickups Report");
  };

  // Generate report for today's drops
  const generateTodayDropsReport = () => {
    const today = getTodayDate();
    const reportData = bookingData.filter(booking => {
      const toDate = booking.ToDate?.split('T')[0];
      return toDate === today;
    });
    generatePDFReport(reportData, "Today's Drops Report");
  };

  // Generate report for all bookings
  const generateTotalSalesReport = () => {
    generatePDFReport(bookingData, "Total Sales Report");
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

    const handleSearchApply = () => {
      console.log("Search applied with:", { searchTerm, searchOption });
      // Implement your search logic here
    };

    const handleDateFilterApply = () => {
      console.log("Date filter applied with:", { 
        dateFilterOption, 
        filterFromDate, 
        filterToDate 
      });
      // Implement your date filter logic here
    };

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
          {/* Card Section - Updated without CardContent */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Orders Card */}
      <Card className="bg-blue-50 p-4">
        <CardHeader className="pb-2">
          <p className="text-sm font-semibold text-blue-600">Total Orders Today</p>
        </CardHeader>
        <div className="p-2">
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="flex justify-end">
          <Button 
            variant="solid"
            className='text-blue-50 bg-blue-600'
            onClick={generateTodayOrdersReport}
          >
            Generate Report
          </Button>
        </div>
      </Card>

      {/* Total Pickups Card */}
      <Card className="bg-green-50 p-4">
        <CardHeader className="pb-2">
          <p className="text-sm font-semibold text-green-600">Total Pickups</p>
        </CardHeader>
        <div className="p-2">
          <p className="text-2xl font-bold">{totalPickups}</p>
        </div>
        <div className="flex justify-end">
          <Button 
            variant="solid"
            className='text-green-50 bg-green-600'
            onClick={generateTodayPickupsReport}
          >
            Generate Report
          </Button>
        </div>
      </Card>

      {/* Total Drops Card */}
      <Card className="bg-yellow-50 p-4">
        <CardHeader className="pb-2">
          <p className="text-sm font-semibold text-yellow-600">Total Drops</p>
        </CardHeader>
        <div className="p-2">
          <p className="text-2xl font-bold">{totalDrops}</p>
        </div>
        <div className="flex justify-end">
          <Button 
            variant="solid"
            className='text-yellow-50 bg-yellow-600'
            onClick={generateTodayDropsReport}
          >
            Generate Report
          </Button>
        </div>
      </Card>

      {/* Total Sales Card */}
      <Card className="bg-purple-50 p-4">
        <CardHeader className="pb-2">
          <p className="text-sm font-semibold text-purple-600">Total Sales</p>
        </CardHeader>
        <div className="p-2">
          <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
        </div>
        <div className="flex justify-end">
          <Button 
            variant="solid"
            className='text-purple-50 bg-purple-600'
            onClick={generateTotalSalesReport}
          >
            Generate Report
          </Button>
        </div>
      </Card>
      </div>
      
      {/* Rest of your component remains the same */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 mt-4">
        {/* Search row - all in one line */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 mt-4">
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 w-1/3"
          />
          <Select
            label="Search By"
            value={searchOption}
            onChange={(e) => setSearchOption(e.target.value)}
            className="min-w-[180px] w-1/3"
          >
            {searchOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
          <Button
            color="primary"
            className="h-[56px]"
            onClick={handleSearchApply}
          >
            Apply
          </Button>
        </div>

        {/* Date filter row - all in one line */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            label="Date Filter"
            value={dateFilterOption}
            onChange={(e) => setDateFilterOption(e.target.value)}
            className="min-w-[180px]"
          >
            <SelectItem value="booking">Booking Date</SelectItem>
            <SelectItem value="pickup">Pickup Date</SelectItem>
            <SelectItem value="drop">Drop Date</SelectItem>
            <SelectItem value="pickup_drop">Pickup & Drop Date</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </Select>
          <Input
            type="date"
            label="From Date"
            value={filterFromDate}
            onChange={(e) => setFilterFromDate(e.target.value)}
          />
          <Input
            type="date"
            label="To Date"
            value={filterToDate}
            onChange={(e) => setFilterToDate(e.target.value)}
          />
          <Button
            color="primary"
            className="h-[56px]"
            onClick={handleDateFilterApply}
          >
            Apply
          </Button>
        </div>

        {/* Action buttons at bottom */}
        <div className="flex justify-between mt-6">
          <Button
            color="success"
            variant="solid"
            onClick={generateMainReport}
          >
            Generate Report
          </Button>
        </div>
      </div>

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
          data={filteredData}
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