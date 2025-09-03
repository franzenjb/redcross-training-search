#!/usr/bin/env python3
"""
Update the Excel file with course codes from the JSON file
"""

import pandas as pd
import json
from pathlib import Path

# Load the courses with codes
with open('courses-with-codes.json', 'r') as f:
    courses = json.load(f)

# Load the Excel file
excel_path = Path('/Users/jefffranzen/Desktop/EDGE Training.xlsx')
df = pd.read_excel(excel_path)

# Create a mapping of course name + type to course code
code_mapping = {}
for course in courses:
    # Create a unique key combining name and type
    key = f"{course['name']}|{course['type']}"
    code_mapping[key] = course['courseCode']

# Add a new column for course codes
course_codes = []
current_course_name = None
current_course_type = None

for idx, row in df.iterrows():
    # Assuming the pattern: Course Name (row 0), Type (row 1), Description (row 2)
    row_position = idx % 3
    
    if row_position == 0:  # Course name row
        current_course_name = str(row.iloc[0]) if pd.notna(row.iloc[0]) else None
        course_codes.append('')  # Placeholder for now
    elif row_position == 1:  # Type row
        current_course_type = str(row.iloc[0]) if pd.notna(row.iloc[0]) else None
        # Now we have both name and type, look up the code
        if current_course_name and current_course_type:
            key = f"{current_course_name}|{current_course_type}"
            code = code_mapping.get(key, '')
            # Update the previous row (name row) with the code
            if course_codes:
                course_codes[-1] = code
        course_codes.append('')  # Empty for type row
    else:  # Description row
        course_codes.append('')  # Empty for description row

# Add the course code column
df['Course Code'] = course_codes

# Save the updated Excel file
output_path = Path('/Users/jefffranzen/Desktop/EDGE Training with Codes.xlsx')
df.to_excel(output_path, index=False)

print(f"Excel file updated with course codes and saved to: {output_path}")

# Verify by showing sample entries
print("\nSample entries with codes:")
for i in range(0, min(15, len(df)), 3):  # Show first 5 courses
    if df.iloc[i]['Course Code']:
        print(f"  {df.iloc[i]['Course Code']}: {df.iloc[i].iloc[0]}")