import React, { useState, useEffect } from 'react';
import DynamicTable from '../Tablecmp';
import Dynamicmodal from '../Modalcmp';
import CustomDangerAlert from '../Dangeralert';
import { CircularProgress } from "@heroui/react";

export default function AvailableLocations() {
  // Modal control
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Alert control
  const [showAlert, setShowAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Table & form data
  const [locationsData, setLocationsData] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [airportName, setAirportName] = useState("");
  const [terminals, setTerminals] = useState(1);
  const [county, setCounty] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("active");
  const [activationDate, setActivationDate] = useState(null);
  const [activationTime, setActivationTime] = useState(null);

  // Check for pending activations
  useEffect(() => {
    const checkActivations = () => {
      const now = new Date();
      locationsData.forEach(async (location) => {
        if (location.Status === "inactive" && location.NextActivation) {
          const activationTime = new Date(location.NextActivation);
          if (now >= activationTime) {
            await updateLocationStatus(location.id, "active");
          }
        }
      });
    };

    const interval = setInterval(checkActivations, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [locationsData]);

  const updateLocationStatus = async (id, newStatus) => {
    try {
      const response = await fetch('/api/Locations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id,
          Status: newStatus,
          NextActivation: null 
        }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      await refreshTableData();
    } catch (error) {
      console.error('Error updating location status:', error);
    }
  };

  const columns = [
    { name: "LOCATION NAME", uid: "Location_name" },
    { name: "AIRPORT NAME", uid: "Airport_name" },
    { name: "TERMINALS", uid: "Terminals" },
    { name: "COUNTY", uid: "County" },
    { name: "COUNTRY", uid: "Country" },
    { name: "STATUS", uid: "Status" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const statusOptions = {
    active: "success",
    inactive: "danger",
    pending: "warning",
  };

  const refreshTableData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/Locations");
      if (!res.ok) throw new Error("Failed to fetch locations data");
      const data = await res.json();
      setLocationsData(data);
    } catch (err) {
      console.error("Error refreshing locations data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTableData();
  }, []);

  const resetForm = () => {
    setLocationName("");
    setAirportName("");
    setTerminals(1);
    setCounty("");
    setCountry("");
    setStatus("active");
    setActivationDate(null);
    setActivationTime(null);
    setIsEditMode(false);
    setModalOpen(false);
  };

  const handleDelete = (item) => {
    if (!item?.id) {
      console.error("Missing ID key");
      return;
    }
    setItemToDelete(item);
    setShowAlert(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch('/api/Locations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemToDelete.id }),
      });

      if (!res.ok) throw new Error('Failed to delete');
      await refreshTableData();
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Failed to delete location.');
    } finally {
      setShowAlert(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowAlert(false);
    setItemToDelete(null);
  };

  const handleEdit = (item) => {
    setCurrentEditItem(item);
    setIsEditMode(true);
    setModalOpen(true);

    setLocationName(item.Location_name || "");
    setAirportName(item.Airport_name || "");
    setTerminals(item.Terminals || 1);
    setCounty(item.County || "");
    setCountry(item.Country || "");
    setStatus(item.Status || "active");
    
    if (item.NextActivation) {
      const nextActivation = new Date(item.NextActivation);
      setActivationDate(new Date(nextActivation));
      const time = new Date(0, 0, 0, nextActivation.getHours(), nextActivation.getMinutes());
      setActivationTime(time);
    } else {
      setActivationDate(null);
      setActivationTime(null);
    }
  };

  const handleSave = async () => {
    try {
      let nextActivation = null;
      if (status === "inactive" && activationDate && activationTime) {
        nextActivation = new Date(
          activationDate.getFullYear(),
          activationDate.getMonth(),
          activationDate.getDate(),
          activationTime.getHours(),
          activationTime.getMinutes()
        ).toISOString();
      }

      const locationItem = {
        ...(isEditMode && { id: currentEditItem.id }),
        Location_name: locationName,
        Airport_name: airportName,
        Terminals: parseInt(terminals) || 1,
        County: county,
        Country: country,
        Status: status,
        ...(nextActivation && { NextActivation: nextActivation }),
        updatedAt: new Date().toISOString()
      };

      if (!isEditMode) {
        const res = await fetch("/api/Locations");
        const existingItems = await res.json();
        const numericIds = existingItems.map(item => parseInt(item.id)).filter(n => !isNaN(n));
        locationItem.id = numericIds.length > 0 
          ? String(Math.max(...numericIds) + 1).padStart(2, '0') 
          : "01";
        locationItem.createdAt = new Date().toISOString();
      }

      const method = isEditMode ? 'PUT' : 'POST';
      const response = await fetch('/api/Locations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationItem),
      });

      if (!response.ok) throw new Error('Failed to save');
      await refreshTableData();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert(`Operation failed: ${error.message}`);
    }
  };

  const modalInputs = [
    {
      label: "Location Name", 
      value: locationName, 
      onChange: (e) => setLocationName(e.target.value), 
      type: "text"
    },
    {
      label: "Airport Name", 
      value: airportName, 
      onChange: (e) => setAirportName(e.target.value), 
      type: "text"
    },
    {
      label: "Available Terminals", 
      value: terminals, 
      onChange: (e) => setTerminals(e.target.value), 
      type: "number",
      min: 1
    },
    {
      label: "County", 
      value: county, 
      onChange: (e) => setCounty(e.target.value), 
      type: "text"
    },
    {
      label: "Country", 
      value: country, 
      onChange: (e) => setCountry(e.target.value), 
      type: "text"
    },
    {
      label: "Status", 
      value: status, 
      onChange: (value) => {
        setStatus(value);
        if (value === "active") {
          setActivationDate(null);
          setActivationTime(null);
        }
      }, 
      type: "autocomplete",
      options: [
        { label: "Active", value: "active" }, 
        { label: "Inactive", value: "inactive" }
      ]
    },
    ...(status === "inactive" ? [
      {
        label: "Next Activation Date", 
        value: activationDate ? activationDate.toISOString().split('T')[0] : "", 
        onChange: (e) => {
          const date = e.target.value ? new Date(e.target.value) : null;
          setActivationDate(date);
        }, 
        type: "date"
      },
      {
        label: "Next Activation Time", 
        value: activationTime ? activationTime.toTimeString().substring(0, 5) : "", 
        onChange: (e) => {
          const timeStr = e.target.value;
          let time = null;
          if (timeStr) {
            const [hours, minutes] = timeStr.split(':');
            time = new Date();
            time.setHours(parseInt(hours));
            time.setMinutes(parseInt(minutes));
          }
          setActivationTime(time);
        }, 
        type: "time"
      }
    ] : [])
  ];

  const modalButtons = [
    {
      text: "Close", 
      color: "danger", 
      variant: "flat", 
      onClick: () => {
        resetForm();
        setModalOpen(false);
      }
    },
    {
      text: isEditMode ? "Update" : "Save", 
      color: "primary", 
      onClick: handleSave
    }
  ];

  return (
    <div>
      <div className='w-full flex justify-end p-4'>
        <Dynamicmodal
          triggerButton={{
            color: "primary",
            text: "Add New Location",
            variant: "solid",
            onClick: () => { resetForm(); setIsEditMode(false); setModalOpen(true); }
          }}
          modalTitle={isEditMode ? "Edit Location" : "Add New Location"}
          inputs={modalInputs}
          buttons={modalButtons}
          showRememberMe={false}
          showForgotPassword={false}
          placement="top-center"
          ModalOpen={modalOpen}
          Editmode={isEditMode}
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress
            color="success"
            formatOptions={{ style: "unit", unit: "kilometer" }}
            label="Loading..."
            showValueLabel={true}
            size="lg"
            value={100}
          />
        </div>
      ) : (
        <DynamicTable
          columns={columns}
          data={locationsData}
          statusOptions={statusOptions}
          value="locations"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showAlert && itemToDelete && (
        <div className="fixed bottom-6 right-6 z-50 w-[300px]">
          <CustomDangerAlert
            title="Confirm Deletion"
            message={`Are you sure you want to delete ${itemToDelete.Location_name}?`}
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