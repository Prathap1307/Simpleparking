"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@heroui/react";
import jsPDF from 'jspdf';

export const EyeIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M12.9833 10C12.9833 11.65 11.65 12.9833 10 12.9833C8.35 12.9833 7.01666 11.65 7.01666 10C7.01666 8.35 8.35 7.01666 10 7.01666C11.65 7.01666 12.9833 8.35 12.9833 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M9.99999 16.8916C12.9417 16.8916 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00831 17.5917 7.83331C15.6833 4.83331 12.9417 3.09998 9.99999 3.09998C7.05833 3.09998 4.31666 4.83331 2.40833 7.83331C1.65833 9.00831 1.65833 10.9833 2.40833 12.1583C4.31666 15.1583 7.05833 16.8916 9.99999 16.8916Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const DeleteIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M8.60834 13.75H11.3833"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.91669 10.4167H12.0834"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const EditIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M2.5 18.3333H17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const PrintIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M6 17.9827C4.44655 17.9354 3.51998 17.7626 2.87868 17.1213C2 16.2426 2 14.8284 2 12C2 9.17157 2 7.75736 2.87868 6.87868C3.75736 6 5.17157 6 8 6H16C18.8284 6 20.2426 6 21.1213 6.87868C22 7.75736 22 9.17157 22 12C22 14.8284 22 16.2426 21.1213 17.1213C20.48 17.7626 19.5535 17.9354 18 17.9827"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 10H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 14H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18 6V5.2C18 4.0799 18 3.51984 17.782 3.09202C17.5903 2.71569 17.2843 2.40973 16.908 2.21799C16.4802 2 15.9201 2 14.8 2H9.2C8.0799 2 7.51984 2 7.09202 2.21799C6.71569 2.40973 6.40973 2.71569 6.21799 3.09202C6 3.51984 6 4.0799 6 5.2V6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6 18V19.8C6 20.9201 6 21.4802 6.21799 21.908C6.40973 22.2843 6.71569 22.5903 7.09202 22.782C7.51984 23 8.0799 23 9.2 23H14.8C15.9201 23 16.4802 23 16.908 22.782C17.2843 22.5903 17.5903 22.2843 17.782 21.908C18 21.4802 18 20.9201 18 19.8V18"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
};

const DynamicTable = ({ columns, data, statusOptions, onEdit, onDelete, currentPage, totalPages }) => {
  const generatePDF = (item) => {
    // Convert 30cm x 16cm to pixels (1cm ≈ 28.35px)
    const width = 30 * 28.35;
    const height = 16 * 28.35;
    
    const doc = new jsPDF({
      orientation: width > height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [width, height]
    });

    // Add logo or header
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 128); // Navy blue color
    doc.text("SIMPLE PARKING RECEIPT", width/2, 40, { align: "center" });
    
    // Add border
    doc.setDrawColor(0, 0, 128);
    doc.setLineWidth(2);
    doc.rect(20, 20, width-40, height-40);

    // Add customer details section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("CUSTOMER DETAILS", 30, 80);
    doc.setFontSize(12);
    doc.text(`Order ID: ${item.OrderId || "N/A"}`, 30, 100);
    doc.text(`Customer Name: ${item.ParkingName.replace(/\(.*\)/, '').trim() || "N/A"}`, 30, 120);
    doc.text(`Email: ${item.CustomerEmail || "N/A"}`, 30, 140);
    doc.text(`Phone: ${item.CustomerPhone || "N/A"}`, 30, 160);

    // Add booking details section
    doc.setFontSize(16);
    doc.text("BOOKING DETAILS", width/2 + 30, 80);
    doc.setFontSize(12);
    doc.text(`Parking Space: ${item.ParkingSlot || "N/A"}`, width/2 + 30, 100);
    doc.text(`Airport: ${item.Airport || "N/A"}`, width/2 + 30, 120);
    doc.text(`From: ${formatDate(item.FromDate)} ${formatTime(item.FromTime)}`, width/2 + 30, 140);
    doc.text(`To: ${formatDate(item.ToDate)} ${formatTime(item.ToTime)}`, width/2 + 30, 160);

    // Add payment details section
    doc.setFontSize(16);
    doc.text("PAYMENT DETAILS", 30, 200);
    doc.setFontSize(12);
    doc.text(`Paid Amount: $${item.PaidAmount || "0"}`, 30, 220);
    doc.text(`Payment Method: ${item.PaymentMethod || "N/A"}`, 30, 240);
    doc.text(`Car Number: ${item.CarNumber || "N/A"}`, 30, 260);

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for choosing Simple Parking!", width/2, height - 50, { align: "center" });
    doc.text(`Generated on ${new Date().toLocaleString()}`, width/2, height - 30, { align: "center" });

    // Open in new tab
    window.open(doc.output('bloburl'), '_blank');
  };

  const handleEdit = (item) => {
    onEdit && onEdit(item);
  };

  const handleDelete = (item) => {
    onDelete && onDelete(item);
  };

  function formatDate(dateString) {
    if (!dateString) return "";

    if (dateString.includes("T")) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }

    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  function formatTime(timeString) {
    if (!timeString) return "";

    if (timeString.includes("T")) {
      const time = new Date(timeString);
      return time.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }

    return timeString; 
  }

  const renderCell = React.useCallback((item, columnKey) => {
    if (columnKey === "FromDate" || columnKey === "ToDate") {
      return formatDate(item[columnKey]);
    }
    if (columnKey === "FromTime" || columnKey === "ToTime") {
      return formatTime(item[columnKey]);
    }

    const cellValue = item[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{radius: "lg", src: item.avatar}}
            description={item.email}
            name={cellValue}
          >
            {item.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">{item.team}</p>
          </div>
        );
      case "Status":
        return (
          <Chip 
            className="capitalize" 
            color={statusOptions?.[item.Status] || "default"} 
            size="sm" 
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEdit(item)}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip content="Print">
              <span
                className="text-lg text-blue-500 cursor-pointer active:opacity-50"
                onClick={() => generatePDF(item)}
              >
                <PrintIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleDelete(item)}
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, [statusOptions]);

  return (
      <div>
        <Table aria-label="Dynamic table">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={data}>
            {(item) => (
              <TableRow key={`${item.id}-${currentPage}`}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <div className="mt-4 text-small text-default-500">
          Page {currentPage} of {totalPages} • {data.length} records
        </div>
      </div>
    );
  };

export default DynamicTable;