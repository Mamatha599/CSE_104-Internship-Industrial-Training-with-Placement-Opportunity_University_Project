# Database Schema

## User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['student', 'faculty', 'placement_cell', 'recruiter']),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Student Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  studentId: String (unique),
  department: String,
  course: String,
  semester: Number,
  cgpa: Number,
  skills: [String],
  interests: [String],
  resume: {
    filename: String,
    url: String,
    uploadDate: Date
  },
  profileCompleted: Boolean,
  placementStatus: String (enum: ['seeking', 'placed', 'not_interested']),
  assignedMentor: ObjectId (ref: Faculty),
  createdAt: Date,
  updatedAt: Date
}
```

## Faculty Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  employeeId: String (unique),
  department: String,
  designation: String,
  assignedStudents: [ObjectId] (ref: Student),
  createdAt: Date,
  updatedAt: Date
}
```

## Opportunity Collection
```javascript
{
  _id: ObjectId,
  title: String,
  company: String,
  description: String,
  type: String (enum: ['internship', 'placement']),
  location: String,
  salary: Number,
  requirements: [String],
  skills: [String],
  eligibility: {
    minCGPA: Number,
    departments: [String],
    courses: [String]
  },
  applicationDeadline: Date,
  status: String (enum: ['active', 'closed', 'draft']),
  postedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Application Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: Student),
  opportunityId: ObjectId (ref: Opportunity),
  status: String (enum: ['pending', 'approved', 'rejected', 'shortlisted', 'selected']),
  coverLetter: String,
  additionalInfo: String,
  appliedDate: Date,
  reviewedBy: ObjectId (ref: User),
  reviewedDate: Date,
  feedback: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Feedback Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: Student),
  opportunityId: ObjectId (ref: Opportunity),
  rating: Number (1-5),
  feedback: String,
  feedbackBy: ObjectId (ref: User),
  feedbackType: String (enum: ['mentor', 'employer', 'student']),
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes

### User Collection
- `email: 1` (unique)
- `role: 1`

### Student Collection
- `userId: 1` (unique)
- `studentId: 1` (unique)
- `department: 1`
- `placementStatus: 1`

### Opportunity Collection
- `status: 1`
- `type: 1`
- `applicationDeadline: 1`
- `postedBy: 1`

### Application Collection
- `studentId: 1, opportunityId: 1` (compound, unique)
- `status: 1`
- `appliedDate: 1`