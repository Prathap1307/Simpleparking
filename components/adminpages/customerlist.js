"use client";
import { useDisclosure, Button, Input, Select, SelectItem, Pagination, Card, CardHeader } from "@heroui/react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import DynamicTable from "../Tablecmp";
import DynamicModal from "../Modalcmp";
import { CircularProgress } from "@heroui/react";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("CustomerEmail");
  const [dateFilterOption, setDateFilterOption] = useState("all");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const columns = [
    { name: "ID", uid: "id" },
    { name: "Name", uid: "ParkingName" },
    { name: "Email", uid: "CustomerEmail" },
    { name: "Phone Numbers", uid: "CustomerPhone" },
    { name: "Car Numbers", uid: "CarNumber" },
    { name: "Airports", uid: "Airport" },
    { name: "Order IDs", uid: "OrderId" },
    { name: "Created", uid: "createdAt" },
    { name: "Updated", uid: "updatedAt" },
    { name: "Actions", uid: "actions" },
  ];

  const searchOptions = [
    { value: "CustomerEmail", label: "Email" },
    { value: "OrderId", label: "Order ID" },
    { value: "CustomerPhone", label: "Phone Number" },
    { value: "CarNumber", label: "Car Number" },
    { value: "ParkingName", label: "Name" },
  ];

  const dateFilterOptions = [
    { value: "created", label: "Created Date" },
    { value: "updated", label: "Updated Date" },
    { value: "all", label: "All Dates" },
  ];

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/Customerlist");
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      alert("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Filter customers based on search and date filters
  const filteredData = useMemo(() => {
    let result = [...customers];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(customer => {
        const fieldValue = customer[searchOption]?.toString().toLowerCase() || '';
        return fieldValue.includes(searchTerm.toLowerCase());
      });
    }

    // Apply date filter
    if (dateFilterOption !== "all" && (filterFromDate || filterToDate)) {
      result = result.filter(customer => {
        const dateField = dateFilterOption === "created" ? "createdAt" : "updatedAt";
        const customerDate = new Date(customer[dateField]).toISOString().split('T')[0];
        
        const afterFrom = !filterFromDate || customerDate >= filterFromDate;
        const beforeTo = !filterToDate || customerDate <= filterToDate;
        
        return afterFrom && beforeTo;
      });
    }

    return result;
  }, [customers, searchTerm, searchOption, dateFilterOption, filterFromDate, filterToDate]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / rowsPerPage) || 1;
  }, [filteredData, rowsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData, rowsPerPage]);

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    onOpen();
  };

  const handleDelete = async (customer) => {
    if (confirm(`Are you sure you want to delete ${customer.ParkingName}?`)) {
      try {
        const response = await fetch("/api/Customerlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: customer.id }),
        });

        if (!response.ok) throw new Error("Failed to delete customer");

        alert("Customer deleted successfully");
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Failed to delete customer");
      }
    }
  };

  const [formData, setFormData] = useState({
    ParkingName: '',
    CustomerEmail: '',
    CustomerPhone: [],
    CarNumber: [],
    Airport: [],
    OrderId: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field, value) => {
    // Convert string to array if needed (for phone numbers, car numbers, etc.)
    const arrayValue = typeof value === 'string' ? value.split(',').map(item => item.trim()) : value;
    handleInputChange(field, arrayValue);
  };

  const handleSave = async (isNew) => {
    try {
      let response;
      const customerData = {
        ...formData,
        id: selectedCustomer?.id
      };

      if (isNew) {
        response = await fetch("/api/Customerlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customerData),
        });
      } else {
        response = await fetch("/api/Customerlist", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customerData),
        });
      }

      if (!response.ok) throw new Error(`Failed to ${isNew ? "create" : "update"} customer`);

      alert(`Customer ${isNew ? "created" : "updated"} successfully`);
      fetchCustomers();
      onOpenChange(); // Close the modal
      return true;
    } catch (error) {
      console.error(`Error ${isNew ? "creating" : "updating"} customer:`, error);
      alert(`Failed to ${isNew ? "create" : "update"} customer`);
      return false;
    }
  };

  useEffect(() => {
    if (selectedCustomer) {
      setFormData({
        ParkingName: selectedCustomer.ParkingName || '',
        CustomerEmail: selectedCustomer.CustomerEmail || '',
        CustomerPhone: selectedCustomer.CustomerPhone || [],
        CarNumber: selectedCustomer.CarNumber || [],
        Airport: selectedCustomer.Airport || [],
        OrderId: selectedCustomer.OrderId || []
      });
    } else {
      setFormData({
        ParkingName: '',
        CustomerEmail: '',
        CustomerPhone: [],
        CarNumber: [],
        Airport: [],
        OrderId: []
      });
    }
  }, [selectedCustomer]);

  const formatArrayCell = (value) => {
    if (!value) return "-";
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-col gap-1">
          {value.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      );
    }
    return value;
  };

  const renderCell = (item, columnKey) => {
    if (columnKey === "CustomerPhone" || columnKey === "CarNumber" || 
        columnKey === "Airport" || columnKey === "OrderId") {
      return formatArrayCell(item[columnKey]);
    }

    if (columnKey === "createdAt" || columnKey === "updatedAt") {
      return new Date(item[columnKey]).toLocaleString();
    }

    return item[columnKey];
  };

  const handleRemoveFilters = () => {
    setSearchTerm("");
    setSearchOption("CustomerEmail");
    setDateFilterOption("all");
    setFilterFromDate("");
    setFilterToDate("");
  };

  const modalInputs = [
    {
      type: "text",
      label: "Parking Name",
      placeholder: "Enter parking name",
      value: formData.ParkingName,
      onChange: (e) => handleInputChange('ParkingName', e.target.value)
    },
    {
      type: "text",
      label: "Customer Email",
      placeholder: "Enter customer email",
      value: formData.CustomerEmail,
      onChange: (e) => handleInputChange('CustomerEmail', e.target.value)
    },
    {
      type: "text",
      label: "Phone Numbers (comma separated)",
      placeholder: "Enter phone numbers",
      value: formData.CustomerPhone.join(', '),
      onChange: (e) => handleArrayInputChange('CustomerPhone', e.target.value)
    },
    {
      type: "text",
      label: "Car Numbers (comma separated)",
      placeholder: "Enter car numbers",
      value: formData.CarNumber.join(', '),
      onChange: (e) => handleArrayInputChange('CarNumber', e.target.value)
    },
    {
      type: "text",
      label: "Airports (comma separated)",
      placeholder: "Enter airports",
      value: formData.Airport.join(', '),
      onChange: (e) => handleArrayInputChange('Airport', e.target.value)
    },
    {
      type: "text",
      label: "Order IDs (comma separated)",
      placeholder: "Enter order IDs",
      value: formData.OrderId.join(', '),
      onChange: (e) => handleArrayInputChange('OrderId', e.target.value)
    }
  ];

  const modalButtons = [
    {
      text: "Cancel",
      color: "default",
      variant: "light",
      onClick: () => onOpenChange(),
      closeOnClick: true
    },
    {
      text: selectedCustomer ? "Update" : "Create",
      color: "primary",
      onClick: () => handleSave(!selectedCustomer),
      closeOnClick: false
    }
  ];

  return (
    <div className="p-4">
      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 w-1/2"
          />
          <Select
            label="Search By"
            value={searchOption}
            onChange={(e) => setSearchOption(e.target.value)}
            className="min-w-[180px] w-1/2"
          >
            {searchOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            label="Date Filter"
            value={dateFilterOption}
            onChange={(e) => setDateFilterOption(e.target.value)}
            className="min-w-[180px]"
          >
            {dateFilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
          <Input
            type="date"
            label="From Date"
            value={filterFromDate}
            onChange={(e) => setFilterFromDate(e.target.value)}
            disabled={dateFilterOption === "all"}
          />
          <Input
            type="date"
            label="To Date"
            value={filterToDate}
            onChange={(e) => setFilterToDate(e.target.value)}
            disabled={dateFilterOption === "all"}
          />
        </div>

        {(searchTerm || dateFilterOption !== "all" || filterFromDate || filterToDate) && (
          <div className="flex justify-end mt-4">
            <Button 
              color="default"
              variant="bordered"
              onClick={handleRemoveFilters}
            >
              Remove All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Customer Count Card */}
      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <span className="font-semibold">Total Customers: {filteredData.length}</span>
          <Button 
            color="primary" 
            onClick={() => {
              setSelectedCustomer(null);
              onOpen();
            }}
          >
            Add New Customer
          </Button>
        </CardHeader>
      </Card>

      {/* Table Section */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress label="Loading..." size="lg" />
        </div>
      ) : (
        <>
          <DynamicTable
            columns={columns}
            data={paginatedData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            renderCell={renderCell}
          />

          {filteredData.length > 0 && (
            <div className="flex flex-col items-center py-4">
              <Pagination 
                color="secondary"
                page={currentPage} 
                total={totalPages} 
                onChange={setCurrentPage}
                className="mb-4"
              />
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} customers
              </div>
            </div>
          )}
        </>
      )}

      {/* Customer Modal */}
      <DynamicModal
        ModalOpen={isOpen}
        modalTitle={selectedCustomer ? "Edit Customer" : "Add New Customer"}
        inputs={modalInputs}
        buttons={modalButtons}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

export default CustomerList;