import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_DEGREE_PROGRAMS = [
  // Associate Programs
  "Associate of Arts in Theology",
  "Associate of Arts in Biblical Studies",
  "Associate of Arts in Christian Ministry",
  "Associate of Arts in Clinical Mental Health Counseling",
  "Associate of Science in Business Administration",
  "Associate of Arts in Leadership & Cultural Management",
  
  // Bachelor Programs
  "Bachelor of Arts in Theology",
  "Bachelor of Arts in Biblical Studies",
  "Bachelor of Arts in Christian Ministry",
  "Bachelor of Science in Psychology",
  "Bachelor of Science in Business Administration",
  "Bachelor of Science in Nursing",
  "Bachelor of Arts in Education",
  "Bachelor of Science in Computer Science",
  "Bachelor of Arts in Communication",
  "Bachelor of Science in Psychology, Minor in Clinical Chaplaincy Psychotherapy",
  "Bachelor of Architecture, Minor in Religious Artifacts",
  "Bachelor of Arts in Human Resources, Minor in Non-Profit Human Resources and Management",
  "Bachelor of Humanitarianism and Conflict Response, Minor in Faith-Based Humanitarian Response",
  "Bachelor of Project Management, Minor in Non-Profit Project Management",
  "Bachelor of Public Administration, Minor in Faith-Based Public Policy and Administration",
  "Bachelor of Science Psychotherapy, Minor in Clinical Mental Health Faith-Based Counseling",
  "Bachelor of Science Christian Counseling & Psychology, Minor in Clinical Mental Health Counseling",
  "Bachelor of Science in Health Policy and Advocacy, Minor in Health Ministry",
  "Bachelor of Science in Healthcare Leadership and Management, Minor in Health Ministry",
  "Bachelor of Agribusiness, Minor in Non-Profit Sustainable and Community Development",
  "Bachelor of Theology, Minor in Education",
  "Bachelor of Human Resources, Minor in Faith-Based Resources and Management",
  "Bachelor of Divinity, Minor in Leadership & Cultural Management",
  "Bachelor of Emergency Management, Minor in Faith-Based Emergency Management",
  "Bachelor of English Literature, Minor in Non-Profit Arts and Culture Management",
  "Bachelor of Divinity, Major in Chaplaincy, Counseling & Psychology",
  "Bachelor of Divinity, Major in Clinical Mental Health Counseling",
  "Bachelor of Divinity, Minor in Counseling",
  "Bachelor of Ministry, Minor in Leadership",
  "Bachelor of Biblical Study, Major in Education and Ministry",
  "Bachelor of Education, Minor in Diverse Ministry Education",
  "Bachelor of Business Administration, Minor in Non-Profit Business Management",
  "Bachelor of Business Management, Minor in Faith-Based Policy",
  "Bachelor of Marketing and Advertising, Minor in Grant Writing for Non-Profit",
  "Bachelor of Public Health, Minor in Health Ministry",
  "Bachelor of Addiction Counseling, Minor in Faith-Based Recovery Services",
  "Bachelor of Life Coaching, Minor in Faith-Based Counseling and Mentoring",
  "Bachelor of Media Production, Minor in Faith-Based Media and Communication",
  "Bachelor of Legal Science, Minor in Laws that Govern Non-Profit Organization",
  "Bachelor of Public Policy, Minor in Public Policy in Non-Profit",
  "Bachelor of Religious Law, Minor in Law and Policy",
  "Bachelor of Law and Digital Technologies, Minor in Faith-Based Org. Laws",
  "Bachelor of International Law and Treaty Law, Minor in Faith-Based Org. Laws",
  "Bachelor of Juridical Science (SJD), Minor in Non-Profit Laws",
  "Bachelor of Law and Politics, Minor in Laws that govern church and state",
  "Bachelor of Christian Law, Minor in Law and Ethics",
  "Bachelor of Iconic Leadership, Minor in Faith-Based Leadership",
  "Bachelor of Music Production, Minor in Arts and Theater Ministry",
  "Bachelor of Science in IT Support, Minor in Technology Management for Faith-Based Organizations",
  "Bachelor of Data Analytics, Minor in Faith-Based Data-Driven Decision Making",
  "Bachelor of UX Design, Minor in Digital Ministry",
  "Bachelor of Science in Cyber Security, Minor in Data Protection for Faith-Based Organizations",
  "Bachelor of Science in Healthcare Administration, Minor in Health Ministry",
  "Bachelor of Science in Healthcare Management, Minor in Health Ministry",
  "Bachelor of Science in Healthcare Administration, Minor in Christian Healthcare Ethics",
  "Bachelor of Science in Public Health, Minor in Jewish Studies: Bioethics and Healthcare",
  "Bachelor of Science in Health Education, Minor in World Religion Healthcare and Spirituality",
  "Bachelor of Science in Public Health, Bioethics, Minor in Healthcare Ministry",
  "Bachelor of Science in Healthcare Policy, Minor in Health Ministry Bioethics",
  "Bachelor of Global Health, Minor in Faith-Based Healthcare and Development",
  "Bachelor of Health Informatics, Minor in Spirituality and Healthcare Technology",
  "Bachelor of Healthcare Management, Minor in Christian Business Ethics in Healthcare",
  "Bachelor of Epidemiology, Minor in Jewish Studies: Epidemiology and Public Health",
  "Bachelor of Biomedical Engineering, Minor in Catholic Bioethics and Medical Engineering",
  "Bachelor of Operational Management, Minor in Faith-Based Operational Leadership",
  "Bachelor of International Business, Minor in Non-Profit International Business and Development",
  "Bachelor of Business, Major in Tourism, Minor in Non-Profit Community Development",
  "Bachelor of Human Resources, Minor in Faith-Based Resources Management",
  "Bachelor of Organizational Leadership, Minor in Christian Ethics",
  "Bachelor of Strategic Leadership, Minor in Jewish Studies: Leadership and Ethics",
  "Bachelor of Leadership Studies, Minor in Understanding Leadership in World Religions",
  "Bachelor of Educational Leadership, Minor in Faith-Based Educational Administration",
  "Bachelor of Transformational Leadership, Minor in Servant Leadership in Ministry",
  "Bachelor of Leadership and Management, Minor in Islamic Leadership Principles",
  "Bachelor of Public Administration, Minor in Faith-Based Public Policy and Administration",
  "Bachelor of Nonprofit Management, Minor in Church Administration",
  "Bachelor of Event Management, Minor in Faith-Based Event Planning",
  "Bachelor of Hospitality Management, Minor in Ministry Hospitality",
  "Bachelor of Supply Chain Management, Minor in Faith-Based Logistics",
  "Bachelor of Finance, Minor in Stewardship and Financial Ethics",
  "Bachelor of Accounting, Minor in Non-Profit Accounting",
  "Bachelor of Economics, Minor in Faith-Based Economic Development",
  "Bachelor of Entrepreneurship, Minor in Social Entrepreneurship",
  "Bachelor of Real Estate, Minor in Faith-Based Property Management",
  "Bachelor of Insurance and Risk Management, Minor in Faith-Based Risk Assessment",
  "Bachelor of Banking and Finance, Minor in Ethical Banking",
  "Bachelor of Investment Management, Minor in Faith-Based Investment Strategies",
  "Bachelor of Marketing, Minor in Faith-Based Branding",
  "Bachelor of Digital Marketing, Minor in Digital Ministry Marketing",
  "Bachelor of Sales Management, Minor in Ethical Sales Practices",
  "Bachelor of Customer Relations, Minor in Ministry Engagement",
  "Bachelor of Brand Management, Minor in Faith-Based Identity",
  "Bachelor of Advertising, Minor in Faith-Based Communication",
  "Bachelor of Public Relations, Minor in Ministry Communications",
  "Bachelor of Media Studies, Minor in Faith-Based Media Analysis",
  "Bachelor of Journalism, Minor in Religious Journalism",
  "Bachelor of Broadcasting, Minor in Faith-Based Broadcasting",
  "Bachelor of Film Production, Minor in Faith-Based Filmmaking",
  "Bachelor of Photography, Minor in Religious Art Photography",
  "Bachelor of Graphic Design, Minor in Faith-Based Visual Arts",
  "Bachelor of Web Design, Minor in Digital Ministry Design",
  "Bachelor of Animation, Minor in Faith-Based Animation",
  "Bachelor of Game Design, Minor in Educational Gaming for Ministry",
  "Bachelor of Music, Minor in Worship Arts",
  "Bachelor of Music Education, Minor in Church Music Ministry",
  "Bachelor of Music Therapy, Minor in Healing Arts Ministry",
  "Bachelor of Performing Arts, Minor in Drama Ministry",
  "Bachelor of Dance, Minor in Liturgical Dance",
  "Bachelor of Theater Arts, Minor in Christian Theater",
  "Bachelor of Fine Arts, Minor in Sacred Arts",
  "Bachelor of Art History, Minor in Religious Art",
  "Bachelor of Creative Writing, Minor in Faith-Based Writing",
  "Bachelor of English, Minor in Biblical Literature",
  "Bachelor of Literature, Minor in Theological Literature",
  "Bachelor of Linguistics, Minor in Biblical Languages",
  "Bachelor of Translation Studies, Minor in Biblical Translation",
  "Bachelor of Interpretation, Minor in Ministry Interpretation",
  "Bachelor of Foreign Languages, Minor in Mission Languages",
  "Bachelor of Spanish, Minor in Hispanic Ministry",
  "Bachelor of French, Minor in Francophone Ministry",
  "Bachelor of Arabic, Minor in Islamic Studies",
  "Bachelor of Hebrew, Minor in Jewish Studies",
  "Bachelor of Greek, Minor in New Testament Studies",
  "Bachelor of Latin, Minor in Church History",
  "Bachelor of History, Minor in Church History",
  "Bachelor of Ancient History, Minor in Biblical Archaeology",
  "Bachelor of Medieval Studies, Minor in Medieval Theology",
  "Bachelor of Renaissance Studies, Minor in Reformation History",
  "Bachelor of Modern History, Minor in Modern Church History",
  "Bachelor of American History, Minor in American Religious History",
  "Bachelor of World History, Minor in World Religions",
  "Bachelor of Political Science, Minor in Faith-Based Politics",
  "Bachelor of International Relations, Minor in Faith-Based Diplomacy",
  "Bachelor of Sociology, Minor in Sociology of Religion",
  "Bachelor of Anthropology, Minor in Religious Anthropology",
  "Bachelor of Geography, Minor in Mission Geography",
  "Bachelor of Environmental Science, Minor in Creation Care",
  "Bachelor of Environmental Studies, Minor in Faith-Based Environmentalism",
  "Bachelor of Sustainability, Minor in Faith-Based Sustainability",
  "Bachelor of Conservation, Minor in Stewardship of Creation",
  "Bachelor of Forestry, Minor in Faith-Based Conservation",
  "Bachelor of Agriculture, Minor in Faith-Based Farming",
  "Bachelor of Horticulture, Minor in Garden Ministry",
  "Bachelor of Animal Science, Minor in Animal Welfare Ministry",
  "Bachelor of Veterinary Science, Minor in Compassionate Care",
  "Bachelor of Marine Biology, Minor in Ocean Stewardship",
  "Bachelor of Wildlife Biology, Minor in Conservation Ministry",
  "Bachelor of Biology, Minor in Bioethics",
  "Bachelor of Chemistry, Minor in Faith and Science",
  "Bachelor of Physics, Minor in Faith and Science",
  "Bachelor of Mathematics, Minor in Mathematical Philosophy",
  "Bachelor of Statistics, Minor in Data Ministry",
  "Bachelor of Actuarial Science, Minor in Faith-Based Risk Analysis",
  "Bachelor of Computer Engineering, Minor in Technology Ministry",
  "Bachelor of Software Engineering, Minor in Faith-Based Software Development",
  "Bachelor of Information Technology, Minor in Digital Ministry",
  "Bachelor of Information Systems, Minor in Church Information Systems",
  "Bachelor of Network Administration, Minor in Faith-Based IT Support",
  "Bachelor of Database Management, Minor in Church Data Management",
  "Bachelor of Artificial Intelligence, Minor in AI Ethics",
  "Bachelor of Machine Learning, Minor in Ethical AI",
  "Bachelor of Robotics, Minor in Technology and Humanity",
  "Bachelor of Mechatronics, Minor in Engineering Ethics",
  "Bachelor of Electrical Engineering, Minor in Faith-Based Engineering",
  "Bachelor of Mechanical Engineering, Minor in Engineering Ministry",
  "Bachelor of Civil Engineering, Minor in Infrastructure Ministry",
  "Bachelor of Chemical Engineering, Minor in Chemical Ethics",
  "Bachelor of Industrial Engineering, Minor in Workplace Ministry",
  "Bachelor of Manufacturing Engineering, Minor in Ethical Manufacturing",
  "Bachelor of Aerospace Engineering, Minor in Creation Exploration",
  "Bachelor of Automotive Engineering, Minor in Transportation Ministry",
  "Bachelor of Environmental Engineering, Minor in Creation Care Engineering",
  "Bachelor of Urban Planning, Minor in Faith-Based Urban Development",
  
  // Master Programs
  "Master of Divinity",
  "Master of Arts in Theology",
  "Master of Arts in Christian Counseling",
  "Master of Arts in Ministry Leadership",
  "Master of Business Administration",
  "Master of Science in Nursing",
  "Master of Education",
  "Master of Public Health",
  "Master of Science in Clinical Mental Health Counseling",
  
  // Doctorate Programs
  "Doctor of Ministry",
  "Doctor of Theology",
  "Doctor of Education",
  "Doctor of Business Administration",
  "Doctor of Nursing Practice",
  
  // PhD Programs
  "PhD in Theology",
  "PhD in Biblical Studies",
  "PhD in Ministry",
  "PhD in Psychology",
  "PhD in Education",
  "PhD in Business Administration"
];

