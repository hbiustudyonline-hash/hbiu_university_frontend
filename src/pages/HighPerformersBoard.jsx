import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import Layout from "@/Layout";

export default function HighPerformersBoard() {
  return (
    <Layout currentPageName="HighPerformersBoard">
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 md:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  High Performers
                </h1>
              </div>
              <p className="text-purple-100 text-lg">
                Celebrate our top-performing students and their achievements
              </p>
            </div>
          </div>

          {/* Content Section */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <div className="space-y-3">
                  <Award className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="text-gray-500 font-semibold">High Performers Board</p>
                  <p className="text-gray-400 text-sm">Top-performing students will be featured here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
