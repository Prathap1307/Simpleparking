import React from 'react'
import DynamicTable from '../Tablecmp'

export default function Settingspage() {

  const columns = [
  {name: "NAME", uid: "name"},
  {name: "ROLE", uid: "role"},
  {name: "STATUS", uid: "status"},
  {name: "ACTIONS", uid: "actions"},
];

// Define your status color mapping (optional)
const statusOptions = {
  active: "success",
  inactive: "danger",
  pending: "warning",
};

// Get your data from the database
const users = [
  {
    id: 1,
    name: "John Doe",
    role: "Developer",
    team: "Engineering",
    status: "active",
    avatar: "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcT0nCVAkm3ui5aY_h5clCn_vHx2iFlUfsjDuTnjWBtZc_bqHFcPNlGXnEkxUIf7-pTOQleO1UFG5zofBPeQ-3oLbmG3TJ5neyGnYNbw1dvwCVmNz9I0qcRXT1aCpnwEZudHLhuU0TWeXw",
    email: "john@example.com"
  },
  // ... more users
];

  return (
    <DynamicTable
      columns={columns} 
      data={users} 
      statusOptions={statusOptions} 
     />
  );
}
