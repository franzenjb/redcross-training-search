#!/usr/bin/env python3
"""
Add course codes and prerequisite relationships to courses.json
"""

import json
from pathlib import Path

# Load the courses with codes
with open('courses-with-codes.json', 'r') as f:
    courses = json.load(f)

# Define prerequisite relationships based on our analysis
prerequisites = {
    # Power BI Series
    "Applying Standards to Reports and Data Modeling (Power BI)": ["Introduction to Creating Power BI Visuals"],
    
    # Instructor Progression
    "Advanced Instructor Fundamentals": ["Basic Instructor Fundamentals"],
    "Basic Instructor Specialty Training": ["Basic Instructor Fundamentals"],
    
    # Disaster Services Progression (based on logical flow)
    "Disaster Assessment: Advanced Concepts": ["Disaster Assessment Fundamentals"],
    "Shelter Operations: Advanced Operations": ["Shelter Fundamentals Workshop"],
    "Advanced Disaster Health Services": ["Introduction to Disaster Health Services"],
    
    # Youth Programs
    "Basic Instructor Fundamentals for Youth": ["Basic Instructor Fundamentals"],
    
    # Feeding Operations
    "Feeding Fundamentals": [],
    "Mobile Feeding Operations": ["Feeding Fundamentals"],
    "Fixed Site Feeding Operations": ["Feeding Fundamentals"],
    
    # Case Management
    "Disaster Case Management Fundamentals": [],
    "Advanced Disaster Case Management": ["Disaster Case Management Fundamentals"],
    
    # Mental Health
    "Psychological First Aid": [],
    "Disaster Mental Health Fundamentals": ["Psychological First Aid"],
    
    # Technology
    "RC View Fundamentals": [],
    "RC View: Advanced Features": ["RC View Fundamentals"],
    
    # Deploy
    "Deployment Fundamentals": [],
    "International Deployment Orientation": ["Deployment Fundamentals"],
}

# Create a mapping of course names to courses for easy lookup
course_by_name = {}
for course in courses:
    course_by_name[course['name']] = course

# Add prerequisites and related courses to each course
for course in courses:
    # Add prerequisite field
    course_prereqs = prerequisites.get(course['name'], [])
    course['prerequisites'] = course_prereqs
    
    # Find related courses (same family, different levels)
    related = []
    if 'courseCode' in course:
        course_code = course['courseCode']
        if course_code:
            # Parse the course code (e.g., "DSAS 13001")
            parts = course_code.split()
            if len(parts) == 2:
                subject = parts[0]
                code_num = parts[1]
                if len(code_num) >= 3:
                    level = code_num[0]
                    family = code_num[1:3]
                    
                    # Find other courses in same family
                    for other in courses:
                        if other['id'] != course['id'] and 'courseCode' in other:
                            other_code = other['courseCode']
                            if other_code and other_code.startswith(subject):
                                other_parts = other_code.split()
                                if len(other_parts) == 2:
                                    other_num = other_parts[1]
                                    if len(other_num) >= 3:
                                        other_family = other_num[1:3]
                                        if other_family == family:
                                            # Same family, add as related
                                            related.append({
                                                'id': other['id'],
                                                'name': other['name'],
                                                'code': other['courseCode'],
                                                'level': other['level']
                                            })
    
    course['relatedCourses'] = related[:3]  # Limit to 3 related courses
    
    # Identify if this course is a prerequisite for others
    is_prereq_for = []
    for other_name, prereq_list in prerequisites.items():
        if course['name'] in prereq_list:
            if other_name in course_by_name:
                other_course = course_by_name[other_name]
                is_prereq_for.append({
                    'id': other_course['id'],
                    'name': other_course['name'],
                    'code': other_course.get('courseCode', '')
                })
    
    course['prerequisiteFor'] = is_prereq_for

# Save the enhanced courses data
output_path = Path('courses-enhanced.json')
with open(output_path, 'w') as f:
    json.dump(courses, f, indent=2)

print(f"Enhanced courses data saved to: {output_path}")
print(f"Total courses: {len(courses)}")

# Show some examples
print("\nExamples of courses with prerequisites:")
for course in courses:
    if course.get('prerequisites'):
        print(f"  {course['name']} requires: {', '.join(course['prerequisites'])}")
        if len(course.get('prerequisiteFor', [])) > 0:
            next_courses = [c['name'] for c in course['prerequisiteFor']]
            print(f"    → Leads to: {', '.join(next_courses)}")
            
# Count statistics
courses_with_prereqs = sum(1 for c in courses if c.get('prerequisites'))
courses_as_prereqs = sum(1 for c in courses if c.get('prerequisiteFor'))
print(f"\nStatistics:")
print(f"  Courses with prerequisites: {courses_with_prereqs}")
print(f"  Courses that are prerequisites for others: {courses_as_prereqs}")