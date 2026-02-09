import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function CourseFilters({ filters, setFilters, colleges = [] }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Select 
        value={filters.program} 
        onValueChange={(value) => setFilters({ ...filters, program: value })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Program" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Programs</SelectItem>
          <SelectItem value="Associate">Associate</SelectItem>
          <SelectItem value="Bachelor">Bachelor</SelectItem>
          <SelectItem value="Master">Master</SelectItem>
          <SelectItem value="Doctorate">Doctorate</SelectItem>
          <SelectItem value="PhD">PhD</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filters.status} 
        onValueChange={(value) => setFilters({ ...filters, status: value })}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>

      {colleges.length > 0 && (
        <Select 
          value={filters.college} 
          onValueChange={(value) => setFilters({ ...filters, college: value })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="College" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colleges</SelectItem>
            {colleges.map(college => (
              <SelectItem key={college.id} value={college.id}>
                {college.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}