import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../student.service';
import { Course } from '../course';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrl: './students.component.css',
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  courses: Course[] = [];
  studentFormGroup: FormGroup;
  isEditing: boolean = false;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private studentService: StudentService,
    private courseService: CourseService

  ) {
    this.studentFormGroup = formBuilder.group({
      id: [''],
      name: ['', [Validators.minLength(3), Validators.required]],
      course: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (data) => (this.courses = data),
    })
  }

  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: (data) => (this.students = data),
    });
  }

  compareCourses(course1: Course, course2: Course): boolean {
    return course1 && course2 ? course1.id === course2.id : course1 === course2
  }

  save() {
    this.submitted = true;

    if (this.studentFormGroup.valid) {
      if (this.isEditing) {
        this.studentService.update(this.studentFormGroup.value).subscribe({
          next: () => {
            this.loadStudents();
            this.isEditing = false;
            this.studentFormGroup.reset();
            this.submitted = false;
          },
        });
      } else {
        this.studentService.save(this.studentFormGroup.value).subscribe({
          next: (data) => {
            this.students.push(data);
            this.studentFormGroup.reset();
            this.submitted = false;
          },
        });
      }
    }
  }

  delete(student: Student) {
    this.studentService.delete(student).subscribe({
      next: () => this.loadStudents(),
    });
  }

  update(student: Student) {
    this.isEditing = true;
    this.studentFormGroup.setValue(student);
  }

  get name(): any {
    return this.studentFormGroup.get('name');
  }

  get course(): any {
    return this.studentFormGroup.get('course');
  }
}
