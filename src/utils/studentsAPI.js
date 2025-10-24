import { mockStudents } from '../data/mockStudents';

// Simulated delay to mimic API latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StudentsAPI {
  async getStudents() {
    await delay(800);
    return [...mockStudents];
  }

  async getStudentById(id) {
    await delay(500);
    const student = mockStudents.find(s => s.id === id);
    if (!student) throw new Error('Student not found');
    return { ...student };
  }

  async suspendStudent(id, reason) {
    await delay(1000);
    const student = mockStudents.find(s => s.id === id);
    if (!student) throw new Error('Student not found');
    
    student.status = 'suspended';
    student.suspensionReason = reason;
    return { ...student };
  }

  async removeStudent(id) {
    await delay(1000);
    const index = mockStudents.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Student not found');
    
    mockStudents.splice(index, 1);
    return { success: true };
  }

  async activateStudent(id) {
    await delay(1000);
    const student = mockStudents.find(s => s.id === id);
    if (!student) throw new Error('Student not found');
    
    student.status = 'active';
    delete student.suspensionReason;
    return { ...student };
  }
}

export const studentsAPI = new StudentsAPI();