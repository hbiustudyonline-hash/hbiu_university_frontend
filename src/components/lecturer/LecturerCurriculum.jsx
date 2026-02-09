import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function LecturerCurriculum() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Curriculum Management
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Manage course curriculum</h3>
              <Button>Create Curriculum</Button>
            </div>
            
            {/* Placeholder Content */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <div className="space-y-3">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="text-gray-500 font-semibold">No curriculum yet</p>
                <p className="text-gray-400 text-sm">Create and manage your course curriculum here</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
