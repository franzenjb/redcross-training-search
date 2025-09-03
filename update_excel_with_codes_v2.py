#!/usr/bin/env python3
"""
Update the Excel file with course codes from the JSON file
Properly handles the 3-row pattern: Name, Type, Description
"""

import pandas as pd
import json
from pathlib import Path

# Load the courses with codes
with open('courses-with-codes.json', 'r') as f:
    courses = json.load(f)

# Create a mapping of course name + type to course code
code_mapping = {}
for course in courses:
    # Create a unique key combining name and type
    key = f"{course['name']}|{course['type']}"
    code_mapping[key] = course['courseCode']

# Load the Excel file
excel_path = Path('/Users/jefffranzen/Desktop/EDGE Training.xlsx')
df = pd.read_excel(excel_path, header=None)  # No header since data starts at row 1

# Process the data in groups of 3 rows
courses_with_codes = []
for i in range(0, len(df), 3):
    if i + 2 < len(df):  # Ensure we have a complete group
        name_row = df.iloc[i]
        type_row = df.iloc[i + 1] if i + 1 < len(df) else None
        desc_row = df.iloc[i + 2] if i + 2 < len(df) else None
        
        # Get the course name and type
        course_name = str(name_row.iloc[0]) if pd.notna(name_row.iloc[0]) else ''
        course_type = str(type_row.iloc[0]) if type_row is not None and pd.notna(type_row.iloc[0]) else ''
        course_desc = str(desc_row.iloc[0]) if desc_row is not None and pd.notna(desc_row.iloc[0]) else ''
        
        # Look up the course code
        key = f"{course_name}|{course_type}"
        course_code = code_mapping.get(key, '')
        
        # Add to our results
        courses_with_codes.append({
            'Course Code': course_code,
            'Course Name': course_name,
            'Type': course_type,
            'Description': course_desc
        })

# Create a new DataFrame with proper structure
result_df = pd.DataFrame(courses_with_codes)

# Save to a new Excel file
output_path = Path('/Users/jefffranzen/Desktop/EDGE Training with Codes.xlsx')
with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
    result_df.to_excel(writer, sheet_name='Courses', index=False)

print(f"Excel file updated with course codes and saved to: {output_path}")
print(f"Total courses processed: {len(courses_with_codes)}")

# Show sample entries
print("\nSample entries with codes:")
for i, course in enumerate(courses_with_codes[:10]):
    if course['Course Code']:
        print(f"  {course['Course Code']}: {course['Course Name']}")
        
# Count how many courses have codes
courses_with_code_count = sum(1 for c in courses_with_codes if c['Course Code'])
print(f"\nCourses with codes: {courses_with_code_count} / {len(courses_with_codes)}")