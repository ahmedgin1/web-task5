/* ============================================================
   TASK: SCHOOL MANAGEMENT SYSTEM
   ============================================================ */

/* ---------- Step 1: Base class for all school members ---------- */

class Person {
  #email;
  #id;

  constructor(name, email, id) {
    this.name = name;
    this.email = email; // goes through the setter for validation
    this.id = id; // goes through the setter for validation
  }

  get email() {
    return this.#email;
  }

  set email(value) {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!isValidEmail) {
      throw new Error(`Invalid email address: "${value}"`);
    }

    this.#email = value;
  }

  get id() {
    return this.#id;
  }

  set id(value) {
    const isValidId = Number.isInteger(value) && value > 0;

    if (!isValidId) {
      throw new Error(`Invalid ID: "${value}". ID must be a positive integer.`);
    }

    this.#id = value;
  }

  // Shared method — every role customizes this with its own behavior
  describeRole() {
    return `${this.name} is a member of the school.`;
  }
}

/* ---------- Step 2: Principal role ---------- */

class Principal extends Person {
  #members = [];

  addMember(member) {
    const isValidMember = member instanceof Teacher || member instanceof Student;

    if (!isValidMember) {
      console.log("❌ Cannot add member: only Teacher or Student instances are allowed.");
      return;
    }

    this.#members.push(member);
    console.log(`✅ ${member.name} has been added to the school.`);
  }

  removeMember(id) {
    const memberIndex = this.#members.findIndex((member) => member.id === id);

    if (memberIndex === -1) {
      console.log(`❌ No member found with ID: ${id}`);
      return;
    }

    const [removedMember] = this.#members.splice(memberIndex, 1);
    console.log(`🗑️  ${removedMember.name} has been removed from the school.`);
  }

  listMembers() {
    console.log(`\n📋 School Members (managed by Principal ${this.name}):`);

    if (this.#members.length === 0) {
      console.log("No members yet.");
      return;
    }

    this.#members.forEach((member) => {
      console.log(`- ${member.name} (${member.constructor.name}, ID: ${member.id})`);
    });
  }

  describeRole() {
    return `${this.name} is the Principal, overseeing ${this.#members.length} school member(s).`;
  }
}

/* ---------- Step 3: Teacher role ---------- */

class Teacher extends Person {
  #subject;
  #gradedStudents = [];

  constructor(name, email, id, subject) {
    super(name, email, id);
    this.#subject = subject;
  }

  get subject() {
    return this.#subject;
  }

  gradeStudent(studentName, grade) {
    this.#gradedStudents.push({ studentName, grade });
    console.log(`📝 ${this.name} graded ${studentName}: ${grade}`);
  }

  listGradedStudents() {
    console.log(`\n📊 Students graded by ${this.name} (${this.#subject}):`);

    if (this.#gradedStudents.length === 0) {
      console.log("No students graded yet.");
      return;
    }

    this.#gradedStudents.forEach(({ studentName, grade }) => {
      console.log(`- ${studentName}: ${grade}`);
    });
  }

  describeRole() {
    return `${this.name} teaches ${this.#subject} and has graded ${this.#gradedStudents.length} student(s).`;
  }
}

/* ---------- Step 4: Student role ---------- */

class Student extends Person {
  #enrolledSubjects = [];

  enroll(subject) {
    const isAlreadyEnrolled = this.#enrolledSubjects.includes(subject);

    if (isAlreadyEnrolled) {
      console.log(`⚠️  ${this.name} is already enrolled in ${subject}.`);
      return;
    }

    this.#enrolledSubjects.push(subject);
    console.log(`✅ ${this.name} enrolled in ${subject}.`);
  }

  viewEnrolledSubjects() {
    console.log(`\n📚 Subjects enrolled by ${this.name}:`);

    if (this.#enrolledSubjects.length === 0) {
      console.log("Not enrolled in any subject yet.");
      return;
    }

    this.#enrolledSubjects.forEach((subject) => console.log(`- ${subject}`));
  }

  describeRole() {
    return `${this.name} is a student enrolled in ${this.#enrolledSubjects.length} subject(s).`;
  }
}

/* ---------- Step 5: Create and use objects ---------- */

const principal = new Principal("Dr. Ahmed Kamal", "ahmed.kamal@school.com", 1);
const teacher = new Teacher("Ms. Salma Youssef", "salma.youssef@school.com", 2, "Mathematics");
const student1 = new Student("Omar Hassan", "omar.hassan@school.com", 3);
const student2 = new Student("Nour Ibrahim", "nour.ibrahim@school.com", 4);

// Principal adds members
principal.addMember(teacher);
principal.addMember(student1);
principal.addMember(student2);
principal.listMembers();

// Teacher grades students
teacher.gradeStudent("Omar Hassan", "A");
teacher.gradeStudent("Nour Ibrahim", "B+");
teacher.listGradedStudents();

// Students enroll in subjects
student1.enroll("Mathematics");
student1.enroll("Science");
student1.viewEnrolledSubjects();

student2.enroll("Mathematics");
student2.viewEnrolledSubjects();

// Principal removes a member
principal.removeMember(4);
principal.listMembers();

// Loop through all members and call the shared method
console.log("\n🔊 Role Descriptions:");
const allMembers = [principal, teacher, student1, student2];
allMembers.forEach((member) => console.log(member.describeRole()));

/* ---------- Validation demo (getters/setters in action) ---------- */

console.log("\n⚠️  Testing validation errors:");

try {
  new Student("Test User", "not-an-email", 5); // invalid email format
} catch (error) {
  console.log(`Error: ${error.message}`);
}

try {
  new Student("Test User", "test@school.com", -1); // invalid ID (must be positive)
} catch (error) {
  console.log(`Error: ${error.message}`);
}
