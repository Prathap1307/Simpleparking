import React, { useState, useEffect } from 'react';
import DynamicTable from '../Tablecmp';
import Dynamicmodal from '../Modalcmp';
import CustomDangerAlert from '../Dangeralert';
import { CircularProgress } from "@heroui/react";

export default function Parkingsspace() {
  // Modal control
  const [isEditMode, setIsEditMode] = useState(false);
  const [CurrentEditItem, setCurrentEditItem] = useState(null);
  const [ModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Alert control
  const [showAlert, setShowAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Table & form data
  const [parkingData, setParkingData] = useState([]);
  const [ParkingName, setParkingName] = useState("");
  const [Location, setLocation] = useState("");
  const [price_per_day, setprice_per_day] = useState("");
  const [Price_per_hour, setPrice_per_hour] = useState("");
  const [Taxpercentage, setTaxpercentage] = useState("");
  const [Taxname, setTaxname] = useState("");
  const [Status, setStatus] = useState("active");
  const [Space, setSpace] = useState("");
  const [StrikePrice, setStrikePrice] = useState("");
  const [AvailableFacilities, setAvailableFacilities] = useState("");

  // Fetch locations
  const [LocationsData, setLocationsData] = useState([]);

  const columns = [
    { name: "PARKING NAME", uid: "ParkingName" },
    { name: "LOCATION", uid: "Location" },
    { name: "PRICE PER DAY", uid: "price_per_day" },
    { name: "PRICE PER HOUR", uid: "Price_per_hour" },
    { name: "STATUS", uid: "Status" },
    { name: "SPACE", uid: "Space" },
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
      const res = await fetch("/api/Parkingspace");
      if (!res.ok) throw new Error("Failed to fetch parking data.");
      const data = await res.json();
      setParkingData(data);
    } catch (err) {
      console.error("Error refreshing parking data:<br />", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTableData();
  }, []);

  const resetForm = () => {
    setParkingName("");
    setLocation("");
    setprice_per_day("");
    setPrice_per_hour("");
    setTaxpercentage("");
    setTaxname("");
    setSpace("");
    setStrikePrice("");
    setAvailableFacilities("");
    setStatus("active");
    setIsEditMode(false);
    setModalOpen(false);
  };

  const handleDelete = (item) => {
    if (!item?.id || !item?.Space) {
      console.error("Missing ID or Space key.<br />");
      return;
    }

    setItemToDelete(item);
    setShowAlert(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch('/api/Parkingspace', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemToDelete.id, Space: itemToDelete.Space }),
      });

      if (!res.ok) throw new Error('Failed to delete.<br />');

      console.log(`Deleted parking space with ID: ${itemToDelete.id}`);
      await refreshTableData();
    } catch (error) {
      console.error('Error deleting parking space:<br />', error);
      alert('Failed to delete parking space.<br />');
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

    setParkingName(item.ParkingName || "");
    setLocation(item.Location || "");
    setprice_per_day(Number(item.price_per_day) || "");
    setPrice_per_hour(Number(item.Price_per_hour) || "");
    setTaxpercentage(Number(item.Taxpercentage) || "");
    setTaxname(item.Taxname || "");
    setSpace(Number(item.Space) || "");
    setStrikePrice(Number(item.StrikePrice) || "");
    setAvailableFacilities(item.AvailableFacilities || "");
    setStatus(item.Status || "active");
  };

  const modalInputs = [
    { label: "Parking Name", value: ParkingName, onChange: (e) => setParkingName(e.target.value), type: "text" },
    {
      label: "Airport",
      value: Location,
      onChange: setLocation,
      type: "autocomplete",
      options: LocationsData.map(loc => ({
        label: loc.Airport_name,
        value: loc.Airport_name
      }))
    },
    { label: "Price Per Day", value: price_per_day, onChange: (e) => setprice_per_day(e.target.value), type: "number" },
    { label: "Price Per Hour", value: Price_per_hour, onChange: (e) => setPrice_per_hour(e.target.value), type: "number" },
    { label: "Strike Price", value: StrikePrice, onChange: (e) => setStrikePrice(e.target.value), type: "number" },
    { label: "Tax Percentage", value: Taxpercentage, onChange: (e) => setTaxpercentage(e.target.value), type: "number" },
    { label: "Tax Name", value: Taxname, onChange: (e) => setTaxname(e.target.value), type: "text" },
    { label: "Available Space", value: Space, onChange: (e) => setSpace(e.target.value), type: "number" },
    { label: "Available Facilities", value: AvailableFacilities, onChange: (e) => setAvailableFacilities(e.target.value), type: "text" },
    {
      label: "Status", value: Status, onChange: setStatus, type: "autocomplete",
      options: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }]
    }
  ];

  const modalButtons = [
    {
      text: "Close", color: "danger", variant: "flat", onClick: () => {
        resetForm();
        setModalOpen(false);
      }
    },
    {
      text: isEditMode ? "Update" : "Save", color: "primary", onClick: async () => {
        try {
          const parkingItem = {
            ...(isEditMode && { id: CurrentEditItem.id }),
            ParkingName,
            Location,
            price_per_day: Number(price_per_day),
            Price_per_hour: Number(Price_per_hour),
            StrikePrice: Number(StrikePrice),
            Taxpercentage: Number(Taxpercentage),
            Taxname,
            Status,
            Space: Number(Space),
            AvailableFacilities,
            updatedAt: new Date().toISOString()
          };

          if (!isEditMode) {
            const res = await fetch("/api/Parkingspace");
            const existingItems = await res.json();
            const numericIds = existingItems.map(item => parseInt(item.id)).filter(n => !isNaN(n));
            parkingItem.id = numericIds.length > 0 ? String(Math.max(...numericIds) + 1).padStart(2, '0') : "01";
            parkingItem.createdAt = new Date().toISOString();
          }

          const method = isEditMode ? 'PUT' : 'POST';
          const response = await fetch('/api/Parkingspace', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parkingItem),
          });

          if (!response.ok) throw new Error('Failed to save.<br />');

          await refreshTableData();
          resetForm();
          setModalOpen(false);
        } catch (error) {
          console.error('Error:<br />', error);
          alert(`Operation failed:<br /> ${error.message}`);
        }
      }
    }
  ];

  const fetchlocations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/Locations");
      if (!res.ok) throw new Error("Failed to fetch locations data.<br />");
      const data = await res.json();
      setLocationsData(data);
    } catch (err) {
      console.error("Error fetching locations data:<br />", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchlocations();
  }, []);

  return (
    <div>
      <div className='w-full flex justify-end p-4'>
        <Dynamicmodal
          triggerButton={{
            color: "primary",
            text: "Add New Parking Space",
            variant: "solid",
            onClick: () => { resetForm(); setIsEditMode(false); setModalOpen(true); }
          }}
          modalTitle={isEditMode ? "Edit Parking Space" : "Add New Parking Space"}
          inputs={modalInputs}
          buttons={modalButtons}
          showRememberMe={false}
          showForgotPassword={false}
          placement="top-center"
          ModalOpen={ModalOpen}
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
          data={parkingData}
          statusOptions={statusOptions}
          value="parkingspace"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showAlert && itemToDelete && (
        <div className="fixed bottom-6 right-6 z-50 w-[300px]">
          <CustomDangerAlert
            title="Confirm Deletion"
            message={`Are you sure you want to delete parking space ${itemToDelete.ParkingName}?`}
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
