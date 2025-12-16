import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AdminCollegeStaff from "../admin/AdminCollegeStaff";

export default function CollegeStaffTab({ college, staff }) {
  const queryClient = useQueryClient();

  return (
    <div>
      <AdminCollegeStaff 
        staff={staff} 
        colleges={[college]} 
      />
    </div>
  );
}