export default function EditCourseDialog({ open, onClose, onSubmit, course, isLoading, lecturers, colleges, isAdmin }) {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    program: 'Bachelor',
    degree_program: '',
    semester: '',
    credits: 3,
    enrollment_limit: 30,
    status: 'draft',
    instructor: '',
    instructor_name: '',
    college_id: '',
    college_name: ''
  });

  useEffect(() => {
    if (course) {
      setFormData({
        code: course.code || '',
        title: course.title || '',
        description: course.description || '',
        program: course.program || 'Bachelor',
        degree_program: course.degree_program || '',
        semester: course.semester || '',
        credits: course.credits || 3,
        enrollment_limit: course.enrollment_limit || 30,
        status: course.status || 'draft',
        instructor: course.instructor || '',
        instructor_name: course.instructor_name || '',
        college_id: course.college_id || '',
        college_name: course.college_name || ''
      });
    }
  }, [course]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCollegeChange = (collegeId) => {
    const college = colleges?.find(c => c.id === collegeId);
    setFormData(prev => ({
      ...prev,
      college_id: collegeId,
      college_name: college?.name || ''
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program">Program Level *</Label>
              <Select value={formData.program} onValueChange={(value) => handleChange('program', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Associate">Associate</SelectItem>
                  <SelectItem value="Bachelor">Bachelor</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="Doctorate">Doctorate</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="degree_program">Degree Program *</Label>
            <Select value={formData.degree_program} onValueChange={(value) => handleChange('degree_program', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a degree program" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {ALL_DEGREE_PROGRAMS.map(program => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="college">College/Department *</Label>
            <Select value={formData.college_id} onValueChange={handleCollegeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a college" />
              </SelectTrigger>
              <SelectContent>
                {colleges?.map(college => (
                  <SelectItem key={college.id} value={college.id}>
                    {college.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isAdmin && lecturers && (
            <div className="space-y-2">
              <Label htmlFor="instructor">Assign Lecturer *</Label>
              <Select 
                value={formData.instructor} 
                onValueChange={(value) => {
                  const lecturer = lecturers.find(l => l.email === value);
                  handleChange('instructor', value);
                  handleChange('instructor_name', lecturer?.full_name || '');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a lecturer" />
                </SelectTrigger>
                <SelectContent>
                  {lecturers.map(lecturer => (
                    <SelectItem key={lecturer.email} value={lecturer.email}>
                      {lecturer.full_name} ({lecturer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Input
                id="semester"
                value={formData.semester}
                onChange={(e) => handleChange('semester', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="10"
                value={formData.credits}
                onChange={(e) => handleChange('credits', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollment_limit">Enrollment Limit</Label>
              <Input
                id="enrollment_limit"
                type="number"
                min="1"
                value={formData.enrollment_limit}
                onChange={(e) => handleChange('enrollment_limit', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}